import express from 'express';
import UserController from '../controllers/userController';
import SchoolController from '../controllers/schoolController';
import AddUsersValidation from '../middlewares/addUsersValidation';
import SchoolValidator from '../middlewares/schoolValidation';
import { checkUserIsLoggedIn, 
    checkAdminAndAboveRole,
} 
    from '../middlewares/checkUser';

const router = express.Router();

// adds students to the database
router.post('/api/v1/users/addusers', checkUserIsLoggedIn, checkAdminAndAboveRole, AddUsersValidation.validateAddUsers, UserController.addUsers);

// creates new school
router.post('/api/v1/schools/create', checkUserIsLoggedIn, checkAdminAndAboveRole, SchoolValidator.validateSchoolCreate, SchoolController.create);

export default router;