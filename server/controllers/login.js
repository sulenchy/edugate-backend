import bcrypt from 'bcryptjs';
import db from '../../server/models/index'

let { Users } = db;

let login = {}

login.get = (req, res) => {
  res.send('Login page');
}

login.post = (req, res) => {
  const { username, password } = req.body;
  Users.findAll({
    attributes: ['password', 'user_uid', 'role'],
    where: {
        username
    }
  })
  .then(user => {
    if (!user || !user.length) return res.send({err: "No User Found"})
    const userData = user[0].dataValues;
    bcrypt.compare(password, userData.password)
    .then(match => {
      if (match) {
        const user = {
          user_uid: userData.user_uid,
          role: userData.role,
        }
        req.session = user
      }
      res.send({match})
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
};

export { login }
