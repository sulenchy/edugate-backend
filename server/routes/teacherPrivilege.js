  import express from 'express';
import UserController from '../controllers/userController';
import ResultsController from '../controllers/resultsController';
import AddResultsValidation from '../middlewares/addResultsValidation';
import AddUsersValidation from '../middlewares/addUsersValidation';
import { checkIfUserHasSchool, checkUserUpdatePrivilege, checkResultUpdatePrivilege, checkResultDeletePrivilege }
    from '../middlewares/checkUser';

const router = express.Router();

// get users from the database
router.get('/api/v1/users/:query', checkIfUserHasSchool, UserController.getUsers);

// update user in the database
router.patch('/api/v1/users/update', checkIfUserHasSchool, checkUserUpdatePrivilege, AddUsersValidation.validateUpdateUsers, UserController.updateUser);

// adds new result to the database
router.post('/api/v1/results/addresults', checkIfUserHasSchool, AddResultsValidation.validateAddResults, ResultsController.addResults);

// update result in the database
router.patch('/api/v1/results/update', checkIfUserHasSchool, checkResultUpdatePrivilege, AddResultsValidation.validateUpdateResults, ResultsController.updateResult);

router.get('/api/v1/results/toplevel', checkIfUserHasSchool,ResultsController.getAllResults)

router.delete('/api/v1/results/delete', checkIfUserHasSchool, checkResultDeletePrivilege, ResultsController.delete);

export default router;
