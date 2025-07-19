import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Thali = ({thalis}) => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 500,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handleThali = (thaliId) => {
    navigate(`/thali/description/${thaliId}`);
  };

  return (
    <div className="w-full py-8 sm:py-10 md:py-12 bg-white">
      <div className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-red-900">Indian Veg Thalis</h2>
        <Slider {...settings}>
          {thalis.map((thali, index) => (
            <div key={index} className="px-1 sm:px-2">
              <div 
                className="bg-white rounded-xl text-center h-80 sm:h-92 shadow-md overflow-hidden mx-auto max-w-xs sm:max-w-sm"
                onClick={() => handleThali(thali.thali_id)}
              >
                <img
                  src={thali.thali_img}
                  alt={thali.thali_name}
                  className="h-56 sm:h-64 md:h-72 w-56 sm:w-64 md:w-72 rounded-full mt-1 mx-auto"
                />
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg text-red-900 font-bold">{thali.thali_name}</h3>
                  <p className="text-sm sm:text-base text-red-600 font-bold">{thali.price}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Thali;