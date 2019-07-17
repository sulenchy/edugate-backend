import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    userDataSignupValidData,
    userDataLoginValidData
} from '../../mockData/userMockData';

let mockSession = require('mock-session');

chai.use(chaiHttp);
chai.should();

const { Users } = db;

const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';
const addUsersUrl = '/api/v1/users/addusers';
const getUsersUrl = '/api/v1/users';

let userSession = '';


describe("User Controller", () => {
    before(async () => {
        try {
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

    describe("Signup Route", () => {
        it('should signup successfully', async () => {
            chai.request(app)
                .post(signupUrl)
                .send(userDataSignupValidData)
                .end((err, res) => {
                    res.body.should.be.eql({
                        message: "New account created successfully.",
                        status: "success",
                    });
                });
        });
    })

    describe("Login Route", () => {
        it('should login successfully', async () => {
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
                });
        });

        it('should respond with password incorrect', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'jamsgra.doey@gmail.com', password: '1testing' })
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'failure',
                        error: 'Password is incorrect'
                    });
                });

            done()
        });

        it('should throw error if password is not correct', async () => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'john.e@gmail.com', password: '12testing' })
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'failure',
                        error: 'No User Found'
                    });
                });
        });
    })

    describe('Add users', () => {
        it('should login the second user', async () => {
            chai.request(app)
                .post(loginUrl)
                .send(userDataLoginValidData)
                .end((err, res) => {
                    userSession = res.body.userSession
                    res.body.should.be.eql({
                        status: "success",
                        message: "User logged in successfully.",
                        userSession
                    });
                });

        })
        it('should all users', async () => {
            const req = chai.request(app)
                .post(addUsersUrl)
                .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataValid.xlsx')), 'addUsersDataValid.xlsx')
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'success',
                        message: '3 new User accounts created successfully.'
                    });
                });
        })

    })
    describe('Get Users API endpoint', () => {
        it('should not get all users', async () => {
            let cookie = '';
            chai.request(app)
                .get(getUsersUrl)
                .set('cookie', [cookie])
                .end((err, res) => {
                    res.body.status.should.be.eql('failure');
                    res.body.message.should.be.eql('Please, Login');
                })
        })

        it('should login successfully', async () => {
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
                });
        });


        it('should get all users', async () => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            const agent = chai.request(app);
            agent
                .get(getUsersUrl)
                .set('cookie', [cookie])
                .end((err, res) => {
                    res.body.status.should.be.eql('success');
                    res.body.message.should.be.eql('User(s) successfully retrieved');
                    res.body.userList.should.be.an('array');
                })
        })
    })
})
