import bcrypt from 'bcryptjs';
import models from '../models';

import { createToken } from '../middlewares/tokenUtils';

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
    const lifeSpan = '1h';
    try {
      const user = await Users
      .create({
        email,
        password,
        role,
        username
      });
      if(user){
        const token = createToken(user.user_uid, lifeSpan);

        // TODO: should we send confirmation emil to user

        return res.status(201).json({
          status: 'success',
          message: 'New account created successfully.',
          username,
          token
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
    const lifeSpan = '1h';
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
        const user = {
          user_uid: userData.user_uid,
          role: userData.role,
        }
        const token = createToken(user.user_uid, lifeSpan);
        req.session = user
        return res.status(200).json({
          status: 'success',
          message: 'User logged in successfully.',
          token
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
