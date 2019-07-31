import express from 'express';
import UserController from '../controllers/userController';
import ResultsController from '../controllers/resultsController';
import AddResultsValidation from '../middlewares/addResultsValidation';
import { checkIfUserHasSchool } 
    from '../middlewares/checkUser';

const router = express.Router();

// get users from the database
router.get('/api/v1/users/:query', checkIfUserHasSchool, UserController.getUsers);

// adds new result to the database
router.post('/api/v1/results/addresults', checkIfUserHasSchool, AddResultsValidation.validateAddResults, ResultsController.addResults);

router.get('/api/v1/results/toplevel', checkIfUserHasSchool,ResultsController.getAllResults)

router.delete('/api/v1/results/result', checkIfUserHasSchool, ResultsController.delete);

export default router;