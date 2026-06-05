import '../styling/cart.css'

export default function CartItem(props){
    return(

        <div>

           <div className="item-container">

            <img className='cart-image' src={props.product.image} alt="" />

            <h4>{props.product.name}</h4>

            <div className='cart-count'>
                <button className='btn-count' onClick={()=>props.lessCount(props.id , props.amount)}>-</button>
                <p>{props.amount}</p>
                <button className='btn-count' onClick={()=>props.addCount(props.id , props.amount , props.product.stock)}>+</button>
            </div>

            <h4>{props.product.price}</h4>

            <button className='delete-item' onClick={()=>props.deleteItem(props.id)}><i className="fa-solid fa-trash"></i></button>        

            {props.cartIssue && <div className='cart-issue'><p>{`Only ${props.currentStock} items available in stock`}</p></div>}
            
            

            </div>




            <div className="item-container-2">

            <div className="item-container-flex-1">

            <img className='cart-image' src={props.product.image} alt="" />

            <h4>{props.product.name}</h4>

            </div>
            
            <div className="item-container-flex-2">

            <div className='cart-count'>
                <button className='btn-count' onClick={()=>props.lessCount(props.id , props.amount)}>-</button>
                <p>{props.amount}</p>
                <button className='btn-count' onClick={()=>props.addCount(props.id , props.amount , props.product.stock)}>+</button>
            </div>

            <h4>{props.product.price}</h4>

            <button className='delete-item' onClick={()=>props.deleteItem(props.id)}><i className="fa-solid fa-trash"></i></button>

            </div>          

            {props.cartIssue && <div className='cart-issue'><p>{`Only ${props.currentStock} items available in stock`}</p></div>}
            
            

            </div>

        </div>
   
            
        
        
    ) 
}