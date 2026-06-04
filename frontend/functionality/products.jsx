export default function NewProducts(props){
    return(
        <div className="new-products">
            <img className="new-products-img" src={props.img.src} alt={props.img.src}/>
            <div className="info-pro">
                <h2>{props.title}</h2>
                <p className="product-desc">{props.description}</p>
                <p className="price">{props.price}</p>
            </div>
            
        </div> 
        
    )
}