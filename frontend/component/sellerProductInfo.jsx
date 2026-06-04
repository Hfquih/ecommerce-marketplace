import { div } from "motion/react-client";
import React from "react";
import { useParams } from "react-router-dom";
import '../styling/sellerProduct.css'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function SellerProduct(){
    const [product , setProduct] = React.useState({})

    const {token} = useAuth()

    const {id} = useParams()

    React.useEffect(()=>{
        const productSeller = async()=>{
            try{
                const {data} = await apiClient.get(`/products/product-seller/${id}` , {headers: {Authorization : `Bearer ${token}`}})

                setProduct(data.products)
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        }
        productSeller();
    },[])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    return(
        <div className="product-seller-container">
            {Object.keys(product).length > 0 ? (
                <div className="seller-product-card">
                    {/* Product Image */}
                    <div className="seller-product-image-section">
                        <img src={product.image} alt={product.name} className="seller-product-image" />
                    </div>

                    {/* Product Details */}
                    <div className="seller-product-details">
                        <div className="seller-product-details-flex">
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-status-badge" style={{backgroundColor: product.status === 'active' ? '#0f5132' : '#842029'}}>
                                {product.status?.toUpperCase()}
                            </div>
                        </div>
                        
                        <p className="product-category">Category: <span>{product.category}</span></p>
                        
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Pricing Section */}
                        <div className="pricing-section">
                            <div className="price-group">
                                <span className="label">Original Price:</span>
                                <span className="price">${product.price}</span>
                            </div>
                            {product.discount && (
                                <div className="discount-group">
                                    <span className="label">Discount:</span>
                                    <span className="discount-value">-${product.discount} ({product.discountType})</span>
                                </div>
                            )}
                        </div>

                        {/* Stock & Sales Info */}
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Stock Available</span>
                                <span className="info-value stock-count">{product.stock} units</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Units Sold</span>
                                <span className="info-value sold-count">{product.sold}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Total Views</span>
                                <span className="info-value views-count">{product.views}</span>
                            </div>
                        </div>

                        {/* Dates Section */}
                        <div className="dates-section">
                            <div className="date-item">
                                <span className="date-label">Created:</span>
                                <span className="date-value">{formatDate(product.createdAt)}</span>
                            </div>
                            <div className="date-item">
                                <span className="date-label">Last Updated:</span>
                                <span className="date-value">{formatDate(product.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading-state">
                    <p>Loading product information...</p>
                </div>
            )}
        </div>
    )
}