import models from '../models';

const { Users } = models;

/**
 * This arrow function checks if an email exists in database.
 * @param {string} email - email must be type string
 * @returns {object} return email if it exist or null if it doesn't.
 */
const checkEmail = email => Users.findOne({
  where: {
    email
  }
});

export default checkEmail;