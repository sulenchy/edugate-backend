import models from '../models';
import removeDuplicates from '../helpers/removeDuplicates';
import convertIndexToExcelRow from '../helpers/convertIndexToExcelRow.js';
import sendError from '../helpers/sendError.js';
import { toLowerCase } from '../helpers/convertToLowerCase';

const { Results, Users } = models;

/**
 * @class ResultsController
 * @description Results related Operations
 */
class ResultsController {
  /**
 * @description -
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns results
 */
  static async addResults(req, res) {
    try {
      const { results, duplicates } = res.locals;
      const uniqueResults = removeDuplicates(results, duplicates);
      const newResults = await Results
        .bulkCreate(
          uniqueResults
        );
      if (newResults) {
        const resObj = {
          status: 'success',
          message: `${Object.keys(uniqueResults).length} results successfully added.`
        }
        if (Object.keys(duplicates).length) {
          resObj.duplicates = convertIndexToExcelRow(duplicates);
        }
        return res.status(201).json(resObj);
      }
    } catch (err) {
      return sendError(res, 500, err);
    }
  }

  /**
 * @description - get result for admin and teacher
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns results
 */
  static async getAllResults(req, res) {
    try {
      const term = toLowerCase(req.query.term);
      const year = toLowerCase(req.query.year);
      const subject = toLowerCase(req.query.subject);


      const options = {
        attributes: ['result_uid', 'year', 'subject', 'exam', 'mark', 'term', 'student_result_id'],
        where: {
          status: 'active'
        },
        include: [{ model: Users, 'as': 'User', attributes: ['user_uid', 'first_name', 'last_name', 'dob', 'year_of_graduation', 'role', 'phone_number', 'email'] }],
        order: [['subject', 'ASC']]
      };

      options.where.school_uid = req.session.school_uid;

      if (term) {
        options.where.term = term;
      }

      if (year) {
        options.where.year = year;
      }

      if (subject) {
        options.where.subject = subject;
      }

      const results = await Results.findAndCountAll(
        options
      )

      return res.status(200).json({
        status: 'success',
        message: 'Result retrieved successfully.',
        results
      })
    }
    catch (err) {
      return sendError(res, 500, err);
    }
  }

  /**
 * @description - get result for students
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns results
 */
  static async getUserResults(req, res) {
    try {
      const term = toLowerCase(req.query.term);
      const year = toLowerCase(req.query.year);
      const subject = toLowerCase(req.query.subject);

      // specifies options in the findAll sequelize method
      const options = {
        attributes: ['result_uid', 'year', 'subject', 'exam', 'mark', 'term', 'student_result_id'],
        where: {
          status: 'active'
        },
        order: [['subject', 'ASC']]
      };


      const { school_uid, user_uid } = req.session;
      options.where.school_uid = school_uid;
      options.where.user_uid = user_uid;

      if (term) {
        options.where.term = term;
      }

      if (year) {
        options.where.year = year;
      }

      if (subject) {
        options.where.subject = subject;
      }

      const results = await Results.findAll(
        options
      )

      return res.status(200).json({
        status: 'success',
        message: 'Result retrieved successfully.',
        results
      })
    }
    catch (err) {
      return sendError(res, 500, err);
    }
  }

  static async updateResult(req, res) {
    try {
      const updateData = res.locals.result;
      const updatedResult = await Results.update(updateData, {
        where: {
          result_uid: req.query.result_uid
        },
        returning: true
      })
      if (updatedResult) {
        let updatedInfo = updatedResult[1][0];
        return res.status(200).json({
          status: 'success',
          message: 'Result successfully updated',
          updatedResult: updatedInfo.student_result_id
        })
      }

    } catch (err) {
      return sendError(res, 500, err);
    }
  }

  /**
  * @description - delete result
  * @param {object} req - request object
  * @param {object} res - response object
  */
  static async delete(req, res) {
    try {
      const { options } = res.locals;

      const deletedResults = await Results.update(
        { status: 'deleted' },
        options,
      )
      if (deletedResults) {
        res.status(200).json({
          status: 'success',
          message: 'Result(s) deleted',
          deletedResults: deletedResults[0]
        })
      }
    }
    catch (err) {
      return res.status(500)
        .json({
          errors: {
            message: [err.message]
          },
        })
    }
  }
}

export default ResultsController;
