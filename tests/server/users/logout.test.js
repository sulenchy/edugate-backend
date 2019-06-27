import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import server from '../../../server/app';
import db from '../../../server/models/index'

chai.use(chaiHttp);

const { expect } = chai;

let { Users } = db;

describe('Logout route', () => {
  before((done) => {
    bcrypt.hash('123testing', 10)
    .then(password => {
      Users.create({
            user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
            first_name: 'John',
            last_name: 'Doe',
            dob: new Date(),
            year_of_graduation: '2020',
            role: 'admin',
            password,
            phone_number: '07038015455',
            username: 'jamsgra',
            email: 'John.doe@gmail.com',
        })
        .then(() => done())
    })
  })

  let agent = chai.request.agent(server)

  before((done) => {
    agent
    .post('/login').redirects(0)
    .send({ username: 'jamsgra', password: '123testing' })
    .then(res => {
      expect(res).to.have.cookie('session');
      done();
    })
    .catch(err => console.log(err))
    })

  after((done) => {
    Users.destroy({
      where: {
        username: 'jamsgra'
      }
    }).then(() => done())
  })

  it('logout', (done) => {
        agent.get('/logout')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.msg).to.equal("User logged out successfully");
          return agent.get('/')
          .then(function(res) {
            expect(res).to.not.have.cookie('session')
            done()
          })
        })
        .catch(err => console.log(err))
  })
})
