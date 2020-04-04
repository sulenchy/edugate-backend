import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import mockSession from 'mock-session';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    userDataSignupValidData,
    userDataSignupValidDataVerify,
    privilegeUsers,
    resultValidData,
} from '../../mockData/userMockData';
// import { EMAIL_VERIFY_MSG, EMAIL_VERIFY_SUBJECT, EMAIL_VERIFY_ERROR_MSG } from '../helpers/constant';

chai.use(chaiHttp);
chai.should();

const { Users, Results } = db;

let token = ''

const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';
const verifyUrl = '/api/v1/users/verify';

const addUsersUrl = '/api/v1/users/addusers';
const getUsersUrlStudent = '/api/v1/users/student';
const getUsersUrlTeacher = '/api/v1/users/teacher';
const getUsersUrlInvalid = '/api/v1/users/stu';
const updateUserUrl = '/api/v1/users/update?user_uid=';
const changePassword = '/api/v1/users/changePassword';
const deleteUserUrl = '/api/v1/users/delete?user_uid=';

let userSession = '';
let validToken = '';
const inValidToken = 'hsdjhsdjhdshsdjhsfksd';

describe('User Controller', () => {
    before(async () => {
        try {
            await Users.bulkCreate(privilegeUsers);
            await Results.bulkCreate(resultValidData);
        } catch (err) {
            return err;
        }
    })

    after(async () => {
        await Users.destroy({ where: {} })
        await Results.destroy({ where: {} })
    })

    describe('Signup Route', () => {
        it('should signup successfully', (done) => {
            chai.request(app)
                .post(signupUrl)
                .send(userDataSignupValidData)
                .end((err, res) => {
                    token = res.body.token;
                    res.body.should.be.eql({
                        message: 'New account created successfully.',
                        status: 'success',
                        token
                    });
                    
                    done();
                });
        });
    })

    // TODO 2: test email verification route
    describe('Verify route', () => {
        it('should signup successfully', (done) => {
            chai.request(app)
                .post(signupUrl)
                .send(userDataSignupValidDataVerify)
                .end((err, res) => {
                    token = res.body.token;
                    res.body.should.be.eql({
                        message: 'New account created successfully.',
                        status: 'success',
                        token
                    });
                    validToken = token;
                    done();
                });
        });
        it('should login successfully', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'sulenchy@gmail.com', password: '123testing' })
                .end((err, res) => {
                    userSession = res.body.userSession
                    res.status.should.be.eql(403);
                    res.body.should.be.eql({
                        status: 'failure',
                        error: 'Sorry, your account is not verified. A verification email has been sent to you. Please click the link to get verified. Thank you',
                    });
                    done();
                });
        });
        it('should verify user`s account', (done) => {
            chai.request(app)
            .patch(`${ verifyUrl }?token=${ validToken }`)
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done();
            })
        })
        it('should login successfully', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'sulenchy@gmail.com', password: '123testing' })
                .end((err, res) => {
                    userSession = res.body.userSession
                    res.status.should.be.eql(200);
                    res.body.should.be.eql({
                        status: 'success',
                        message: 'User logged in successfully.',
                        userSession
                    });
                    done();
                });
        });
    })

    describe('Login Route', () => {
        it('should login successfully', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'jamsgra.doey@gmail.com', password: '1234567' })
                .end((err, res) => {
                    userSession = res.body.userSession
                    res.body.should.be.eql({
                        status: 'success',
                        message: 'User logged in successfully.',
                        userSession
                    });
                    done();
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
                    done()
                });

        });

        it('should throw error if email is not correct', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'john.e@gmail.com', password: '12testing' })
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
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
                .post(addUsersUrl)
                .set('cookie', [cookie])
                .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataValid.xlsx')), 'addUsersDataValid.xlsx')
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'success',
                        message: '3 new User accounts created successfully.'
                    });
                    done();
                });
        })
        it('should add users successfully & return any duplicates', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            const agent = chai.request(app);
            agent
                .post(addUsersUrl)
                .set('cookie', [cookie])
                .attach('addUsers', fs.readFileSync(path.join(__dirname, '../../mockData/addUsersDataTableDuplicates.xlsx')), 'addUsersDataTableDuplicates.xlsx')
                .end((err, res) => {
                    res.status.should.be.eql(201)
                    res.body.should.be.eql({
                        status: 'success',
                        message: '2 new User accounts created successfully.',
                        duplicates: { 4: 'Email already registered' }
                    });
                    done();
                });
        });

    })
    describe('Get Users API endpoint', () => {
        it('should not get all users if invalid cookie', (done) => {
            let cookie = '';
            chai.request(app)
                .get(getUsersUrlTeacher)
                .set('cookie', [cookie])
                .end((err, res) => {
                    res.body.status.should.be.eql('failure');
                    res.body.error.should.be.eql('Please login');
                    done();
                })
        })

        it('should get all users', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            const agent = chai.request(app);
            agent
                .get(getUsersUrlStudent)
                .set('cookie', [cookie])
                .end((err, res) => {
                    res.body.status.should.be.eql('success');
                    res.body.message.should.be.eql('User(s) successfully retrieved');
                    res.body.userList.should.be.an('array');
                    done();
                })
        })
        it('should get all users', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            const agent = chai.request(app);
            agent
                .get(getUsersUrlTeacher)
                .set('cookie', [cookie])
                .end((err, res) => {
                    res.body.status.should.be.eql('success');
                    res.body.message.should.be.eql('User(s) successfully retrieved');
                    res.body.userList.should.be.an('array');
                    done();
                })
        })
        it('should not get users', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            const agent = chai.request(app);
            agent
                .get(getUsersUrlInvalid)
                .set('cookie', [cookie])
                .end((err, res) => {
                    res.body.status.should.be.eql('failure');
                    res.body.error.should.be.eql('Sorry, invalid data supplied. Please enter valid data.');
                    // res.body.userList.should.be.an('array');
                    done();
                })
        })
    })

    describe('Update Users', () => {
      it('should not allow access if not logged on', (done) => {
        chai.request(app)
            .patch(updateUserUrl)
            .end((err, res) => {
              res.status.should.be.eql(401);
              res.body.error.should.be.eql('Please login');
              done();
            })
      })
      it('should not allow students to update users', (done) => {
        let cookie;
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'student@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl)
                            .set('cookie', [cookie])
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege');
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow teacher to update other teacher', (done) => {
        let cookie;
        const updateData = { email: 'teacher2@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'teacher' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
              // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f611')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege to update teacher');
                              done();
                })
            })
            .catch(done)
      })
      it('should allow teacher to update student', (done) => {
        let cookie;
        const updateData = { email: 'student@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'student' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f610')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(200);
                              res.body.message.should.be.eql('User successfully updated');
                              res.body.updatedUser.should.be.eql('student@gmail.com')
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow teacher to update student role to teacher', (done) => {
        let cookie;
        const updateData = { email: 'student@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'teacher' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f610')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege to update role');
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow teacher to update student role to admin', (done) => {
        let cookie;
        const updateData = { email: 'student@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'admin' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f610')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege to update admin or super admin');
                              done();
                })
            })
            .catch(done)
      })

      it('should not allow teacher to update admin', (done) => {
        let cookie;
        const updateData = { email: 'jamsgra.doey@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'admin' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f608')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege to update admin or super admin');
                              done();
                })
            })
            .catch(done)
      })
      it('should allow admin to update teacher', (done) => {
        let cookie;
        const updateData = { email: 'teacher@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'teacher' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'admin@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f609')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(200);
                              res.body.message.should.be.eql('User successfully updated');
                              done();
                })
            })
            .catch(done)
      })
      it('should allow admin to update user email with one that is already registered', (done) => {
        let cookie;
        const updateData = { email: 'student@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'teacher' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'admin@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f609')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(422);
                              res.body.error.should.be.eql('Email already registered');
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow admin to update teacher role to admin', (done) => {
        let cookie;
        const updateData = { email: 'teacher@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'admin' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'admin@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f609')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege to update admin or super admin');
                              done();
                })
            })
            .catch(done)
      })
      it('should allow admin to update student', (done) => {
        let cookie;
        const updateData = { email: 'student@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'teacher' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'admin@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f610')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(200);
                              res.body.message.should.be.eql('User successfully updated');
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow admin to update student role to admin', (done) => {
        let cookie;
        const updateData = { email: 'teacher@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'admin' }
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'admin@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: 'success',
                    message: 'User logged in successfully.',
                    userSession
                });
                return chai.request(app)
                            .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f609')
                            .set('cookie', [cookie])
                            .send(updateData)
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege to update admin or super admin');
                              done();
                })
            })
            .catch(done)
      })
    })
    it('should not allow admin to update student from different school', (done) => {
      let cookie;
      const updateData = { email: 'diffschoolstudent@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'student' }
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'admin@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f613')
                          .set('cookie', [cookie])
                          .send(updateData)
                          .then((res) => {
                            res.status.should.be.eql(404);
                            res.body.error.should.be.eql('User not found');
                            done();
              })
          })
          .catch(done)
    })
    it('should allow super admin to update super admin', (done) => {
      let cookie;
      const updateData = { email: 'superadmin2@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'admin' }
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'superadmin@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(updateUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f614')
                          .set('cookie', [cookie])
                          .send(updateData)
                          .then((res) => {
                            res.body.message.should.be.eql('User successfully updated');
                            res.status.should.be.eql(200);
                            done();
              })
          })
          .catch(done)
    })
    it('should not allow if no user_uid sent', (done) => {
      let cookie;
      const updateData = { email: 'superadmin2@gmail.com', first_name: 'joe', last_name: 'bloggs', dob: '1990-01-01', year_of_graduation: '2020', role: 'admin' }
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'superadmin@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(updateUserUrl)
                          .set('cookie', [cookie])
                          .send(updateData)
                          .then((res) => {
                            res.body.error.should.be.eql('No user_uid sent');
                            res.status.should.be.eql(400);
                            done();
              })
          })
          .catch(done)
    })

  describe('changePassword', () => {
    it('should not allow user to change password if they type in incorrect current password', (done) => {
      let cookie;
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'student@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(changePassword)
                          .set('cookie', [cookie])
                          .send({ password: '123ABC', newPassword: 'pizza123' })
                          .then((res) => {
                            res.body.error.should.be.eql('Current password entered incorrectly');
                            res.status.should.be.eql(401);
                            done();
              })
          })
          .catch(done)
    })
    it('should not allow user to change password if confirmPassword not sent', (done) => {
      let cookie;
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'student@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(changePassword)
                          .set('cookie', [cookie])
                          .send({ password: '1234567', newPassword: 'pizza123' })
                          .then((res) => {
                            res.body.error.should.be.eql(['Confirm Password not sent', 'Passwords do not match']);
                            res.status.should.be.eql(422);
                            done();
              })
          })
          .catch(done)
    })
    it('should not allow user to change password if less than 5 chars, does not contain numbers, & do not match', (done) => {
      let cookie;
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'student@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(changePassword)
                          .set('cookie', [cookie])
                          .send({ password: '1234567', newPassword: 'pizz', confirmPassword: 'pizh'})
                          .then((res) => {
                            res.body.error.should.be.eql(['Password must be at least 5 chars long', 'Password must contain a number', 'Passwords do not match']);
                            res.status.should.be.eql(422);
                            done();
              })
          })
          .catch(done)
    })
    it('should not allow user to change password if not matching', (done) => {
      let cookie;
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'student@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(changePassword)
                          .set('cookie', [cookie])
                          .send({ password: '1234567', newPassword: 'pizza123', confirmPassword: 'pizza1234'})
                          .then((res) => {
                            res.body.error.should.be.eql([ 'Passwords do not match' ]);
                            res.status.should.be.eql(422);
                            done();
              })
          })
          .catch(done)
    })
    it('should allow user to change password', (done) => {
      let cookie;
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'student@gmail.com', password: '1234567' })
          .then((res) => {
              // logs on user & stores their session to use for the next server request
              userSession = res.body.userSession
              cookie = mockSession('session', process.env.SECRET, userSession);
              res.body.should.be.eql({
                  status: 'success',
                  message: 'User logged in successfully.',
                  userSession
              });
              return chai.request(app)
                          .patch(changePassword)
                          .set('cookie', [cookie])
                          .send({ password: '1234567', newPassword: 'pizza123', confirmPassword: 'pizza123'})
                          .then((res) => {
                            res.body.message.should.be.eql('User successfully updated');
                            res.status.should.be.eql(200);
                            return chai.request(app)
                                        .post(loginUrl)
                                        .send({ email: 'student@gmail.com', password: 'pizza123' })
                                        .then((res) => {
                                          res.body.message.should.be.eql('User logged in successfully.');
                                          res.status.should.be.eql(200);
                                          done();
                                        })
              })
          })
          .catch(done)
    })
  })

  describe('deleteUser', () => {
    it('should not allow teacher to delete user', (done) => {
      let cookie;
      chai.request(app)
          .post(loginUrl)
          .send({ email: 'teacher@gmail.com', password: '1234567'})
          .then((res) => {
            userSession = res.body.userSession
            cookie = mockSession('session', process.env.SECRET, userSession);
            res.body.should.be.eql({
                status: 'success',
                message: 'User logged in successfully.',
                userSession
            });
            return chai.request(app)
                        .delete(deleteUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f613')
                        .set('cookie', [cookie])
                        .then((res) => {
                          res.body.error.should.be.eql('Sorry, you do not have the required privilege');
                          res.status.should.be.eql(401);
                          done();

                        })
          })
          .catch(done)
    })
  })
  it('should not allow admin to delete super admin', (done) => {
    let cookie;
    chai.request(app)
        .post(loginUrl)
        .send({ email: 'admin@gmail.com', password: '1234567'})
        .then((res) => {
          userSession = res.body.userSession
          cookie = mockSession('session', process.env.SECRET, userSession);
          res.body.should.be.eql({
              status: 'success',
              message: 'User logged in successfully.',
              userSession
          });
          return chai.request(app)
                      .delete(deleteUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f608')
                      .set('cookie', [cookie])
                      .then((res) => {
                        res.body.error.should.be.eql('Sorry, you do not have the required privilege to delete user with this role');
                        res.status.should.be.eql(401);
                        done();

                      })
        })
        .catch(done)
  })
  it('should not allow admin to delete student from different school', (done) => {
    let cookie;
    chai.request(app)
        .post(loginUrl)
        .send({ email: 'admin@gmail.com', password: '1234567'})
        .then((res) => {
          userSession = res.body.userSession
          cookie = mockSession('session', process.env.SECRET, userSession);
          res.body.should.be.eql({
              status: 'success',
              message: 'User logged in successfully.',
              userSession
          });
          return chai.request(app)
                      .delete(deleteUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f613')
                      .set('cookie', [cookie])
                      .then((res) => {
                        res.body.error.should.be.eql('User not found');
                        res.status.should.be.eql(404);
                        done();

                      })
        })
        .catch(done)
  })
  it('should return error if user not found', (done) => {
    let cookie;
    chai.request(app)
        .post(loginUrl)
        .send({ email: 'admin@gmail.com', password: '1234567'})
        .then((res) => {
          userSession = res.body.userSession
          cookie = mockSession('session', process.env.SECRET, userSession);
          res.body.should.be.eql({
              status: 'success',
              message: 'User logged in successfully.',
              userSession
          });
          return chai.request(app)
                      .delete(deleteUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f619')
                      .set('cookie', [cookie])
                      .then((res) => {
                        res.body.error.should.be.eql('User not found');
                        res.status.should.be.eql(404);
                        done();

                      })
        })
        .catch(done)
  })
  it('should allow admin to delete student', (done) => {
    let cookie;
    chai.request(app)
        .post(loginUrl)
        .send({ email: 'admin@gmail.com', password: '1234567'})
        .then((res) => {
          userSession = res.body.userSession
          cookie = mockSession('session', process.env.SECRET, userSession);
          res.body.should.be.eql({
              status: 'success',
              message: 'User logged in successfully.',
              userSession
          });
          return chai.request(app)
                      .delete(deleteUserUrl + '40e6215d-b5c6-4896-987c-f30f3678f615')
                      .set('cookie', [cookie])
                      .then((res) => {
                        res.body.should.be.eql({
                          status: 'success',
                          message: 'User successfully deleted',
                          deletedUser: 'deletestudent@gmail.com',
                          deletedResults: 0,
                        });
                        res.status.should.be.eql(200);
                        done();

                      })
        })
        .catch(done)
  })

})
