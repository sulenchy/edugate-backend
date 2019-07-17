import path from 'path';
import Validator from 'validator';
import db from '../models/index.js';

const { Results } = db;

class ExcelValidators {
  static checkFileType(file) {
    return path.extname(file.name) === '.xlsx';
  }

  static checkEmptySheet(arr) {
    return !arr.length;
  }

  static checkCorrectFormat(file, dataInputs) {
    for (let input of dataInputs) {
      if(!file[0][input]) {
        return false;
      }
    }
    return true;
  }

  static checkEmptyInput(input) {
    if (input === 'empty') {
      return 'Cannot be empty'
    }
  }

  static validateYear(year) {
    if (!Validator.isNumeric(year) || year.length !== 4) {
      return 'Invalid year';
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

  static validateTerm(term) {
    if (!['1', '2', '3'].includes(term)) return 'Invalid term number'
  }

  static validateMark(mark) {
    if (!mark.match(/^\d+\/\d+$/)) {
      return 'Mark should be "number/number"'
    }
  }

  static isAlphanumeric(value) {
    if (!Validator.isAlphanumeric(value)) {
      return 'Should only be letters & numbers'
    }
  }

  static isEmail(value) {
    if(!Validator.isEmail(value)) {
      return 'Should be valid email'
    }
  }

  static checkUid(results) {
    let errs = {};
    for (let i = 0; i < results.length; i++) {
      if (!results[i].user_uid) {
        errs[i] = 'Username not found'
      }
    }
    return errs;
  }

  static addSchoolUid(data, school_uid) {
    for (let row of data) {
        row.school_uid = school_uid
      }
      return data;
    }

  static emptyToNull(users, dataInputs) {
    for (let user of users) {
      for (let input of dataInputs) {
        if (user[input] === 'empty') {
          user[input] = null;
        }
      }
    }
    return users;
  }

  static addStudentResultId(results) {
    for (let result of results) {
      result.student_result_id = `${result.user_uid}.${result.year}.${result.term}.${result.exam}`
    }
    return results;
  }

  static async checkResultTableDuplicate(results) {
    try {
      let errs = {};
      for (let i = 0; i < results.length; i++) {
        const { student_result_id } = results[i];
        const found = await Results.findOne({
          where: {
            student_result_id,
          }
        })
        if (found) {
          errs[i] = 'Duplicate record found'
        }
      }
      return errs;
    } catch(err) {
      return `Error reading result table: ${err}`
    }
  }

  static checkFileDuplicates(file, id) {
    const duplicates = file.reduce((obj, item, index) => {
      const key = item[id];
      obj[key] = obj[key] ? obj[key].concat([index]) : [index];
      return obj;
    }, {});

    const duplicatesKey = Object.keys(duplicates);

    for (let key of duplicatesKey) {
      const group = duplicates[key];
      if (group.length === 1) {
        delete duplicates[key]
      }
    }
    return duplicates;
  }

  static fileDuplicateMessage(duplicates) {
    let duplicateGroups = [];
    const duplicatesKey = Object.keys(duplicates);
    for (let key of duplicatesKey) {
      const excelGroup = duplicates[key].map(x => x + 2);
      duplicateGroups.push(excelGroup);
    }
    const sortedGroups = duplicateGroups.sort((a, b) => a[0] - b[0]);
    return { duplicates: sortedGroups };
  }
}

export default ExcelValidators;
