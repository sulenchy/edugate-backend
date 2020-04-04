import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import mockSession from 'mock-session';
import app from '../../../server/app';
import db from '../../../server/models/index'
import {
    schoolDataWithEmptySchoolName,
    schoolDataWithEmptyAddressLine1,
    schoolDataWithEmptyCity,
    schoolDataWithEmptyFields,
    schoolDataWithEmptyPostalCode,
} from '../../mockData/schoolMockData'



chai.use(chaiHttp);
chai.should();

let userSession = '';

const { Schools, Users } = db;

const schoolCreateUrl = '/api/v1/schools/create';
const loginUrl = '/api/v1/users/login';

describe('School create validation unit tests', () => {
    before(async () => {
        Schools.destroy({
            where: {
            }
        });
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
                isVerified: true
            });
        } catch (err) {
            return err;
        }
    })

    after(async () => {
        await Users.destroy({ where: {} })
    })

    it('should login successfully', (done) => {
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
                done()
            });
    });

    it('should return error if not logged in', (done) => {
        let cookie = mockSession('session', process.env.SECRET, 'userSession');
        chai.request(app)
            .post(schoolCreateUrl)
            .set('cookie', [cookie])
            .send(schoolDataWithEmptySchoolName)
            .end((err, res) => {
                res.body.should.be.eql({
                    status: 'failure',
                    error: 'Please login'
                });
                done();
            });
    });

    it('should return error if school name is empty', (done) => {
        let cookie = mockSession('session', process.env.SECRET, userSession);
        chai.request(app)
            .post(schoolCreateUrl)
            .set('cookie', [cookie])
            .send(schoolDataWithEmptySchoolName)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        school_name: ['must be at least 2 letters long']
                    }
                });
                done();
            });
    });

    it('should return error if address line 1 is empty', (done) => {
        let cookie = mockSession('session', process.env.SECRET, userSession);
        chai.request(app)
            .post(schoolCreateUrl)
            .set('cookie', [cookie])
            .send(schoolDataWithEmptyAddressLine1)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        address_line_1: ['must be at least 5 letters long']
                    }
                });
                done();
            });
    });

    it('should return error if city is empty', (done) => {
        let cookie = mockSession('session', process.env.SECRET, userSession);
        chai.request(app)
            .post(schoolCreateUrl)
            .set('cookie', [cookie])
            .send(schoolDataWithEmptyCity)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        city: ['must be at least 2 letters long']
                    }
                });
                done();
            });
    });

    it('should return error if all fields are empty', (done) => {
        let cookie = mockSession('session', process.env.SECRET, userSession);
        chai.request(app)
            .post(schoolCreateUrl)
            .set('cookie', [cookie])
            .send(schoolDataWithEmptyFields)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        city: ['must be at least 2 letters long'],
                        school_name: ['must be at least 2 letters long'],
                        address_line_1: ['must be at least 5 letters long'],
                        postal_code: ['must be at least 2 letters long']
                    }
                });
                done();
            });
    });

    it('should return error if all postal code field is empty', (done) => {
        let cookie = mockSession('session', process.env.SECRET, userSession);
        chai.request(app)
            .post(schoolCreateUrl)
            .set('cookie', [cookie])
            .send(schoolDataWithEmptyPostalCode)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        postal_code: ['please enter postal code','must be at least 2 letters long'
                    ]
                    }
                });
                done();
            });
    });
})
