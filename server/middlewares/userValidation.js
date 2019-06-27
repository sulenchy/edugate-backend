import checkEmail from '../helpers/checkEmail';

const message = [];
/**
 * @class ValidationHelper
 * @description Helps perform validations on user request body.
 */
class UserValidation {
  /**
    * @description - This method checks if a user enters an email.
    * @param {object} req - The request object bearing the email.
    * @param {object} res - The response object sent to the next middleware.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateUserLogin(req, res, next) {
    UserValidation.validateUsername(req);
    UserValidation.validatePassword(req);
    UserValidation.sendFormattedError(req, res, next);
  }

  /**
    * @description - This method validates the user request body.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object to be validated.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateUserSignUp(req, res, next) {
    // UserValidation.validateFullName(req);
    UserValidation.validateEmail(req);
    UserValidation.validatePassword(req);
    UserValidation.sendFormattedError(req, res, next);
  }



  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateEmail(req) {
    req.checkBody('email', 'please enter email').exists();
    req.checkBody('email', 'please enter a valid email').isEmail();
  }

  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
   static validateUsername(req) {
    req.checkBody('username', 'please enter username').exists();
  }


  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validatePassword(req) {
    req.checkBody('password', 'please enter password').exists();
    req.checkBody('password', 'please enter a valid password').isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    .matches(/\d/).withMessage('must contain a number');
  }



  /**
    * @description - This method sends the error in the suggested json format.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object.
    * @param {object} next - The callback function to the next middleware.
    * @param {number} statusCode - the status code for the error
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static sendFormattedError(req, res, next, statusCode) {
    const newErrors = req.validationErrors();
    const errors = {};
    if (message.length) {
      errors.fullName = [];
      errors.fullName.push(...message);
    }
    if (newErrors) {
      newErrors.forEach((x) => {
        errors[`${x.param}`] = [];
      });
      newErrors.forEach((err) => {
        if (errors[`${err.param}`]) { errors[`${err.param}`].push(err.msg); }
      });
    }
    if (newErrors || message.length) {
      return res.status(statusCode || 422).json({ errors });
    }
    if (!newErrors && !message.length) return next();
  }

  /**
    * @description - This method checks if an email is already in the system.
    * @param {object} req - The request object bearing the email.
    * @param {object} res - The response object sent to the next middleware.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static async checkExistingEmail(req, res, next) {
    const { email } = req.body;
    try{
      const emailFound = await checkEmail(email);
      if (!emailFound) return next();
        if (emailFound) {
          return res.status(409).json({
            errors: {
              email: ['email is already in use']
            }
          });
        }
    }
    catch(err){
      return res.status(500).json({
        error: {
          message: ['error reading user table', `${err}`]
        }
      });
    }
  }
}

export default UserValidation;
