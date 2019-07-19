import ExcelValidators from '../helpers/excelValidators';
import formatExcel from '../helpers/formatExcel';
import sendError from '../helpers/sendError';
import { toLowerCase } from '../helpers/convertToLowerCase';
import convertIndexToExcelRow from '../helpers/convertIndexToExcelRow';
import { removeUndefinedInputs } from '../helpers/removeUndefinedInputs.js';

const dataInputs = ['first_name', 'last_name', 'dob', 'year_of_graduation', 'role', 'phone_number', 'email'];

class addUsersValidation {

  static async validateAddUsers(req, res, next) {
    try {
      if (!req.files || !Object.keys(req.files).length) return sendError(res, 400, 'No files were uploaded');

      const file = req.files.addUsers;

      if (!file || !Object.keys(file).length) return sendError(res, 400, 'Incorrect file name');

      if (!ExcelValidators.checkFileType(file)) return sendError(res, 422, 'Wrong file type');

      let users = formatExcel(file);

      // converts all data to lowercase
      users = Object.values(toLowerCase(users));

      if (ExcelValidators.checkEmptySheet(users)) return sendError(res, 422, 'File does not contain users');

      if (!ExcelValidators.checkCorrectFormat(users, dataInputs)) return sendError(res, 422, 'Data is in incorrect format. Please use template');

      const inputErrs = addUsersValidation.checkInputs(users);

      if (Object.keys(inputErrs).length) return sendError(res, 422, convertIndexToExcelRow(inputErrs));

      // Prevents an users other than super admin from creating admin/super admin
      const privilegeErrs = addUsersValidation.checkInputRolePrivilege(users, req.session.role);

      if (Object.keys(privilegeErrs).length) return sendError(res, 422, convertIndexToExcelRow(privilegeErrs));

      const fileDuplicates = ExcelValidators.checkFileDuplicates(users, 'email');

      if (Object.keys(fileDuplicates).length) return sendError(res, 422, ExcelValidators.fileDuplicateMessage(fileDuplicates));

      users = ExcelValidators.addSchoolUid(users, req.session.school_uid);
      users = ExcelValidators.emptyToNull(users, dataInputs);
      res.locals.duplicates = await ExcelValidators.checkUserTableDuplicate(users);
      res.locals.users = users;
      next();
    } catch(err) {
      return sendError(res, 500, err.message);
    }
  }

  static validateUpdateUsers(req, res, next) {
    const { email, first_name, last_name, dob, year_of_graduation, phone_number, role } = req.body;
    let user = { email, first_name, last_name, dob, year_of_graduation, phone_number, role };
    user = toLowerCase(user);
    const userUpdatedInputs = removeUndefinedInputs([user]);
    const inputErrs = addUsersValidation.checkInputs(userUpdatedInputs);
    if (Object.keys(inputErrs).length) return sendError(res, 422, inputErrs);
    res.locals.user = userUpdatedInputs[0];
    next();
  }

  static checkInputs(users) {
    let errors = {};
    for (let i = 0; i < users.length; i++) {
      let userErrors = {};
      const userRow = i;
      for (let input of Object.keys(users[i])) {
        const value = users[i][input];
        // Validator only accepts strings
        let stringError = ExcelValidators.checkString(value);
        if (stringError) {
          userErrors[input] = stringError
        } else {
          let inputError = ExcelValidators.checkEmptyInput(value);
          const validatorKey = {
            first_name: ExcelValidators.validateName(value),
            last_name: ExcelValidators.validateName(value),
            dob: ExcelValidators.validateDob(value),
            year_of_graduation: ExcelValidators.validateYear(value),
            role: ExcelValidators.validateRole(value),
            phone_number: ExcelValidators.validatePhone(value),
            email: ExcelValidators.validateEmail(value)
          };
          if (inputError) {
            if (!['phone_number'].includes(input)) {
              userErrors[input] = inputError
            }
          } else if (validatorKey[input]) {
            userErrors[input] = validatorKey[input]
          }
        }
      }
    if (Object.keys(userErrors).length) errors[userRow] = userErrors;
    }
  return errors;
  }

  static checkInputRolePrivilege(users, role) {
    let errors = {};
    for (let i = 0; i < users.length; i++) {
      if (['admin', 'super admin'].includes(users[i].role) && role !== 'super admin') {
        errors[i] = 'You do not have the correct privilege to set user as admin or super admin'
      }
    }
    return errors;
  }
}

export default addUsersValidation;
