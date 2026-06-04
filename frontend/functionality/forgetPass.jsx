import React from "react"
import '../styling/forgetReset.css'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();


export default function ForgetPass(){
    const [email , setEmail] = React.useState('')
    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})

    async function forgetPassword(e){
        e.preventDefault()
        if(!email){
            setAlert({msg:'Please enter your email', field:true, error:true, success:false})
            setTimeout(()=> setAlert({msg:'', field:false, error:false, success:false}),3000)
            return
        }

        try{
            const {data} = await apiClient.post('/auth/forgot-password' , {email})

            setAlert({
                msg:data.msg , field:true , error:false , success:true
            })

            setTimeout(()=>{
                setAlert({msg:'', field:false, error:false, success:false})
            },3000)
        }catch(error){
            console.log(error)

            setAlert({
                msg:error.response?.data?.msg || 'Something went wrong' , field:true , error:true , success:false
            })

            setTimeout(()=>{
                setAlert({msg:'', field:false, error:false, success:false})
            },3000)
        }
    }

    return(
        <div className="forget-container">
            <div className="forget-card">
                <h2 className="forget-title">Forgot password</h2>
                <p className="forget-desc">Enter your account email and we'll send password reset instructions.</p>

                {alert.field && (
                    <div className={`forget-alert ${alert.error ? 'error' : ''} ${alert.success ? 'success' : ''}`}>
                        {alert.msg}
                    </div>
                )}

                <form className="forget-form" onSubmit={forgetPassword}>
                    <label className="forget-label" htmlFor="email">Email</label>
                    <input id="email" type="email" className="forget-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />

                    <button type="submit" className="forget-btn" disabled={!email}>Send reset link</button>
                </form>

                <div className="forget-note">If you don't receive the email, check your spam folder or try again.</div>

            </div>
        </div>
    )
}