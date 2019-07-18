import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import path from 'path';
import app from '../../../server/app';
import db from '../../../server/models/index';

let mockSession = require('mock-session');

const loginUrl = '/api/v1/users/login';
const addResultsUrl = '/api/v1/results/addresults';

const { Users, Results, Schools } = db;

chai.use(chaiHttp);
chai.should();

let userSession = '';

describe('Add results validation unit tests', () => {
  before(async() => {
    try{
      await Users.create({
        user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
        school_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
        first_name: 'John',
        last_name: 'Doe',
        dob: new Date(),
        year_of_graduation: '2020',
        role: 'admin',
        password: bcrypt.hashSync('1234567', 10),
        phone_number: '07038015455',
        email: 'jamsgra.doey@gmail.com',
      });
    } catch(err) {
      return err
    }
  })

  after(async() => {
      await Schools.destroy({where:{}})
      await Users.destroy({where:{}})
      await Results.destroy({where:{}})
  })

  it('should login successfully', (done) => {
    chai.request(app)
        .post(loginUrl)
        .send({ email: 'jamsgra.doey@gmail.com', password: '1234567' })
        .end((err, res) => {
            userSession = res.body.userSession
            res.body.should.be.eql({
                status: "success",
                message: "User logged in successfully.",
                userSession
            });
            done()
        });
});

  it('should give error if no file sent', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .end((err, res) => {
          res.status.should.be.eql(400);
          res.body.should.be.eql({
            status: 'failure',
            error: 'No files were uploaded'
          });
        })
  })
  it('should give error when user is unauthorised', async() => {
    let cookie = mockSession('session', process.env.SECRET, 'userSession');
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.eql({
            status: 'failure',
            message: 'Please, Login'
          });
        })
  })

  it('should give error if file not correct type', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataInvalidType.doc')), 'addResultsDataInvalidType.doc')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: 'Wrong file type'
          });
          res.status.should.be.eql(422);
        })
  })

  it('should give error if file not in correct format', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataInvalidFormat.xlsx')), 'addResultsDataInvalidFormat.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: 'Data is in incorrect format. Please use template'
          });
          res.status.should.be.eql(422);
        })
  })

  it('should give error if file does not contain results', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataNoUsers.xlsx')), 'addResultsDataNoUsers.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: 'File does not contain results'
          });
          res.status.should.be.eql(422);
        })
  })

  it('should give error if missing required results inputs', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataReqMissing.xlsx')), 'addResultsDataReqMissing.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: { 2: { email: 'Cannot be empty'}}
          });
          res.status.should.be.eql(422);
        })
  })

  it('should give error if missing required user inputs', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataInvalidInputs.xlsx')), 'addResultsDataInvalidInputs.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: {
              2: {
                term: 'Invalid term number',
                year: 'Invalid year',
                email: 'Invalid email',
                mark: 'Mark should be "number/number"',
              }
            }
          });
          res.status.should.be.eql(422);
        })
  })

  it('should give error if invalid user', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataInvalidUser.xlsx')), 'addResultsDataInvalidUser.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: {
              2: 'User not found'
            },
          });
          res.status.should.be.eql(422);
        })
  })

  it('should give error when duplicates in excel file', async() => {
    let cookie = mockSession('session', process.env.SECRET, userSession);
    chai.request(app)
        .post(addResultsUrl)
        .set('cookie', [cookie])
        .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataFileDuplicates.xlsx')), 'addResultsDataFileDuplicates.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: {
              "2": "User not found",
              "3": "User not found",
              "4": "User not found",
              "5": "User not found"
            },
          });
          res.status.should.be.eql(422);
        })
  });

});
