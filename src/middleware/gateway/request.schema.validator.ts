import { Request, Response, NextFunction } from 'express';
import Ajv, { Schema } from 'ajv';

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  removeAdditional: false
});

export function validateSchema(schema: Schema) {
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Request body is empty or missing.'
      });
      return;
    }

    const valid = validate(req.body);
    if (!valid) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Schema validation failed.',
        details: validate.errors?.map(err => ({
          path: err.instancePath,
          message: err.message,
          params: err.params
        }))
      });
      return;
    }

    next();
  };
}