import '../styling/ProductCarousel.css';
import products from '../slidePro'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductSlider(){
    const mapProducts = products.map((product)=>{
        return(
            <SwiperSlide key={product.id}>
                <div className="product-card">
                    <img src={product.image} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p>{product.price}</p>
                </div>
            </SwiperSlide>
        )
    })

    return (
    <div className="slider-wrapper">

        <h2 className="slider-title">Featured Gaming Products</h2>
      
        <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        
        pagination={{ clickable: true }}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }} 
        >
            {mapProducts}
        </Swiper>   
      
    </div>
  );
}




//modules={[Navigation, Pagination, Autoplay]}
        //slidesPerView={1}
        //spaceBetween={20}
        //navigation
        //pagination={{ clickable: true }}
        //loop
        //autoplay={{ delay: 3000, disableOnInteraction: false }}
        //breakpoints={{
          //640: { slidesPerView: 2 },
          //768: { slidesPerView: 3 },
          //1024: { slidesPerView: 4 },
        //}} 