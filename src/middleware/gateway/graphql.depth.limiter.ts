import { Request, Response, NextFunction } from 'express';
import { parse, DocumentNode, SelectionSetNode, Kind } from 'graphql';

const MAX_DEPTH = 5;

function calculateDepth(node: SelectionSetNode | undefined, currentDepth: number = 0): number {
  if (!node || !node.selections || node.selections.length === 0) {
    return currentDepth;
  }

  let maxSubDepth = currentDepth;
  for (const selection of node.selections) {
    if (selection.kind === Kind.FIELD) {
      const depth = calculateDepth(selection.selectionSet, currentDepth + 1);
      if (depth > maxSubDepth) {
        maxSubDepth = depth;
      }
    } else if (selection.kind === Kind.FRAGMENT_SPREAD || selection.kind === Kind.INLINE_FRAGMENT) {
      const depth = calculateDepth(selection.selectionSet, currentDepth);
      if (depth > maxSubDepth) {
        maxSubDepth = depth;
      }
    }
  }

  return maxSubDepth;
}

export function graphqlDepthLimiter(req: Request, res: Response, next: NextFunction): void {
  const query = req.body?.query;

  if (!query || typeof query !== 'string') {
    return next();
  }

  try {
    const ast: DocumentNode = parse(query);
    let maxQueryDepth = 0;

    for (const definition of ast.definitions) {
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        const depth = calculateDepth(definition.selectionSet, 0);
        if (depth > maxQueryDepth) {
          maxQueryDepth = depth;
        }
      }
    }

    if (maxQueryDepth > MAX_DEPTH) {
      res.status(400).json({
        errors: [
          {
            message: `GraphQL query depth of ${maxQueryDepth} exceeds the maximum allowed depth of ${MAX_DEPTH}.`,
            extensions: { code: 'GRAPHQL_DEPTH_LIMIT_EXCEEDED', maxDepth: MAX_DEPTH, actualDepth: maxQueryDepth }
          }
        ]
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(400).json({
      errors: [
        {
          message: 'Invalid GraphQL query syntax.',
          extensions: { code: 'GRAPHQL_PARSE_FAILED', details: error.message }
        }
      ]
    });
  }
}