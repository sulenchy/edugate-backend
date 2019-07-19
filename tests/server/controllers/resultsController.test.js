import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import app from '../../../server/app';
import db from '../../../server/models/index'

let mockSession = require('mock-session');

chai.use(chaiHttp);
chai.should();

const { Users, Results } = db;

const loginUrl = '/api/v1/users/login';
const addResultsUrl = '/api/v1/results/addresults';

let userSession = '';

describe("Results Controller", () => {
    before(async () => {
        try {
            await Users.create({
                user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
                school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
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
        await Results.destroy({ where: {}})
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
    })

    describe('Add users', () => {
        it('should add results successfully', async () => {
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
                            });
                    });
          });
        })
      })
