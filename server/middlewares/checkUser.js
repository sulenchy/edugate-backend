export const checkUserIsLoggedIn = (req, res, next) => {
    if (!req.session.user_uid) {
        return res.status(401).json({
            status: 'failure',
            message: "Please, Login"
        })
    }
    next();
}

export const checkAdminPrivilege = (req, res, next) => {
    if (!['admin', 'super admin'].includes(req.session.role)) {
        return res.status(401).json({
            status: 'failure',
            message: 'Sorry, you do not have the required privilege'
        })
    }
    next();
}


export const checkTeacherPrivilege = (req, res, next) => {
    const { query } = req.params;
    const { role } = req.session;
    if (!['Teacher', 'admin', 'super admin'].includes(role)) {
        return res.status(401).json({
            status: 'failure',
            message: 'Sorry, you do not have the required privilege'
        })
    }

    // protects teacher from getting teachers
    if (role === 'teacher' && query === 'teacher') {
        return res.status(401).json({
            status: 'failure',
            message: 'Sorry, you do not have the required privilege'
        })
    }

    next();
}

export const checkIfUserHasSchool = (req, res, next) => {
    const { school_uid } = req.session;
    if (school_uid === null) {
        return res.status(422).json({
            status: 'failure',
            message: 'School not found. Please register a school'
        })
    }
    next();
}
