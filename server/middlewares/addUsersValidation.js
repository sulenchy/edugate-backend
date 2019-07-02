import XLSX from 'xlsx';
import path from 'path';
import Validator from 'validator';

const dataInputs = ['first_name', 'last_name', 'dob', 'year_of_graduation', 'role', 'phone_number', 'email'];

class addUsersValidation {

  static validateAddUsers(req, res, next) {
    if (!req.files || !Object.keys(req.files).length) {
      return res.status(400).json({
        status: 'failure',
        error: 'No files were uploaded'
        });
    }

    const file = req.files.addUsers;

    if (!addUsersValidation.checkFileType(file)) {
      return res.status(422).json({
        status: 'failure',
        error: 'Wrong file type'
        })
    }
    const users = addUsersValidation.formatExcelData(file);
    if (addUsersValidation.checkUsersEmpty(users)) {
      return res.status(422).json({
        status: 'failure',
        error: 'File does not contain users'
      });
    }
    if (!addUsersValidation.checkCorrectFormat(users)) {
      return res.status(422).json({
        status: 'failure',
        error: 'Data is in incorrect format. Please use template'
      });
    }
    const inputErrs = addUsersValidation.checkInputs(users);
    if (Object.keys(inputErrs).length) {
      return res.status(422).json({
        status: 'failure',
        error: inputErrs,
      });
    }
    for (let user of users) {
      for (let input of dataInputs) {
        if (user[input] === 'empty') {
          user[input] = null;
        }
      }
    }
    res.locals.users = users;
    next();
  }

  static formatExcelData(file) {
    const usersData = file.data;
    const workbook = XLSX.read(usersData);
    const worksheet = workbook.Sheets.Sheet1;
    const usersArray = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: 'empty' });
    return usersArray;
  }

  static checkFileType(file) {
    return path.extname(file.name) === '.xlsx';
  }

  static checkUsersEmpty(users) {
    return !users.length;
  }

  static checkCorrectFormat(users) {
    for (let input of dataInputs) {
      if(!users[0][input]) {
        return false;
      }
    }
    return true;
  }

  static checkInputs(users) {
    let errors = {};
    for (let i = 0; i < users.length; i++) {
      let userErrors = {};
      const userRow = i + 2;
      for (let input of dataInputs) {
        const value = users[i][input];
        let inputError;
        switch(input) {
          case 'first_name':
            inputError = addUsersValidation.checkEmpty(value) ? addUsersValidation.checkEmpty(value) : addUsersValidation.validateName(value)
            break;
          case 'last_name':
            inputError = addUsersValidation.checkEmpty(value)? addUsersValidation.checkEmpty(value): addUsersValidation.validateName(value)
            break;
          case 'dob':
            inputError = addUsersValidation.checkEmpty(value) ? addUsersValidation.checkEmpty(value): addUsersValidation.validateDob(value)
            break;
          case 'year_of_graduation':
            inputError = addUsersValidation.checkEmpty(value) ? addUsersValidation.checkEmpty(value) : addUsersValidation.validateYearOfGrad(value);
            break;
          case 'role':
            inputError = addUsersValidation.checkEmpty(value) ? addUsersValidation.checkEmpty(value) : addUsersValidation.validateRole(value);
            break;
          case 'phone_number':
            inputError = addUsersValidation.checkEmpty(value) ? '' : addUsersValidation.validatePhone(value);
            break;
          case 'email':
            inputError = addUsersValidation.checkEmpty(value) ? '' : addUsersValidation.validateEmail(value);
            break;
          }
        if (inputError) userErrors[input] = inputError;
      }
    if (Object.keys(userErrors).length) errors[userRow] = userErrors;
  }
  return errors;
}

  static checkEmpty(input) {
    if (input === 'empty') {
      return 'Cannot be empty'
    }
  }

  static validateName(name) {
    if (!Validator.isAlpha(name.replace(/-/g, ''))) {
      return 'Name should only contain letters'
    }
  }

  static validateDob(dob) {
    if (!Validator.isISO8601(dob)) {
      return 'Invalid date format'
    }
  }

  static validateYearOfGrad(year) {
    if (!Validator.isNumeric(year) || year.length !== 4) {
      return 'Invalid year';
    }
  }

  static validateRole(role) {
    if (role !== 'teacher' && role !== 'student') {
      return 'Invalid role'
    }
  }

  static validatePhone(phone) {
    if (!Validator.isMobilePhone(phone)) {
      return 'Invalid phone number';
    }
  }

  static validateEmail(email) {
    if (!Validator.isEmail(email)) {
      return 'Invalid email'
    }
  }
}

export default addUsersValidation;
