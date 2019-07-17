import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import app from '../../../server/app';

chai.use(chaiHttp);
chai.should();

const addUsersUrl = '/api/v1/users/addusers';

describe('Add users validation unit tests', () => {

  it('should give error if no file sent', (done) => {
    chai.request(app)
        .post(addUsersUrl)
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
    chai.request(app)
        .post(addUsersUrl)
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
    chai.request(app)
        .post(addUsersUrl)
        .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataInvalidFormat.xlsx')), 'addUsersDataInvalidFormat.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: 'Data is in incorrect format. Please use template'
          });
          res.status.should.be.eql(422);
          done();
        })
  })

  it('should give error if file does not contain users', (done) => {
    chai.request(app)
        .post(addUsersUrl)
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
    chai.request(app)
        .post(addUsersUrl)
        .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataReqMissing.xlsx')), 'addUsersDataReqMissing.xlsx')
        .end((err, res) => {
          res.body.should.be.eql({
            status: 'failure',
            error: { 2: { last_name: 'Cannot be empty', email: 'Cannot be empty'}}
          });
          res.status.should.be.eql(422);
          done();
        })
  })

  it('should give error if invalid input formats', (done) => {
    chai.request(app)
        .post(addUsersUrl)
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

});
