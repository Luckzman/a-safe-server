import express from 'express'
import { AuthController } from '../controllers/auth.controller'
import { registerValidator } from '../validators/auth.validator'
import { validate } from '../middleware/validate'

const router = express.Router()

const authController = new AuthController()

router.post('/login', authController.login)
router.post('/register', registerValidator, validate, authController.register)
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password', authController.resetPassword)

export const authRouter = router 