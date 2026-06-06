import React from "react"
import '../styling/aboutUs.css'
import support from "../media/img7.png"
import { Link } from 'react-router-dom'
import useAuth from '../globalProps/useAuth';
import footer from '../media/footer.png';
import { jwtDecode } from "jwt-decode"

export default function AboutUs(){

    const [openSection, setOpenSection] = React.useState('');
    
    const {token} = useAuth()

    let users=''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return(
        <div className="about-page">

            <div className="header">
            
                            <h1 onClick={()=>setComponent('home')}>MINKIY</h1>
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

            <section className="about-hero">
                <div className="hero-copy">
                    <span className="eyebrow">Who we are</span>
                    <h2>Building a premium gaming marketplace<br/>for every collector and player.</h2>
                    <p>
                        MINKIY is the place where vintage consoles, rare titles and new releases come together in one vibrant storefront.
                        We help gamers discover hard-to-find classics, shop confidently, and enjoy curated gaming experiences with fast support.
                    </p>
                    <div className="hero-features">
                        <div>
                            <strong>Curated catalog</strong>
                            <p>Handpicked games and gear for every style of player.</p>
                        </div>
                        <div>
                            <strong>Safe shopping</strong>
                            <p>Secure checkout and fast order tracking for a worry-free purchase.</p>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="image-mask"></div>
                    <img src={support} alt="Gaming collection" />
                </div>
            </section>

            <section className="about-story">
                <div className="story-card story-card-left">
                    <h3>Our mission</h3>
                    <p>
                        We exist to connect gamers with the best products in a playful, polished shopping experience.
                        Every item is selected for its quality, nostalgia value, or modern appeal.
                    </p>
                </div>
                <div className="story-card story-card-right">
                    <h3>Our promise</h3>
                    <p>
                        Fast support, trusted sellers, and a community-first store built around gaming passion.
                        From vintage favorites to today's hits, we make discovery simple and exciting.
                    </p>
                </div>
            </section>

            <section className="about-values">
                <div className="values-intro">
                    <span className="eyebrow">What drives us</span>
                    <h2>Designed for gamers, powered by quality.</h2>
                </div>
                <div className="values-grid">
                    <article className="value-card">
                        <h4>Authenticity</h4>
                        <p>Every product meets our quality standard so you can shop with confidence.</p>
                    </article>
                    <article className="value-card">
                        <h4>Community</h4>
                        <p>We support our players with timely help, updates, and a friendly experience.</p>
                    </article>
                    <article className="value-card">
                        <h4>Discovery</h4>
                        <p>Find rare finds, new releases, and hidden gems in a single immersive store.</p>
                    </article>
                </div>
            </section>

            <section className="about-stats">
                <div className="stat-item">
                    <span>500+</span>
                    <p>collector-approved products</p>
                </div>
                <div className="stat-item">
                    <span>24/7</span>
                    <p>support for every order</p>
                </div>
                <div className="stat-item">
                    <span>100%</span>
                    <p>trusted marketplace experience</p>
                </div>
            </section>


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
                                <Link className="link-footer" to='/aboutUs'><p>About Us</p></Link>
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
