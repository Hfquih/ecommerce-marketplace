import '../styling/ProductCarousel.css';
import categories from '../categories'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductSlider(){

    const categorySlides = categories.map((category) => (
        <SwiperSlide key={category.id} style={{display:'flex', justifyContent:'center'}}>
            <div className="category-card" role="button" tabIndex={0} aria-label={`Explore ${category.category}`}>
                <div className="category-image">
                    <img src={category.img.src} alt={category.img.alt} />
                </div>
                <div className="category-body">
                    <p className="category-title">{category.category}</p>
                </div>
            </div>
        </SwiperSlide>
    ));

    return (
        <div className="slider-wrapper">
            <h2 className="slider-title">Categories</h2>
            <Swiper
                modules={[Navigation , Pagination, Autoplay]}
                slidesPerView='auto'
                centeredSlides={false}
                spaceBetween={20}
                loop
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                    320: { slidesPerView: 2 },
                    420: { slidesPerView: 2 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {categorySlides}
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