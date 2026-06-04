import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function AdminProducts(){

    const [products, setProducts] = React.useState({})

    const [selectedProductId , setSelectedProductId] = React.useState(null)

    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})

    const [filter , setFilter] = React.useState({category:'' , status:''})

    const [dataCount , setDataCount] = React.useState({})

    const [currentPage, setCurrentPage] = React.useState(1);
    
    const [numOfPages, setNumOfPages] = React.useState(1);

    const {token} = useAuth()

    React.useEffect(()=>{
      const params = new URLSearchParams({...filter , page: currentPage}).toString()
      const getProducts = async()=>{
        try{
          const {data} = await apiClient.get(`/products/admin/?${params}` , {headers:{Authorization : `Bearer ${token}`}})
          setProducts(data)
          setNumOfPages(data.numOfPages)
        }catch(error){
          console.log(error)
        }
      }
        getProducts()
    },[filter , currentPage]) 

    React.useEffect(()=>{
      const getDataCount = async()=>{
        try{
          const {data} = await apiClient.get(`/dashboard/admin-dashboard` , {headers:{Authorization : `Bearer ${token}`}})
          setDataCount(data)
        }catch(error){
          console.log(error)
        }
      }
      getDataCount()
    },[])

    const selectedProduct = products.products?.find((pro)=> pro._id === selectedProductId)

    function handleInput(e){
      const {name , value} = e.currentTarget 
       setFilter(prev=>{
        return{
          ...prev,
          [name]:value
        }
       })
    }

    async function deleteProducts() {
      if(!selectedProductId) return

      try{
        const {data} = await apiClient.patch(
          `/products/delete-product-admin/${selectedProductId}`,
          {},
          {headers : {Authorization : `Bearer ${token}`}}
        )

        setProducts(prev=>{
          return{
            ...prev,
            products:prev.products.map((pro)=>{
              return pro._id === selectedProductId ? {...pro , status:'disabled'} : pro
            })
          }
        })

        if(filter.status==='active'){
          setProducts(prev=>{
          return{
            ...prev,
            products:prev.products.filter((pro)=>{
              return pro._id !== selectedProductId
            })
          }
        })
        }

        setAlert({
          msg:data.msg , field:true , error:false , success:true
        })

        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , error:false , success:false
          })
        },3000)

      }catch(error){
        console.log(error)

        setAlert({
          msg:error.response?.data.msg || 'SOMETHING WONT WRONG' , field:true , error:true , success:false
        })

        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , error:false , success:false
          })
        },3000)
      }
    }

    async function restoreProducts() {
      if(!selectedProductId) return

      try{
        const {data} = await apiClient.patch(
          `/products/restore-product-admin/${selectedProductId}`,
          {},
          {headers : {Authorization : `Bearer ${token}`}}
        )

        setProducts(prev=>{
          return{
            ...prev,
            products:prev.products.map((pro)=>{
              return pro._id === selectedProductId ? {...pro , status:'active'} : pro
            })
          }
        })

        if(filter.status==='disabled'){
          setProducts(prev=>{
          return{
            ...prev,
            products:prev.products.filter((pro)=>{
              return pro._id !== selectedProductId
            })
          }
        })
        }

        setAlert({
          msg:data.msg , field:true , error:false , success:true
        })

        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , error:false , success:false
          })
        },3000)

      }catch(error){
        console.log(error)

        setAlert({
          msg:error.response?.data.msg || 'SOMETHING WONT WRONG' , field:true , error:true , success:false
        })

        setTimeout(()=>{
          setAlert({
            msg:'' , field:false , error:false , success:false
          })
        },3000)
      }
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


  return(
    <div className="dashboard-content">

      <header className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! </p>
        </div>
      </header>

      <section className="dashboard-general-info-product">
        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user"></i>
          <div>
            <p>{dataCount.totalProducts}</p>
            <p>Total Products</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user-tie"></i>
          <div>
            <p>{dataCount.activeProducts}</p>
            <p>Active Products</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-brands fa-product-hunt" ></i>
          <div>
            <p>{dataCount.disabledUser}</p>
            <p>Disabled Products</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-bag-shopping"></i>
          <div>
            <p>{dataCount.outOfStockProducts}</p>
            <p>Out Of Stock Products</p>
          </div>
        </div>

      </section>


      <div className="dashbord-second-info">
          <div className="table-order">

          <div className="filter-products"> 

            <select name="status" className="users-filter" onChange={handleInput}> 
                <option value="">All Product</option>
                <option value="active">Active Products</option>
                <option value="disabled">Disabled Products</option>
                <option value="out_of_stock">Out of Stock Products</option>
            </select>

            <select name="category" className="users-filter" onChange={handleInput}> 
                <option value="">All Category</option>
                <option value="laptop">Laptop</option>
                <option value="console">Console</option>
                <option value="setup">Setup</option>
                <option value="accessory">Accessory</option>
                <option value="video_game">Video Game</option>               
            </select>

            <button className="product-admin-add">Add Products</button>

          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.products?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.status}</td>
                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-action"><i className="fa-solid fa-eye" onClick={()=>setSelectedProductId(product._id)}></i></button>
                      <button className="btn-action"><Link className="link-admin" to={`/editProduct/${product._id}`} target='_blank'><i className="fa-solid fa-pen-to-square"></i></Link></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="pagination-div">
            <div>
              <p>Showing 1 to 8 of {dataCount.totalProducts} Products</p>
            </div>

            <div>
            {getPageButtons().map((item, index) => {
              if (item === '...') {
                return <span key={index}>...</span>;
              }

              return (
                <button key={index} onClick={() => setCurrentPage(item)} className={`button-pag ${currentPage === item ? 'active-pag' : ''}`}>{item}</button>
              );
            })}
            </div>

          </div>


          </div>
        </div> 

        <div className="show-admin-products">
            {selectedProduct ? (
              <div className="product-preview-card">
                <div className="product-preview-header">
                  <div>
                    <h2>{selectedProduct.name}</h2>
                    <p className="product-preview-category">{selectedProduct.category}</p>
                  </div>
                  <span className={`product-preview-status ${selectedProduct.status === 'active' ? 'active' : 'disabled'}`}>
                    {selectedProduct.status}
                  </span>
                </div>

                <div className="product-preview-body">

                  <div>
                    <div className="product-preview-image">
                    <img src={selectedProduct.image} alt={selectedProduct.name}/>
                  </div>

                  <div className="product-admin-btn">
                    <button className="product-edt-btn">Edit Product</button>
                    <button className="product-vw-btn">View On Store</button>
                    {selectedProduct.status==='active' && <button className="product-dlt-btn" onClick={deleteProducts}>Delete Product</button>}
                    {selectedProduct.status==='disabled' && <button className="product-rst-btn" onClick={restoreProducts}>Restore Product</button>}
                  </div>

                  {alert.field && <p className={alert.success ? 'text-success' : alert.error ? 'text-error' : ''} style={{textAlign:'center'}}>{alert.msg}</p>}
                  
                </div>
                  

                  <div className="product-preview-info">
                    <p className="product-preview-description">{selectedProduct.description}</p>

                    <div className="product-preview-grid">
                      <div>
                        <span>Price</span>
                        <strong>${selectedProduct.price}</strong>
                      </div>
                      <div>
                        <span>Stock</span>
                        <strong>{selectedProduct.stock}</strong>
                      </div>
                      <div>
                        <span>Discount</span>
                        <strong>{selectedProduct.discount ?? 'None'}</strong>
                      </div>
                      <div>
                        <span>Created</span>
                        <strong>{new Date(selectedProduct.createdAt).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    <div className="product-preview-meta">
                      <div>
                        <span>Product ID</span>
                        <p>{selectedProduct._id}</p>
                      </div>
                      <div>
                        <span>Created By</span>
                        <p>{selectedProduct.createdBy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="product-preview-empty">
                <p>Select a product from the table to view its details here.</p>
              </div>
            )}
          </div>

  </div>
  )
}