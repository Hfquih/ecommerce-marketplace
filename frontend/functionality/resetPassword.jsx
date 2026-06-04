import React from "react";
import '../styling/forgetReset.css'
import ApiClient from "../API/apiClient";
import { useParams, Link } from "react-router-dom";
import globalError from "../globalProps/globalError";
import { p } from "motion/react-client";
const apiClient = new ApiClient();


export default function ResetPass(){
    const [password , setPassword] = React.useState('')
    const [errors , setErrors] = React.useState({})
    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})
    const [loading, setLoading] = React.useState(false)

    const { token } = useParams()

    console.log(token)
    async function handleForm(e){
        e.preventDefault()
        if(!password){
            setAlert({msg:'Please enter a new password', field:true, error:true, success:false})
            setTimeout(()=> setAlert({msg:'', field:false, error:false, success:false}),3000)
            return
        }

        try{
            setLoading(true)

            const {data} = await apiClient.post(`/auth/reset-password/${token}` , {password})

            setAlert({
                msg:data.msg || 'Password updated' , field:true , error:false , success:true
            })

            setTimeout(()=>{
                setAlert({msg:'', field:false, error:false, success:false})
            },3000)

        }catch(error){
            console.log(error)

            globalError(error , setErrors , setAlert)

        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="reset-container">
            <div className="reset-card">
                <h2>Reset Your Password</h2>
                <p>Enter a new secure password for your account.</p>

                {alert.field && (
                    <div className={`alert ${alert.error ? 'error' : ''} ${alert.success ? 'success' : ''}`}>
                        {alert.msg}
                    </div>
                )}

                <form onSubmit={handleForm}>
                    <input
                        type="password"
                        placeholder="New password"
                        className="reset-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                    />

                    <button className="reset-btn" type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>

                    {errors.password && <h4 className="text-error">{errors.password}</h4>}
                </form>

                <div className="reset-footer">
                    <Link to="/login" className="reset-link">Return to login</Link>
                </div>
            </div>
        </div>
    )
}
