import express from 'express';
import UserController from '../controllers/userController';
import SchoolController from '../controllers/schoolController';
import AddUsersValidation from '../middlewares/addUsersValidation';
import SchoolValidator from '../middlewares/schoolValidation';
import { checkIfUserHasSchool } 
    from '../middlewares/checkUser';

const router = express.Router();

// creates new school
router.post('/api/v1/schools/create', SchoolValidator.validateSchoolCreate, SchoolController.create);

// adds students to the database
router.post('/api/v1/users/addusers', checkIfUserHasSchool, AddUsersValidation.validateAddUsers, UserController.addUsers);



export default router;