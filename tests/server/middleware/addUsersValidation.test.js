import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import mockSession from 'mock-session';
import app from '../../../server/app';
import db from '../../../server/models/index';
import {
    privilegeUsers
} from '../../mockData/userMockData';


chai.use(chaiHttp);
chai.should();

const { Users } = db;

const addUsersUrl = '/api/v1/users/addusers';
const loginUrl = '/api/v1/users/login';
const updateUserUrl = '/api/v1/users/update?user_uid=';

let userSession = ''

describe('Add users validation unit tests', () => {

  before(async() => {
    try{
      await Users.bulkCreate(privilegeUsers);
    } catch (err) {
      return err;
    }

  })
  after(async () => {
    await Users.destroy({ where: {} })
  })
  
  it('should give error if not logged in', (done) => {
    let cookie = mockSession('session', process.env.SECRET, '');
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .end((err, res) => {
        res.status.should.be.eql(401);
        res.body.should.be.eql({
          status: 'failure',
          error: 'Please login'
        });
        done();
      })
  })
  it('should login successfully', (done) => {
    chai.request(app)
      .post(loginUrl)
      .send({ email: 'jamsgra.doey@gmail.com', password: '1234567' })
      .end((err, res) => {
        userSession = res.body.userSession;
        res.body.should.be.eql({
          status: 'success',
          message: 'User logged in successfully.',
          userSession
        });
        done()
      });
  });

  it('should give error if no file sent', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .end((err, res) => {
        res.status.should.be.eql(400);
        res.body.should.be.eql({
          status: 'failure',
          error: 'No files were uploaded'
        });
        done();
      })
  })


  it('should give error if file not correct type', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataInvalidType.doc')), 'addUsersDataInvalidType.doc')
      .end((err, res) => {
        res.body.should.be.eql({
          status: 'failure',
          error: 'Wrong file type'
        });
        res.status.should.be.eql(422);
        done();
      })
  })

  it('should give error if file not in correct format', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataInvalidFormat.xlsx')), 'addUsersDataInvalidFormat.xlsx')
      .end((err, res) => {
        res.body.should.be.eql({
          status: 'failure',
          error: 'Data is in incorrect format. Please use template'
        });
        res.status.should.be.eql(422);
        done()
      })
  })

  it('should give error if file does not contain users', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataNoUsers.xlsx')), 'addUsersDataNoUsers.xlsx')
      .end((err, res) => {
        res.body.should.be.eql({
          status: 'failure',
          error: 'File does not contain users'
        });
        res.status.should.be.eql(422);
        done();
      })
  })

  it('should give error if missing required user inputs', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataReqMissing.xlsx')), 'addUsersDataReqMissing.xlsx')
      .end((err, res) => {
        res.body.should.be.eql({
          status: 'failure',
          error: { 2: { last_name: 'Cannot be empty', email: 'Cannot be empty' } }
        });
        res.status.should.be.eql(422);
        done();
      })
  })

  it('should give error if invalid input formats', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataInvalidInputs.xlsx')), 'addUsersDataInvalidInputs.xlsx')
      .end((err, res) => {
        res.body.should.be.eql({
          status: 'failure',
          error: {
            2: {
              first_name: 'Name should only contain letters',
            },
            3: {
              dob: 'Invalid date format',
              email: 'Invalid email',
              last_name: 'Name should only contain letters'
            },
            4: {
              role: 'Invalid role',
              year_of_graduation: 'Invalid year'
            }
          }
        });
        res.status.should.be.eql(422);
        done();
      })
  })

  it('should give error when duplicates in excel file', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addUsersUrl)
        .set('cookie', [cookie])
        .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataFileDuplicates.xlsx')), 'addUsersDataFileDuplicates.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: {
              duplicates: [
                [4, 5],
              ],
            },
          });
          res.status.should.be.eql(422);
          done();
        })
  });

  it('should give error when trying to set user role above privilege level', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addUsersUrl)
        .set('cookie', [cookie])
        .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataInvalidRolePrivilege.xlsx')), 'addUsersDataInvalidRolePrivilege.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: {
              2: 'You do not have the correct privilege to set user as admin or super admin'
            },
          });
          res.status.should.be.eql(422);
          done();
        })
  });

  it('should give error if invalid data to update user', (done) => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f610')
        .set('cookie', [cookie])
        .send({ email: 'student@gmail.com', first_name: '123124', dob: 1234, year_of_graduation: '', role: 'pizza' })
        .then((res) => {
          res.status.should.be.eql(422);
          res.body.should.be.eql({
            status: 'failure',
            error: {
              0: {
                dob: 'Should be a string',
                first_name: 'Name should only contain letters',
                role: 'Invalid role',
                year_of_graduation: 'Cannot be empty'
             }
            },
          });
          done();
        })
        .catch(done);
  })
});
