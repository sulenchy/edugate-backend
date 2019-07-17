import chai from 'chai';
import emailToUid from '../../../server/helpers/emailToUid';
import db from '../../../server/models'

chai.should();

const { Users } = db;


describe('emailToUid', () => {
  before(async() => {
    try{
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
        email: 'john.doe@gmail.com',
      });
    } catch(err){
      return err
    }
  })

  after(async() => {
      await Users.destroy({where:{}})
  })

  it('should convert email to uid', async() => {
    const mockData = [
      { email: 'john.doe@gmail.com' },
      { email: 'jamaskasfa' },
      { email: 'john.doe@gmail.com' },
      { email: 'jamaskasfa' }
    ]
    const results = await emailToUid(mockData);
    const expected = [
      { user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608' },
      { user_uid: null },
      { user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608' },
      { user_uid: null },
    ]

    results[0].user_uid.should.be.a('string');
    results[1].should.be.eql(expected[1]);
    results[2].user_uid.should.be.a('string');
    results[3].should.be.eql(expected[3]);

  })
})
