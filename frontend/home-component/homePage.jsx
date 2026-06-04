import TopProduct from "../functionality/topProduct"
import categories from "../categories"
import filtering from "../filtering"
import ProductCarousel from "../functionality/slideProducts"
import { Link } from 'react-router-dom'

export default function HomePage(props){
    
    const category = categories.map((category)=>{
        return (
            <div className="home-page-category-img">
                <img src={category.img.src} alt={category.img.src} />
                <p>{category.category}</p>
            </div>
        )
    })

    const filter = filtering.map((filter)=>{
        return(
            <div className="home-page-layout-filter-relative">
                <img src={filter.img.src} alt={filter.img.alt} />
                <div className="home-page-layout-filter-info">
                    <h1>{filter.title}</h1>
                    <p>{filter.description}</p>
                    <button className="filter-explore-btn" onClick={()=>props.setComponent('shop')}>Explore</button>
                </div>
            </div>
        )
    })

    return(
    <div>
        <div className="img-container">    
            <video className="video" autoPlay loop muted>
                <source src="../media/vid1.mp4"></source>
            </video>
            </div>
        
            <div className="body-container">
                <div className="body1">
                    <h1 style={{marginBottom:20}}>Welcome To Our Store</h1>
                    <p>« Découvrez un morceau d’histoire avec cette pièce rare et intemporelle. Soigneusement conservée et sélectionnée à la main, chaque création raconte sa propre histoire, reflétant l’artisanat et le caractère d’une époque révolue. Parfaite pour les collectionneurs, les passionnés ou toute personne souhaitant posséder un fragment du passé, cette pièce allie nostalgie et authenticité, apportant charme et sophistication à votre espace ou collection. »</p>
                </div>
                        
                <div className="center-top"><TopProduct/></div>
                        
            </div>

            <div id="category" style={{padding:20}}>
                <h1 style={{textAlign:'center'}}>Categories</h1>
                <div className="home-page-category">   
                    {category}
                </div>
            </div>

            <div className="home-page-layout0">
                <img src="../media/layout2.png" alt="" />
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
                <img src="../media/layout.png" alt="" />
                <div className="home-page-layout1-info">
                    <h1>THE ULTIMATE <span style={{color:'gold'}}>GAMING</span> MARKETPLACE FOR EVERYONE </h1>
                    <p>A secure and powerfull platform connecting gamers, sellers, and trusted partners worldwide.</p>
                    <div className="home-page-layout1-btn">
                        <button className="explore-cat-btn" onClick={()=>props.setComponent('shop')}>Explore Products <i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>

            <div className="home-page-layout-filter">
                {filter}
            </div>

            <div className="home-page-layout3">
                <img src="../media/beSeller.jpg" alt="" />
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
                                description: 'Verified vendors, curated product quality, and consistent reviews.'
                            },
                            {
                                icon: '⚡',
                                title: 'Fast & Reliable',
                                description: 'Built for speed, simplicity, and reliability, our marketplace delivers a smooth gaming experience for buyers and sellers.'
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
    
    )
}