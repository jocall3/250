import { Request, Response, NextFunction } from 'express';
import { parse, DocumentNode, SelectionSetNode, Kind } from 'graphql';

const MAX_COST = 100;
const DEFAULT_FIELD_COST = 1;

const COMPLEXITY_MAP: Record<string, number> = {
  generateTrumpBill: 50,
  renderHighResBill: 30,
  listTransactions: 10,
  userProfile: 2
};

function calculateCost(node: SelectionSetNode | undefined): number {
  if (!node || !node.selections) {
    return 0;
  }

  let totalCost = 0;
  for (const selection of node.selections) {
    if (selection.kind === Kind.FIELD) {
      const fieldName = selection.name.value;
      const baseCost = COMPLEXITY_MAP[fieldName] ?? DEFAULT_FIELD_COST;
      const subCost = calculateCost(selection.selectionSet);
      totalCost += baseCost + subCost;
    } else if (selection.kind === Kind.FRAGMENT_SPREAD || selection.kind === Kind.INLINE_FRAGMENT) {
      totalCost += calculateCost(selection.selectionSet);
    }
  }

  return totalCost;
}

export function graphqlCostAnalyzer(req: Request, res: Response, next: NextFunction): void {
  const query = req.body?.query;

  if (!query || typeof query !== 'string') {
    return next();
  }

  try {
    const ast: DocumentNode = parse(query);
    let totalQueryCost = 0;

    for (const definition of ast.definitions) {
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        totalQueryCost += calculateCost(definition.selectionSet);
      }
    }

    if (totalQueryCost > MAX_COST) {
      res.status(400).json({
        errors: [
          {
            message: `GraphQL query complexity cost of ${totalQueryCost} exceeds the maximum allowed cost of ${MAX_COST}.`,
            extensions: { code: 'GRAPHQL_COST_LIMIT_EXCEEDED', maxCost: MAX_COST, actualCost: totalQueryCost }
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