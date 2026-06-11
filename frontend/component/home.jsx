import React from "react"
import { jwtDecode } from "jwt-decode"
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../globalProps/useAuth';
import footer from '../media/footer.png';

import TopProduct from "../functionality/topProduct"
import categories from "../categories"
import filtering from "../filtering"
import ProductSlider from "../functionality/slideProducts"

import vid1 from "../media/vid1.mp4"
import img1 from "../media/layout2.png"
import img2 from "../media/layout.png"
import img3 from "../media/beSeller.jpg"

export default function Home(){

    const [openSection, setOpenSection] = React.useState('');

    const {token} = useAuth()

    const navigate = useNavigate()

    function productShow(){
        navigate('/shop')
    }

    const filter = filtering.map((filter)=>{
            return(
                <div className="home-page-layout-filter-relative">
                    <img src={filter.img.src} alt={filter.img.alt} />
                    <div className="home-page-layout-filter-info">
                        <h1>{filter.title}</h1>
                        <p>{filter.description}</p>
                        <button className="filter-explore-btn" onClick={productShow}>Explore</button>
                    </div>
                </div>
            )
        })

    let users=''

    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return(
        <div className="container"> 

            <div className="header">

                <h1 onClick={()=>setComponent('home')}>MINKIY</h1>
                <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
                <label htmlFor="nav-toggle" className="nav-toggle-btn"><i className="fa-solid fa-bars"></i></label>
                <div className="home-component">
                    <div className="home-component-flex">
                        <Link to="/" className="link"><p className="style-component active-component">Home</p></Link>
                        <Link to="/shop" className="link"><p className="style-component">Shop</p></Link>
                        <Link to="/contact" className="link"><p className="style-component">Contact</p></Link>
                        <Link to="/aboutUs" className="link"><p className="style-component">About Us</p></Link>
                    </div>

                    <div className="web-info"> 
                        {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon"></i></Link> : <Link to="/login" target="_blank"><i className="fa-regular fa-circle-user icon"></i></Link>}
                        {users.role !=='seller' && <Link to="/cart" target="_blank"><i className="fa-solid fa-cart-arrow-down icon"></i></Link>}
                    </div>
                </div>
                

            </div>



                
            <div>
                    <div className="img-container">    
                        <video className="video" autoPlay loop muted>
                            <source src={vid1}></source>
                        </video>
                    </div>
                    
                        <div className="body-container">
                            <div className="body1">
                                <h1 style={{marginBottom:20}}>Welcome To Our Store</h1>
                                <p>« Discover a piece of history with this rare and timeless item. Carefully preserved and hand-selected, each piece tells its own unique story, reflecting the craftsmanship and character of a bygone era. Perfect for collectors, enthusiasts, or anyone looking to own a fragment of the past, this item combines nostalgia and authenticity, bringing charm and sophistication to your space or collection.»</p>
                            </div>
                                    
                            <div className="center-top"><TopProduct/></div>
                                    
                        </div>
            
                        <div id="category" style={{padding:20}} className="category-hom-page">
                            
                            <div className="home-page-category">
                                <ProductSlider/>
                            </div>
                        </div>
            
                        <div className="home-page-layout0">
                            <img src={img1} alt="" />
                            <div className="home-page-layout0-info">
                                <p>ABOUT OUR PLATFORM</p>
                                <h1>BUILT FOR GAMERS, DESIGNED FOR TRUST</h1>
                                <p>Our marketplace brings together buyers and sellers
                                   in a secure, modern, and easy-to-use platform.
                                   Whether you're searching for premium gaming gear
                                   or growing your business, we provide the tools,
                                   security, and experience you need.
                                </p>
                            </div>
                        </div>
            
                        <div className="home-page-layout1">
                            <img src={img2} alt="" />
                            <div className="home-page-layout1-info">
                                <h1>THE ULTIMATE <span style={{color:'gold'}}>GAMING</span> MARKETPLACE FOR EVERYONE </h1>
                                <p>A secure and powerfull platform connecting gamers, sellers, and trusted partners worldwide.</p>
                                <div className="home-page-layout1-btn">
                                    <button className="explore-cat-btn" onClick={productShow}>Explore Products <i className="fa-solid fa-arrow-right"></i></button>
                                </div>
                            </div>
                        </div>
            
                        <div className="home-page-layout-filter">
                            {filter}
                        </div>
            
                        <div className="home-page-layout3">
                            <img src={img3} alt="" />
                            <div className="home-page-layout3-info">
                                <p>FOR SELLERS</p>
                                <h1>START SELLING TODAY</h1>
                                <p>Grow your gaming business with powerful seller tools, advanced analytics, and a secure marketplace designed to help you reach more customers and maximize sales.</p>
                                <button className="beSeller-btn"><Link to="/register" className="link">Become a Seller</Link></button>
                            </div>
                        </div>
            
                        
                        <div className="home-page-layout2">
                            <div className="why-choose-us-panel">
                                <div className="why-choose-us-header">
                                    <span className="why-choose-us-badge">Why Choose Us</span>
                                    <h2>Built for gamers who want a premium marketplace experience</h2>
                                </div>
                                <div className="why-choose-us-grid">
                                    {[
                                        {
                                            icon: '★',
                                            title: 'Trusted sellers',
                                            description: 'Verified vendors, curated product quality.'
                                        },
                                        {
                                            icon: '⚡',
                                            title: 'Fast & Reliable',
                                            description: 'Built for speed, simplicity, and reliability.'
                                        },
                                        {
                                            icon: '🛡️',
                                            title: 'Secure payments',
                                            description: 'Protected transactions with transparent payment controls.'
                                        },
                                        {
                                            icon: '🎮',
                                            title: 'Curated collections',
                                            description: 'Premium gaming gear, collectibles, and exclusive drops.'
                                        }
                                    ].map((feature, index) => (
                                        <div key={index} className="why-choose-card">
                                            <span className="why-choose-card-icon">{feature.icon}</span>
                                            <h3 className="why-choose-card-title">{feature.title}</h3>
                                            <p className="why-choose-card-desc">{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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