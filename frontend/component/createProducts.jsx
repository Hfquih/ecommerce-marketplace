import React from "react";
import '../styling/createProducts.css'
import axios from "axios";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';
import globalError from '../globalProps/globalError';

export default function CreateProducts(){
    const [addProducts , setProducts] = React.useState({
        image:"",
        name:"",
        description:"",
        price:null,
        stock:null,
        category:""
    })

    const [alert , setAlert] = React.useState({
        msg:'' , field:'' , success:'' , error:''
    })

    const [errors , setErrors] = React.useState({})

    const {token} = useAuth()

    function handleInput(event){
        const {name , value}=event.currentTarget 

        setProducts(prevProducts => {
            return{
                ...prevProducts,
                [name]: name==='price' || name==='stock' || name==='discount' ? Number(value) : value
            }
        })

        setErrors(prevErrors=>{
            return{
                ...prevErrors,
                [name]:''
            }
        })
    }

    async function handleImage(event){
        try{
        
            const imageFile=event.target.files[0]
            const formData=new FormData()
            formData.append('image' , imageFile)

            const {data:{image:{src}}}=await apiClient.post('/products/upload' , formData , {headers:{Authorization:`Bearer ${token}`}})
            console.log(src)
            setProducts(prevProducts=>{
                return{
                    ...prevProducts,
                    image:src
                }
            })
        }catch(error){
            setProducts(prevProducts=>{
                return{
                    ...prevProducts,
                    image:''
                }
            })
            globalError(error , setErrors , setAlert)
        }   
    }

    async function handleForm(event){
        
        event.preventDefault()
        if(!checkInputs()){
            console.log("validation failed")
            return
        }  

        try{
            const {data} = await apiClient.post(
                '/products' ,
                addProducts , 
                {headers:{Authorization:`Bearer ${token}`}}
            )
            console.log(data)
            formSuccess(data)
        }catch(error){
            globalError(error , setErrors , setAlert)
        } 
    }

    function formSuccess(data){
        setAlert({
            msg:data.msg,
            field:true,
            success:true,
            error:false
        })

        setProducts({
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
            setAlert({msg:'' , field:false , success:false , error:false})
        },4000)
    }


    function checkInputs(){
        const requiredFields = [
        "image",
        "name",
        "description",
        "price",
        "stock",
        "category"
    ]
        let verified={}
        
        requiredFields.forEach((field)=>{
            const value = addProducts[field]
            if((typeof value === "string" && value.trim() === "")  || value === null || (typeof value === "number" && value === 0)){
                return verified[field] = `${capitalize(field)} is required`
            }
        })
        setErrors(verified)

        setAlert({field:true , error:true , success:false})

        setTimeout(()=>{
            setAlert({msg:'' , field:false , success:false , error:false})
        },3000)

        return Object.keys(verified).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    return(
        <div>

            <div className="add-container">
                <form onSubmit={handleForm}>

                <div className="header-add">
                    <h1><span><i className="fa-solid fa-shop"></i></span> Add New Products</h1>
                    <button type="submit" className="add-products">Add Products</button>
                </div>

                <div className="products-info">

                    <div className="container-1">
                        <div className="general-info">
                            <h2>Generale Informations</h2>
                             
                            <div className="div-controle">
                                <label htmlFor="name">Name Products</label>
                                <input value={addProducts.name} className={alert.success ? 'border-success' : errors.name ? 'border-error' : ''} type="text" name="name" id="name" onChange={handleInput} placeholder="Ex: PSP"/>
                                {errors.name && <small>{errors.name}</small>}
                            </div>
                            
                            <div className="div-controle">
                                <label htmlFor="description">Description Products</label>
                                <textarea value={addProducts.description} className={alert.success ? 'border-success' : errors.description ? 'border-error' : ''} name="description" id="description" onChange={handleInput} placeholder="Add description for your product"></textarea>
                                {errors.description && <small>{errors.description}</small>}
                            </div>
                            
                        </div>

                        <div className="pricing-stock">
                            <h2>Pricing And Stock</h2>
                            
                            <div className="pricing-flex">
                                <div style={{width:450 , marginRight:10}} className="div-controle">
                                    <label htmlFor="price">Base Pricing in USD</label>
                                    <input value={addProducts.price ?? ""} className={alert.success ? 'border-success' : errors.price ? 'border-error' : ''} type="number" name="price" id="price" onChange={handleInput}/>
                                    {errors.price && <small>{errors.price}</small>}
                                </div>

                                <div style={{width:450}} className="div-controle">
                                    <label htmlFor="stock">Stock</label>
                                    <input value={addProducts.stock ?? ""} className={alert.success ? 'border-success' : errors.stock ? 'border-error' : ''} type="number" name="stock" id="stock" onChange={handleInput}/>
                                    {errors.stock && <small>{errors.stock}</small>}
                                </div>
                            </div> 

                        </div>
                    </div>



                    <div className="container-2">

                        <div className="image-div">
                            <h2>Upload Img</h2>
                            <div className="span">{addProducts.image && <img className="new-image" src={addProducts.image} alt="" />}</div>
                            <div className="div-controle">
                                <label htmlFor="image">Select Image</label>
                                <input className={alert.success ? 'border-success' : errors.image ? 'border-error' : ''} type="file" name="image" id="image" accept="image/*" onChange={handleImage}/>
                                {errors.image && <small>{errors.image}</small>}
                                {alert.field && alert.error && <p className="text-error">{alert.msg}</p>}
                            </div>
                            
                        </div>

                        <div className="category-div">
                            <h2>Category</h2>
                            
                            <div className="div-controle" style={{padding:20}}>
                                <select value={addProducts.category} name="category" className={`select ${alert.success ? 'border-success' : errors.category ? 'border-error' : ''}`} onChange={handleInput}>
                                    <option value="" disabled>-- Select a category --</option>
                                    <option value="video_game">Video Game</option>
                                    <option value="console">Console</option>
                                    <option value="laptop">Laptop</option>
                                    <option value="setup">Setup</option>
                                    <option value="accessory">Accessory</option>
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

