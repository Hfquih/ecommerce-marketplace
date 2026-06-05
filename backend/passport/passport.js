const user = require('../connect/user')
const jwtStrategy = require('passport-jwt').Strategy
const extractJWT = require('passport-jwt').ExtractJwt
const fs = require('fs')
const path =require('path')

const PUB_KEY= process.env.JWT_PUBLIC_KEY

const options={
    jwtFromRequest : extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : PUB_KEY,
    algorithms : ['RS256']
}

module.exports=(passport)=>{
    passport.use(new jwtStrategy(options , async (payload , done)=>{
        try{
            const users = await user.findOne({_id:payload.userId})

            if(users){
                return done(null , users)
            }
            else{
                return done(null , false)
            }
        }catch(error){
            return done(error)
        }
    }))
}