"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
const authController = new auth_controller_1.AuthController();
router.post('/login', authController.login);
router.post('/register', auth_validator_1.registerValidator, validate_1.validate, authController.register);
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password', authController.resetPassword)
exports.authRouter = router;
