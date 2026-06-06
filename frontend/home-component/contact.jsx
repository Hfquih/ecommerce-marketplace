import React from 'react'
import '../styling/contact.css'
import axios from 'axios'
import { small } from 'motion/react-client'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';
import footer from '../media/footer.png';
import { Link } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"


import vid1 from "../media/vid3.mp4"
import supportImg from "../media/img6.jpg"

export default function Contact() {

    const [support , setSupport] = React.useState({username:'' , email:'' , message:''})

    const [alert , setAlert] = React.useState({msg:'' , field:false , success:false , error:false})

    const [error , setError] = React.useState({})

    const [openSection, setOpenSection] = React.useState('');

    function handelInput(e){
        const {name , value} = e.currentTarget 

        setSupport(prev=>{
            return{
                ...prev,
                [name]:value
            }
        })

        setError(prev=>{
            return{
                ...prev,
                [name]:''
            }
        })
    }

    async function handleSupport(e){
        e.preventDefault()

        if(!checkInput())return

        try{
            const {data} = await apiClient.post('/support' , {...support})
            
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
                msg:error.response?.data.msg || 'SOMETHING WONT WRONG' , field:true , success:false , error:true 
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false 
                })
            },3000)
        }
    }

    function checkInput(){
        let newErrors={}

        Object.entries(support).forEach(([field , value])=>{
            if(!value.trim()){
                newErrors[field] = `${capitalize(field)} is required`
            }
        })
        setError(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    const {token} = useAuth()

    let users=''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return(
        <div>

            <div className="header">
            
                            <Link to="/" className="link"><h1>MINKIY</h1></Link>
                            <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
                            <label htmlFor="nav-toggle" className="nav-toggle-btn"><i className="fa-solid fa-bars"></i></label>
                            <div className="home-component">
                                <div className="home-component-flex">
                                    <Link to="/" className="link"><p className="style-component">Home</p></Link>
                                    <Link to="/shop" className="link"><p className="style-component">Shop</p></Link>
                                    <Link to="/contact" className="link"><p className="style-component">Contact</p></Link>
                                    <Link to="/aboutUs" className="link"><p className="style-component active-component">About Us</p></Link>
                                </div>
            
                                <div className="web-info"> 
                                    {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon"></i></Link> : <Link to="/login" target="_blank"><i className="fa-regular fa-circle-user icon"></i></Link>}
                                    {users.role !=='seller' && <Link to="/cart" target="_blank"><i className="fa-solid fa-cart-arrow-down icon"></i></Link>}
                                </div>
                            </div>
                            
            
                        </div>

            <div className="contact-page">
            <section className="purpose">
                <video className="contact-vid" src={vid1} autoPlay loop muted playsInline />
                <div className="purpose-text">
                    <h2>Reach out for fast support</h2>
                    <p>
                        Our team is here to help with product questions, order support, or account requests.
                        Send us a message and we’ll reply as quickly as possible with the information you need.
                    </p>
                    <ul className="purpose-list">
                        <li>Order and delivery assistance</li>
                        <li>Product advice and seller support</li>
                        <li>Feedback, returns, and account help</li>
                    </ul>
                </div>
            </section>

            <section className="div-form">
                <form className="contact-form" onSubmit={handleSupport}>
                    <div className="div-contact div-controle">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter your username" onChange={handelInput} />
                        {error.username && <small>{error.username}</small>}
                    </div>

                    <div className="div-contact div-controle">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" onChange={handelInput}/>
                        {error.email && <small>{error.email}</small>}
                    </div>
                    
                    <div className="div-contact div-controle">
                        <label htmlFor="text">Message</label>
                        <textarea name="message" id="text" placeholder="Write your message here" className='contact-area' onChange={handelInput}></textarea>
                        {error.message && <small>{error.message}</small>}
                    </div>

                    <button type="submit" className="contact-btn">Send message</button>

                    {alert.field && <p style={{textAlign:'center'}} className={alert.success ? 'text-success' : alert.error ? 'text-error' : ''}>{alert.msg}</p>}
                </form>

                <img src={supportImg} className="img-contact" alt="Support and contact" />
            </section>
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
                                <p onClick={()=>setComponent('shop')}>All Products</p>
                                <p onClick={()=>setComponent('shop')}>Laptops</p>
                                <p onClick={()=>setComponent('shop')}>Consoles</p>
                                <p onClick={()=>setComponent('shop')}>Accessories</p>
                                <p onClick={()=>setComponent('shop')}>Setup</p>
                            </div>
            
                            <div className={`footer-content-general-2 ${openSection==='customer' ? 'open-mobile' : ''}`}>
                                <h1>CUSTOMER</h1>
                                <p onClick={()=>setComponent('contact')}>Contact Us</p>
                                <Link className="link-footer" to='/shipping-delivery'><p>Shipping & Delivery</p></Link>
                                <Link className="link-footer" to='/return-refound'><p>Return & Refound</p></Link>
                                {token ? <Link className="link-footer" to='/account'><p>Track Order</p></Link> : <Link className="link-footer" to="/login" target="_blank"><p>Track Order</p></Link>}
                            </div>
            
                            <div className={`footer-content-general-3 ${openSection==='company' ? 'open-mobile' : ''}`}>
                                <h1>COMPANY</h1>
                                <p onClick={()=>setComponent('about')}>About Us</p>
                                <Link className="link-footer" to='/AboutUs'><p>Our Story</p></Link>
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