import React from "react";
import {jwtDecode} from "jwt-decode";
import '../styling/order.css'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function AccountDetail(){
    const [userInfo, setUserInfo] = React.useState(null)
    const {token} = useAuth()
    let users = null

    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    React.useEffect(() => {
        if (!token || !users?.userId) return

        const fetchAccountDetails = async () => {
            try {
                const { data } = await apiClient.get(`/auth/${users.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(data.users);
            } catch (error) {
                console.error('Account detail fetch failed:', error);
            }
        };

        fetchAccountDetails();
    }, [token, users?.userId]);

    if (!userInfo) {
        return (
            <section className="account-details-page">
                <h1>Personal Data</h1>
                <div className="account-empty">Loading account details...</div>
            </section>
        )
    }

    return (
        <section className="account-details-page">
            <h1>Personal Data</h1>
            <div className="account-details-card">
                <div className="account-detail-row">
                    <span>Name</span>
                    <strong>{userInfo.firstName}</strong>
                </div>
                <div className="account-detail-row">
                    <span>Last Name</span>
                    <strong>{userInfo.lastName}</strong>
                </div>
                <div className="account-detail-row">
                    <span>Email</span>
                    <strong>{userInfo.email}</strong>
                </div>
                <div className="account-detail-row">
                    <span>Phone</span>
                    <strong>{userInfo.phone}</strong>
                </div>
                <div className="account-detail-row">
                    <span>Role</span>
                    <strong>{userInfo.role}</strong>
                </div>
            
                <div className="account-detail-row">
                    <span>Joined</span>
                    <strong>{userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}</strong>
                </div>
            </div>
        </section>
    )
}
