import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/app';

chai.use(chaiHttp);

const { expect } = chai;

describe('App.js', () => {
  it('default api route', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.be.a('string');
        expect(res.text).to.equal('Welcome to EduGate!');
        done();
      });
  })
})
