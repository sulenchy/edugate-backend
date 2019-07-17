import models from '../models';

const { Users } = models;

async function emailToUid(results) {
  try {
    let usersSearched = {};
    for (let result of results) {
      const { email } = result;
      const searched = usersSearched[email];
      if (searched) {
        result.user_uid = searched !== 'Not found' ? searched : null;
      } else {
        const user = await findUserUid(email);
        result.user_uid = user ? user.user_uid : null;
        usersSearched[email] = result.user_uid || 'Not found';
      }
      delete result.email;
    }
    return results;
  } catch(err) {
    return `Error reading user table: ${err}`
  }
}

const findUserUid = (email) => Users.findOne({
  where: {
    email
  }
});


export default emailToUid;
