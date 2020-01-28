import express from 'express';
import UserController from '../controllers/userController';
import ResultsController from '../controllers/resultsController';
import { checkIfUserHasSchool, checkStudentPrivilege }
    from '../middlewares/checkUser';
import { checkUserPassword, validatePassword } from '../middlewares/passwordValidation.js'


const router = express.Router();

router.get('/api/v1/results', checkIfUserHasSchool, checkStudentPrivilege, ResultsController.getUserResults);
router.patch('/api/v1/users/changePassword', checkUserPassword, validatePassword, UserController.changePassword);

export default router;
