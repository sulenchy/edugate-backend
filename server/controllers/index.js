import express from 'express';
import { login } from './users/login';
import logout from './users/logout';

const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to EduGate!'));
router.post('/login', login.post);
router.get('/login', login.get);
router.get('/logout', logout);

export default router;
