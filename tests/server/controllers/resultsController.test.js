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
const addResultsUrl = '/api/v1/results/addresults';
const getUsersUrl = '/api/v1/users';

let tempUsername = '';
let userSession = '';


describe("User Controller", () => {
    let agent = chai.request.agent(app)
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
                username: 'jamsgra',
                email: 'jamsgra.doey@gmail.com',
            });
        } catch (err) {
            return err;
        }

    })


    after(async () => {
        await Users.destroy({ where: {} })
        agent.close()
    })

    describe("Signup Route", () => {
        it('should signup successfully', async () => {
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
    })

    describe('Add users', () => {
        it('should add results successfully', async () => {
            let cookie = mockSession('session', 'FGAHSGDBJHS', userSession);
            const agent = chai.request(app);
            agent
                            .post(addResultsUrl)
                            .set('cookie', [cookie])
                            .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataValid.xlsx')), 'addResultsDataValid.xlsx')
                            .end((err, res) => {
                                res.status.should.be.eql(201)
                                res.body.should.be.eql({
                                    status: 'success',
                                    message: '1 results successfully added.'
                                });
                            });
                    });
    })
})
