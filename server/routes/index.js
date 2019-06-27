import express from 'express';
import UserController from '../controllers/userController';
import UserValidator from '../middlewares/userValidation';


const router = express.Router();
// default route 
router.get('/', (req, res) => res.send('Welcome to EduGate!'))
router.post('/api/v1/users/login', UserValidator.validateUserLogin, UserController.login);
router.post('/api/v1/users/signup', UserValidator.validateUserSignUp, UserValidator.checkExistingEmail, UserController.signUp);

export default router;