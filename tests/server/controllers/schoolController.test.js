import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    userDataSignupValidData
} from '../../mockData/userMockData';
import {
    schoolDataWithValidFields,
} from '../../mockData/schoolMockData';

chai.use(chaiHttp);
chai.should();

const { Users, Schools } = db;

const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';
const createSchoolUrl = '/api/v1/schools/create';


describe("School Controller", () => {
    let agent = chai.request.agent(app)
    before(async() => {
        await Users.create({
          user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
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

    before(() => {
      agent
        .post(loginUrl)
        .send({ username: 'jamsgra', password: '1234567' })
        .then(function (res) {
          res.body.should.be.eql({
            message: "User logged in successfully.",
            status: "success",
          })
        }).catch(err => console.log(err))
    });

    after(async() => {
        await Schools.destroy({where:{}})
        await Users.destroy({where:{}})
        agent.close()
    })

    describe("Test Create school route", () => {
        it('Unauthorised user should not create a school', (done) => {
            chai.request(app)
                .post(createSchoolUrl)
                .send(schoolDataWithValidFields)
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'failure',
                        error: 'Please log in to create a school'
                    });
                    done();
                });
        });
        it('should signup school successfully', (done) => {
            agent
                .post(createSchoolUrl)
                .send(schoolDataWithValidFields)
                .end((err, res) => {
                    const { school } = res.body;
                    res.body.should.be.eql({
                        message: "New account created successfully.",
                        status: "success",
                        school
                    });
                    done();
                });
        });
    })
})
