import '../styling/account.css'
import React from 'react'
import Offers from '../sub-functionality/offers'
import { useNavigate , Link } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function Seller(props) {

  const [sellerData , setSellerData] = React.useState({})

  const [verifyShow , setVerifyShow] = React.useState("account-details")

  const {token , logout} = useAuth()

  React.useEffect(()=>{ 
    const dashboardData = async()=>{
      try{
        const {data} = await apiClient.get('/dashboard' , {headers : {Authorization : `Bearer ${token}`}})
        setSellerData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    dashboardData();
  },[])

  const navigate = useNavigate()

  function SignOut(){
    logout()
    navigate('/login')
  }

  let users=''

  if(token){
    const decoded=jwtDecode(token)
    users=decoded
  }

  return (
    <div>
      <div className="header">
                <h1><a className="link" href="/">MINKIY</a></h1>
              
                <div className="web-info-second">
                    {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon-second"></i></Link> : <Link to="/login"><i className="fa-regular fa-circle-user icon-second"></i></Link>}
                    {users.role==='user' && <Link to="/cart"><i className="fa-solid fa-cart-arrow-down icon-second"></i></Link>}
                </div>
            </div>
    <div className="seller-page">
      <main className="seller-dashboard">
        <aside className="seller-profile-card">
          <div className="seller-avatar">{props.firstName?.[0]}</div>
          <div className="seller-summary">
            <p className="seller-role">Seller dashboard</p>
            <h1 className="seller-name">{props.firstName} {props.lastName}</h1>
            <p className="seller-email">{props.email}</p>
          </div>

          <div className="seller-badges">
            <span>Verified seller</span>
            <span>Fast response</span>
          </div>

          <div className="seller-action-group">
            <button onClick={()=>setVerifyShow('account-details')} className="action-btn">Account details</button>
            <button onClick={()=>setVerifyShow('offers')} className="action-btn action-btn-secondary">View Offres</button>
            <button onClick={SignOut} className="action-btn action-btn-secondary">Sign Out</button>
          </div>
        </aside>


        {verifyShow==='account-details' && <section className="seller-details-grid">
          <section className="detail-card seller-details-card">
            <div className="section-title">
              <h2>Account details</h2>
              <p>Update your profile information and keep your store current.</p>
            </div>

            <div className="detail-row">
              <div>
                <span>First name</span>
                <strong>{props.firstName}</strong>
              </div>
              <Link className="edit-link" to="/edit-info" target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link>
            </div>

            <div className="detail-row">
              <div>
                <span>Last name</span>
                <strong>{props.lastName}</strong>
              </div>
              <Link className="edit-link" to="/edit-info" target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link>
            </div>

            <div className="detail-row">
              <div>
                <span>Email</span>
                <strong>{props.email}</strong>
              </div>
              <Link className="edit-link" to="/edit-info" target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link>
            </div>

            <div className="detail-row">
              <div>
                <span>Phone</span>
                <strong>{props.phone}</strong>
              </div>
              <Link className="edit-link" to="/edit-info" target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link>
            </div>

            <div className="detail-row">
              <div>
                <span>Password</span>
                <strong>••••••••</strong>
              </div>
              <Link className="edit-link" to="/edit-info" target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link>
            </div>
          </section>

          <section className="detail-card seller-quick-card">
            <div className="section-title">
              <h2>Quick access</h2>
              <p>Fast links for seller tools and product management.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <strong>{sellerData.totalProducts}</strong>
                <span>Active products</span>
              </div>
              <div className="stat-box">
                <strong>{sellerData.totalOrders}</strong>
                <span>New orders</span>
              </div>
            </div>

            <div className="card-actions">
              <Link to="/viewProducts" target="_blank" className="secondary-btn">Manage All Products</Link>
              <Link to="/createProducts" target="_blank" className="secondary-btn">Add New Product</Link>
            </div>
          </section>
        </section>}

        <section className='section-offer-seller'>{verifyShow==='offers' && <Offers/>}</section>
      </main>
    </div>
    </div>
  )
}