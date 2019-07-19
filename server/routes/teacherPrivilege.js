import express from 'express';
import UserController from '../controllers/userController';
import ResultsController from '../controllers/resultsController';
import AddResultsValidation from '../middlewares/addResultsValidation';
import AddUsersValidation from '../middlewares/addUsersValidation';
import { checkIfUserHasSchool, checkUserUpdatePrivilege }
    from '../middlewares/checkUser';

const router = express.Router();

// get students from the database
router.get('/api/v1/users/:query', checkIfUserHasSchool, UserController.getUsers);

// update user in the database
router.post('/api/v1/users/update', checkIfUserHasSchool, checkUserUpdatePrivilege, AddUsersValidation.validateUpdateUsers, UserController.updateUser);

// adds new result to the database
router.post('/api/v1/results/addresults', checkIfUserHasSchool, AddResultsValidation.validateAddResults, ResultsController.addResults);

router.get('/api/v1/results/toplevel', checkIfUserHasSchool,ResultsController.getAllResults)

export default router;
