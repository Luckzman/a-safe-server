"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
exports.userRouter = router;
const userController = new user_controller_1.UserController();
router.get('/', auth_1.auth, userController.getUsers);
router.get('/:id', auth_1.auth, userController.getUser);
router.put('/:id', auth_1.auth, userController.updateUser);
router.delete('/:id', auth_1.auth, userController.deleteUser);
