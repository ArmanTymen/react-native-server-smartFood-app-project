"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoritesController_1 = require("../controllers/favoritesController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get('/', favoritesController_1.getAllFavorites);
router.post('/', favoritesController_1.addFavorite);
router.delete('/:id', auth_1.default, favoritesController_1.deleteFavorite);
exports.default = router;
