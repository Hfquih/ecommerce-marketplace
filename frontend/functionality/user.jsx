import '../styling/user.css'
import React from 'react'
import Order from '../sub-functionality/order'
import AccountDetail from '../sub-functionality/accountDetail'
import ChangeInfo from '../sub-functionality/ChangeInfo'
import { useNavigate , Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import useAuth from '../globalProps/useAuth';


export default function User(props){

    const [activeSession , setActiveSession] = React.useState('order')

    const {token , logout} = useAuth()

    const navigate = useNavigate()

    function signOut(){
        logout()
        navigate('/login')
    }

    let users=''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return(
        <div>
            <div className="header">
                <h1><a className="link" href="/">MINKIY</a></h1>
              
                <div className="web-info-second">
                    {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon-second"></i></Link> : <Link to="/login"><i className="fa-regular fa-circle-user icon-second"></i></Link>}
                    {users.role==='user' && <Link to="/cart"><i className="fa-solid fa-cart-arrow-down icon-second"></i></Link>}
                </div>
            </div>

            <div className="account-user">
                <h1>My Account</h1>

                <div className="account-flex">

                    <div className="account-info1">
                        <h3>Welcome, {props.firstName} {props.lastName}</h3>

                        <button className='account-detail' onClick={()=>setActiveSession('order')}>
                            <i className="fa-solid fa-box-open account-icon"></i>
                            <p>Order</p>
                        </button>

                        <button className='account-detail' onClick={()=>setActiveSession('account-detail')}>
                            <i className="fa-regular fa-user account-icon"></i>
                            <p>Personal Data</p>
                        </button>

                        <button className='account-detail' onClick={()=>setActiveSession('change-info')}>
                            <i className="fa-solid fa-lock account-icon"></i>
                            <p>Change Information</p>
                        </button>

                        <button className='account-detail' onClick={signOut}>
                            <i className="fa-solid fa-arrow-right-from-bracket account-icon"></i>
                            <p>Sign Out</p>
                        </button>
                    </div>

                    <div className="account-info2">
                        {activeSession==='order' && <Order/>}
                        {activeSession==='account-detail' && <AccountDetail/>}
                        {activeSession==='change-info' && <ChangeInfo/>}
                    </div>

                </div>
            </div>
        </div>
    )
}