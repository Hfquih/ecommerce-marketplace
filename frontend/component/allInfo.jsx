import React from "react";
import { useParams } from "react-router-dom";
import '../styling/viewInfo.css'
import {Link} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';
import footer from '../media/footer.png';

export default function AllInfo(props){
    const [oneProduct , setOneProduct] = React.useState({})
    const [openSection, setOpenSection] = React.useState('');

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
        <div className="footer-container" style={{ backgroundImage: `url(${footer})` }}>
                    <div className="footer-container-info">
        
                        <div className="footer-content-general">
                            <h1>MINKIY</h1>
                            <p>Your ultimate destination for gaming, and innovation. Discover. Shop. .Pay </p>
                            <div className="footer-media">
                                <a className="link-footer" href="https://facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f social-icon"></i></a>
                                <a className="link-footer" href="https://instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram social-icon"></i></a>
                                <a className="link-footer" href="https://youtube.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-youtube social-icon"></i></a>
                                <a className="link-footer" href="https://x.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-x-twitter social-icon"></i></a>
                            </div>
                        </div>
        
                        <div className="footer-div-toogle">
                            <div className="mobile-footer-toggles">
                                <button className={`mobile-toggle ${openSection==='shop' ? 'open' : ''}`} onClick={()=>setOpenSection(prev=> prev==='shop' ? '' : 'shop')}>SHOP</button>
                                <button className={`mobile-toggle ${openSection==='customer' ? 'open' : ''}`} onClick={()=>setOpenSection(prev=> prev==='customer' ? '' : 'customer')}>CUSTOMER</button>
                                <button className={`mobile-toggle ${openSection === 'company' ? 'open' : ''}`} onClick={()=>setOpenSection(prev=> prev==='company' ? '' : 'company')}>COMPANY</button>
                                <button className={`mobile-toggle ${openSection === 'newsletter' ? 'open' : ''}`} onClick={()=>setOpenSection(prev=> prev==='newsletter' ? '' : 'newsletter')}>NEWSLETTER</button>
                            </div>
                        </div>
        
                        <div className={`footer-content-general-1 ${openSection==='shop' ? 'open-mobile' : ''}`}>
                            <h1>SHOP</h1>
                            <Link className="link-footer" to='/shop'><p>All Products</p></Link>
                            <Link className="link-footer" to='/shop'><p>Laptops</p></Link>
                            <Link className="link-footer" to='/shop'><p>Consoles</p></Link>
                            <Link className="link-footer" to='/shop'><p>Accessories</p></Link>
                            <Link className="link-footer" to='/shop'><p>Setup</p></Link>
                        </div>
        
                        <div className={`footer-content-general-2 ${openSection==='customer' ? 'open-mobile' : ''}`}>
                            <h1>CUSTOMER</h1>
                            <Link className="link-footer" to='/contact'><p>Contact Us</p></Link>
                            <Link className="link-footer" to='/shipping-delivery'><p>Shipping & Delivery</p></Link>
                            <Link className="link-footer" to='/return-refound'><p>Return & Refound</p></Link>
                            {token ? <Link className="link-footer" to='/account'><p>Track Order</p></Link> : <Link className="link-footer" to="/login" target="_blank"><p>Track Order</p></Link>}
                        </div>
        
                        <div className={`footer-content-general-3 ${openSection==='company' ? 'open-mobile' : ''}`}>
                            <h1>COMPANY</h1>
                            <p className="link-footer" to='/aboutUs'>About Us</p>
                            <Link className="link-footer" to='/privacy-policy'><p>Privacy Policy</p></Link>
                        </div>
        
                        <div className={`footer-content-general-4 ${openSection==='newsletter' ? 'open-mobile' : ''}`}>
                            <h1>NEWSLETTER</h1>
                            <p>Stay updated with new releases and exclusive offers.</p>
                        </div>
        
                    </div>   
        
                    <div className="footer-end">
                    <div><p><i className="fa-regular fa-copyright icon-right"></i> <span style={{color:"mediumvioletred"}}>MINKIY.</span> All rights reserved.</p></div>
                    <div><p><i className="fa-solid fa-lock icon-right"></i>Secure Payement. 100% protected.</p></div>
                   </div> 
        
                   </div>
    </div>
    )
}