import React from "react";
import fast from '../media/delivery.jpg'
import secure from '../media/secure.png'
import analytics from '../media/analytic.jpg'
import support from '../media/support.jpg'
import admin from '../media/admin.png'

export default function TopProduct(){
    const [currentIndex , setCurrentIndex] = React.useState(0)

    const WhyUs = [
  {
    id: 1,
    img: {fast},
    name: 'Fast & Reliable Delivery',
    description:
      'Get your products delivered quickly and safely with our trusted shipping system. We make sure every order reaches customers on time.',
  },
  {
    id: 2,
    img: {secure},
    name: 'Secure Payement',
    description:
      'Shop with confidence using our protected payment methods and advanced security features for safe online transactions.',
  },
  {
    id: 3,
    img: {analytics},
    name: 'Powerful Seller Dashboard',
    description:
      'Sellers can easily manage products, orders, and analytics with a modern dashboard designed to grow their business faster.',
  },
  {
    id: 4,
    img: {support},
    name: '24/7 Customer Support',
    description:
      'Our support team is always ready to help buyers and sellers with any issue to ensure the best marketplace experience.',
  },
  {
    id: 5,
    img: {admin},
    name: 'Advanced Admin Management',
    description:
      'Admins have full control over users, products, reports, and platform activities to maintain a secure and professional marketplace.',
  },
];

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % WhyUs.length);
  };

  const previusProduct = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1 , 0) % WhyUs.length);
  };

  return(
    
        <div className="func1-cont">
            <button className="btn-pro" onClick={previusProduct}><i className="fa-solid fa-chevron-left"></i></button>

            <div className="func1">

                {WhyUs[currentIndex] && (
                <>
                    <img className="img2" src={WhyUs[currentIndex].img} alt="" />
                    <h3>{WhyUs[currentIndex].name}</h3>
                    <p className="product-desc">{WhyUs[currentIndex].description}</p>
                </>
                )}     
            </div>

            <button className="btn-pro" onClick={nextProduct}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
    
  )
}