import '../styling/offers.css'
import React from 'react'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function Offers(){
    const [offers , setOffers] = React.useState([])

    const [status , setStatus] = React.useState('')

    const {token} = useAuth()

  React.useEffect(() => {
    const params = new URLSearchParams({status}) 

    const sellerOffer = async () => {
      try{
        const {data} = await apiClient.get(`/order/sellerOffer/?${params}`, {headers:{Authorization : `Bearer ${token}`}})

        setOffers(data.results)
      }catch(error){
        console.log(error)
      }
    }

    sellerOffer()
  }, [token , status])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusClass = (status) => {
    return `offer-status ${status ? status.toLowerCase() : ''}`
  }


  const mapOffers = offers.length
    ? offers.map((offer) => (
        <article key={offer._id} className="offer-card">
          <div className="offer-card__header">
            <div>
              <span className="offer-card__label">Order submitted</span>
              <h2>{new Date(offer.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}</h2>
            </div>
            <span className={getStatusClass(offer.status)}>{offer.status}</span>
          </div>

          <div className="offer-card__summary">
            <div className="offer-card__summary-item">
              <p>Order total</p>
              <strong>{formatCurrency(offer.sellerTotal)}</strong>
            </div>
            <div className="offer-card__summary-item">
              <p>Shipping</p>
              <strong>{offer.shippingType}</strong>
            </div>
            <div className="offer-card__summary-item">
              <p>Shipping fee</p>
              <strong>{formatCurrency(offer.shippingFee)}</strong>
            </div>
          </div>

          <div className="offer-card__items">
            {offer.orderItem.map((item) => (
              <div key={item._id} className="offer-item">
                <div className="offer-item__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="offer-item__info">
                  <h3>{item.name}</h3>
                  <p>{item.amount} × {formatCurrency(item.price)}</p>
                  <span className="offer-item__meta">Product ID: {item.product}</span>
                </div>
                <div className="offer-item__price">
                  {formatCurrency(item.price * item.amount)}
                </div>
              </div>
            ))}
          </div>

          <div className="offer-card__details">
            <div>
              <p>Customer</p>
              <p>{offer.shippingAddress.fullName}</p>
              <p>{offer.shippingAddress.emailAddress}</p>
              <p>{offer.shippingAddress.phone}</p>
            </div>
            <div>
              <p>Shipping address</p>
              <p>{offer.shippingAddress.address}</p>
              <p>{offer.shippingAddress.city}, {offer.shippingAddress.postalCode}</p>
            </div>
          </div>
        </article>
      ))
    : (
        <div className="offers-empty">
          <p>No seller offers are available yet.</p>
        </div>
      )

  return (
    <section className="offers-page">

      <div className="offers-page__hero">
        <h1>Seller Offers</h1>
        <p>Review incoming order details, payment status, and shipping information in a clean, responsive layout.</p>
      </div>

      <select name="status" id="" className="filter-status-order" onChange={(e)=>setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
        <option value="paid">Paid</option>
        <option value="delivered">Delivered</option>
        <option value="canceled">Canceled</option>
      </select>

      <div className="offers-grid">{mapOffers}</div>

    </section>
  )
}
