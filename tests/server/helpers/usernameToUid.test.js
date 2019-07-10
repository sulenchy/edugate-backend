import chai from 'chai';
import usernameToUid from '../../../server/helpers/usernameToUid';
import db from '../../../server/models/index'

chai.should();

const { Users } = db;


describe('usernameToUid', () => {
  before(async() => {
      await Users.create({
        user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
        school_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
        first_name: 'John',
        last_name: 'Doe',
        dob: new Date(),
        year_of_graduation: '2020',
        role: 'admin',
        password: 'testing',
        phone_number: '07038015455',
        username: 'jamsgra',
        email: 'John.doe@gmail.com',
      });
  })

  after(async() => {
      await Users.destroy({where:{}})
  })

  it('should convert username to uid', async() => {
    const mockData = [
      { username: 'jamsgra' },
      { username: 'jamaskasfa' },
      { username: 'jamsgra' },
      { username: 'jamaskasfa' }
    ]

    const expected = [
      { user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608' },
      { user_uid: null },
      { user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608' },
      { user_uid: null },
    ]
    const results = await usernameToUid(mockData);
    results.should.be.eql(expected);
  })
})
