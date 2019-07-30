import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import mockSession from 'mock-session';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    privilegeUsers,
    resultValidData
} from '../../mockData/userMockData';

chai.use(chaiHttp);
chai.should();

const { Users, Results } = db;

const loginUrl = '/api/v1/users/login';
const addResultsUrl = '/api/v1/results/addresults';
const getAllResultsUrl = '/api/v1/results/toplevel';
const getAllResultsUrlSearchBySubject = '/api/v1/results/toplevel?subject=Maths';
const getAllResultsUrlSearchByTerm = '/api/v1/results/toplevel?term=2';
const getAllResultsUrlSearchByYear = '/api/v1/results/toplevel?year=2010';
const getAllResultsUrlStudent = '/api/v1/results';
const getAllResultsUrlSearchBySubjectStudent = '/api/v1/results?subject=Maths';
const getAllResultsUrlSearchByTermStudent = '/api/v1/results?term=2';
const getAllResultsUrlSearchByYearStudent = '/api/v1/results?year=2010';
const logoutUrl = '/api/v1/users/logout';
const updateResultUrl = '/api/v1/results/update?result_uid=';

let userSession = '';

describe("Results Controller", () => {
    before(async () => {
        try {
            await Users.bulkCreate(privilegeUsers);
            await Results.bulkCreate(resultValidData);
        } catch (err) {
            return err;
        }
    })

    before((done) => {
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
                done();
            });
    })


    after(async () => {
        await Users.destroy({ where: {} })
        await Results.destroy({ where: {} })
    })

    describe('Add results', () => {
        it('should add results successfully', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
                .post(addResultsUrl)
                .set('cookie', [cookie])
                .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataValid.xlsx')), 'addResultsDataValid.xlsx')
                .end((err, res) => {
                    res.status.should.be.eql(201)
                    res.body.should.be.eql({
                        status: 'success',
                        message: '1 results successfully added.'
                    });
                    done();
                });
        });

        it('should add results successfully', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
                .post(addResultsUrl)
                .set('cookie', [cookie])
                .attach('addResults', fs.readFileSync(path.join(__dirname, '../../mockData/addResultsDataTableDuplicate.xlsx')), 'addResultsDataTableDuplicate.xlsx')
                .end((err, res) => {
                    res.status.should.be.eql(201)
                    res.body.should.be.eql({
                        status: 'success',
                        message: '1 results successfully added.',
                        duplicates: {
                            2: 'Duplicate record found'
                        }
                    });
                    done()
                });
        });
    });

    describe('Get results for admin', () => {
        it('should get result for admin', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrl)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        });

        it('should search result by subject for Admin', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchBySubject)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should search result by year for Admin', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchByYear)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should search result by term for admin', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchByTerm)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should logout the logged in admin', (done) => {
            chai.request(app)
            .get(logoutUrl)
            .end((err, res) => {
                userSession = '';
                res.status.should.be.eql(200);
                res.body.status.should.be.eql('success');
                res.body.message.should.be.eql('User logout successfully');
                done();
            })
        })

        it('should not get result for admin', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrl)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(401);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('failure');
                done()
            })
        });
    })

    describe('Get results for teacher', () => {
        it('should login teacher', (done) => {
            chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .end((err, res) => {
                userSession = res.body.userSession;
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                done();
            });

        })

        it('should get result for teacher', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrl)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        });

        it('should search result by subject for teacher', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchBySubject)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should search result by year for teacher', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchByYear)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should search result by term fro teacher', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchByTerm)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should logout the logged in teacher', (done) => {
            chai.request(app)
            .get(logoutUrl)
            .end((err, res) => {
                userSession = '';
                res.status.should.be.eql(200);
                res.body.status.should.be.eql('success');
                res.body.message.should.be.eql('User logout successfully');
                done();
            })
        })

        it('should not get result for teacher', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrl)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(401);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('failure');
                done()
            })
        });
    });

    describe('Get results for student', () => {
         it('should login student', (done) => {
            chai.request(app)
            .post(loginUrl)
            .send({ email: 'student@gmail.com', password: '1234567' })
            .end((err, res) => {
                userSession = res.body.userSession
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                done();
            });
        })

        it('should search result by subject for student', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchBySubjectStudent)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should search result by year for teacher', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchByYearStudent)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should search result by term for student', (done)=>{
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlSearchByTermStudent)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('success');
                done()
            })
        })

        it('should logout the logged in student', (done) => {
            chai.request(app)
            .get(logoutUrl)
            .end((err, res) => {
                userSession = '';
                res.status.should.be.eql(200);
                res.body.status.should.be.eql('success');
                res.body.message.should.be.eql('User logout successfully');
                done();
            })
        })

        it('should not get result for student', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
            chai.request(app)
            .get(getAllResultsUrlStudent)
            .set('cookie', [cookie])
            .end((err, res) => {
                res.status.should.be.eql(401);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('failure');
                done()
            })
        });
    });

    describe('update result', () => {
      it('should not allow students to update result', (done) => {
        let cookie;
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'student@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                return chai.request(app)
                            .patch(updateResultUrl)
                            .set('cookie', [cookie])
                            .then((res) => {
                              res.status.should.be.eql(401);
                              res.body.error.should.be.eql('Sorry, you do not have the required privilege');
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow auth user to update result without result id', (done) => {
        let cookie;
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                return chai.request(app)
                            .patch(updateResultUrl)
                            .set('cookie', [cookie])
                            .send({ year: '2010', subject: 'Maths', exam: 'GR2423', mark: '123/150', term: '2' })
                            .then((res) => {
                              res.status.should.be.eql(400);
                              res.body.error.should.be.eql('No result id sent');
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow auth user to update result with unknown id', (done) => {
        let cookie;
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                return chai.request(app)
                            .patch(updateResultUrl + '85811cc6-5001-435e-bd58-b69d902b1c8e')
                            .set('cookie', [cookie])
                            .send({ year: '2010', subject: 'Maths', exam: 'GR2423', mark: '123/150', term: '2' })
                            .then((res) => {
                              res.body.should.be.eql({error: "Result not found", status: "failure"});
                              res.status.should.be.eql(404);
                              done();
                })
            })
            .catch(done)
      })
      it('should not allow auth user to update result from different school', (done) => {
        let cookie;
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                return chai.request(app)
                            .patch(updateResultUrl + '9a958e6a-97fb-4d2f-ab18-bfb30708fa05')
                            .set('cookie', [cookie])
                            .send({ year: '2010', subject: 'Maths', exam: 'GR2423', mark: '123/150', term: '2' })
                            .then((res) => {
                              res.body.should.be.eql({error: "Sorry, you do not have the required privilege to update result from different school", status: "failure"});
                              res.status.should.be.eql(401);
                              done();
                })
            })
            .catch(done)
      })
      it('should allow auth user to update result', (done) => {
        let cookie;
        chai.request(app)
            .post(loginUrl)
            .send({ email: 'teacher@gmail.com', password: '1234567' })
            .then((res) => {
                // logs on user & stores their session to use for the next server request
                userSession = res.body.userSession
                cookie = mockSession('session', process.env.SECRET, userSession);
                res.body.should.be.eql({
                    status: "success",
                    message: "User logged in successfully.",
                    userSession
                });
                return chai.request(app)
                            .patch(updateResultUrl + '9a958e6a-97fb-4d2f-ab18-bfb30708fa04')
                            .set('cookie', [cookie])
                            .send({ year: '2009', subject: 'Maths', exam: 'GR2423', mark: '123/150', term: '1' })
                            .then((res) => {
                              res.body.should.be.eql({
                                message: "Result successfully updated",
                                status: "success",
                                updatedResult: "40e6215d-b5c6-4896-987c-f30f3678f610.2009.1.gr2423"
                              })
                              res.status.should.be.eql(200);
                              done();
                })
            })
            .catch(done)
      })
    })
})
