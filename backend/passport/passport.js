const user = require('../connect/user')
const jwtStrategy = require('passport-jwt').Strategy
const extractJWT = require('passport-jwt').ExtractJwt
const fs = require('fs')
const path =require('path')
const {NotFound} = require('../errors')

const PUB_KEY= process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');

if(!process.env.JWT_PUBLIC_KEY){
    throw new NotFound(
    'environment variables are missing'
  );
}

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