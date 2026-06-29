import * as authController from '../controllers/authController.js';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', authController.register);

export default authRouter;