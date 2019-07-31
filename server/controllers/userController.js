import bcrypt from 'bcryptjs';
import models from '../models';
import removeDuplicates from '../helpers/removeDuplicates';
import convertIndexToExcelRow from '../helpers/convertIndexToExcelRow.js';
import { toLowerCase } from '../helpers/convertToLowerCase';
import setUserResultToDelete from '../helpers/setUserResultToDelete';
import { compareSchoolUid, isUserStatusDeleted}  from '../helpers/getUserSchoolUid';

const { Users } = models;

/**
 * @class UsersController
 * @description User related Operations
 */
class UsersController {
  /**
 * @description - creates admin user
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns user
 */
  static async signUp(req, res) {
    const { email, first_name, last_name } = toLowerCase(req.body);
    let { password } = req.body;
    password = bcrypt.hashSync(password, 10);
    const role = 'admin';
    try {
      const user = await Users
        .create({
          email,
          first_name,
          last_name,
          password,
          role
        });
      if (user) {
        const userSession = {
          user_uid: user.user_uid,
          role: user.role,
          school_uid: user.school_uid
        }
        req.session = userSession

        return res.status(201).json({
          status: 'success',
          message: 'New account created successfully.',
        });
      }
    } catch (err) {
      return res.status(500)
        .json({
          errors: {
            message: [err.message]
          },
        })
    }
  }

  /**
  * @description - logs in the users(ADMIN, TEACHER & STUDENT) using his or her password and email
  * @param {object} req - request object
  * @param {object} res - response object
  * @returns {object} - returns user
  */
  static async login(req, res) {
    const { email } = toLowerCase(req.body);
    const { password } = req.body;
    try {
      const user = await Users.findOne({
        attributes: ['password', 'user_uid', 'school_uid', 'role'],
        where: {
          email
        }
      });
      if (!user) return res.status(404).json({ status: 'failure', error: "No User Found" });
      const match = await bcrypt.compare(password, user.password);
      if (match) {


        const userSession = {
          user_uid: user.user_uid,
          role: user.role,
          school_uid: user.school_uid
        }
        req.session = userSession;

        return res.status(200).json({
          status: 'success',
          message: 'User logged in successfully.',
          userSession
        });
      }
      return res.status(401).json({
        status: 'failure',
        error: "Password is incorrect"
      })
    }
    catch (err) {
      res.status(500).json({ err });
    }
  }

  /**
   * @description - creates password and encrypt it
   */
  static createPassword() {
    const randomString = (Math.random().toString(36).slice(-10)).slice(0, 5);
    const password = bcrypt.hashSync(randomString, 10);
    return password;
  }

  /**
   * @description - create a list of user via a spreadsheet
   * @param {*} req
   * @param {*} res
   */
  static async addUsers(req, res) {
    try {
      const { users, duplicates } = res.locals;
      for (let user of users) {
        user.password = UsersController.createPassword();
      }
      const uniqueUsers = removeDuplicates(users, duplicates);
      const newUsers = await Users
        .bulkCreate(
          uniqueUsers
        );
      if (newUsers) {
        const resObj = {
          status: 'success',
          message: `${Object.keys(uniqueUsers).length} new User accounts created successfully.`
        }
        if (Object.keys(duplicates).length) {
          resObj.duplicates = convertIndexToExcelRow(duplicates);
        }
        return res.status(201).json(resObj);
      }
    } catch (err) {
      return res.status(500)
        .json({
          errors: {
            message: [err.message]
          },
        })
    }
  }

  /**
   * gets users from the the users table and also filters based on role
   * @param {*} req
   * @param {*} res
   */
  static async getUsers(req, res) {
    // gets role parameter from request param
    let { query } = req.params;

    try {
      let userList = null;
      const { school_uid, role } = req.session;

      if (!['student', 'teacher'].includes(query)) {
        return res.status(422).json({
          status: 'failure',
          message: 'Sorry, invalid data supplied. Please enter valid data.'
        })
      }
      if (role) {
        userList = await Users.findAll({
          attributes: ['user_uid', 'first_name', 'last_name', 'dob', 'year_of_graduation', 'role', 'phone_number', 'email'],
          where: {
            role: query,
            school_uid
          }
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'User(s) successfully retrieved',
        userList
      })
    }
    catch (error) {
      return res.status(500)
        .json({
          errors: {
            message: [error.message]
          },
        })
    }
  }

  /**
  * @description - delete user
  * @param {object} req - request object
  * @param {object} res - response object
  */
  static async delete(req, res) {
    const { user_uid } = req.query;
    const { school_uid } = req.session;

    try {
      // checks if a user is selected
      if(!user_uid){
        return res.status(422).json({
          status: 'failure',
          error: 'Please, select a user to be deleted'
        })
      }
      const deletePrivilege = await compareSchoolUid(user_uid, school_uid);

      // checks for user delete privilege
      if (!deletePrivilege) {
        return res.status(400).json({
          status: 'failure',
          error: 'Sorry, you do not have the required privilege'
        })
      }

      // checks the status of the user
      const status = await isUserStatusDeleted(user_uid);
      if(status){
        return res.status(404).json({
          status: 'failure',
          error: 'Sorry, user does not exist again.'
        })
      }

      const updatedUser = await Users.update(
        { status: 'deleted' },
        {
          where: {
            user_uid
          }
        })

      const updatedResults = setUserResultToDelete(user_uid);
      if (updatedUser && updatedResults) {
        res.status(200).json({
          status: 'success',
          updatedUser
        })
      }
    }
    catch (err) {
      return res.status(500)
        .json({
          errors: {
            message: [err.message]
          },
        })
    }

  }

  /**
  * @description - logout user
  * @param {object} req - request object
  * @param {object} res - response object
  */
  static async logout(req, res) {
    if (req.session) {
      req.session = null;
      return res.status(200).json({
        status: 'success',
        message: 'User logout successfully'
      })
    }
  }
}



export default UsersController;
