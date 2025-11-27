import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .min(5)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Email обязателен',
      'string.email': 'Некорректный формат email',
      'string.min': 'Email слишком короткий', // ← добавить
      'string.max': 'Email слишком длинный',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
    .required()
    .messages({
      'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
      'string.empty': 'Пароль обязателен',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Пароли должны совпадать',
      'string.empty': 'Подтверждение пароля обязательно',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .min(5)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Email обязателен',
      'string.email': 'Некорректный формат email',
      'string.min': 'Email слишком короткий', 
      'string.max': 'Email слишком длинный',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/) // ← ЗАМЕНИ на такую же регулярку
    .required()
    .messages({
      'string.empty': 'Пароль обязателен',
      'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
    }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .min(5)
    .max(255)
    .optional()
    .messages({
      'string.email': 'Некорректный формат email',
      'string.min': 'Email слишком короткий', // ← добавить
      'string.max': 'Email слишком длинный',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
    }),
})
  .or('email', 'password') // ← Замена custom валидации
  .messages({
    'object.missing': 'Должно быть указано email или password для обновления'
  });

// Отдельная схема для параметров
export const userIdParamsSchema = Joi.object({
  id: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.pattern.base': 'ID должен быть числом',
      'string.empty': 'ID обязателен',
    }),
});