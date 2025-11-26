import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Email обязателен',
        'string.email': 'Некорректный формат email',
        'string.max': 'Email слишком длинный',
        'string.min': 'Email слишком короткий',
      }),

    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
      .required()
      .messages({
        'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
        'string.min': 'Пароль должен быть минимум 8 символов',
        'string.max': 'Пароль слишком длинный',
        'string.empty': 'Пароль обязателен',
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .min(8)
      .max(64)
      .required()
      .messages({
        'any.only': 'Пароли должны совпадать',
        'string.empty': 'Подтверждение пароля обязательно',
        'string.min': 'Подтверждение пароля должно быть минимум 8 символов',
        'string.max': 'Подтверждение пароля слишком длинное',
      }),
  }).required(),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Email обязателен',
        'string.email': 'Некорректный формат email',
      }),

    password: Joi.string()
      .min(1)
      .max(64)
      .required()
      .messages({
        'string.empty': 'Пароль обязателен',
      }),
  }).required(),
});

export const updateUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .optional()
      .messages({
        'string.email': 'Некорректный формат email',
      }),

    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$/)
      .min(8)
      .max(64)
      .optional()
      .messages({
        'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
        'string.min': 'Пароль должен быть минимум 8 символов',
        'string.max': 'Пароль слишком длинный',
      }),
  }).custom((value, helpers) => {
    if (!value.email && !value.password) {
      return helpers.error('any.custom', { message: 'Должно быть указано email или password для обновления' });
    }
    return value;
  }),

  params: Joi.object({
    id: Joi.string()
      .pattern(/^\d+$/)
      .required()
      .messages({
        'string.pattern.base': 'ID должен быть числом',
        'string.empty': 'ID обязателен',
      }),
  }),
});
