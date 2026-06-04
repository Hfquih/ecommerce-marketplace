import { nanoid } from 'nanoid'
import '../styling/checkout.css'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Seller from '../functionality/seller'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';
import globalError from '../globalProps/globalError';
import { MdOutlineAddShoppingCart } from 'react-icons/md'

export default function Checkout(){

    const [cart, setCart] = React.useState([])
    const [shippingType, setShippingType] = React.useState('')
    const [shippingFee, setShippingFee] = React.useState(0)
    const [errors , setErrors] = React.useState({})
    const [alert , setAlert] = React.useState({msg:'' , field:false , success:false , error:false})

    const [shippingAddress, setShippingAddress] = React.useState({
        fullName: '',
        phone: '',
        emailAddress:'',
        address: '',
        city: '',
        postalCode: null
    })

    const {token} = useAuth()

    React.useEffect(()=>{
        const getCart = async()=>{
            try{
                const {data} = await apiClient.get('/cart' , {headers:{Authorization : `Bearer ${token}`}})
                setCart(data.carts.items)
            }catch(error){
                console.log(error)
            }
        }
        getCart()
    },[])

    const mapCart = cart.map((cart)=>{
        return{
            product:cart.product._id ,
            amount:cart.amount,
        }
    })

    const itemMap = cart.map((cart)=>{
        return(
            <div key={nanoid()} className='summary-cart'>
                <img src={cart.product.image} alt="" />
                <div className='summary-cart-info'>
                    <p>{cart.product.name}</p>
                    <p>{`${cart.amount}x`}</p>
                    <p>{`price: ${cart.product.price} MAD`}</p>
                </div>
            </div>
        )
    })

    useEffect(()=>{
        if(shippingAddress.city==='Sale' || shippingAddress.city==='Rabat' || shippingAddress.city==='Kenitra'){
            setShippingFee(1)
        }
        else if(shippingAddress.city==="Casablanca" || shippingAddress.city==='El Jadida'){
            setShippingFee(1.5)
        }
        else if(shippingAddress.city===""){
            setShippingFee(0)
        }
        else{
            setShippingFee(2)
        }
    },[shippingAddress.city])
    

    const subTotal = cart.reduce((sum , item)=>{
        return sum + item.product.price * item.amount
    },0)

    const total = subTotal + shippingFee

    const handleInputs = (e)=>{
        const {name , value} = e.currentTarget

        if(name==='shippingType'){
            setShippingType(value)
        }

        setShippingAddress(prevAddress=>{
            return{
                ...prevAddress,
                [name]: name==='postalCode' ? Number(value) : value
            }
        })

        setErrors(prevErrors=>{
            return{
                ...prevErrors,
                [name]:''
            }
        })

    }

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        if(!checkInputs())return 

        if(cart.length===0){
            setAlert({msg:'cart empty' , field:true , success:false , error:true})
            return
        }
        
        try{
            
            const {data} = await apiClient.post('/order' , {item:mapCart , shippingType , shippingFee , shippingAddress} , {headers:{Authorization:`Bearer ${token}`}}) 
            

            if(shippingType==='bank payement'){
                const orderId = data.orders._id
                const res = await apiClient.post('/payement/stripePayement' , {item:[{orderId:orderId}]} ,{headers:{Authorization:`Bearer ${token}`}})
                if(res.data?.url){
                navigate(res.data.url)
                return
                }
            }

            showSuccess(data)

            setTimeout(()=>{
                navigate('/account')
            },2000)

        }catch(error){
            console.log(error)
            globalError(error , setErrors , setAlert)
        }
    }

    function showSuccess(data){
        setAlert({msg:data.msg , field:true , success:true , error:false})
        setTimeout(()=>{
            setAlert({msg:'' , field:false , success:false , error:false})
        },5000)
    }

    function checkInputs(){
        let check={}

        console.log('failed check inputs')

        if(!shippingType){
            check.shippingType = "Shipping type is required"
        }

        Object.entries(shippingAddress).forEach(([field , value])=>{
            if((typeof value === "string" && value.trim() === "")  || value === null || (typeof value === "number" && value === 0)){
                return check[field] = `${capitalize(field)} is required`
            }
        })
        setErrors(check)
        setAlert({msg:'' , field:true , success:false , error:true})

        setTimeout(()=>{
            setAlert({msg:'' , field:false , success:false , error:false})
        },5000)
        return Object.keys(check).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);


    return(
        <div>
            <div className="cart-header">

                <div className='cart-flex'>

                    <div className="cart-proccess">
                        <div className='div-style'><i className="fa-solid fa-check"></i></div>
                        <p>Cart</p>
                    </div>

                    <i className="fa-solid fa-angles-right next-icon"></i>

                    <div className="cart-proccess">
                        <div className='div-style'>2</div>
                        <p>Checkout</p>
                    </div>

                    <i className="fa-solid fa-angles-right"></i>

                    <div className="cart-proccess">
                        <div className='div-style'></div>
                        <p>Payement</p>
                    </div>
                    
                </div>

            </div>
            
            <form onSubmit={handleSubmit} className='form-checkout'>
                <section className='info-checkout'>
                    <div className='checkout-card-header'>
                        <span className='checkout-tag'>Step 2</span>
                        <h2>Shipping Information</h2>
                        <p className='checkout-description'>Select a delivery method and Add your information before placing your order.</p>
                    </div>

                    <h4>Delivery method</h4>
                    <div className='shipping-options div-controle'>
                        <label className='delivery-flex'>
                            <input type="radio" name="shippingType" id="on-delivery" value='cash on dilevery' onChange={handleInputs}/>
                            <span><i className="fa-solid fa-truck"></i> Cash on delivery</span>
                        </label>
                        <label className='delivery-flex'>
                            <input type="radio" name="shippingType" id="on-bank" value='bank payement' disabled onChange={handleInputs}/>
                            <span><i className="fa-solid fa-cart-shopping"></i> Card Payment (Currently Unavailable)</span>
                        </label>
                        {errors.shippingType && <small>{errors.shippingType}</small>}
                    </div>

                    <div className='div-controle'>
                        <label htmlFor="fullName">Full name</label>
                        <input type="text" name='fullName' placeholder='Enter full name' onChange={handleInputs} className={errors.fullName ? 'border-error' : alert.success ? 'border-success' : null}/>
                        {errors.fullName && <small>{errors.fullName}</small>}
                    </div>

                    <div className='div-controle'>
                        <label htmlFor="emailAddress">Email address</label>
                        <input type="email" name='emailAddress' placeholder='Enter email address' onChange={handleInputs} className={errors.email ? 'border-error' : alert.success ? 'border-success' : null}/>
                        {errors.emailAddress && <small>{errors.emailAddress}</small>}
                    </div>

                    <div className='div-controle'>
                        <label htmlFor="phone">Phone</label>
                        <input type="text" name='phone' placeholder='Enter phone number' onChange={handleInputs} className={errors.phone ? 'border-error' : alert.success ? 'border-success' : null}/>
                        {errors.phone && <small>{errors.phone}</small>}
                    </div>

                    <div className='address-option'>
                        <div className='div-controle'>
                            <label htmlFor="city">City</label>
                            <select name='city' value={shippingAddress.city} onChange={handleInputs} className={`city-select ${errors.city ? 'border-error' : alert.success ? 'border-success' : null}`}>
                                <option value="">Select your city</option>
                                <option value="Casablanca">Casablanca</option>
                                <option value="Rabat">Rabat</option>
                                <option value="Marrakech">Marrakech</option>
                                <option value="Tangier">Tangier</option>
                                <option value="Fes">Fes</option>
                                <option value="Agadir">Agadir</option>
                                <option value="Meknes">Meknes</option>
                                <option value="Oujda">Oujda</option>
                                <option value="Kenitra">Kenitra</option>
                                <option value="Tetouan">Tetouan</option>
                                <option value="Safi">Safi</option>
                                <option value="El Jadida">El Jadida</option>
                                <option value="Sale">Sale</option>
                            </select>
                            {errors.city && <small>{errors.city}</small>}
                        </div>

                        <div className='div-controle'>
                            <label htmlFor="address">Address</label>
                            <input type="text" name='address' placeholder='Enter adress' onChange={handleInputs} className={errors.address ? 'border-error' : alert.success ? 'border-success' : null}/>
                            {errors.address && <small>{errors.address}</small>}
                        </div>

                        <div className='div-controle'>
                            <label htmlFor="postalCode">ZIP Code</label>
                            <input type="number" name='postalCode' placeholder='Enter ZIP code' onChange={handleInputs} className={errors.postalCode ? 'border-error' : alert.success ? 'border-success' : null}/>
                            {errors.postalCode && <small>{errors.postalCode}</small>}
                        </div>
                    </div>
                    {alert.field && <p className={`checkout-alert ${alert.success ? 'text-success' : alert.error ? 'text-error' : null}`}>{alert.msg}</p>}
                </section>

                <aside className='summary-checkout'>
                    <div className='summary-card'>
                        {itemMap}
                        <h3>Order summary</h3>
                        <div className='summary-row'>
                            <span>Subtotal</span>
                            <strong>{subTotal} USD</strong>
                        </div>
                        <div className='summary-row'>
                            <span>Shipping</span>
                            <strong>{shippingFee} USD</strong>
                        </div>
                        <div className='summary-row summary-discount'>
                            <span>Discount</span>
                            <strong>-00.00 USD</strong>
                        </div>
                        <div className='summary-total'>
                            <span>Total</span>
                            <strong>{total} USD</strong>
                        </div>
                        <button type='submit' className='button-primary'>Place order</button>
                    </div>
                </aside>
            </form>
        </div>
    )
}