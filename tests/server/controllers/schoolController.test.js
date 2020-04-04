import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import mockSession from 'mock-session';
import app from '../../../server/app';
import db from '../../../server/models/index';
import {
    schoolDataWithValidFields,
} from '../../mockData/schoolMockData';

chai.use(chaiHttp);
chai.should();

const { Users, Schools } = db;

const loginUrl = '/api/v1/users/login';
const createSchoolUrl = '/api/v1/schools/create';

let userSession = '';

describe("School Controller", () => {
    before(async () => {
        try {
            await Users.create({
                user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
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
            return err
        }

    })
    after(async () => {
        await Schools.destroy({ where: {} })
        await Users.destroy({ where: {} })
    })

    describe("Test Create school route", () => {
        it('Unauthorised user should not create a school', (done) => {
            chai.request(app)
                .post(createSchoolUrl)
                .send(schoolDataWithValidFields)
                .end((err, res) => {
                    res.body.should.be.eql({
                        status: 'failure',
                        error: 'Please login'
                    });
                });
                done();
        });

        it('should login user successfully', (done) => {
            chai.request(app)
                .post(loginUrl)
                .send({ email: 'jamsgra.doey@gmail.com', password: '1234567' })
                .end((err, res) => {
                    userSession = res.body.userSession;
                    res.body.should.be.eql({
                        status: "success",
                        message: "User logged in successfully.",
                        userSession
                    });
                    done();
                });
        });
        it('should creates school successfully', (done) => {
            let cookie = mockSession('session', process.env.SECRET, userSession);
                chai.request(app)
                .post(createSchoolUrl)
                .set('cookie', [cookie])
                .send(schoolDataWithValidFields)
                .end((err, res) => {
                    const { school } = res.body;
                    res.body.should.be.eql({
                        message: "New account created successfully.",
                        status: "success",
                        school
                    });
                    done()
                });
        });
    })
})
