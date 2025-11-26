"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });
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
        req.body = value.body;
        // для query и params создаём новые поля
        req.validatedQuery = value.query;
        req.validatedParams = value.params;
        next();
    };
};
exports.validate = validate;
