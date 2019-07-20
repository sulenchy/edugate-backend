import ExcelValidators from '../helpers/excelValidators';
import formatExcel from '../helpers/formatExcel';
import sendError from '../helpers/sendError';
import convertIndexToExcelRow from '../helpers/convertIndexToExcelRow';

const dataInputs = ['first_name', 'last_name', 'dob', 'year_of_graduation', 'role', 'phone_number', 'email'];

class addUsersValidation {

  static async validateAddUsers(req, res, next) {
    try {
      if (!req.files || !Object.keys(req.files).length) return sendError(res, 400, 'No files were uploaded');

      const file = req.files.addUsers;

      if (!file || !Object.keys(file).length) return sendError(res, 400, 'Incorrect file name');

      if (!ExcelValidators.checkFileType(file)) return sendError(res, 422, 'Wrong file type');

      let users = formatExcel(file);

      if (ExcelValidators.checkEmptySheet(users)) return sendError(res, 422, 'File does not contain users');

      if (!ExcelValidators.checkCorrectFormat(users, dataInputs)) return sendError(res, 422, 'Data is in incorrect format. Please use template');

      const inputErrs = addUsersValidation.checkInputs(users);

      if (Object.keys(inputErrs).length) return sendError(res, 422, convertIndexToExcelRow(inputErrs));

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

  static checkInputs(users) {
    let errors = {};
    for (let i = 0; i < users.length; i++) {
      let userErrors = {};
      const userRow = i;
      for (let input of dataInputs) {
        const value = users[i][input];
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
        if (['phone_number'].includes(input)) {
          inputError = inputError ? '' : validatorKey[input]
        } else {
          inputError = inputError ? inputError : validatorKey[input]
        }
        if (inputError) userErrors[input] = inputError;
      }
    if (Object.keys(userErrors).length) errors[userRow] = userErrors;
    }
  return errors;
  }
}

export default addUsersValidation;
