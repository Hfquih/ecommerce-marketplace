import React from "react"
import HomePage from "../home-component/homePage"
import { jwtDecode } from "jwt-decode"
import { ShoppingBag } from "lucide-react"
import Contact from "../home-component/contact"
import AboutUs from "../home-component/aboutUs"
import Shop from "../home-component/shop"
import { Link } from 'react-router-dom'
import useAuth from '../globalProps/useAuth';

export default function Home(){

    const [component , setComponent] = React.useState('home')

    const {token} = useAuth()

    let users=''

    if(token){
        const decoded=jwtDecode(token)
        users=decoded
    }

    return(
        <div className="container"> 

            <div className="header">

                <h1><Link className="link" to="/">MINKIY</Link></h1>
                <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
                <label htmlFor="nav-toggle" className="nav-toggle-btn"><i className="fa-solid fa-bars"></i></label>
                <div className="home-component">
                    <div className="home-component-flex">
                        <p className={`style-component ${component==='home' ? 'active-component' : ''}`} onClick={()=>setComponent('home')}>Home</p>
                        <p className={`style-component ${component==='shop' ? 'active-component' : ''}`} onClick={()=>setComponent('shop')}>Shop</p>
                        <p className={`style-component ${component==='contact' ? 'active-component' : ''}`} onClick={()=>setComponent('contact')}>Contact</p>
                        <p className={`style-component ${component==='about-us' ? 'active-component' : ''}`} onClick={()=>setComponent('about-us')}>About Us</p>
                    </div>

                    <div className="web-info"> 
                        {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon"></i></Link> : <Link to="/login" target="_blank"><i className="fa-regular fa-circle-user icon"></i></Link>}
                        {users.role !=='seller' && <Link to="/cart" target="_blank"><i className="fa-solid fa-cart-arrow-down icon"></i></Link>}
                    </div>
                </div>
                

            </div>

           {component==='home' && <HomePage setComponent={setComponent}/>}

           {component==='shop' && <Shop/>}

           {component==='contact' && <Contact/>}

           {component==='about-us' && <AboutUs/>}

           <div className="footer">
                    <div className="footer-brand">
                        <h2><a className="link" href="/">MINKIY</a></h2>
                        <p>Professional gaming marketplace for gamers, collectors and modern players.</p>
                        <p className="footer-note">Fast support, secure checkout, and curated products crafted for every gaming enthusiast.</p>
                    </div>
                    <div className="footer-links">
                        <div>
                            <h3>Quick links</h3>
                            <Link to="/">Home</Link>
                            <p onClick={()=>setComponent('about-us')}>About Us</p>
                            <p onClick={()=>setComponent('contact')}>Contact</p> 
                            <p onClick={()=>setComponent('shop')}>Products</p>
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