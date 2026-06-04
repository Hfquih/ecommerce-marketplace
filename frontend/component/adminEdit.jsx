import React from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import '../styling/changeInfo.css'
import { useParams } from "react-router-dom";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function AdminChangeInfo(){
    const [userInfo , setUserInfo] = React.useState({})

    const [alert , setAlert] = React.useState({msg:'' , field:false , success:false , error:false})

    const [errors , setErrors] = React.useState({})

    const {token} = useAuth()

    const {id} = useParams()

    React.useEffect(()=>{
        const getUsers = async()=>{
            try{
                const {data} = await apiClient.get(`/auth/${id}` , {headers:{Authorization : `Bearer ${token}`}})
                setUserInfo(data.users)
            }catch(error){
                console.error('Account detail fetch failed:', error)
            }
        }
        getUsers()
    },[token])

    async function handleForm(e) {
        e.preventDefault()
        if(!checkInputs()) return 

        try{
            const {data} = await apiClient.patch(`/auth/edit-user-admin/${id}` , userInfo , {headers: {Authorization : `Bearer ${token}`}})
            showSuccess(data)
        }catch(error){
            showGlobalError(error)
        }
    }

    function handleInputChange(e){
        const { name, value } = e.target
        setUserInfo(prev => ({ ...prev, [name]: value }))

        setErrors(prev=>({...prev , [name]:''}))
    }

    function showSuccess(data){
        setAlert({msg:data.msg , field:true , error:false , success:true})

        setTimeout(()=>{
            setAlert({msg:'' , field:false , success:false , error:false})
        },5000)
    }

    function showGlobalError(error){
        const errors = error.response?.data 

        let globalError={}

        if(errors && errors.errors){
            errors.errors.forEach(({field , msg})=>{
                return globalError[field] = msg
            })
            setErrors(globalError)
        }

        setAlert({msg:errors.msg||'something wrong happened' , field:true , error:true , success:false})
        
        setTimeout(()=>{
            setAlert({msg:'' , field:false , error:false , success:false})
        },5000)
    }

    function checkInputs(){
        let valid={}

        const allowedFields = ["firstName", "lastName", "phone", "email", "password"]

        Object.entries(userInfo).forEach(([field , value])=>{
            
            if(!allowedFields.includes(field))return

            if((typeof value === "string" && value.trim() === "")  || value === null || (typeof value === "number" && value === 0)){
                return valid[field] = `${capitalize(field)} is required`
            }
        })

        setErrors(valid)

        setAlert({field:true , success:false , error:true}) 

        setTimeout(()=>{
            setAlert({field:false , error:false , success:false}) 
        },5000)
        return Object.keys(valid).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    return(
        <div className="change-info-page">
            <div className="change-info-card">
                <div className="change-info-header">
                    <p className="eyebrow">Account settings</p>
                    <h2>Update your profile details</h2>
                    <p className="subtext">Keep your account information accurate so we can keep your experience personalized.</p>
                </div>

                {alert.field && (
                    <div className={`change-info-alert ${alert.success ? 'text-success' : ''} ${alert.error ? 'text-error' : ''}`}>
                        {alert.msg}
                    </div>
                )}

                <form onSubmit={handleForm} className="change-info-form" noValidate>
                    <div className="form-grid">
                        <div className="form-group div-controle">
                            <label htmlFor="firstName">First name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={userInfo.firstName || ''}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className={alert.success ? 'border-success' : errors.firstName ? 'border-error' : null}
                            />
                            {errors.firstName && <small>{errors.firstName || ''}</small>}
                        </div>

                        <div className="form-group div-controle">
                            <label htmlFor="lastName">Last name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={userInfo.lastName || ''}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className={alert.success ? 'border-success' : errors.lastName ? 'border-error' : null}
                            />
                            {errors.lastName && <small>{errors.lastName || ''}</small>}
                        </div>

                        <div className="form-group div-controle">
                            <label htmlFor="phone">Phone number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={userInfo.phone || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 0623127823"
                                className={alert.success ? 'border-success' : errors.phone ? 'border-error' : null}
                            />
                            {errors.phone && <small>{errors.phone || ''}</small>}
                        </div>

                        <div className="form-group div-controle">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={userInfo.email || ''}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={alert.success ? 'border-success' : errors.email ? 'border-error' : null}
                            />
                            {errors.email && <small>{errors.email || ''}</small>}
                        </div>

                        <div className="form-group div-controle">
                            <label htmlFor="password">New password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={userInfo.password || ''}
                                onChange={handleInputChange}
                                placeholder="Leave blank to keep current password"
                                className={alert.success ? 'border-success' : errors.password ? 'border-error' : null}
                            />
                            {errors.password && <small>{errors.password || ''}</small>}
                        </div>
                    </div>

                    <p className="form-note">Leave the password blank if you do not want to change it. Otherwise type a new secure password.</p>

                    <button type="submit" className="primary-button">Save changes</button>
                </form>
            </div>
        </div>
    )
}
