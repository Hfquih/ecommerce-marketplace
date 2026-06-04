import '../styling/register.css'
import React from 'react'
import axios from 'axios'
import { useNavigate , Link } from 'react-router-dom'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';
import globalError from '../globalProps/globalError';
import loginImg from '../media/img1.jpg'

export default function Login(){

    const [loginState , setLoginState] = React.useState({
        email : "",
        password: "",
    })

    const [errors , setErrors] = React.useState({})

    const [alert , setAlert] = React.useState({msg:"" , field:""})
    const {logout , login} = useAuth()
    

    function handleInputChange(event){
        const {name , value} = event.currentTarget

        setLoginState(prevlogin=>{
            return{
                ...prevlogin,
                [name]:value
            }
        })

        setErrors(prevError=>{
            return{
               ...prevError,
               [name]:''
            }
        })
    }

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        if(!checkInput()) return 

        try{
            const {data} =await apiClient.post('/auth/login' , loginState)
            login(data.token)
            formSuccess(data)

            setTimeout(()=>{
                navigate('/')
            },2000)
        }catch(error){
            logout()
            globalError(error , setErrors , setAlert);
        }
    }

    function formSuccess(data){
        setAlert({
            msg:data.msg,
            field:true,
            success:true,
            error:false
        })

        setTimeout(()=>{
            setAlert({msg:"" , field:false , success:false , error:false})
        },3000)
    }

    function checkInput(){
        let emptyError={}

        Object.entries(loginState).forEach(([field , value])=>{
            if(!value.trim()){
                return emptyError[field] = `${capitalize(field)} is required`
            }
        })
        setErrors(emptyError)
        setAlert({field:true , error:true , success:false})
        return Object.keys(emptyError).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    return( 
    <div>

        <div className="login-auth"> 
            <img className='login-img' src={loginImg} alt="" />

            <form onSubmit={handleSubmit} action="/register" className="login-el">
                
                <h1>Login</h1>

                <div className="div-controle">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={loginState.email}
                        onChange={handleInputChange}
                        className={alert.error ? 'border-error' : alert.success ? 'border-success' : ""}
                    />
                    {errors.email && <small>{errors.email}</small>}
                </div>

                <div className="div-controle">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Your Password"
                        value={loginState.password}
                        onChange={handleInputChange}
                        className={alert.error ? 'border-error' : alert.success ? 'border-success' : ""}
                    />
                    {errors.password && <small>{errors.password}</small>}
                </div>

                <button className="rgt-btn" type="submit">Login</button>

                <div>
                    <p className='signIn-logIn' style={{marginBottom:5}}>Don't have an account? <span><Link to="/register">Sign Up</Link></span></p>
                    <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                </div>

                

                {alert.field && <p className={`alert ${alert.success ? 'text-success' : alert.error ? 'text-error' : ""}`}>{alert.msg}</p>}
    
            </form>

        </div>   

    </div>
    
    )
}