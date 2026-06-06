import "../styling/shippingDelivery.css";
import React from "react"
import footer from '../media/footer.png';
import { Link } from "react-router-dom";
import useAuth from '../globalProps/useAuth';

export default function ShippingDelivery(){
    const [openSection, setOpenSection] = React.useState('');

    const {token} = useAuth()

    let users=''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return (
        <div>
        
        <div className="header">
            <h1><a className="link" href="/">MINKIY</a></h1>
                      
            <div className="web-info-second">
                {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon-second"></i></Link> : <Link to="/login"><i className="fa-regular fa-circle-user icon-second"></i></Link>}
                {users.role==='user' && <Link to="/cart"><i className="fa-solid fa-cart-arrow-down icon-second"></i></Link>}
            </div>
        </div>

        <main className="shipping-delivery-page">
            <section className="shipping-hero">
                <div className="hero-copy">
                    <span>Shipping & Delivery</span>
                    <h1>Fast, secure delivery for every order</h1>
                    <p>From order confirmation to doorstep arrival, we make shipping simple, reliable, and transparent.</p>
                </div>
                <div className="hero-details">
                    <div>
                        <h2>Free standard shipping</h2>
                        <p>Enjoy free shipping on orders over $49 with delivery in 4-7 business days.</p>
                    </div>
                    <div>
                        <h2>Express options</h2>
                        <p>Need it faster? Choose express delivery at checkout and receive your items in 1-2 days.</p>
                    </div>
                </div>
            </section>

            <section className="shipping-cards">
                <article className="shipping-card">
                    <h3>Order processing</h3>
                    <p>We prepare your order immediately after payment is confirmed and keep you updated every step of the way.</p>
                </article>
                <article className="shipping-card">
                    <h3>Tracking made easy</h3>
                    <p>Track your package in real time with our shipment tracking and receive status alerts by email.</p>
                </article>
                <article className="shipping-card">
                    <h3>Delivery guarantee</h3>
                    <p>Our delivery partners are selected for speed and care, ensuring your products arrive safely and on time.</p>
                </article>
            </section>

            <section className="shipping-info-panel">
                <div className="info-column">
                    <h3>Delivery areas</h3>
                    <p>We deliver nationwide with coverage for all major cities and most surrounding regions.</p>
                </div>
                <div className="info-column">
                    <h3>Return policy</h3>
                    <p>If your purchase isn’t right, return it within 30 days for a full refund with easy return instructions.</p>
                </div>
            </section>

            <section className="shipping-checklist">
                <h2>What to expect</h2>
                <ul>
                    <li><strong>Order confirmation:</strong> email sent immediately after checkout.</li>
                    <li><strong>Preparation:</strong> your items are packed and handed to our courier in 1 business day.</li>
                    <li><strong>Shipping:</strong> standard or express delivery with tracking available.</li>
                    <li><strong>Delivery:</strong> arrive within the selected timeframe, safely and on schedule.</li>
                </ul>
            </section>

            

        </main>

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