import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    userDataWithEmptyEmail,
    userDataWithEmptyPassword,
    userDataWithEmptyFields,
    userDataWithInvalidEmail,
    userDataWithInvalidFields,
    userDataWithInvalidPassword,
    userDataWithAnExistingEmail,
    loginUserDataWithEmptyFields,
    loginUserDataWithEmptyUsername,
    loginUserDataWithEmptyPassword,
    loginUserDataWithInvalidPassword
} from '../../mockData/userMockData';

chai.use(chaiHttp);
chai.should();

const { Users } = db;

const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';

describe('User signup validation unit tests', () => {

    before((done) => {
        bcrypt.hash('123testing', 10)
            .then(password => {
                Users.create({
                    user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
                    first_name: 'John',
                    last_name: 'Doe',
                    dob: new Date(),
                    year_of_graduation: '2020',
                    role: 'admin',
                    password,
                    phone_number: '07038015455',
                    username: 'jamsgra',
                    email: 'John.doe@gmail.com',
                })
                    .then(() => done())
            })
    })

    after((done) => {
        Users.destroy({
            where: {
                username: 'jamsgra'
            }
        }).then(() => done())
    })
    it('should return error if user enters empty name', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithEmptyPassword)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        password: [
                            "must be at least 5 chars long",
                            "must contain a number"
                        ]
                    }
                });
                done();
            });
    });

    it('should return error if user enters invalid name (have &%#)', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithInvalidPassword)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        password: [
                            "must contain a number"
                        ]
                    }
                });
                done();
            });
    });

    it('should return error if user enters invalid email', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithInvalidEmail)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        email: [
                            'please enter a valid email'
                        ]
                    }
                });
                done();
            });
    });

    it('should return error if user fails to enter email', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithEmptyEmail)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        email: [
                            'please enter a valid email'
                        ]
                    }
                });
                done();
            });
    });

    it('should return error if user enters invalid email', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithInvalidEmail)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        email: [
                            'please enter a valid email',
                        ]
                    }
                });
                done();
            });
    });

    it('should return error if user enters invalid fields', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithInvalidFields)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        email: [
                            "please enter a valid email"
                        ],
                        password: [
                            "must contain a number"
                        ]
                    }
                });
                done();
            });
    });

    it('should return error if user fails to fill any field', (done) => {
        chai.request(app)
            .post(signupUrl)
            .send(userDataWithEmptyFields)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        password: [
                            'must be at least 5 chars long',
                            'must contain a number',
                        ],
                        email: [
                            'please enter a valid email',
                        ]
                    }
                });
                done();
            });
    });
    it(
        'should return error if user enters an existing email',
        (done) => {
            chai.request(app)
                .post(signupUrl)
                .send(userDataWithAnExistingEmail)
                .end((err, res) => {
                    res.body.should.be.eql({
                        errors: {
                            email: [
                                'email is already in use',
                            ]
                        }
                    });
                    done();
                });
        }
    );

    it(
        'should return error if user does not provide login details',
        (done) => {
            chai.request(app)
                .post(loginUrl)
                .send(loginUserDataWithEmptyFields)
                .end((err, res) => {
                    res.body.should.be.eql({
                        errors: {
                            password: [
                                'must be at least 5 chars long',
                                'must contain a number'
                            ]
                        }
                    });
                    done();
                });
        }
    );
    it(
        'should return error if user does not provide username',
        (done) => {
            chai.request(app)
                .post(loginUrl)
                .send(loginUserDataWithEmptyUsername)
                .end((err, res) => {
                    res.body.should.be.eql({
                        errors: {
                            username: [
                                'please enter username',
                            ]
                        }
                    });
                    done();
                });
        }
    );
    it(
        'should return error if user does provide empty password',
        (done) => {
            chai.request(app)
                .post(loginUrl)
                .send(loginUserDataWithEmptyPassword)
                .end((err, res) => {
                    res.body.should.be.eql({
                        errors: {
                            password: [
                                'must be at least 5 chars long',
                                'must contain a number'
                            ]
                        }
                    });
                    done();
                });
        }
    );
    it(
        'should return error if user does provide invalid password',
        (done) => {
            chai.request(app)
                .post(loginUrl)
                .send(loginUserDataWithInvalidPassword)
                .end((err, res) => {
                    res.body.should.be.eql({
                        errors: {
                            password: [
                                'must contain a number',
                            ]
                        }
                    });
                    done();
                });
        }
    );
});
