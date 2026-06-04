import React from "react";
import ShowAllProducts from "../functionality/showAllProducts";
import AllInfo from "./allInfo";
import '../styling/allProducts.css'
import { nanoid } from "nanoid";
import axios from "axios";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';


export default function ViewProducts(){
    const [allProducts , setAllProducts] = React.useState([])
    const [alert , setAlert] = React.useState({msg:'' , field:false , error:false , success:false})
    const {token} = useAuth()

    React.useEffect(()=>{
        const fetchProducts = async()=>{
            try{
                const {data} = await apiClient.get('/products' , {headers:{Authorization:`Bearer ${token}`}}) 
                setAllProducts(data.products)
            }catch(error){
                console.log(error)
            }
        }
        fetchProducts();
    },[])

    const mapProducts = allProducts.map((products)=>{
        return <ShowAllProducts key={nanoid()}  productId={products._id} {...products} userDeleteProducts={userDeleteProducts}/>
    })

    async function userDeleteProducts(id){
        try{
            const {data} = await apiClient.patch(
                `/products/delete-product-user/${id}`,
                {},
                {headers : {Authorization : `Bearer ${token}`}}
            )

            setAllProducts(prev => prev.filter((pro)=> pro._id !==id))

            setAlert({msg:data.msg , field:true , success:true , error:false})

            setTimeout(()=>{
                setAlert({msg:'' , field:false , success:false , error:false})
            },3000)
        }catch(error){
            console.log(error)
            setAlert({msg:error.response?.data.msg || 'SOMETHING WONT WRONG' , field:true , success:false , error:true})

            setTimeout(()=>{
                setAlert({msg:'' , field:false , success:false , error:false})
            },3000)
        }
    }

    return(
        <div>

            <div className="allProducts-container">
                <p>PRODUCTS</p>
                <h1>All Your Products</h1>
                <div className="products-container">{mapProducts}</div>
                {alert.field && <p style={{marginTop:20}} className={alert.error ? 'text-error' : alert.success ? 'text-success' : ''}>{alert.msg}</p>}
            </div>    

        </div>
    )
}