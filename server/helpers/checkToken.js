import model from '../models';

const { User } = model;

/**
 * @description checks whether the user id in the token exist
 * @param {integer} userId - the id of the user
 * @returns {void} - return null
 */
async function checkToken(userId) {
  // check if user Id is from delete token
  if (userId.toString().includes('-')) {
    [userId] = userId.split('-');
  }

  let result;
  try {
    result = await User.findByPk(userId);
    if (!result) {
      const error = new Error('Please sign up');
      error.status = 401;
      throw error;
    }
  } catch (err) {
    return err;
  }
}


export default checkToken;
