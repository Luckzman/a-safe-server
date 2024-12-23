import express from 'express'
import { auth } from '../middleware/auth'
import { UserController } from '../controllers/user.controller'

const router = express.Router()
const userController = new UserController()

router.get('/', auth, userController.getUsers)
router.get('/:id', auth, userController.getUser)
router.put('/:id', auth, userController.updateUser)
router.delete('/:id', auth, userController.deleteUser)

export { router as userRouter } 