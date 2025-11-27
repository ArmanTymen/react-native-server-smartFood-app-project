"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const favoritesRoutes_1 = __importDefault(require("./routes/favoritesRoutes"));
const personalRationRoutes_1 = __importDefault(require("./routes/personalRationRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = ['http://localhost:3000'];
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error('CORS not allowed'), false);
    },
    credentials: true
}));
app.use('/api/', (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/users', authRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/articles', articleRoutes_1.default);
app.use('/api/favorites', favoritesRoutes_1.default);
app.use('/api/personalRation', personalRationRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.use((error, req, res, next) => {
    console.error('Error:', error);
    const status = error.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message;
    res.status(status).json({ error: message });
});
exports.default = app;
