import checkEmail from '../helpers/checkEmail';

const message = [];
/**
 * @class ValidationHelper
 * @description Helps perform validations on user request body.
 */
class SchoolValidation {
  /**
    * @description - This method validates the user request body.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object to be validated.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf SchoolValidation
    * @static
    */
  static validateSchoolCreate(req, res, next) {
    // SchoolValidation.validateFullName(req);
    SchoolValidation.validateSchoolName(req);
    SchoolValidation.validateAddressLine1(req);
    SchoolValidation.validateCity(req);
    SchoolValidation.validateCountry(req);
    SchoolValidation.validatePostalCode(req);
    SchoolValidation.sendFormattedError(req, res, next);
  }



  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf SchoolValidation
    * @static
    */
  static validateSchoolName(req) {
    req.checkBody('school_name', 'please enter school name').exists();
    req.checkBody('school_name', 'please enter a valid school name').isLength({ min: 2 }).withMessage('must be at least 2 letters long');
  }

  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf SchoolValidation
    * @static
    */
   static validateAddressLine1(req) {
    req.checkBody('address_line_1', 'please enter address line 1').exists();
    req.checkBody('address_line_1', 'please enter valid address line 1').isLength({ min: 5 }).withMessage('must be at least 5 letters long');
  }


  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf SchoolValidation
    * @static
    */
  static validateCity(req) {
    req.checkBody('city', 'please enter city').exists();
    req.checkBody('city', 'please enter valid city').isLength({ min: 2 }).withMessage('must be at least 2 letters long');
  }

  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf SchoolValidation
    * @static
    */
  static validateCountry(req) {
    req.checkBody('country', 'please enter country').exists();
    req.checkBody('country', 'please enter valid country').isLength({ min: 2 }).withMessage('must be at least 2 letters long');
  }

  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf SchoolValidation
    * @static
    */
   static validatePostalCode(req) {
    req.checkBody('postal_code', 'please enter postal code').exists();
    req.checkBody('postal_code', 'please enter valid postal code').isLength({ min: 2 }).withMessage('must be at least 2 letters long');
  }




  /**
    * @description - This method sends the error in the suggested json format.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object.
    * @param {object} next - The callback function to the next middleware.
    * @param {number} statusCode - the status code for the error
    * @returns {object} - The error object with message.
    * @memberOf SchoolValidation
    * @static
    */
  static sendFormattedError(req, res, next, statusCode) {
    const newErrors = req.validationErrors();
    const errors = {};
    if (message.length) {
      errors.school_name = [];
      errors.school_name.push(...message);
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
    * @memberOf SchoolValidation
    * @static
    */
  static async checkExistingSchoolName(req, res, next) {
    const { school_name } = req.body;
    try{
      const schoolNameFound = await checkEmail(school_name);
      if (!schoolNameFound) return next();
        if (schoolNameFound) {
          return res.status(409).json({
            errors: {
              schoolName: ['school name is already in use']
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

export default SchoolValidation;
