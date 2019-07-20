import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import mockSession from 'mock-session';
import app from '../../../server/app';
import db from '../../../server/models/index';


chai.use(chaiHttp);
chai.should();

const { Users } = db;

const addUsersUrl = '/api/v1/users/addusers';
const loginUrl = '/api/v1/users/login';

let userSession = ''

describe('Add users validation unit tests', () => {

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
    } catch (err) {
      return err;
    }

  })
  after(async () => {
    await Users.destroy({ where: {} })
  })

  it('should give error if no file sent', async () => {
    let cookie = mockSession('session', process.env.SECRET, '');
    chai.request(app)
      .post(addUsersUrl)
      .set('cookie', [cookie])
      .end((err, res) => {
        res.status.should.be.eql(401);
        res.body.should.be.eql({
          status: 'failure',
          message: 'Please, Login'
        });
      })
  })
    it('should login successfully', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({ email: 'jamsgra.doey@gmail.com', password: '1234567' })
        .end((err, res) => {
          userSession = res.body.userSession;
          res.body.should.be.eql({
            status: "success",
            message: "User logged in successfully.",
            userSession
          });
          done()
        });
    });
  
    it('should give error if no file sent', async () => {
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
        })
    })


  it('should give error if file not correct type', async () => {
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
      })
  })

  it('should give error if file not in correct format', async () => {
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
      })
  })

  it('should give error if file does not contain users', () => {
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
      })
  })

  it('should give error if missing required user inputs', async () => {
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
      })
  })

  it('should give error if invalid input formats', async () => {
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
      })
  })

  it('should give error when duplicates in excel file', async() => {
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
        })
  });

});
