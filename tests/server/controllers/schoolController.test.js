import chai from 'chai';
import chaiHttp from 'chai-http';
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
const createSchoolUrl = '/api/v1/schools/create';


describe("User Controller", () => {
    before(async() => {
        await Schools.destroy({where:{}});
        await Users.destroy({where:{}});
    })
    // after(async() => {
    //     await Schools.destroy({where:{}})
    //     await Users.destroy({where:{}})
    // })

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
        it('should signup successfully', (done) => {
            chai.request(app)
                .post(signupUrl)
                .send(userDataSignupValidData)
                .end((err, res) => {
                    const { username } = res.body;
                    res.body.should.be.eql({
                        message: "New account created successfully.",
                        status: "success",
                        username
                    }); 
                    done();
                });
        });
    })
})