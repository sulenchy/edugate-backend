import express from 'express';
import UserController from '../controllers/userController';
import SchoolController from '../controllers/schoolController';
import ResultsController from '../controllers/resultsController';
import UserValidator from '../middlewares/userValidation';
import AddUsersValidation from '../middlewares/addUsersValidation';
import SchoolValidator from '../middlewares/schoolValidation';
import AddResultsValidation from '../middlewares/addResultsValidation';
import { checkUserIsLoggedIn, checkUserRole } from '../middlewares/checkUser';


const router = express.Router();
// default route
router.get('/', (req, res) => res.send('Welcome to EduGate!'))

router.get('/api/v1/users/logout', UserController.logout);
router.get('/api/v1/users/:role', checkUserIsLoggedIn, checkUserRole, UserController.getUsers);
router.post('/api/v1/users/login', UserValidator.validateUserLogin, UserController.login);
router.post('/api/v1/users/signup', UserValidator.validateUserSignUp, UserValidator.checkExistingEmail, UserController.signUp);
router.post('/api/v1/users/addusers', checkUserIsLoggedIn, checkUserRole, AddUsersValidation.validateAddUsers, UserController.addUsers);
router.post('/api/v1/schools/create', checkUserIsLoggedIn, checkUserRole, SchoolValidator.validateSchoolCreate, SchoolController.create);
router.post('/api/v1/results/addresults', checkUserIsLoggedIn, checkUserRole, AddResultsValidation.validateAddResults, ResultsController.addResults);

export default router;
