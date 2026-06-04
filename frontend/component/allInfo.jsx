import React from "react";
import { useParams } from "react-router-dom";
import '../styling/viewInfo.css'
import {Link} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function AllInfo(props){
    const [oneProduct , setOneProduct] = React.useState({})

    const [item , setItems] = React.useState(
        {
          product:'',
          amount:0,  
        }
    )

    const [alert , setAlert] = React.useState({msg:'' , success:false , errors:false})

    const {token} = useAuth()

    async function handleCart(e){

        e.preventDefault()
        
        try{
            const {data} = await apiClient.post('/cart' , {item:[item]} , {headers : {Authorization : `Bearer ${token}`}} )
            setAlert({msg:data.msg || 'Added to cart' , success:true , errors:false})
            setTimeout(() => {
                setAlert({msg:'' , success:false , errors:false})
            }, 5000);
        }catch(error){
            console.log(error)
            setAlert({msg:error.response.data.errors[0]?.msg || 'Something wont wrong' , success:false , errors:true})
            console.log(alert)
            setTimeout(() => {
                setAlert({msg:'' , success:false , errors:false})
            }, 5000);
        }

    }
    const {id} = useParams()

    React.useEffect(()=>{
        const params = new URLSearchParams(item.amount).toString()

        const getProduct = async()=>{
            try{
                const {data} = await apiClient.get(`/products/${id}/?${params}`)
                setOneProduct(data.products)
                setItems(prev=>{
                    return{
                        ...prev,
                        product:id
                    }
                })

                if(data.warning){
                    setAlert({msg:data.warning , success:false , errors:true})

                    setTimeout(() => {
                        setAlert({msg:'' , success:false , errors:false})
                    }, 5000);

                }

            }catch(error){
                console.error('Product detail fetch failed:', error)
                
            }
        }

        getProduct()
    },[id])

    function addCount(){
         setItems(prevCount => {
            return{
                ...prevCount,
                amount: Math.min(prevCount.amount+1 , oneProduct.stock)
            }
         })
    }

    function lessCount(){
        setItems(prevCount => {
            return{
                ...prevCount,
                amount: Math.max(prevCount.amount - 1, 0)
            }
         })
    }

    let users=''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return(
    <div>
        <div className="header">
            <h1><a className="link" href="/">MINKIY</a></h1>
              
            <div className="web-info-second">
                {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon-second"></i></Link> : <Link to="/login"><i className="fa-regular fa-circle-user icon-second"></i></Link>}
                {(users.role==='user' || users.role==='admin') && <Link to="/cart"><i className="fa-solid fa-cart-arrow-down icon-second"></i></Link>}
            </div>
        </div>

        <div>
            
            <div className="product-view">
                <img className="image" src={oneProduct.image} alt="" />
                <div className="all-info-cont div-controle">
                    <p>{oneProduct.category}</p>
                    <h1>{oneProduct.name}</h1>
                    <div className="div-flex-info">
                        <p className="price-info">Price : ${oneProduct.price}</p>
                        <p className="stock-info">Stock : {oneProduct.stock}</p>
                    </div>
                   
                    {users.role === 'seller' ? <p className="login-to-buy">Only users can buy products.</p> :
                    token ? <div className="div-flex-info">
                        <div className="button-counter div-flex-info-btn">
                            <button className="count-btn" onClick={lessCount}>-</button>
                            <p>{item.amount}</p>
                            <button className="count-btn" onClick={addCount}>+</button>
                        </div>
                        
                        <form onSubmit={handleCart}>
                            <button className="cart-btn">ADD TO CART</button>
                        </form>
                        
                    </div> : 
                      
                     <p className="login-to-buy">Please<Link to="/login">login</Link> to buy this product.</p>
                    }

                    <small className={alert.success ? 'text-success' : alert.errors ? 'text-error' : ''}>{alert.msg}</small>
                </div>
            </div>
        
            <div className="more-info">
                <h1>Description:</h1>
                <p className="description">{oneProduct.description}</p>
            </div>
        </div>
        <div className="footer">
            <div className="footer-brand">
                <h2><a className="link" href="/">MINKIY</a></h2>
                <p>Professional gaming marketplace for gamers, collectors and modern players.</p>
                <p className="footer-note">Fast support, secure checkout, and curated products crafted for every gaming enthusiast.</p>
            </div>
            <div className="footer-links">
                <div>
                    <h3>Quick links</h3>
                    <a href="/">Home</a>
                    <a href="/about">About us</a>
                    <a href="/contact">Contact</a>
                    <a href="/viewProducts">Products</a>
                </div>
                <div>
                    <h3>Contact</h3>
                    <a href="mailto:support@minkiy.com">support@minkiy.com</a>
                    <a href="tel:+15551234567">+1 (555) 123-4567</a>
                    <p>Mon-Fri 9am - 7pm</p>
                </div>
            </div>
        </div>
    </div>
    )
}