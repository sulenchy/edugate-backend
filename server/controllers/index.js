import express from 'express';
import { login } from './login'

const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to EduGate!'));
router.post('/login', login.post);
router.get('/login', login.get);

export default router;
