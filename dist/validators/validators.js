"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamsSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
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
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
        .required()
        .messages({
        'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
        'string.empty': 'Пароль обязателен',
    }),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({
        'any.only': 'Пароли должны совпадать',
        'string.empty': 'Подтверждение пароля обязательно',
    }),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.empty': 'Email обязателен',
        'string.email': 'Некорректный формат email',
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'Пароль обязателен',
    }),
});
exports.updateUserSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .min(5)
        .max(255)
        .optional()
        .messages({
        'string.email': 'Некорректный формат email',
    }),
    password: joi_1.default.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Пароль должен содержать заглавные, строчные буквы и цифры',
    }),
})
    .or('email', 'password')
    .messages({
    'object.missing': 'Должно быть указано email или password для обновления'
});
exports.userIdParamsSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^\d+$/)
        .required()
        .messages({
        'string.pattern.base': 'ID должен быть числом',
        'string.empty': 'ID обязателен',
    }),
});
