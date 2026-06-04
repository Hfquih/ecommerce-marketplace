import React from "react";
import {jwtDecode} from 'jwt-decode';
import Seller from '../functionality/seller';
import User from '../functionality/user'
import Admin from "../functionality/admin";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function Account(){
    const [userInfo , setUserInfo] = React.useState([])

    const {token} = useAuth()
    let users= ''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    React.useEffect(()=>{
        const getUsers = async()=>{
            try{
                const {data} = await apiClient.get(`/auth/${users.userId}` , {headers:{Authorization : `Bearer ${token}`}})

                setUserInfo(data.users)
            }catch(error){
                console.log(error)
            }
        }
        getUsers()
    },[])

    return(
        <div>
            {userInfo.role === 'seller' && <Seller {...userInfo}/>}
            {userInfo.role === 'user' && <User {...userInfo}/>}
            {userInfo.role === 'admin' && <Admin/>}
        </div>
        
    )
}