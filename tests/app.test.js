import chai from 'chai';
import server from '../server/app';
import chaiHttp from 'chai-http';

const expect = chai.expect;

chai.use(chaiHttp);

describe('App.js', () => {
  it('default api route', () => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.be.a('string');
        expect(res.text).to.equal('Welcome to EduGate!');
      });
  })
})