import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export interface ValidatedRequest<TBody = unknown, TQuery = unknown, TParams = unknown> extends Request {
  body: TBody;
  validatedQuery?: TQuery;
  validatedParams?: TParams;
}

export const validate = <TBody, TQuery = {}, TParams = {}>(schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.details.map((err) => ({
          field: err.path.join('.') || 'unknown',
          message: err.message,
        })),
      });
    }

    // безопасно переписываем только body
    (req as ValidatedRequest<TBody, TQuery, TParams>).body = value.body;

    // для query и params создаём новые поля
    (req as ValidatedRequest<TBody, TQuery, TParams>).validatedQuery = value.query;
    (req as ValidatedRequest<TBody, TQuery, TParams>).validatedParams = value.params;

    next();
  };
};
