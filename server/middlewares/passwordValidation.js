import { body } from 'express-validator/check';

export const validatePassword = [
    body('password', 'Password not sent').exists(),
    body('confirmPassword', 'Confirm Password not sent').exists(),
    body('password', 'Please enter a valid password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
    .matches(/\d/).withMessage('Password must contain a number')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ];
