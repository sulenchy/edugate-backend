export const checkUser = (req, res,next) => {
    if(!req.session){
        return res.status(401).json({
            status: 'failure',
            message: "Please, Login"
        })
    }
}