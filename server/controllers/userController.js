import bcrypt from 'bcryptjs';
import models from '../models';

const { Users } = models;

/**
 * @class UsersController
 * @description User related Operations
 */
class UsersController {
  /**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns user
 */
  static async signUp(req, res) {
    const { email, first_name, last_name } = req.body;
    let { password } = req.body;
    password = bcrypt.hashSync(password, 10);
    const role = 'admin';
    const username = UsersController.createUsername(first_name, last_name);
    try {
      const user = await Users
        .create({
          email,
          first_name,
          last_name,
          password,
          role,
          username
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
          username,
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
  * @description
  * @param {object} req - request object
  * @param {object} res - response object
  * @returns {object} - returns user
  */
  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await Users.findOne({
        attributes: ['password', 'user_uid', 'school_uid', 'role'],
        where: {
          username
        }
      });
<<<<<<< HEAD
      if (!user) return res.status(404).json({status: 'failure', error: "No User Found"});
      const match =  await bcrypt.compare(password, user.password);
      if (match) {
        const userSession = {
          user_uid: user.user_uid,
          role: user.role,
          school_uid: user.school_uid
=======
      if (!user) return res.status(404).json({ status: 'failure', error: "No User Found" });
      const userData = user.dataValues;
      const match = await bcrypt.compare(password, userData.password);
      if (match) {
        const userSession = {
          user_uid: userData.user_uid,
          role: userData.role,
          school_uid: userData.school_uid
>>>>>>> ft(get-user): fix some issues on add user functionality
        }
        req.session = userSession

        console.log('session values ===> ', req.session);

        return res.status(200).json({
          status: 'success',
          message: 'User logged in successfully.',
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
   * 
   * @param {*} first_name 
   * @param {*} last_name 
   */
  static createUsername(first_name, last_name) {
    const randomString = (Math.random().toString(36).slice(-10)).slice(0, 2);
    const username = `${first_name}${last_name}${randomString}`;
    return username;
  }

  /**
   * 
   */
  static createPassword() {
    const randomString = (Math.random().toString(36).slice(-10)).slice(0, 5);
    const password = bcrypt.hashSync(randomString, 10);
    return password;
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  static async addUsers(req, res) {
    console.log('session values ====> ', req.session)
    const { users } = res.locals;
    for (let user of users) {
      const { first_name, last_name } = user;
      user.username = UsersController.createUsername(first_name, last_name);
      user.password = UsersController.createPassword();
      user.school_uid = req.session.school_uid;

    }
    try {
      const newUsers = await Users
        .bulkCreate(
          users
        );
      if (newUsers) {
        return res.status(201).json({
          status: 'success',
          message: `${users.length} new User accounts created successfully.`
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
   * gets users from the the users table and also filters based on role
   * @param {*} req 
   * @param {*} res 
   */
  static async getUsers(req, res) {
    // gets role parameter from request param
    let { role } = req.param;

    try {
      let userList = null;
      const { school_uid, user_uid } = req.session;
      if (role) {
        userList = await Users.findAll({
          where: {
            role,
            school_uid,
            user_uid: !user_uid
          }
        });
      } else {
        userList = await Users.findAll({
          where: {
            school_uid,
            user_uid: !user_uid
          }
        });
      }

      if (userList) {
        return res.status(200).json({
          status: 'success',
          messaage: 'User(s) successfully retrieved',
          userList
        })
      }
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

  static async logout(req, res) {
    if (req.session) {
      req.session = null;
      return res.status(200).json({
        status: 'success',
        messaage: 'User logout successfully'
      })
    }
    return res.status(200).json({
      status: 'success',
      messaage: 'User logout successfully'
    })
  }
}



export default UsersController;
