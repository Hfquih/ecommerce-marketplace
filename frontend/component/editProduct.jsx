import axios from "axios"
import React from "react"
import { useParams } from "react-router-dom"
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';
import globalError from "../globalProps/globalError";

export default function EditProduct(){
    const [produtsInfo , setProductsInfo] = React.useState({})

    const [errors , setErrors] = React.useState({})

    const [alert , setAlert] = React.useState({msg:'' , field:false , success:false , error:false})

    const {id} = useParams()

    const {token}=useAuth()

    React.useEffect(()=>{
        const getProductInfo = async()=>{
            try{
                const {data} = await apiClient.get(`/products/${id}` , {headers:{Authorization : `Bearer ${token}`}})
                setProductsInfo(data.products)
            }catch(error){
                console.log(error)
            }
        }
        getProductInfo()
    },[])
 
    function handleInput(e){
        const {name , value} = e.currentTarget

        setProductsInfo(prevtProduct=>{
            return{
                ...prevtProduct,
                [name]:value
            }
        })

        setErrors(prevError=>{
            return{
                ...prevError,
                [name]:''
            }
        })
    }

    async function handleImage(e){
        try{ 
        const imageFile=e.target.files[0]
        const formData= new FormData()
        formData.append('image' , imageFile)

        const {data : {image : {src}}} = await apiClient.post('/products/upload' , formData)

        setProductsInfo(prevProduct=>{
            return{
                ...prevProduct,
                image:src
            }
        })
        }catch(error){
            setProductsInfo(prevProduct=>{
            return{
                ...prevProduct,
                image:''
            }
        })
        console.log(error)
        }
        
    }

    async function handleForm(e){
        e.preventDefault()
        if(!checkInputs()) return 

        try{
            const {data} = await apiClient.patch(`/products/${id}` , produtsInfo , {headers:{Authorization : `Bearer ${token}`}})
            formSuccess(data)
        }catch(error){
            globalError(error , setErrors , setAlert)
        }
    }

    function formSuccess(data){
        setAlert({msg:data.msg, field:true, success:true, error:false})

        setProductsInfo({
            image:"",
            name:"",
            description:"",
            price:null,
            stock:null,
            discount:null,
            discountType:null,
            category:""
        })

        setTimeout(()=>{
            setAlert({msg:'', field:false, success:false, error:false})
        },3000)
    }

    function checkInputs(){
        const requiredFields = ["image", "name", "description", "price", "stock", "category"]

        let verified={}
        requiredFields.forEach((field)=>{
            const value = produtsInfo[field]

            if((typeof value === "string" && value.trim() === "")  || value === null || (typeof value === "number" && value === 0)){
                return verified[field] = `${capitalize(field)} is required`
            }
        })

        setErrors(verified)

        setAlert({msg:'' , field:true , error:true , success:false})

        setTimeout(()=>{
            setAlert({msg:'' , field:false , error:false , success:false})
        },3000)

        return Object.keys(verified).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    return(
        <div>

        <div className="add-container">
            <form onSubmit={handleForm}>

                <div className="header-add">
                    <h1><span><i className="fa-solid fa-shop"></i></span> Edit Product</h1>
                    <button type="submit" className="add-products">Edit Products</button>
                </div>

                <div className="products-info">

                    <div className="container-1">
                        <div className="general-info">
                            <h2>Generale Informations</h2>
                             
                            <div className="div-controle">
                                <label htmlFor="name">Name Products</label>
                                <input value={produtsInfo.name} className={alert.success ? 'border-success' : errors.name ? 'border-error' : ''} type="text" name="name" id="name" onChange={handleInput} placeholder="Ex: PSP"/>
                                {errors.name && <small>{errors.name}</small>}
                            </div>
                            
                            <div className="div-controle">
                                <label htmlFor="description">Description Products</label>
                                <textarea value={produtsInfo.description} className={alert.success ? 'border-success' : errors.description ? 'border-error' : ''} name="description" id="description" onChange={handleInput} placeholder="Add description for your product"></textarea>
                                {errors.description && <small>{errors.description}</small>}
                            </div>
                            
                        </div>

                        <div className="pricing-stock">
                            <h2>Pricing And Stock</h2>
                            
                            <div className="pricing-flex">
                                <div style={{width:450 , marginRight:10}} className="div-controle">
                                    <label htmlFor="price">Base Pricing in USD</label>
                                    <input value={produtsInfo.price ?? ""} className={alert.success ? 'border-success' : errors.price ? 'border-error' : ''} type="number" name="price" id="price" onChange={handleInput}/>
                                    {errors.price && <small>{errors.price}</small>}
                                </div>

                                <div style={{width:450}} className="div-controle">
                                    <label htmlFor="stock">Stock</label>
                                    <input value={produtsInfo.stock ?? ""} className={alert.success ? 'border-success' : errors.stock ? 'border-error' : ''} type="number" name="stock" id="stock" onChange={handleInput}/>
                                    {errors.stock && <small>{errors.stock}</small>}
                                </div>
                            </div> 

                        </div>
                    </div>



                    <div className="container-2">

                        <div className="image-div">
                            <h2>Upload Img</h2>
                            <div className="span">{produtsInfo.image && <img className="new-image" src={produtsInfo.image} alt="" />}</div>
                            <div className="div-controle">
                                <label htmlFor="image">Select Image</label>
                                <input className={alert.success ? 'border-success' : errors.image ? 'border-error' : ''} type="file" name="image" id="image" accept="image/*" onChange={handleImage}/>
                                {errors.image && <small>{errors.image}</small>}
                            </div>
                            
                        </div>

                        <div className="category-div">
                            <h2>Category</h2>
                            
                            <div className="div-controle" style={{padding:20}}>
                                <select value={produtsInfo.category} name="category" className={`select ${alert.success ? 'border-success' : errors.category ? 'border-error' : ''}`} onChange={handleInput}>
                                    <option value="" disabled>-- Select a category --</option>
                                    <option value="old-game">Old Game</option>
                                    <option value="new-game">New Game</option>
                                    <option value="general-category">General Category</option>
                                </select>
                                {errors.category && <small>{errors.category}</small>}
                            </div>
                            

                        </div>
                    </div>

                </div>

                {alert.field && <p className={`alert ${alert.error ? 'text-error' : alert.success ? 'text-success' : ''}`}>{alert.msg}</p>}

            </form>

            

        </div>

        </div>
        
    )
}