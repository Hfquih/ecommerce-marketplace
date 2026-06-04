import React from "react";
import '../styling/adminUser.css'
import axios from "axios";
import { Link } from "react-router-dom";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';


export default function AdminUser(){
    const [userInfo , setUserInfo] = React.useState({})

    const [typeUser , setTypeUser] = React.useState('all-users')

    const [selectedUserId , setSelectedUserId] = React.useState(null)

    const [userOrder , setUserOrder] = React.useState([])

    const [overView , setOverView] = React.useState('overView')

    const [filter , setFilter] = React.useState('')

    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})

    const [countData , setCountData]= React.useState({})

    const [currentPage, setCurrentPage] = React.useState(1);

    const [numOfPages, setNumOfPages] = React.useState(1);

    const {token} = useAuth()

    React.useEffect(()=>{
        const params = new URLSearchParams({filter , page: currentPage})
        const userInfo = async()=>{
          try{
            const {data} = await apiClient.get(`/auth/?${params}` , {headers:{Authorization : `Bearer ${token}`}})
            setUserInfo(data)
            setNumOfPages(data.numOfPages)
          }catch(error){
            console.log(`User info fetch failed: ${error}`)
          }
        }
        userInfo()
    },[filter,currentPage])

    React.useEffect(()=>{
      if(!selectedUserId) return
      const getUserOrder = async()=>{
        try{
          const {data} = await apiClient.get(`/order/${selectedUserId}` , {headers:{Authorization : `Bearer ${token}`}})
          setUserOrder(data.orders)
        }catch(error){
          console.log(`User order fetch failed: ${error}`)
        }
      }
      getUserOrder()
    },[selectedUserId])

    React.useEffect(()=>{
      const getCountData = async()=>{
        try{
          const {data} = await apiClient.get(`/dashboard/admin-dashboard` , {headers:{Authorization : `Bearer ${token}`}})
          setCountData(data)
        }catch(error){
          console.log(`Count data fetch failed: ${error}`)
        }
      }
      getCountData()
    },[])

    async function disableUser(){

      try{
        const {data} = await apiClient.patch(
          `/auth/admin-delete/${selectedUserId}`,
          {},
          {headers:{Authorization:`Bearer ${token}`}}
        )

        setUserInfo(prev=>{
          return {
            ...prev,
            users : userInfo.users.map((user)=>{
              return user._id === selectedUserId ? {...user , status:'disabled'} : user
            })
          }
        })

        if(filter==='today'){
          setUserInfo(prev=>{
            return{
              ...prev,
              users : prev.users.filter((user)=>user._id !== selectedUserId)
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
          `/auth/restore-admin/${selectedUserId}`,
          {},
          {headers:{Authorization:`Bearer ${token}`}}
        )

        setUserInfo(prev=>{
          return{
            ...prev,
            users : prev.users.map((user)=>{
              return user._id === selectedUserId ? {...user , status:'active'} : user
            })
          }
        })

        if(filter==='deleted'){
          setUserInfo(prev=>{
            return{
              ...prev,
              users : prev.users.filter((user)=>user._id !== selectedUserId)
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

    const selectedUser= userInfo.users?.find((user)=> user._id===selectedUserId)

    const lastOrder = userOrder?.length
      ? [...userOrder].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null

    const mapOneOrder = lastOrder ? (
      <div className="one-order-card">
        <div className="one-order-header">
          <div>
            <h4>Last Order</h4>
            <p>Order ID: {lastOrder._id}</p>
          </div>
          <span className={`order-status-chip ${lastOrder.status}`}>{lastOrder.status}</span>
        </div>

        <div className="order-summary-grid">
          <div>
            <p className="summary-label">Order total</p>
            <p className="summary-value">${lastOrder.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="summary-label">Shipping</p>
            <p className="summary-value">{lastOrder.shippingType} · ${lastOrder.shippingFee}</p>
          </div>
          <div>
            <p className="summary-label">Placed on</p>
            <p className="summary-value">{new Date(lastOrder.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="summary-label">Items</p>
            <p className="summary-value">{lastOrder.orderItem.length}</p>
          </div>
        </div>

        <div className="order-item-list">
          {lastOrder.orderItem.map((item) => (
            <div key={item._id} className="order-item-card">
              <img className="order-item-image" src={item.image} alt={item.name} />
              <div className="order-item-details">
                <p className="item-name">{item.name}</p>
                <p>{item.amount} × ${item.price.toLocaleString()}</p>
                <p className="item-subtext">Product ID: {item.product}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-address">
          <h5>Shipping address</h5>
          <p>{lastOrder.shippingAddress.fullName}</p>
          <p>{lastOrder.shippingAddress.address}, {lastOrder.shippingAddress.city}</p>
          <p>{lastOrder.shippingAddress.postalCode}</p>
          <p>{lastOrder.shippingAddress.phone}</p>
          <p>{lastOrder.shippingAddress.emailAddress}</p>
        </div>
      </div>
    ) : (
      <div className="one-order-empty">
        <p>No recent orders found for this user.</p>
      </div>
    )

    const allOrdersMarkup = userOrder?.length ? (
      <div className="all-orders-list">
        {[...userOrder]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h4>Order ID: {order._id}</h4>
                  <p className="order-card-meta">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`order-status-chip ${order.status}`}>{order.status}</span>
              </div>

              <div className="order-card-summary">
                <div>
                  <p className="summary-label">Order total</p>
                  <p className="summary-value">${order.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="summary-label">Shipping</p>
                  <p className="summary-value">{order.shippingType} · ${order.shippingFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="summary-label">Items</p>
                  <p className="summary-value">{order.orderItem.length}</p>
                </div>
              </div>

              <div className="order-product-list">
                {order.orderItem.map((item) => (
                  <div key={item._id} className="order-product-card">
                    <img className="order-product-image" src={item.image} alt={item.name} />
                    <div className="order-product-text">
                      <p className="product-name">{item.name}</p>
                      <p className="product-detail">{item.amount} × ${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-ship-address">
                <h5>Shipping address</h5>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.emailAddress}</p>
              </div>
            </article>
          ))}
      </div>
    ) : (
      <div className="order-empty-state">
        <p>No orders found for this user.</p>
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
            <p>{countData.totalUser}</p>
            <p>Total Users</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user-plus"></i>
          <div>
            <p>{countData.newUsersToday}</p>
            <p>New Users</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i class="fa-solid fa-user-slash"></i>
          <div>
            <p>{countData.disabledUser}</p>
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
              {userInfo.users?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
                      <button className="btn-action"><i className="fa-solid fa-eye" onClick={()=>setSelectedUserId(user._id)}></i></button>
                      <button className="btn-action"><Link className="link-admin" to={`/admin-edit/${user._id}`} target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="pagination-div">
            <div>
              <p>Showing 1 to 8 of {countData.totalUser} Users</p>
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
            <div className="user-avatar">{selectedUser && selectedUser.firstName?.[0]}</div>
            <div>
              <h5>First Name : {selectedUser && selectedUser.firstName}</h5>
              <h5>Last Name : { selectedUser && selectedUser.lastName}</h5>
              <p>User ID: {selectedUser && selectedUser._id}</p>
              <p>Joind At: {selectedUser && new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
        </div>

        <div className="order-status">

          <div className="order-status-info1">
            <p>Total Order</p>
            <h5>{userOrder.length}</h5>
          </div>

          <div className="order-status-info2">
            <p>Status</p>
            <h5>{selectedUser &&  selectedUser.status}</h5>
          </div>

        </div>

        <div className="disable-active-container">
          {selectedUser?.status==='active' && <button className="user-disable-btn" onClick={disableUser}>Disable User</button>}
          {selectedUser?.status==='disabled' && <button className="user-restore-btn" onClick={restoreUser}>Restore User</button>}
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
              <p>{selectedUser && selectedUser.role}</p>
            </div>

            <div className="flex-account-information">
              <span><i className="fa-solid fa-user"></i> Account Created</span>
              <p>{selectedUser && new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex-account-information">
              <span><i class="fa-solid fa-user"></i> Status</span>
              <p>{selectedUser && selectedUser.status}</p>
            </div>

          </div>

          <div>
            {mapOneOrder}
          </div>

        </div>}

        {overView==='orders' && <div className="account-order-information">{allOrdersMarkup}</div>}

      </div>
      


    
            
      </div>
    )

}    