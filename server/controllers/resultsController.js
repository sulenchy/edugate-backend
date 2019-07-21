import models from '../models';
import removeDuplicates from '../helpers/removeDuplicates';
import convertIndexToExcelRow from '../helpers/convertIndexToExcelRow.js';

const { Results } = models;

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
      return res.status(500)
        .json({
          errors: {
            message: [err.message]
          },
        })
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
      const term = req.query.term;
      const year = req.query.year;
      const subject = req.query.subject;


      const clause = {
        attributes: ['id', 'year', 'subject', 'exam', 'mark', 'term', 'student_result_id', 'user_uid'],
        where: {}
      };

      clause.where.school_uid = req.session.school_uid;

      if (term) {
        clause.where.term = term;
      }

      if (year) {
        clause.where.year = year;
      }

      if (subject) {
        clause.where.subject = subject;
      }

      const results = await Results.findAll(
        clause
      )

      return res.status(200).json({
        status: 'success',
        message: 'Result retrieved successfully.',
        results
      })
    }
    catch (err) {
      return res.status(500)
        .json({
          status: 'failure',
          errors: {
            message: [err.message]
          },
        })
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
      const term = req.query.term;
      const year = req.query.year;
      const subject = req.query.subject;


      const clause = {
        attributes: ['id', 'year', 'subject', 'exam', 'mark', 'term', 'student_result_id'],
        where: {}
      };


      const { school_uid, user_uid } = req.session;
      clause.where.school_uid = school_uid;
      clause.where.user_uid = user_uid;

      if (term) {
        clause.where.term = term;
      }

      if (year) {
        clause.where.year = year;
      }

      if (subject) {
        clause.where.subject = subject;
      }

      const results = await Results.findAll(
        clause
      )

      return res.status(200).json({
        status: 'success',
        message: 'Result retrieved successfully.',
        results
      })
    }
    catch (err) {
      return res.status(500)
        .json({
          status: 'failure',
          errors: {
            message: [err.message]
          },
        })
    }
  }
}

export default ResultsController;
