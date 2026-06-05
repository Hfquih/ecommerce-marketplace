import '../styling/cart.css'
import React from 'react'
import CartItem from '../functionality/cartItem'
import { nanoid } from 'nanoid/non-secure'
import { Link } from 'react-router-dom'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function Cart(){

    const [cart , setCart] = React.useState({})

    const [alert , setAlert] = React.useState({})

    const {token} = useAuth()

    React.useEffect(()=>{
        const getCart = async()=>{
            try{
                const {data} = await apiClient.get('/cart' , {headers:{Authorization: `Bearer ${token}`}})

                setCart(data.carts)
            }catch(error){
                console.log(error)
            }
        }
        getCart()
    },[])


    const mapCart= cart.items?.map((cart)=>{
        return <CartItem key={cart._id} id={cart._id} {...cart} addCount={addCount} lessCount={lessCount} amount={cart.amount} deleteItem={deleteItem}/>
    })

    
    
    function addCount(id , amount , stock){
        const newAmount = Math.min(amount + 1 , stock) 

        const addToCart = async()=>{
            try{
                const {data} = await apiClient.patch(`/cart/${id}` , {itemCount:newAmount} , {headers:{"Content-Type": "application/json" , Authorization: `Bearer ${token}`}})

                setCart(prev=>{
                    return{
                        ...prev,
                        items:prev.items.map((cart)=>{
                            return cart._id === id ? {...cart , amount : newAmount} : cart
                        })
                    }
                })

            }catch(error){ 
                console.log(error)
            }
        }
        
        addToCart()
    }

    function lessCount(id , amount){
        const newAmount = Math.max(1 , amount - 1)

        const lessToCart = async()=>{
            try{
                const {data} = await apiClient.patch(`/cart/${id}` , {itemCount:newAmount} , {headers:{"Content-Type": "application/json" , Authorization: `Bearer ${token}`}})

                setCart(prev=>{
                    return{
                        ...prev,
                        items:prev.items.map((cart)=>{
                             return cart._id === id ? {...cart , amount : newAmount} : cart
                        })
                    }
                })
            
            }catch(error){
                console.log(error)
            }
        }
        lessToCart()
    }

    function deleteItem(id){

        const deleteFromCart = async()=>{
            try{
                const {data} = await apiClient.delete(`/cart/${id}` , {headers:{Authorization : `Bearer ${token}`}})

                setAlert(data)

                setCart(prevCart =>{
                    return{
                        ...prevCart,
                        items:prevCart.items?.filter(item=>item._id!==id)
                    }
                })

                setTimeout(()=>{
                    setAlert({})
                },2000)
            }catch(error){
                console.log(error) 
            }
        }

        deleteFromCart()

    }

    function clearCart(){

        const clearCart = async()=>{
            try{
                const {data} = await apiClient.delete('/cart' , {headers:{Authorization : `Bearer ${token}`}})

                setAlert(data)

                setCart([])

                setTimeout(()=>{
                    setAlert({}) 
                },2000)
            }catch(error){
                console.log(error)
            }
        }
        clearCart()
    }
 
    const total = cart.items?.reduce((sum , item)=>{
        return sum + item.product.price * item.amount
    },0)

    
    return(
        <div>

            <div className="cart-header">

                <div className='cart-flex'>

                    <div className="cart-proccess">
                        <div className='div-style'>1</div>
                        <p>Cart</p>
                    </div>

                    <div className="cart-proccess">
                        <div className='div-style'></div>
                        <p>Checkout</p>
                    </div>

                    <div className="cart-proccess">
                        <div className='div-style'></div>
                        <p>Payement</p>
                    </div>
                    
                </div>

            </div>

            <button className='cart-home-page'><Link className="link" to="/">Go Back To Home Page</Link></button>

            <div className='info-cart'>

                <div className='cart-content'>
                    <div className='header-content'>
                        <h2>Cart</h2>
                        <button className='clear-cart' onClick={clearCart}><i className="fa-solid fa-x" style={{marginRight:20}}></i> Clear cart</button>
                    </div>

                    <div className='type-cart'>
                        <h4>Product</h4>
                        <h4>Count</h4>
                        <h4>Price</h4>
                    </div>

                    <div>
                        {mapCart}
                    </div>
                    
                    <p style={{textAlign:'center'}} className='text-error'>{alert.msg}</p>
                </div>

                <div>
                    <div className='total-content'>
                        <div className='total-content2'>
                            <div className='total-flex'>
                            <h5>Total</h5>
                            <h5>{total}</h5>
                            </div>
                            <Link className='checkout-btn link' to="/checkout" target='_blank'>Continue To Checkout</Link>
                        </div>   
                    </div>

                </div>
                

            </div>

        </div>
        
    )
}