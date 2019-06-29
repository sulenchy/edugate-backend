import express from 'express';
import UserController from '../controllers/userController';
import SchoolController from '../controllers/schoolController';
import UserValidator from '../middlewares/userValidation';
import SchoolValidator from '../middlewares/schoolValidation';


const router = express.Router();
// default route 
router.get('/', (req, res) => res.send('Welcome to EduGate!'))
router.post('/api/v1/users/login', UserValidator.validateUserLogin, UserController.login);
router.post('/api/v1/users/signup', UserValidator.validateUserSignUp, UserValidator.checkExistingEmail, UserController.signUp);
router.post('/api/v1/schools/create', SchoolValidator.validateSchoolCreate, SchoolController.create)

export default router;