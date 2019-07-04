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