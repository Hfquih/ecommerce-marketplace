import React from "react";
import '../styling/adminUser.css'
import axios from "axios";
import { Link } from "react-router-dom";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';


export default function AdminSeller(){
    const [sellerInfo , setSellerInfo] = React.useState({})

    const [typeUser , setTypeUser] = React.useState('all-users')

    const [selectedSellerId , setSelectedSellerId] = React.useState(null)

    const [SellerOffer , setSellerOffer] = React.useState([])

    const [overView , setOverView] = React.useState('overView')

    const [filter , setFilter] = React.useState('')

    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})

    const [countData , setCountData]= React.useState({})

    const [currentPage, setCurrentPage] = React.useState(1);
    
    const [numOfPages, setNumOfPages] = React.useState(1);

    const {token} = useAuth()

    React.useEffect(()=>{
        const params = new URLSearchParams({filter , page: currentPage})
        const sellerAuth = async()=>{
          try{
            const {data} = await apiClient.get(`/auth/seller?${params}`, {
              headers: { 
                'Authorization': `Bearer ${token}`
              }
            })
            setSellerInfo(data)
            setNumOfPages(data.numOfPages)
          } catch(error){
            console.log(error)
          }
        }
        sellerAuth()
    },[filter , currentPage])

    React.useEffect(()=>{
      if(!selectedSellerId) return
      const getSellerOffer = async()=>{  
        try{
          const {data} = await apiClient.get(`/order/sellerOffer-admin/${selectedSellerId}`, {
            headers: {Authorization : `Bearer ${token}`}
          })
          setSellerOffer(data.results)
        }catch(error){
          console.log(error)
        }
      }
      getSellerOffer()
    },[selectedSellerId])

    React.useEffect(()=>{
      const genCountData = async()=>{
        try{
          const {data} = await apiClient.get(`/dashboard/admin-dashboard`, {
            headers:{Authorization : `Bearer ${token}`}
          })
          setCountData(data)
        }catch(error){
          console.log(error)
        }
      }
      genCountData()
    },[])

    async function disableUser(){

      try{
        const {data} = await apiClient.patch(
          `/auth/admin-delete/${selectedSellerId}`,
          {},
          {headers:{Authorization:`Bearer ${token}`}}
        )

        setSellerInfo(prev=>{
          return {
            ...prev,
            users : prev.users.map((user)=>{
              return user._id === selectedSellerId ? {...user , status:'disabled'} : user
            })
          }
        })

        if(filter==='today'){
          setSellerInfo(prev=>{
            return{
              ...prev,
              users:prev.users.filter((user)=>user._id !== selectedSellerId)
            }
          })
        }

        setAlert({
          msg:data.msg , field:true , success:true , error:false 
        })
        
        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , success:false , error:false
          })
        },5000)

      }catch(error){
        console.log(error)

        setAlert({
          msg:error.response?.data.msg || 'Something wont wrong' , field:true , success:false , error:true 
        })
        
        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , success:false , error:false
          })
        },5000)
      }
    }

    async function restoreUser(){
      try{
        const {data} = await apiClient.patch(
          `/auth/restore-admin/${selectedSellerId}`,
          {},
          {headers:{Authorization:`Bearer ${token}`}}
        )

        setSellerInfo(prev=>{
          return{
            ...prev,
            users : prev.users.map((user)=>{
              return user._id === selectedSellerId ? {...user , status:'active'} : user
            })
          }
        })

        if(filter==='deleted'){
          setSellerInfo(prev=>{
            return{
              ...prev,
              users:prev.users.filter((user)=>user._id !== selectedSellerId)
            }
          })
        }

        setAlert({
          msg:data.msg , field:true , success:true , error:false 
        })
        
        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , success:false , error:false
          })
        },5000)

      }catch(error){
        console.log(error)

        setAlert({
          msg:error.response?.data.msg || 'Something wont wrong' , field:true , success:false , error:true 
        })
        
        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , success:false , error:false
          })
        },5000)
      }
    }

    const selectedSeller = sellerInfo.users?.find((user)=> user._id === selectedSellerId)

    const lastOffer = SellerOffer?.length
      ? SellerOffer.reduce((latest, offer) => {
          if (!latest) return offer
          return new Date(offer.createdAt) > new Date(latest.createdAt) ? offer : latest
        }, null)
      : null

    const mapOneOffer = lastOffer ? (
      <div className="one-offer-card">
        <div className="offer-card-header">
          <div>
            <h5>Latest Offer</h5>
            <p>Order ID: {lastOffer._id}</p>
          </div>
          <span className={`offer-status ${lastOffer.status || ''}`}>{lastOffer.status || 'unknown'}</span>
        </div>

        <div className="offer-summary-grid">
          <div>
            <p>Total seller revenue</p>
            <h6>{Number(lastOffer.totalSeller || 0).toLocaleString()} DH</h6>
          </div>
          <div>
            <p>Shipping</p>
            <h6>{lastOffer.shippingType}</h6>
          </div>
          <div>
            <p>Shipping fee</p>
            <h6>{Number(lastOffer.shippingFee || 0).toLocaleString()} DH</h6>
          </div>
          <div>
            <p>Created on</p>
            <h6>{new Date(lastOffer.createdAt).toLocaleDateString()}</h6>
          </div>
        </div>

        <div className="offer-product-card">
          <img src={lastOffer.orderItem?.[0]?.image} alt={lastOffer.orderItem?.[0]?.name || 'Product image'} />
          <div>
            <h6>{lastOffer.orderItem?.[0]?.name || 'Product details'}</h6>
            <p>Amount: {lastOffer.orderItem?.[0]?.amount || 0}</p>
            <p>Price: {Number(lastOffer.orderItem?.[0]?.price || 0).toLocaleString()} DH</p>
          </div>
        </div>

        <div className="offer-details-grid">
          <div className="offer-detail-block">
            <p>Customer</p>
            <h6>{lastOffer.shippingAddress?.fullName || 'N/A'}</h6>
            <p>{lastOffer.shippingAddress?.emailAddress || 'No email'}</p>
            <p>{lastOffer.shippingAddress?.phone || 'No phone'}</p>
          </div>
          <div className="offer-detail-block">
            <p>Shipping address</p>
            <h6>{lastOffer.shippingAddress?.address || 'No address'}</h6>
            <p>{lastOffer.shippingAddress?.city || 'No city'}, {lastOffer.shippingAddress?.postalCode || ''}</p>
          </div>
          <div className="offer-detail-block">
            <p>Order total</p>
            <h6>{Number(lastOffer.total || 0).toLocaleString()} DH</h6>
            <p className="small-text">Order items: {lastOffer.orderItem?.length || 0}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="offer-empty-state">
        <p>Select a seller from the table above to view their most recent offer.</p>
      </div>
    )

    const allOffers = SellerOffer?.length > 0 ? (
      SellerOffer.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((offer) => (
          <article className="offer-row" key={offer._id}>
            <div className="offer-row-header">
              <div>
                <h5>Offer ID: {offer._id}</h5>
                <p>{new Date(offer.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`offer-status ${offer.status || ''}`}>{offer.status || 'unknown'}</span>
            </div>

            <div className="offer-row-summary">
              <div>
                <p>Seller Revenue</p>
                <h6>{Number(offer.totalSeller || 0).toLocaleString()} DH</h6>
              </div>
              <div>
                <p>Order Total</p>
                <h6>{Number(offer.total || 0).toLocaleString()} DH</h6>
              </div>
              <div>
                <p>Shipping</p>
                <h6>{offer.shippingType || 'N/A'}</h6>
              </div>
              <div>
                <p>Shipping Fee</p>
                <h6>{Number(offer.shippingFee || 0).toLocaleString()} DH</h6>
              </div>
            </div>

            <div className="offer-row-content">
              <div className="offer-row-items">
                <h6>Products</h6>
                {offer.orderItem?.map((item) => (
                  <div className="offer-item" key={item._id}>
                    <img src={item.image} alt={item.name || 'Product image'} />
                    <div>
                      <p>{item.name}</p>
                      <span>{item.amount} × {Number(item.price || 0).toLocaleString()} DH</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="offer-row-customer">
                <h6>Customer</h6>
                <p>{offer.shippingAddress?.fullName || 'N/A'}</p>
                <p>{offer.shippingAddress?.emailAddress || ''}</p>
                <p>{offer.shippingAddress?.phone || ''}</p>
                <p>{offer.shippingAddress?.address || ''}</p>
                <p>{offer.shippingAddress?.city || ''} {offer.shippingAddress?.postalCode || ''}</p>
              </div>
            </div>
          </article>
        ))
    ) : (
      <div className="offer-empty-state">
        <p>Select a seller and switch to Orders to see all offers.</p>
      </div>
    )

    const getPageButtons = () => {
      const pages = [];

      if (numOfPages <= 5) {
        for (let i = 1; i <= numOfPages; i++) {
            pages.push(i);
        }
      } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(numOfPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }

        if (currentPage < numOfPages - 2) {
            pages.push('...');
        }

        pages.push(numOfPages);
      }

    return pages;
    };


    return(
      <div className="dashboard-content">
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin! </p>
          </div>
        </header>

      <section className="dashboard-general-info-user">
        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user"></i>
          <div>
            <p>{countData.totalSeller}</p>
            <p>Total Users</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user-plus"></i>
          <div>
            <p>{countData.newSellersToday}</p>
            <p>New Users</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i class="fa-solid fa-user-slash"></i>
          <div>
            <p>{countData.disabledSeller}</p>
            <p>disabled Users</p>
          </div>
        </div>

      </section>

      <div className="dashbord-second-info">
          <div className="table-order">

          <div className="filter-users"> 
            <select name="filter" className="users-filter" onChange={(e)=>setFilter(e.target.value)}> 
                <option value="">All Users</option>
                <option value="today">New Users</option>
                <option value="deleted">Disabled Users</option>
            </select>
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellerInfo.users?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-action"><i className="fa-solid fa-eye" onClick={()=>setSelectedSellerId(user._id)}></i></button>
                      <button className="btn-action"><Link className="link-admin" to={`/admin-edit/${user._id}`} target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="pagination-div">
            <div>
              <p>Showing 1 to 8 of {countData.totalSeller} Sellers</p>
            </div>

            <div>
            {getPageButtons().map((item, index) => {
              if (item === '...') {
                return <span key={index}>...</span>;
              }

              return (
                <button key={index} onClick={() => setCurrentPage(item)} className={`button-pag ${currentPage === item ? 'active-pag' : ''}`}>{item}</button>
              );
            })}
            </div>

          </div>

        </div> 

      </div>

      <div className="user-info-general-container">
        <div className="user-info-general">

          <h3>User Details</h3>
          <div className="flex-user-info-general">
            <div className="user-avatar">{selectedSeller && selectedSeller.firstName?.[0]}</div>
            <div>
              <h5>First Name : {selectedSeller && selectedSeller.firstName}</h5>
              <h5>Last Name : { selectedSeller && selectedSeller.lastName}</h5>
              <p>User ID: {selectedSeller && selectedSeller._id}</p>
              <p>Joind At: {selectedSeller && new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
        </div>

        <div className="order-status">

          <div className="order-status-info1">
            <p>Total Order</p>
            <h5>{SellerOffer.length}</h5>
          </div>

          <div className="order-status-info2">
            <p>Status</p>
            <h5>{selectedSeller &&  selectedSeller.status}</h5>
          </div>

        </div>

        <div className="disable-active-container">
          {selectedSeller?.status==='active' && <button className="user-disable-btn" onClick={disableUser}>Disable User</button>}
          {selectedSeller?.status==='disabled' && <button className="user-restore-btn" onClick={restoreUser}>Restore User</button>}
          {alert.field && <p className={`${alert.error ? 'text-error' : alert.success ? 'text-success' : ''}`}>{alert.msg}</p>}
        </div>

        <div className="user-info-general-btn">
          <button className={`button-info ${overView==='overView' ? 'active-info' : ''}`} onClick={()=>setOverView('overView')}>OverView</button>
          <button className={`button-info ${overView==='orders' ? 'active-info' : ''}`} onClick={()=>setOverView('orders')}>Orders</button>
        </div>

        {overView === 'overView' && <div className="account-information-container">

          <h4>Account Information</h4>

          <div className="account-information">

            <div className="flex-account-information">
              <span><i className="fa-solid fa-user"></i> Role</span>
              <p>{selectedSeller && selectedSeller.role}</p>
            </div>

            <div className="flex-account-information">
              <span><i className="fa-solid fa-user"></i> Account Created</span>
              <p>{selectedSeller && new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex-account-information">
              <span><i class="fa-solid fa-user"></i> Status</span>
              <p>{selectedSeller && selectedSeller.status}</p>
            </div>

          </div>

          <div className="account-one-offer">
            {mapOneOffer}
          </div>

        </div>}

        {overView==='orders' && <div className="account-offers-information">{allOffers}</div>}

      </div>
      


    
            
      </div>
    )

}    