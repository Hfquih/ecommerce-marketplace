import React from 'react'
import '../styling/contact.css'
import axios from 'axios'
import { small } from 'motion/react-client'
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();

export default function Contact() {

    const [support , setSupport] = React.useState({username:'' , email:'' , message:''})

    const [alert , setAlert] = React.useState({msg:'' , field:false , success:false , error:false})

    const [error , setError] = React.useState({})

    function handelInput(e){
        const {name , value} = e.currentTarget 

        setSupport(prev=>{
            return{
                ...prev,
                [name]:value
            }
        })

        setError(prev=>{
            return{
                ...prev,
                [name]:''
            }
        })
    }

    async function handleSupport(e){
        e.preventDefault()

        if(!checkInput())return

        try{
            const {data} = await apiClient.post('/support' , {...support})
            
            setAlert({
                msg:data.msg , field:true , success:true , error:false 
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false 
                })
            },3000)
        }catch(error){
            console.log(error)
            setAlert({
                msg:error.response?.data.msg || 'SOMETHING WONT WRONG' , field:true , success:false , error:true 
            })

            setTimeout(()=>{
                setAlert({
                    msg:'' , field:false , success:false , error:false 
                })
            },3000)
        }
    }

    function checkInput(){
        let newErrors={}

        Object.entries(support).forEach(([field , value])=>{
            if(!value.trim()){
                newErrors[field] = `${capitalize(field)} is required`
            }
        })
        setError(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

    return(
        <div>

            <div className="contact-page">
            <section className="purpose">
                <video className="contact-vid" src="../media/vid3.mp4" autoPlay loop muted playsInline />
                <div className="purpose-text">
                    <h2>Reach out for fast support</h2>
                    <p>
                        Our team is here to help with product questions, order support, or account requests.
                        Send us a message and we’ll reply as quickly as possible with the information you need.
                    </p>
                    <ul className="purpose-list">
                        <li>Order and delivery assistance</li>
                        <li>Product advice and seller support</li>
                        <li>Feedback, returns, and account help</li>
                    </ul>
                </div>
            </section>

            <section className="div-form">
                <form className="contact-form" onSubmit={handleSupport}>
                    <div className="div-contact div-controle">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter your username" onChange={handelInput} />
                        {error.username && <small>{error.username}</small>}
                    </div>

                    <div className="div-contact div-controle">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" onChange={handelInput}/>
                        {error.email && <small>{error.email}</small>}
                    </div>
                    
                    <div className="div-contact div-controle">
                        <label htmlFor="text">Message</label>
                        <textarea name="message" id="text" placeholder="Write your message here" className='contact-area' onChange={handelInput}></textarea>
                        {error.message && <small>{error.message}</small>}
                    </div>

                    <button type="submit" className="contact-btn">Send message</button>

                    {alert.field && <p style={{textAlign:'center'}} className={alert.success ? 'text-success' : alert.error ? 'text-error' : ''}>{alert.msg}</p>}
                </form>

                <img src="../media/img6.jpg" className="img-contact" alt="Support and contact" />
            </section>
            </div>


            </div>

            

        
    )
}