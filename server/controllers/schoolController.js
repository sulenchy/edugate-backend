import models from '../models';

const { Schools } = models;

/**
 * @class SchoolsController
 * @description School related Operations
 */
class SchoolsController {
  /**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns user
 */
  static async create(req, res) {
    const { school_name, address_line_1, Address_line_2, city, postal_code } = req.body;
    const admin_uid = req.session.user_uid;

    try {
      const school= await Schools
      .create({
          school_name,admin_uid,address_line_1,Address_line_2, city, postal_code
      });
      if(school){

        return res.status(201).json({
          status: 'success',
          message: 'New account created successfully.',
          school
        });
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

export default SchoolsController;
