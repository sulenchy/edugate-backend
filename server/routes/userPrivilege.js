import express from 'express';
import ResultsController from '../controllers/resultsController';
import { checkIfUserHasSchool, checkStudentPrivilege }
    from '../middlewares/checkUser';

const router = express.Router();

router.get('/api/v1/results', checkIfUserHasSchool, checkStudentPrivilege, ResultsController.getUserResults)

export default router;
