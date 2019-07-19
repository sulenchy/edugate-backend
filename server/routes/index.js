import express from 'express';
import UserController from '../controllers/userController';
import UserValidator from '../middlewares/userValidation';
import adminPriviledgeRouter from './adminPriviledge';
import teacherPrivilegeRouter from './teacherPriviledge';


const router = express.Router();
// default route
router.get('/', (req, res) => res.send('Welcome to EduGate!'))

router.get('/api/v1/users/logout', UserController.logout);

router.post('/api/v1/users/login', UserValidator.validateUserLogin, UserController.login);
router.post('/api/v1/users/signup', UserValidator.validateUserSignUp, UserValidator.checkExistingEmail, UserController.signUp);

router.use(adminPriviledgeRouter);
router.use(teacherPrivilegeRouter)


export default router;
