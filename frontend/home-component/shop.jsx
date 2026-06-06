import React from "react";
import "../styling/shop.css";
import { Link } from "react-router-dom";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();

import useAuth from '../globalProps/useAuth';
import footer from '../media/footer.png';

import img1 from "../media/header.png"

const categories = [
  {
    label:'All Categories',
    value:''
  },

  {
    label:'Console',
    value:'console'
  },

  {
    label:'Laptop',
    value:'laptop'
  },

  {
    label:'Setup',
    value:'setup'
  },

  {
    label:'Accessory',
    value:'accessory'
  },

  {
    label:'Video Game',
    value:'video_game'
  }
];

const sortOptions = [
  {
    label:'All',
    value:''
  },
  {
    label:'Best Seller',
    value:'-sold'
  },

  {
    label:'New Arrival',
    value:'-createdAt'
  },

  {
    label:'Most Viewed',
    value:'-views'
  },

  {
    label:'Trending Now',
    value:'-sold -views -createdAt'
  },
];

const availabilityOptions = [
  {
    label: 'All',
    value:''
  },
  {
    label:'In Stock',
    value:'active'
  },

  {
    label:'soon in stock',
    value:'out_of_stock'
  }
];

export default function Shop() {
  const [products , setProducts] = React.useState({})
  const [selected, setSelected] = React.useState({category:'' , filter:'' , status:'' , search:'' , gtePrice:'' , ltePrice:''});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [numOfPages, setNumOfPages] = React.useState(1);
  const [openSection, setOpenSection] = React.useState('');
  
   const {token} = useAuth()
  
  let users=''
  
  if(token){
    const decoded=jwtDecode(token)
    users=decoded
    }

  React.useEffect(()=>{
    const params = new URLSearchParams({...selected , page: currentPage}).toString()
    const productsCustomer = async()=>{
      try{
        const {data} = await apiClient.get(`/products/customer/?${params}`)
        setProducts(data)
        setNumOfPages(data.numOfPages)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    productsCustomer();
  },[selected , currentPage])  
   
  function handleInput(e){
    const {name , value} = e.currentTarget 

    setSelected(prev=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }

  const getPageButtons = () => {
      const pages = [];

      if (numOfPages <= 5) {
        for (let i = 1; i <= numOfPages; i++) {
            pages.push(i);
        }
      } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(numOfPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }

        if (currentPage < numOfPages - 2) {
            pages.push('...');
        }

        pages.push(numOfPages);
      }

    return pages;
    };

  return (
    <div className="shop-home-container">

      <div className="header">
      
                      <h1 onClick={()=>setComponent('home')}>MINKIY</h1>
                      <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
                      <label htmlFor="nav-toggle" className="nav-toggle-btn"><i className="fa-solid fa-bars"></i></label>
                      <div className="home-component">
                          <div className="home-component-flex">
                              <Link to="/" className="link"><p className="style-component">Home</p></Link>
                              <Link to="/shop" className="link"><p className="style-component active-component">Shop</p></Link>
                              <Link to="/contact" className="link"><p className="style-component" className="link">Contact</p></Link>
                              <Link to="/aboutUs" className="link"><p className="style-component" className="link">About Us</p></Link>
                          </div>
      
                          <div className="web-info"> 
                              {token ? <Link to="/account"><i className="fa-regular fa-circle-user icon"></i></Link> : <Link to="/login" target="_blank"><i className="fa-regular fa-circle-user icon"></i></Link>}
                              {users.role !=='seller' && <Link to="/cart" target="_blank"><i className="fa-solid fa-cart-arrow-down icon"></i></Link>}
                          </div>
                      </div>
                      
      
                  </div>

      <div className="header-shop">
        <img src={img1} alt="Shop hero"/>
        <div className="header-shop-info">
          <span>Gaming Store</span>
          <h1>Shop</h1>
          <p>Explore curated gear, accessories, and new releases for every player.</p>
        </div>
      </div>

      <div className="shop-content">
        <aside className="shop-sidebar">

          <div className="shop-select-filter">
            <select name="category" id="" className="shop-filter-select" onChange={handleInput}>
              <option value="" disabled defaultValue>Select Categories</option>
              <option value="">All Category</option>
              <option value="console">Console</option>
              <option value="laptop">Laptop</option>
              <option value="setup">Setup</option>
              <option value="accessory">Accessory</option>
              <option value="video_game">Video Game</option>
            </select>
          </div>

          <div className="shop-filter-box">
            <h3>Categories</h3>
            <div className="filter-pill-group">
              {categories.map((category) => (
                <button
                  className={`filter-pill ${selected.category === category.value ? "active" : ""}`}
                  onClick={() => setSelected(prev=>{return{...prev , category:category.value}})}
                  type="button"
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-select-filter">
            <select name="filter" id="" className="shop-filter-select" onChange={handleInput}>
              <option value="" disabled defaultValue>Sort By</option>
              <option value="">All Products</option>
              <option value="-sold">Best Seller</option>
              <option value="-createdAt">New Arrival</option>
              <option value="-views">Most Viewed</option>
              <option value="-sold -views -createdAt">Trending Now</option>
            </select>
          </div>

          <div className="shop-filter-box">
            <h3>Sort by</h3>
            <div className="filter-pill-group">
              {sortOptions.map((option) => (
                <button
                  className={`filter-pill ${selected.filter === option.value ? "active" : ""}`}
                  onClick={() => setSelected(prev=>{return { ...prev , filter:option.value}})}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-select-filter">
            <select name="status" id="" className="shop-filter-select" onChange={handleInput}>
              <option value="" disabled defaultValue>Availability</option>
              <option value="">All</option>
              <option value="active">In Stock</option>
              <option value="out_of_stock">soon in stock</option>
            </select>
          </div>

          <div className="shop-filter-box">
            <h3>Availability</h3>
            <div className="filter-pill-group">
              {availabilityOptions.map((option) => (
                <button
                  className={`filter-pill ${selected.status === option.value ? "active" : ""}`}
                  onClick={() => setSelected(prev=>{return{...prev , status:option.value}})}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-filter-box">
            <h3>Price</h3>
            <div>
              <label htmlFor="gtePrice">Great Than:</label>
              <input type="number" name="gtePrice" id="gtePrice" onChange={handleInput}/>
            </div>
            <div>
              <label htmlFor="ltePrice">Less Than:</label>
              <input type="number" name="ltePrice" id="ltePrice" onChange={handleInput}/>
            </div>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-toolbar">
            <div>
              <h2>Featured products</h2>
              <p className="toolbar-copy">Filtered results for the latest gaming collection.</p>
            </div>

            <div className="shop-search">
              <input
                type="search"
                name='search'
                value={selected.search}
                onChange={(event) =>  setSelected(prev=>{return{...prev , search:event.target.value}})}
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="shop-grid">
            {products.products?.length > 0 ? (
              products.products.map((product) => (
                <article key={product._id} className="shop-product-card">
                  <div className="product-card-badge">{product.category}</div>
                  <img src={product.image} alt={product.name} />
                  <div className="shop-product-copy">
                    <h3>{product.name}</h3>
                    <div className="shop-product-meta">
                      <span className="price">${product.price}</span>
                      <div className="info-div-pro">
                        <span className={`stock ${product.status.replace(" ", "-").toLowerCase()}`}>
                          {product.status}
                        </span>
                        <button className="customer-product-info"><Link to={`/allInfo/${product._id}`} target="_blank"><i className="fa-solid fa-eye view-pro"></i></Link></button>
                      </div>
                      
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms to see more items.</p>
              </div>
            )}
          </div>

          <div className="pagination-div-customer">
            <div>
              <p>Showing 1 to 8 of {products.products?.length} Products</p>
            </div>

            <div>
            {getPageButtons().map((item, index) => {
              if (item === '...') {
                return <span key={index}>...</span>;
              }

              return (
                <button key={index} onClick={() => setCurrentPage(item)} className={`button-pag-customer ${currentPage === item ? 'active-pag-customer' : ''}`}>{item}</button>
              );
            })}
            </div>

          </div>

        </main>

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
  );
}
