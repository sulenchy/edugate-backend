import bcrypt from 'bcryptjs';
import db from '../../server/models/index'

let { Users } = db;

let login = {}

login.get = (req, res) => {
  res.send('Login page');
}

login.post = (req, res) => {
  const { username, password } = req.body;
  Users.findOne({
    attributes: ['password', 'user_uid', 'role'],
    where: {
        username
    }
  })
  .then(user => {
    if (!user) return res.send({userFound: false})
    const userData = user.dataValues;
    bcrypt.compare(password, userData.password)
    .then(match => {
      if (match) {
        const user = {
          user_uid: userData.user_uid,
          role: userData.role,
        }
        req.session = user
        return res.redirect('/dash')
      }
      res.send({passMatch: match})
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
};

export { login }
