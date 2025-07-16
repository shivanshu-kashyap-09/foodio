import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

// import logo from "../assets/logo.png"

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
    <div className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-900 ">Indian Veg Thalis</h2>
        <Slider {...settings}>
          {thalis.map((thali, index) => (
            <div key={index} className="px-2">
              <div className="bg-white rounded-xl text-center h-92 shadow-md overflow-hidden"
              onClick={() => handleThali(thali.thali_id)}>
                <img
                  src={thali.thali_img}
                  alt={thali.thali_name}
                  className="h-73 w-72 rounded-full mt-1 text-center"
                />
                <div className="p-4">
                  <h3 className="text-lg text-red-900 font-bold">{thali.thali_name}</h3>
                  <p className="text-red-600 font-bold">{thali.price}</p>
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
