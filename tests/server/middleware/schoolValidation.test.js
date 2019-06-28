import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
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

const { Schools } = db;

const schoolCreateUrl = '/api/v1/schools/create';

describe('School create validation unit tests', () => {
    before((done) => {
        Schools.destroy({
            where: {
            }
        }).then(() => done())
    })


    it('should return error if school name is empty', (done) => {
        chai.request(app)
            .post(schoolCreateUrl)
            .send(schoolDataWithEmptySchoolName)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        school_name: ['must be at least 2 letters long']
                    }
                });

            });
        done();
    });

    it('should return error if address line 1 is empty', (done) => {
        chai.request(app)
            .post(schoolCreateUrl)
            .send(schoolDataWithEmptyAddressLine1)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        address_line_1: ['must be at least 5 letters long']
                    }
                });

            });
        done();
    });

    it('should return error if city is empty', (done) => {
        chai.request(app)
            .post(schoolCreateUrl)
            .send(schoolDataWithEmptyCity)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        city: ['must be at least 2 letters long']
                    }
                });

            });
        done();
    });

    it('should return error if all fields are empty', (done) => {
        chai.request(app)
            .post(schoolCreateUrl)
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

            });
        done();
    });

    it('should return error if all postal code field is empty', (done) => {
        chai.request(app)
            .post(schoolCreateUrl)
            .send(schoolDataWithEmptyPostalCode)
            .end((err, res) => {
                res.body.should.be.eql({
                    errors: {
                        postal_code: ['please enter postal code','must be at least 2 letters long'
                        
                    ]
                    }
                });

            });
        done();
    });


})