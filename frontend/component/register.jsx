import '../styling/register.css'
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import globalError from '../globalProps/globalError';

export default function Register() {
    const [registerState, setRegisterState] = useState({
        firstName: "",
        lastName:"",
        phone:"",
        email: "",
        password: "",
        role:""
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ msg: '', field: '' });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRegisterState(prevAuth => ({
            ...prevAuth,
            [name]: value
        }));

        setErrors(prevError => {
            return{
                ...prevError,
                [name]:''
            }
        })
    };

    const navigate=useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!checkInputs()) return;

        try {
            const { data } = await apiClient.post('/auth/register', registerState);
            
            FormSuccess(data);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
            
        } catch (error) {
            globalError(error , setErrors , setAlert);
        }
    };

    const FormSuccess = (data) => {

        setAlert({
            msg: data.msg,
            field: true,
            success:true,
            error:false
        });

        setTimeout(()=>{
            setAlert({msg:"" , field:false , success:false , error:false})
        },3000)
        
    };

    const checkInputs = () => {
        let newErrors = {};

        Object.entries(registerState).forEach(([field, value]) => {
            if (!value.trim()) {
                newErrors[field] = `${capitalize(field)} is required`;
            }
        });
        setErrors(newErrors);
        setAlert({field:true , error:true , success:false})
        return Object.keys(newErrors).length === 0;
    };

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    return (
    <div>

        <div className="register-auth">
            <img className='register-img' src="../media/img1.jpg" alt="" />

            <form onSubmit={handleSubmit} action="/register" className="register-el">
                
                <h1>Register</h1>

                <div className="div-controle">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter Your first name"
                        value={registerState.firstName}
                        onChange={handleInputChange}
                        className={alert.success ? 'border-success' : errors.firstName ? 'border-error' : ''}
                    />
                    {errors.firstName && <small>{errors.firstName}</small>}
                </div>

                <div className="div-controle">
                    <label htmlFor="last">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter Your last name"
                        value={registerState.lastName}
                        onChange={handleInputChange}
                        className={alert.success ? 'border-success' : errors.lastName ? 'border-error' : ''}
                    />
                    {errors.lastName && <small>{errors.lastName}</small>}
                </div>

                <div className="div-controle">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="Enter Your phone"
                        value={registerState.phone}
                        onChange={handleInputChange}
                        className={alert.success ? 'border-success' : errors.phone ? 'border-error' : ''}
                    />
                    {errors.phone && <small>{errors.phone}</small>}
                </div>                

                <div className="div-controle">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={registerState.email}
                        onChange={handleInputChange}
                        className={alert.success ? 'border-success' : errors.email ? 'border-error' : ''}
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
                        value={registerState.password}
                        onChange={handleInputChange}
                        className={alert.success ? 'border-success' : errors.password ? 'border-error' : ''}
                    />
                    {errors.password && <small>{errors.password}</small>}
                    {alert.field && alert.error && <p className="text-error">{alert.msg}</p>}
                </div>

                <div className='div-controle'>
                    <label htmlFor="">Account Type</label>
                    <div className='container-role'>
                        <div className='role-div'>
                            <label className='input-role' htmlFor="user">user</label>
                            <input className='radio-input' type="radio" name="role" id="user" value='user' onChange={handleInputChange}/>
                        </div>

                        <div className='role-div'>
                            <label className='input-role' htmlFor="seller">seller</label>
                            <input className='radio-input' type="radio" name="role" id="seller" value='seller' onChange={handleInputChange}/>
                        </div>
                        
                    </div>
                    {errors.role && <small>{errors.role}</small>}
                </div>

                <button className="rgt-btn" type="submit">Register</button>

                <p className='signIn-logIn'>Have an account? <span><a href="/login">Logn in</a></span></p>

                {alert.field && <p className={`alert ${alert.success ? 'text-success' : alert.error ? 'text-error' : ""}`}>{alert.msg}</p>}
    
            </form>
        </div>

        

        </div>
        

    );
}
