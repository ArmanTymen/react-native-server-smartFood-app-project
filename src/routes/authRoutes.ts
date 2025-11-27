import express from 'express';
import { validate } from '../middleware/validation';
import authenticate from '../middleware/auth';

import { getCurrentUser, login, register } from '../controllers/authControllers';
import { loginSchema, registerSchema } from '../validators/validators';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login); 
router.get('/me', authenticate, getCurrentUser);

export default router;