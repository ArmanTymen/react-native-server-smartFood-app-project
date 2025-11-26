"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    body: joi_1.default.object({
        email: joi_1.default.string()
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
        password: joi_1.default.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
            .required()
            .messages({
            'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
            'string.min': 'Пароль должен быть минимум 8 символов',
            'string.max': 'Пароль слишком длинный',
            'string.empty': 'Пароль обязателен',
        }),
        confirmPassword: joi_1.default.string()
            .valid(joi_1.default.ref('password'))
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
exports.loginSchema = joi_1.default.object({
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .min(5)
            .max(255)
            .required()
            .messages({
            'string.empty': 'Email обязателен',
            'string.email': 'Некорректный формат email',
        }),
        password: joi_1.default.string()
            .min(1)
            .max(64)
            .required()
            .messages({
            'string.empty': 'Пароль обязателен',
        }),
    }).required(),
});
exports.updateUserSchema = joi_1.default.object({
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .min(5)
            .max(255)
            .optional()
            .messages({
            'string.email': 'Некорректный формат email',
        }),
        password: joi_1.default.string()
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
    params: joi_1.default.object({
        id: joi_1.default.string()
            .pattern(/^\d+$/)
            .required()
            .messages({
            'string.pattern.base': 'ID должен быть числом',
            'string.empty': 'ID обязателен',
        }),
    }),
});
