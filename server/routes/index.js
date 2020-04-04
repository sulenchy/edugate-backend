import express from 'express';
import UserController from '../controllers/userController';
import UserValidator from '../middlewares/userValidation';
import adminPrivilegeRouter from './adminPrivilege';
import teacherPrivilegeRouter from './teacherPrivilege';
import userPrivilegeRouter from './userPrivilege';
import {
    checkUserIsLoggedIn,
    checkTeacherPrivilege,
    checkAdminPrivilege,
}
    from '../middlewares/checkUser';


const router = express.Router();
// default route
router.get('/api/v1', (req, res) => res.send('Welcome to EduGate API!'))

router.get('/api/v1/users/logout', UserController.logout);

router.post('/api/v1/users/signup', UserValidator.validateUserSignUp, UserValidator.checkExistingEmail, UserController.signUp);

router.patch('/api/v1/users/verify', UserController.verify);

router.post('/api/v1/users/login', UserValidator.validateUserLogin, UserController.login);

router.use(checkUserIsLoggedIn);

router.use(userPrivilegeRouter);

router.use(checkTeacherPrivilege);
router.use(teacherPrivilegeRouter);

router.use(checkAdminPrivilege);
router.use(adminPrivilegeRouter);



export default router;
