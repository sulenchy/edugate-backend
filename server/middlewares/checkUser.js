export const checkUserIsLoggedIn = (req, res,next) => {
    if(!req.session.user_uid){
        return res.status(401).json({
            status: 'failure',
            message: "Please, Login"
        })
    }
    next();
}
export const checkUserRole = (req, res,next) => {
    if(!['admin', 'super admin'].includes(req.session.role)){
        return res.status(401).json({
            status: 'failure',
            message: "Sorry, you do not have the required priviledge"
        })
    }
    next();
}

export const checkAdminAndAboveRole = (req, res,next) => {
    if(!['admin', 'super admin'].includes(req.session.role)){
        return res.status(401).json({
            status: 'failure',
            message: 'Sorry, you do not have the required priviledge'
        })
    }
    next();
}


export const checkTeacherAndAboveTole = (req, res,next) => {
    const { query } = req.params;
    const { role } = req.session;
    if(!['Teacher', 'admin', 'super admin'].includes(role)){
        return res.status(401).json({
            status: 'failure',
            message: 'Sorry, you do not have the required priviledge'
        })
    }

    // protects teacher from getting teachers
    if(role === 'teacher' && query === 'teacher'){
        res.status(401).json({
            status: 'failure',
            message: 'Sorry, you do not have the required priviledge'
        })
    }

    next();
}
