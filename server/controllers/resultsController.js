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
 * @description
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
   } catch(err){
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
