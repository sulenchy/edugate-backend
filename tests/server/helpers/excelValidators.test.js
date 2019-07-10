import chai from 'chai';
import ExcelValidators from '../../../server/helpers/excelValidators';

chai.should();

describe('Excel Validators', () => {

  it('should return duplicates from list', async() => {
    const mockData = [
      { username: 'jamsgra', id: '1234567' },
      { username: 'jamaskasfa', id: '1234567' },
      { username: 'jamsgra', id: '234567' },
      { username: 'jamaskasfa', id: '234567' }
    ]

    const expected = { "234567": [2, 3], "1234567": [0, 1]}
    const results = ExcelValidators.checkFileDuplicates(mockData, 'id');
    results.should.be.eql(expected);
  })
})
