import React from "react"
import footer from '../media/footer.png';
import { Link } from "react-router-dom";
import useAuth from '../globalProps/useAuth';
import '../styling/returnRefound.css';

export default function ReturnRefound(){

    const [openSection, setOpenSection] = React.useState('');
    
    const {token} = useAuth()

    let users=''
    
    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    const returnPolicy = [
        {
            id: 1,
            title: "30-Day Return Policy",
            description: "You can return most items within 30 days of purchase for a full refund if the product is unused and in original condition."
        },
        {
            id: 2,
            title: "Free Return Shipping",
            description: "We offer free return shipping on eligible items. Just contact our support team to get a prepaid return label."
        },
        {
            id: 3,
            title: "Inspection Process",
            description: "Once received, we inspect your item for quality and authenticity. Most refunds are processed within 5-7 business days."
        }
    ];

    const refundProcess = [
    {
        step: 1,
        title: "Contact Support",
        description: "Visit our Contact page and submit your return request with the product details"
    },
    {
        step: 2,
        title: "Request Review",
        description: "Our team reviews your request and verifies the order information"
    },
    {
        step: 3,
        title: "Return Instructions",
        description: "If approved, you'll receive detailed instructions for returning the item"
    },
    {
        step: 4,
        title: "Item Verification",
        description: "Once received, the returned item is inspected to confirm its condition"
    },
    {
        step: 5,
        title: "Refund Processed",
        description: "After approval, your refund will be issued to your original payment method"
    }
];

    const faqs = [
        {
            id: 1,
            question: "What items cannot be returned?",
            answer: "Customized or personalized items, items marked as final sale, and items damaged due to misuse cannot be returned."
        },
        {
            id: 2,
            question: "How long does the refund take?",
            answer: "After inspection, refunds are typically processed within 5-7 business days. Your bank may take an additional 1-2 business days to reflect the credit."
        },
        {
            id: 3,
            question: "Can I exchange an item instead of returning it?",
            answer: "Yes! You can request an exchange instead of a refund. We'll process your request and send the new item once we receive your return."
        },
        {
            id: 4,
            question: "What if my item arrives damaged?",
            answer: "Please report any damage within 48 hours of delivery with photos. We'll either send a replacement or issue a full refund."
        },
        {
            id: 5,
            question: "Can I return items bought on sale?",
            answer: "Yes, sale items can be returned for the price you paid. The refund will match your purchase price, not the original retail price."
        }
    ];

    const [expandedFaq, setExpandedFaq] = React.useState(null);

    return (
        <div className="return-refund-container">
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

            <div className="rr-content">
                {/* Policy Highlights */}
                <section className="rr-section">
                    <h2>Our Policy Highlights</h2>
                    <div className="rr-highlights">
                        {returnPolicy.map(policy => (
                            <div key={policy.id} className="rr-highlight-card">
                                <div className="rr-card-icon">
                                    <span>✓</span>
                                </div>
                                <h3>{policy.title}</h3>
                                <p>{policy.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Return Process Steps */}
                <section className="rr-section">
                    <h2>How to Return an Item</h2>
                    <div className="rr-process">
                        {refundProcess.map(item => (
                            <div key={item.step} className="rr-process-item">
                                <div className="rr-step-number">{item.step}</div>
                                <div className="rr-step-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                                {item.step < refundProcess.length && <div className="rr-step-divider"></div>}
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="rr-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="rr-faq">
                        {faqs.map(faq => (
                            <div key={faq.id} className="rr-faq-item">
                                <button 
                                    className="rr-faq-question"
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                >
                                    <span>{faq.question}</span>
                                    <span className={`rr-faq-toggle ${expandedFaq === faq.id ? 'active' : ''}`}>+</span>
                                </button>
                                {expandedFaq === faq.id && (
                                    <div className="rr-faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Support */}

                {/* Quick Action */}

                {token && (
                    <section className="rr-section">
                        <div className="rr-action">
                            <h2>Start a Return</h2>
                            <p>Ready to return an item? Visit your orders to initiate the process</p>
                            <Link to="/order" className="rr-btn-primary">
                                View My Orders
                            </Link>
                        </div>
                    </section>
                )}
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