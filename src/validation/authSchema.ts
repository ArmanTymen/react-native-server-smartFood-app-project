import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, { message: 'Email обязателен' })
      .max(255, { message: 'Email слишком длинный' })
      .email({ message: 'Некорректный формат email' }),
    
    password: z.string()
      .min(8, { message: 'Пароль должен быть минимум 8 символов' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Пароль должен содержать заглавные, строчные буквы и цифры'
      })
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, { message: 'Email обязателен' })
      .email({ message: 'Некорректный формат email' }),
    
    password: z.string()
      .min(1, { message: 'Пароль обязателен' }),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string()
      .email({ message: 'Некорректный формат email' })
      .optional(),
    password: z.string()
      .min(8, { message: 'Пароль должен быть минимум 8 символов' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Пароль должен содержать заглавные, строчные буквы и цифры'
      })
      .optional(),
  }).refine(data => data.email || data.password, {
    message: 'Должно быть указано email или password для обновления'
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID должен быть числом' })
  })
});

// Типы для TypeScript
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];