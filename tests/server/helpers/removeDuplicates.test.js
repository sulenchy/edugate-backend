import chai from 'chai';
import removeDuplicates from '../../../server/helpers/removeDuplicates';

chai.should();

describe('Remove Duplicates', () => {

  it('should remove duplicates from list', async() => {
    const mockData = [
      { username: 'jamsgra', id: '1234567' },
      { username: 'jamaskasfa', id: '1234567' },
      { username: 'asdasdasd', id: '2232334567' },
    ]

    const duplicates = {
      0: 'Duplicate found'
    }

    const result = removeDuplicates(mockData, duplicates);

    const expected = [ { username: 'jamaskasfa', id: '1234567' },
    { username: 'asdasdasd', id: '2232334567' },
    ]

    result.should.be.eql(expected);
  })
})
