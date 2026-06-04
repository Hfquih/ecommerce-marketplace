import React from "react"
import '../styling/order.css'
import axios from "axios"
import { div, p } from "motion/react-client"
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';


export default function Order(){
    const [orders, setOrders] = React.useState({})

    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:true})

    const [status , setStatus] = React.useState('')

    const {token} = useAuth()

    React.useEffect(()=>{
        if (!token) return

        const params = new URLSearchParams({status})

        const orderUser = async()=>{
            try{
                const {data} = await apiClient.get(`/order/showAllMyOrders/?${params}`, {headers:{Authorization : `Bearer ${token}`}})
                setOrders(data || [])
            }catch(error){
                console.error('Order fetch failed:', error)
            }
        }

        orderUser()
    }, [status])

    console.log(status)

    async function cancelOrder(id){
        try{
            const {data} = await apiClient.patch(
                `/order/cancel-order/${id}`,
                {},
                {headers : {Authorization : `Bearer ${token}`}}
            )

            setOrders(prev=>{
                return{
                    ...prev,
                    orders : prev.orders.map((order)=>{
                        return order._id === id ? {...order , status : 'canceled'} : order
                    })
                }
            })

            setAlert({
                msg:data.msg , field:true , success:true , error:false
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false
                })
            },6000)

        }catch(error){
            console.log(error)

            setAlert({
                msg:error.response.data?.msg || 'SOMETHING WONT WRONG' , field:true , success:true , error:false
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false
                })
            },6000)
        }
    }

    async function deleteItem(orderId , itemId){
        try{
            const {data} = await apiClient.delete(
                `/order/${orderId}/${itemId}`,
                {headers : {Authorization : `Bearer ${token}`}}
            )

            setOrders(prev=>{

                return{
                    ...prev,
                    orders : prev.orders.map((order)=>{
                        return order._id === orderId ? {...order , orderItem:order.orderItem.filter((item)=>item._id !== itemId)} : order
                    })
                }
            })

            setAlert({
                msg:data.msg , field:true , success:true , error:false
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false
                })
            },3000)

        }catch(error){
            console.log(error)

            setAlert({
                msg:error.response.data?.msg || 'SOMETHING WONT WRONG' , field:true , success:true , error:false
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false
                })
            },3000)
        }
    }

    const mapOrder = orders.orders?.length > 0 ? orders.orders?.map((order) => {

        const {
            _id,
            shippingType,
            total,
            orderItem,
            shippingAddress,
            status,
            createdAt
        } = order

        const orderItems = Array.isArray(orderItem)
            ? orderItem : []

        const readableDate = createdAt
            ? new Date(createdAt).toLocaleDateString()
            : 'Unknown date'

        const addressLines = []
        if (shippingAddress) {
            if (typeof shippingAddress === 'string') {
                addressLines.push(shippingType)
            } else {
                addressLines.push(shippingAddress.fullName)
                addressLines.push(shippingAddress.phone)
                addressLines.push(shippingAddress.emailAddress)
                const cityLine = [shippingAddress.city, shippingAddress.address, shippingAddress.postalCode]
                    .filter(Boolean)
                    .join(', ')
                if (cityLine) addressLines.push(cityLine)
            }
        }

        return (
            <article key={_id} className="order-card">
                <div className="order-card__header">
                    <div>
                        <p className="order-label">Order</p>
                        <h2>{(_id ? _id.slice(-8).toUpperCase() : '—')}</h2>
                    </div>
                    <div className="order-status-cancel">
                        <span className={`orders-status orders-status--${(status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>
                            {status || 'Pending'}
                        </span>
                        {status==='pending' && <button className="cancel-order-btn" onClick={()=>cancelOrder(_id)}>Cancel Order</button>}
                    </div>
                    
                </div>

                <div className="order-card__meta">
                    <div className="order-meta-item">
                        <span>Date</span>
                        <strong>{readableDate}</strong>
                    </div>
                    <div className="order-meta-item">
                        <span>Payment</span>
                        <strong>{shippingType}</strong>
                    </div>
                    <div className="order-meta-item">
                        <span>Total</span>
                        <strong>{total}</strong>
                    </div>
                </div>

                {addressLines.length > 0 && (
                    <div className="order-card__address">
                        <p className="order-section-title">Delivery Address</p>
                        {addressLines.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                )}

                <div className="order-card__items">
                    <p className="order-section-title">Items</p>
                    {orderItems.length > 0 ? (
                        orderItems.map((item, index) => {
                            const itemId = item._id
                            const name = item.name
                            const qty = item.amount??0
                            const price = item.price??0
                            const image = item.image

                            return (
                                <div>
                                    <div key={`${name}-${index}`} className="order-item">
                                        {image && <img className="order-item__image" src={image} alt={name} />}
                                        <div className="order-item__details">
                                            <h3>{name}</h3>
                                            <p>{qty} × ${price.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <strong className="order-item__subtotal">${(qty * price).toFixed(2)}</strong>
                                            {orderItem.length > 1 && status==='pending' && <button className="delete-order-item" onClick={()=>deleteItem(_id , itemId)}><i className="fa-solid fa-trash icon-trash"></i></button>}
                                        </div>
                                    </div>
                                </div>  
                            )
            
                        })
                    ) : (
                        <p className="order-item-empty">No item details available for this order.</p>
                    )}
                </div>
                {alert.field && <p className={alert.success ? 'text-success' : alert.error ? 'text-error' : ''}>{alert.msg}</p>}
            </article>
        )
    }) : (
        <div className="order-empty">You have no orders yet.</div>
    )

    return (
        <section className="orders-page">
            <div className="myOrder-status-flex">
                <h1>My Orders</h1>
                <select name="status" id="" className="filter-status-order" onChange={(e)=>setStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="paid">Paid</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>
            

            {mapOrder}
        </section>
    )
}