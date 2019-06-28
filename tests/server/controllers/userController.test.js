import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    userDataSignupValidData
} from '../../mockData/userMockData';

chai.use(chaiHttp);
chai.should();

const { Users } = db;

const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';

let tempUsername = '';


describe("User Controller", () => {
    before((done) => {
        Users.destroy({
            where: {
            }
        }).then(() => done())
    })
    after((done) => {
        Users.destroy({
            where: {
            }
        }).then(() => done())
    })

    describe("Signup Route", () => {
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
                    tempUsername = username 
                    done();
                });
        });
    })

    describe("Login Route", () => {
        it('should login successfully', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({username: tempUsername, password: '123testing'})
                .end((err, res) => {
                    res.body.should.be.eql({
                        message: "User logged in successfully.",
                        status: "success",
                    });
                    done();
                });
        });
        it('should login successfully', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({username: tempUsername, password: '1testing'})
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'failure',
                        error: 'Password is incorrect'
                    });
                    done();
                });
        });
        it('should throw error if password is not correct', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({username: 'tempUsername', password: '12testing'})
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'failure', 
                        error: "No User Found"
                    });
                    done();
                });
        });
    })
})