import React from "react"
import '../styling/aboutUs.css'

export default function AboutUs(){
    
    const token = localStorage.getItem('token')

    return(
        <div className="about-page">

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
                    <img src="../media/img7.png" alt="Gaming collection" />
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
            
        </div>
    )
}
