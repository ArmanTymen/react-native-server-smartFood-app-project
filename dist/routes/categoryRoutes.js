"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const router = express_1.default.Router();
router.get('/', categoryController_1.getAllCategories);
router.post('/', categoryController_1.createCategory);
router.get('/search/articles', categoryController_1.getArticles);
router.get('/:id', categoryController_1.getCategoryById);
exports.default = router;
