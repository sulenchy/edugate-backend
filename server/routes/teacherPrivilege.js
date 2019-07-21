import express from 'express';
import UserController from '../controllers/userController';
import ResultsController from '../controllers/resultsController';
import AddResultsValidation from '../middlewares/addResultsValidation';
import { checkIfUserHasSchool } 
    from '../middlewares/checkUser';

const router = express.Router();

// get students from the database
router.get('/api/v1/users/:query', checkIfUserHasSchool, UserController.getUsers);

// adds new result to the database
router.post('/api/v1/results/addresults', checkIfUserHasSchool, AddResultsValidation.validateAddResults, ResultsController.addResults);

router.get('/api/v1/results/toplevel', checkIfUserHasSchool,ResultsController.getAllResults)

export default router;