import bcrypt from 'bcryptjs';

export const userDataWithEmptyPassword = {
    email: 'a@a.com',
    password: ''
};

export const userDataWithEmptyEmail = {
    email: '',
    password: '12testing'
};

export const userDataWithEmptyFields = {
    email: '',
    password: ''
};
export const userDataSignupValidData = {
    email: 'john.doe@gmail.com',
    first_name: 'john',
    last_name: 'doe',
    password: '123testing'
};
export const userDataSignupValidDataVerify = {
    email: 'sulenchy@gmail.com',
    first_name: 'sulenchy',
    last_name: 'sulenchy',
    password: '123testing'
};

export const userDataWithInvalidPassword = {
    email: 'a@a.com',
    password: 'testing'
};
export const userDataWithInvalidEmail = {
    email: 'james.grant',
    password: '12testing'
};

export const userDataWithInvalidFields = {
    email: 'james.grant',
    password: 'testing'
};

export const userDataWithAnExistingEmail = {
    email: 'john.doe@gmail.com',
    password: '123testing'
};

export const loginUserDataWithEmptyFields = {
    Email: '',
    password: ''
};
export const loginUserDataWithEmptyEmail = {
    password: '123testing'
};
export const loginUserDataWithEmptyPassword = {
    email: 'john.doe@gmail.com',
    password: ''
};
export const loginUserDataWithInvalidPassword = {
    email: 'john.doe@gmail.com',
    password: 'testing'
};

export const userDataLoginValidData = {
    email: 'john.doe@gmail.com',
    password: '123testing'
};

export const resultValidData = [
  {
    result_uid: '9a958e6a-97fb-4d2f-ab18-bfb30708fa04',
    user_uid: '40e6215d-b5c6-4896-987c-f30f3678f610',
    school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
    student_result_id: '40e6215d-b5c6-4896-987c-f30f3678f610.2010.2.gr100',
    year: '2010',
    term: '2',
    subject: 'maths',
    exam: 'gr100',
    mark: '10/100',
    grade: 'f',
  },
  {
      result_uid: '9a958e6a-97fb-4d2f-ab18-bfb30708fa05',
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f610',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
      student_result_id: '40e6215d-b5c6-4896-987c-f30f3678f610.2010.2.gr100',
      year: '2010',
      term: '2',
      subject: 'maths',
      exam: 'gr100',
      mark: '10/100',
      grade: 'f',
  },
  {
      result_uid: '9a958e6a-97fb-4d2f-ab18-bfb30708fa06',
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f610',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      student_result_id: '40e6215d-b5c6-4896-987c-f30f3678f610.2010.2.gr100',
      year: '2010',
      term: '1',
      subject: 'english',
      exam: 'gr100',
      mark: '10/100',
      grade: 'f',
      status: 'deleted',
    },
    {
        result_uid: '9a958e6a-97fb-4d2f-ab18-bfb30708fa07',
        user_uid: '40e6215d-b5c6-4896-987c-f30f3678f610',
        school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
        student_result_id: '40e6215d-b5c6-4896-987c-f30f3678f610.2010.2.gr100',
        year: '2011',
        term: '1',
        subject: 'english',
        exam: 'gr100',
        mark: '10/100',
        grade: 'f',
        status: 'active',
      }
    ];

export const privilegeUsers = [
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f607',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'super admin',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'superadmin@gmail.com',
      isVerified: true
    },
    {
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
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'teacher',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'teacher@gmail.com',
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f610',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'student',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'student@gmail.com',
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f611',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'teacher',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'teacher2@gmail.com',
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f612',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'admin',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'admin@gmail.com',
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f613',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'student',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'diffschoolstudent@gmail.com',
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f614',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'super admin',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'superadmin2@gmail.com',
      isVerified: true
  },
  {
      user_uid: '40e6215d-b5c6-4896-987c-f30f3678f615',
      school_uid: '40e6215d-b5c6-4896-987c-f30f3678f609',
      first_name: 'John',
      last_name: 'Doe',
      dob: new Date(),
      year_of_graduation: '2020',
      role: 'student',
      password: bcrypt.hashSync('1234567', 10),
      phone_number: '07038015455',
      email: 'deletestudent@gmail.com',
      isVerified: true
  },
]
