import models from '../models';

const { Users } = models;

async function usernameToUid(results) {
  try {
    let usersSearched = {};
    for (let result of results) {
      const { username } = result;
      const searched = usersSearched[username];
      if (searched) {
        result.user_uid = searched !== 'Not found' ? searched : null;
      } else {
        const user = await findUserUid(username);
        result.user_uid = user ? user.user_uid : null;
        usersSearched[username] = result.user_uid || 'Not found';
      }
      delete result.username;
    }
    return results;
  } catch(err) {
    return `Error reading user table: ${err}`
  }
}

const findUserUid = (username) => Users.findOne({
  where: {
    username
  }
});


export default usernameToUid;
