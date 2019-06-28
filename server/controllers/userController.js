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
    const { email, firstName, surName } = req.body;
    let { password } = req.body;
    password = bcrypt.hashSync(password, 10);
    const role = 'admin';
    const randomString = (Math.random().toString(36).slice(-10)).slice(0, 2);
    const username = `${firstName}${surName}${randomString}`;
    try {
      const user = await Users
      .create({
        email,
        firstName,
        surName,
        password,
        role,
        username
      });
      if(user){
        const userSession = {
          user_uid: user.user_uid,
          role: user.role,
        }
        req.session = userSession

        return res.status(201).json({
          status: 'success',
          message: 'New account created successfully.',
          username,
        });
      }
    } catch(err){
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
    try{
      const user = await Users.findOne({
        attributes: ['password', 'user_uid', 'role'],
        where: {
            username
        }
      });
      if (!user) return res.status(404).json({status: 'failure', error: "No User Found"});
      const userData = user.dataValues;
      const match =  await bcrypt.compare(password, userData.password);
      if (match) {
        const userSession = {
          user_uid: userData.user_uid,
          role: userData.role,
        }
        req.session = userSession
        return res.status(200).json({
          status: 'success',
          message: 'User logged in successfully.',
        });
      }
      return res.status(404).json({
        status: 'failure',
        error: "Password is incorrect"
      })
    }
    catch(err){
      res.status(500).json({err});
    }
  }
}

export default UsersController;
