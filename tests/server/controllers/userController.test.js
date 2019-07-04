import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
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
const addUsersUrl = '/api/v1/users/addusers';

let tempUsername = '';


describe("User Controller", () => {
    let agent = chai.request.agent(app)
    before(async() => {
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
          email: 'John.doe@gmail.com',
        });
    })


    after(async() => {
        await Users.destroy({where:{}})
        agent.close()
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
                        error: 'No User Found'
                    });
                    done();
                });
        });
    })

    describe('Add users', () => {
      it('should add all users', (done) => {
        agent
          .post(loginUrl)
          .send({ username: 'jamsgra', password: '1234567' })
          .then(function() {
            return agent
            .post(addUsersUrl)
            .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataValid.xlsx')), 'addUsersDataValid.xlsx')
            .then((res) => {
                res.body.should.be.eql({
                  status: 'success',
                  message: '3 new User accounts created successfully.'
                });
                done();
            });
          }).catch(err => console.log(err))
        })
      })
})
