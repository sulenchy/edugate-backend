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
    email: 'John.do@gmail.com',
    password: '123testing'
};

export const userDataWithInvalidPassword = {
    email: 'a@a.com',
    password: 'testing'
};
export const userDataWithInvalidEmail = {
    email: 'James.grant',
    password: '12testing'
};

export const userDataWithInvalidFields = {
    email: 'James.grant',
    password: 'testing'
};

export const userDataWithAnExistingEmail = {
    email: 'John.doe@gmail.com',
    password: '123testing'
}

export const loginUserDataWithEmptyFields = {
    username: '',
    password: ''
}
export const loginUserDataWithEmptyUsername = {
    password: '123testing'
}
export const loginUserDataWithEmptyPassword = {
    username: 'Jamsgra',
    password: ''
}
export const loginUserDataWithInvalidPassword = {
    username: 'Jamsgra',
    password: 'testing'
}