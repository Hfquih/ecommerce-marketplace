const passport = require('passport')
require('../passport/passport')(passport)
const {Unauthorized} = require('../errors')

const requireAuth = passport.authenticate('jwt', { session:false })

const authorization=(...allowed)=>{
    return(req,res,next)=>{
        if(!allowed.includes(req.user.role)){
            throw new Unauthorized('sorry , you dont have access to this route')
        }
    
        next()
    }
}

const checkPermission = (requestUser , ressourceUser)=>{
    if(requestUser.role==='admin') return
    if(requestUser._id === ressourceUser.toString()) return

    throw new Unauthorized('sorry, you dont have authhorization to access this route')
}

module.exports={
    requireAuth,
    authorization,
    checkPermission
}

