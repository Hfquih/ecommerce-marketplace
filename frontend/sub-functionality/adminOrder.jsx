import axios from "axios";
import React from "react";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';


export default function AdminOrder(){
  const [orders, setOrders] = React.useState({})
  
  const [selectedOrderId , setSelectedOrderId] = React.useState(null)
  
  const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})
  
  const [filter , setFilter] = React.useState({status:'' , payement:'' , date:''})
  
  const [dataCount , setDataCount] = React.useState({})

  const [status , setStatus] = React.useState('')

  const [currentPage, setCurrentPage] = React.useState(1);
  
      const [numOfPages, setNumOfPages] = React.useState(1);
  
  const {token} = useAuth()

  React.useEffect(()=>{
    const params = new URLSearchParams({...filter , page: currentPage}).toString()
    const getOrders = async()=>{
      try{
        const {data} = await apiClient.get(`/order/?${params}` , {headers : {Authorization : `Bearer ${token}`}})
        setOrders(data)
        setNumOfPages(data.numOfPages)
      }catch(error){
        console.log(error)
      }
    }
    getOrders()
  },[filter , currentPage])


  React.useEffect(()=>{
    const getDashboardData = async()=>{
      try{
        const {data} = await apiClient.get('/dashboard/admin-dashboard', {headers : {Authorization : `Bearer ${token}`}})
        setDataCount(data)
      }catch(error){
        console.log(error)
      }
    }
    getDashboardData()
  },[])

  function handleInput(e){
    const {name , value} = e.currentTarget

    setFilter(prev=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }

  async function changeStatus(){
    try{
      const {data} = await apiClient.patch(
        `/order/${selectedOrderId}`,
        {status},
        {headers : {Authorization : `Bearer ${token}`}}
      )

      setOrders(prev=>{
        return{
          ...prev,
          orders : prev.orders.map((order)=>{
            return order._id === selectedOrderId ? {...order , status:status} : order
          })
        }
      })

      if(filter.status!=='' && filter.status !== status){
        setOrders(prev=>{
          return {
            ...prev,
            orders : prev.orders.filter((order) => order._id !== selectedOrderId)
          }
        })
      }

      setAlert({
        msg:data.msg , field:true , error:false , success:true
      })
      setTimeout(()=>{
        setAlert({
          msg:'' , field:false , error:false , success:false
        })
      },3000)
    }catch(error){
      console.log(error)
      setAlert({
        msg:error.response?.data.msg || 'SOMETHING WONT WRONG' , field:true , error:true , success:false
      })
      setTimeout(()=>{
        setAlert({
          msg:'' , field:false , error:false , success:false
        })
      },3000)
    }
  }

  const selectedOrder = orders.orders?.find((order)=>order._id === selectedOrderId)

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

      <section className="dashboard-general-info-product">
        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user"></i>
          <div>
            <p>{dataCount.totalOrders}</p>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user-tie"></i>
          <div>
            <p>{dataCount.pendingOrders}</p>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-brands fa-product-hunt" ></i>
          <div>
            <p>{dataCount.deliveredOrders}</p>
            <p>Delivered Orders</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-bag-shopping"></i>
          <div>
            <p>{dataCount.paidOrders}</p>
            <p>Paid Orders</p>
          </div>
        </div>

      </section>


      <div className="dashbord-second-info">
          <div className="table-order">

          <div className="filter-products"> 

            <select name="status" className="users-filter" onChange={handleInput}> 
                <option value="">All Status</option>
                <option value="pending">Pending Orders</option>
                <option value="failed">Failed Orders</option>
                <option value="paid">Paid Orders</option>
                <option value="delivered">Deliverd Orders</option>
                <option value="canceled">Canceled Orders</option>
            </select>

            <select name="payement" className="users-filter" onChange={handleInput}> 
                <option value="">Payement</option>
                <option value="cash on dilevery">Cash On Dilevery</option>
                <option value="bank payement">Bank Payement</option>
            </select>

            <select name="date" className="users-filter" onChange={handleInput}> 
                <option value="">All Time</option>
                <option value="-createdAt">New Orders</option>
                <option value="createdAt">old Orders</option>
            </select>

            <button className="product-admin-add">Add Orders</button>

          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Seller</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payement</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.orders?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.shippingAddress.emailAddress}</td>
                    <td>{order.orderItem.seller}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.total}</td>
                    <td>{order.shippingType}</td>
                    <td>{order.status}</td>
                    <td>
                      <button className="btn-action"><i className="fa-solid fa-eye" onClick={()=>setSelectedOrderId(order._id)}></i></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="pagination-div">
            <div>
              <p>Showing 1 to 8 of {dataCount.totalOrders} Orders</p>
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

        <div className="show-order-admin">
          {selectedOrder ? (
            <div className="order-detail-card">
              <div className="order-detail-header">
                <div>
                  <h2>Order #{selectedOrder._id}</h2>
                  <p className="order-detail-date">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <span className={`order-detail-chip ${selectedOrder.status}`}>{selectedOrder.status}</span>
              </div>

              <div className="order-detail-grid">
                <div className="order-detail-block">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>{selectedOrder.shippingAddress.emailAddress}</p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                </div>
                <div className="order-detail-block">
                  <h3>Order Summary</h3>
                  <p><strong>Payment method:</strong> {selectedOrder.shippingType}</p>
                  <p><strong>Items:</strong> {selectedOrder.orderItem.length}</p>
                  <p><strong>Shipping fee:</strong> ${selectedOrder.shippingFee.toFixed(2)}</p>
                  <p><strong>Subtotal:</strong> ${selectedOrder.total - selectedOrder.shippingFee}</p>
                  <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="order-detail-block">
                  <h3>Customer</h3>
                  <p>User ID: {selectedOrder.user}</p>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Created: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(selectedOrder.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="order-items-section">
                <div className="order-section-heading">
                  <h3>Order Items</h3>
                  <span>{selectedOrder.orderItem.length} item{selectedOrder.orderItem.length !== 1 ? 's' : ''}</span>
                </div>
                {selectedOrder.orderItem.map((item) => (
                  <div className="order-item-card" key={item._id}>
                    <img className="order-item-image" src={item.image} alt={item.name} />
                    <div className="order-item-content">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-meta">Price: ${item.price.toFixed(2)}</p>
                      <p className="order-item-meta">Quantity: {item.amount}</p>
                      <p className="order-item-meta">Subtotal: ${(item.price * item.amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="div-filter-admin">
                <select name="status" className="status-filter-admin" onChange={(e)=>setStatus(e.target.value)}>
                  <option value="" disabled selected>Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">delivered</option>
                  <option value="canceled">canceled</option>
                </select>
                <button className="btn-filter-admin" onClick={changeStatus}>Change Status</button>
              </div>
              {alert.field && <p className={alert.error ? 'text-error' : alert.success ? 'text-success' : ''}>{alert.msg}</p>}
            </div>
          ) : (
            <div className="order-detail-empty">Select an order from the table above to view its details.</div>
          )}
        </div>
    </div>
  )  
}