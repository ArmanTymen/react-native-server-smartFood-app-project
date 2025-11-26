"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personalRationController_1 = require("../controllers/personalRationController");
const router = express_1.default.Router();
router.get("/", personalRationController_1.getUserPersonalRation);
router.put("/", personalRationController_1.updatePersonalRation);
router.get("/recommended", personalRationController_1.getRecommendations);
exports.default = router;
