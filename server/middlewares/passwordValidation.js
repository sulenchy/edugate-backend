import { body } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import models from '../models';
import sendError from '../helpers/sendError.js';

const { Users } = models;

export const checkUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { user_uid } = req.session;
    const checkUser = await Users.findOne({
      where: {
        user_uid
      }
    })
    const match = await bcrypt.compare(password, checkUser.password);
    if (!match) return sendError(res, 401, 'Current password entered incorrectly')
    next();
  } catch(err) {
    sendError(res, 500, err)
  }
}

export const validatePassword = [
    body('newPassword', 'Password not sent').exists(),
    body('confirmPassword', 'Confirm Password not sent').exists(),
    body('newPassword', 'Please enter a valid password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
    .matches(/\d/).withMessage('Password must contain a number')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ];
