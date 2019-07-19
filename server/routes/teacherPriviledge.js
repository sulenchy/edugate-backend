import express from 'express';
import UserController from '../controllers/userController';
import ResultsController from '../controllers/resultsController';
import AddResultsValidation from '../middlewares/addResultsValidation';
import { checkUserIsLoggedIn, 
    checkTeacherAndAboveTole, } 
    from '../middlewares/checkUser';

const router = express.Router();

// get students from the database
router.get('/api/v1/users/:query', checkUserIsLoggedIn, checkTeacherAndAboveTole, UserController.getUsers);

// adds new result to the database
router.post('/api/v1/results/addresults', checkUserIsLoggedIn, checkTeacherAndAboveTole, AddResultsValidation.validateAddResults, ResultsController.addResults);

export default router;