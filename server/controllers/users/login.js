import bcrypt from 'bcryptjs';
import db from '../../models'

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
    if (!user) return res.status(404).json({err: "No User Found"})
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
      return res.status(404).json({
        err: "Password is incorrect"
      })
    })
  })
  .catch(err => res.status(500).json({err}))
};

export { login }
