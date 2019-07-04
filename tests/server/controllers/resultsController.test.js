import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    schoolDataWithValidFields,
} from '../../mockData/schoolMockData';

chai.use(chaiHttp);
chai.should();

const { Users, Schools, Results } = db;

const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';
const createSchoolUrl = '/api/v1/schools/create';
const addResultsUrl = '/api/v1/results/addresults';

describe("Results Controller", () => {
    let agent = chai.request.agent(app)
    before(async() => {
        await Results.destroy({where:{}});
        await Users.create({
          user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
          school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
          first_name: 'John',
          last_name: 'Doe',
          dob: new Date(),
          year_of_graduation: '2020',
          role: 'admin',
          password: bcrypt.hashSync('1234567', 10),
          phone_number: '07038015455',
          username: 'jamsgra',
          email: 'John.doe@gmail.com',
        });
    })

    after(async() => {
        await Schools.destroy({where:{}})
        await Users.destroy({where:{}})
        await Results.destroy({where:{}})
        agent.close()
    })

    describe("Test add results route", () => {
        it('should add results successfully', (done) => {
            agent
              .post(loginUrl)
              .send({ username: 'jamsgra', password: '1234567' })
              .then(function() {
                return agent
                .post(addResultsUrl)
                .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataValid.xlsx')), 'addResultsDataValid.xlsx')
                .then((res) => {
                    res.status.should.be.eql(201)
                    res.body.should.be.eql({
                      status: 'success',
                      message: '1 results successfully added.'
                    });
                    done();
                });
              }).catch(err => console.log(err))
        });
        it('should add results & show duplicates', (done) => {
            agent
              .post(loginUrl)
              .send({ username: 'jamsgra', password: '1234567' })
              .then(function() {
                return agent
                .post(addResultsUrl)
                .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataTableDuplicate.xlsx')), 'addResultsDataTableDuplicate.xlsx')
                .then((res) => {
                    res.status.should.be.eql(201)
                    res.body.should.be.eql({
                      status: 'success',
                      message: '1 results successfully added.',
                      duplicates: { 2: 'Duplicate record found'}
                    });
                    done();
                });
              }).catch(err => console.log(err))
        });
    })
})
