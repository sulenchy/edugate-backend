import express from 'express';
import UserController from '../controllers/userController';
import SchoolController from '../controllers/schoolController';
import AddUsersValidation from '../middlewares/addUsersValidation';
import SchoolValidator from '../middlewares/schoolValidation';
import { checkIfUserHasSchool, checkUserDeletePrivilege }
    from '../middlewares/checkUser';

const router = express.Router();

// creates new school
router.post('/api/v1/schools/create', SchoolValidator.validateSchoolCreate, SchoolController.create);


// router.delete('/api/v1/users/', (req, res) => res.send('Welcome to EduGate!'))


router.delete('/api/v1/users/delete', checkIfUserHasSchool, checkUserDeletePrivilege, UserController.delete);

// adds students to the database
router.post('/api/v1/users/addusers', checkIfUserHasSchool, AddUsersValidation.validateAddUsers, UserController.addUsers);

export default router;
