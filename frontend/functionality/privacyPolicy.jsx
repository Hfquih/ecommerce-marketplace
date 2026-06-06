import '../styling/privacyPolicy.css';
import React from "react"
import { jwtDecode } from "jwt-decode"
import { Link } from 'react-router-dom'
import useAuth from '../globalProps/useAuth';
import footer from '../media/footer.png';

export default function PrivacyPolicy() {
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
    
                    <Link to="/" className="link"><h1>MINKIY</h1></Link>
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
    
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-hero__content">
          <span className="privacy-hero__label">Privacy Policy</span>
          <h1>Committed to your privacy and data safety</h1>
          <p>
            We collect only the information needed to personalize your experience and fulfill your orders.
            Your data is handled securely, transparently, and only for the purposes described below.
          </p>
        </div>
      </section>

      <section className="privacy-sections">
        <article className="privacy-card">
          <h2>What We Collect</h2>
          <p>
            We may collect information such as your name, email address, shipping address, payment details,
            and order history. This helps us deliver products and support your shopping journey.
          </p>
          <ul>
            <li>Account and contact details</li>
            <li>Purchase and order history</li>
            <li>Shipping, billing, and payment information</li>
            <li>Customer service communications</li>
          </ul>
        </article>

        <article className="privacy-card">
          <h2>How We Use It</h2>
          <p>
            Your information is used to process orders, provide customer support, improve our services,
            and keep you informed about updates that matter to you.
          </p>
          <ul>
            <li>Process orders and manage returns</li>
            <li>Provide personalized shopping recommendations</li>
            <li>Send relevant account and order notifications</li>
            <li>Improve site performance and security</li>
          </ul>
        </article>

        <article className="privacy-card">
          <h2>Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies to make the website faster and more intuitive.
            This includes remembering preferences, analyzing traffic, and securing your sessions.
          </p>
          <ul>
            <li>Essential cookies for checkout and login</li>
            <li>Performance cookies for analytics and optimization</li>
            <li>Preference cookies for a tailored experience</li>
          </ul>
        </article>

        <article className="privacy-card">
          <h2>Security & Your Rights</h2>
          <p>
            We protect your data with technical and organizational safeguards. You can also review,
            update, or request deletion of your information at any time.
          </p>
          <ul>
            <li>Secure storage and encrypted communication</li>
            <li>Access or correction of your personal data</li>
            <li>Request data deletion whenever needed</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </article>
      </section>

      <section className="privacy-banner">
        <div>
          <h2>Questions about privacy?</h2>
          <p>
            If you need more information or wish to update your preferences, contact our support team.
            We take your privacy seriously and are here to help.
          </p>
        </div>
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
  );
}
