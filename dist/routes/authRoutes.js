"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middleware/validation");
const auth_1 = __importDefault(require("../middleware/auth"));
const authControllers_1 = require("../controllers/authControllers");
const validators_1 = require("../validators/validators");
const router = express_1.default.Router();
router.post('/register', (0, validation_1.validate)(validators_1.registerSchema), authControllers_1.register);
router.post('/login', (0, validation_1.validate)(validators_1.loginSchema), authControllers_1.login);
router.get('/me', auth_1.default, authControllers_1.getCurrentUser);
exports.default = router;
