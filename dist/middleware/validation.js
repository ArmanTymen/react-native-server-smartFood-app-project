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
        req.validatedData = value;
        req.body = value.body || {};
        req.query = value.query || {};
        req.params = value.params || {};
        next();
    };
};
exports.validate = validate;
