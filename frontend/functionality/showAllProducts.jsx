import axios from 'axios'
import '../styling/allProducts.css'
import React from 'react'
import { Link } from 'react-router-dom' 

export default function ShowAllProducts(props){

    return(
        
        <div className='product-flex'>
            <div className='div-products animate-card'>
                <img src={props.image} alt="" className='product-img' />
                <h2 className='product-name'>{props.name}</h2>
                <div className='flex-info'>
                    <p className='price'>${props.price.toFixed(2)}</p>
                    <p className='stock'>Stock : {props.stock}</p>
                </div>

                <div className='flex-div-hide'>
                    <Link to={`/info-Seller/${props.productId}`} target='_blank' className='view-link'>View All info</Link>
                    <div className='link-icon-div'>
                        <Link to={`/editProduct/${props.productId}`} target='_blank' className='edit-link'>
                            <i className="fa-solid fa-pen-to-square edit"></i>
                        </Link>
                        <button onClick={()=>props.userDeleteProducts(props.productId)}><i className="fa-solid fa-trash icon-trash"></i></button>
                    </div>
                    
                </div>
                
            </div>
        </div>
        
        
    )
}