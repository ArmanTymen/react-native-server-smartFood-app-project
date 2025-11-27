import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export interface ValidatedRequest<T = unknown> extends Request {
  validatedData?: T;
}

export const validate = <T = unknown>(schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('📨 Received body:', req.body);
    console.log('📨 Headers:', req.headers['content-type']);
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      console.warn('Validation error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.details.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          type: err.type,
        })),
      });
    }

    // Сохраняем провалидированные данные
    (req as ValidatedRequest<T>).validatedData = value;
    
    // Обновляем body
    req.body = value;

    next();
  };
};