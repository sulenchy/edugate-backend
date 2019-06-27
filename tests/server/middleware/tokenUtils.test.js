import chai from 'chai';
import {
  createToken,
} from '../../../server/middlewares/tokenUtils';

chai.should();

describe('Token Utils', () => {
  const result = {};
  const payload = 455;
  describe('Create the token', () => {
    before(() => {
      result.token = createToken(payload, 10000);
    });

    it('token should be a string', () => {
      result.token.should.be.a('string');
    });
  });
});
