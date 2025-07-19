import React, { useState, useEffect } from 'react';
import Hero from "../Components/Hero";
import Veg from "../Components/Veg";
import NonVeg from "../Components/NonVeg";
import SouthIndian from "../Components/SouthIndian";
import Choose from "../Components/Choose";
import Contact from "../Components/Contact";
import HeroRestaurant from '../Components/HeroRestaurant';
import Banner from '../Components/Banner';
import Thali from '../Components/Thali';
import axios from 'axios';

const restaurantData = [
  {
    restaurantName: "Domino's Pizza",
    link: "/restaurant/dominos",
    dishes: [
      {
        image: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_640.jpg",
        name: "Margherita",
        price: "Under ₹199",
        description: "Classic Cheese Pizza",
      },
      {
        image: "https://www.dominos.co.in//files/items/Digital_Veggie_Paradise_olo_266x265.jpg",
        name: "Veggie Paradise",
        price: "Under ₹249",
        description: "Topped with crisp veggies",
      },
      {
        image: "https://www.dominos.co.in//files/items/stuffed-garlic-breadstick_1346070564.webp",
        name: "Garlic Bread",
        price: "Under ₹149",
        description: "Cheesy Garlic Delight",
      },
      {
        image: "https://www.dominos.co.in/files/items/_thumb_17450.png",
        name: "Dip Sauce",
        price: "Under ₹49",
        description: "Classic Cheese Dip",
      },
    ],
  },
  {
    restaurantName: "KFC",
    link: "/restaurant/kfc",
    dishes: [
      {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVz5rLwxOslMFiflVE4Kp1QoQd1GyJU6VEA&s",
        name: "Hot & Crispy Chicken",
        price: "Under ₹199",
        description: "Signature Crispy Chicken",
      },
      {
        image: "https://orderserv-kfc-assets.yum.com/15895bb59f7b4bb588ee933f8cd5344a/images/offers/xl/CHKZINGER.jpg?ver=69.55",
        name: "Zinger Burger",
        price: "Under ₹169",
        description: "Spicy Zinger Burger",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/2db/2ebc3d230c0c31230bca8b794f4ea2db.jpg?output-format=webp",
        name: "French Fries",
        price: "Under ₹99",
        description: "Golden Crispy Fries",
      },
      {
        image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/4/c9494d62-a7f7-4976-9d1f-df89dd26b183_6853c1b4-f67d-42ba-a02e-076d9bfbc5a4.jpg",
        name: "Pepsi",
        price: "Under ₹59",
        description: "Chilled Beverage",
      },
    ],
  },
  {
    restaurantName: "Haldiram's",
    link: "/restaurant/haldirams",
    dishes: [
      {
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rajasthani_Raj_Kachori.jpg/558px-Rajasthani_Raj_Kachori.jpg",
        name: "Raj Kachori",
        price: "Under ₹119",
        description: "Crispy stuffed snack with chutneys",
      },
      {
        image: "https://haldiramsminutekhana.com/wp-content/uploads/2022/12/Choley-bhature.png",
        name: "Chole Bhature",
        price: "Under ₹140",
        description: "Spicy chickpeas with fluffy bread",
      },
      {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_d064AfDvzWP1RfyHNhFMjmSicR79Qc98Uccn55W4MTKqLDGFpQPV&usqp=CAE&s",
        name: "Dahi Puri",
        price: "Under ₹109",
        description: "Crispy puris with yogurt & chutney",
      },
      {
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS2BoB6G9fUuv6YoewDrxPY53mqzRkU6ivZ75qP93Q4ZQVZJBpq40QUNFcCRczuJSAJQwLZjHa3MHvlLEt7dQX5FaaFGJ5a5-gGSWIMPppWOO03x-ZRY92L",
        name: "Gulab Jamun",
        price: "Under ₹89",
        description: "Delicious Indian dessert",
      },
    ],
  },

  {
    restaurantName: "Sagar Ratna",
    link: "/restaurant/sagar-ratna",
    dishes: [
      {
        image: "https://b.zmtcdn.com/data/dish_photos/9d0/63f96e27d32e98eac1ab01c4e5daf9d0.jpg?output-format=webp",
        name: "Vegetable Biryani",
        price: "Under ₹219",
        description: "Aromatic rice with mixed veggies",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/ffc/b7aade304ba89b6f09dc924d6efd0ffc.jpg?output-format=webp",
        name: "Veg Cutlets",
        price: "Under ₹149",
        description: "Spiced mashed potato patties",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/eb4/cb61cf020035baf97586931236323eb4.jpg?output-format=webp",
        name: "Raita",
        price: "Under ₹69",
        description: "Cooling yogurt and cucumber side",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/42a/54ed6186963d4142f75ee26db827342a.jpeg?output-format=webp",
        name: "Kheer",
        price: "Under ₹89",
        description: "Creamy rice pudding dessert",
      },
    ],
  },

  {
    restaurantName: "Saravana Bhavan",
    link: "/restaurant/saravana-bhavan",
    dishes: [
      {
        image: "https://b.zmtcdn.com/data/pictures/0/900/7ca077cee60450b23ddc3b9350b080b7.jpg?fit=around|300:273&crop=300:273;*,*",
        name: "Masala Dosa",
        price: "Under ₹129",
        description: "Stuffed South Indian Dosa",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/ce7/1a4af837f59edb7e22c5d50a6bc93ce7.png?output-format=webp",
        name: "Idli Sambar",
        price: "Under ₹99",
        description: "Steamed Rice Cakes",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/a92/822dc94ff826f993d4d3780aff711a92.jpg?output-format=webp",
        name: "Onion Uttapam",
        price: "Under ₹119",
        description: "Soft Rice Pancake",
      },
      {
        image: "https://b.zmtcdn.com/data/dish_photos/fd6/fcaa8fdd1dcade709b2adafecb661fd6.jpeg",
        name: "Chutney",
        price: "Under ₹169",
        description: "Free with every dish",
      },
    ],
  },
  {
    restaurantName: "Burger King",
    link: "/restaurant/burger-king",
    dishes: [
      {
        image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_640.jpg",
        name: "Whopper",
        price: "Under ₹179",
        description: "Flame Grilled Burger",
      },
      {
        image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/19/d4387d28-73ab-45b7-b424-61588863d158_9477217d-7c7a-4834-919a-b9ae7d7cf950.jpg",
        name: "Crispy Veg Burger",
        price: "Under ₹99",
        description: "Crunchy Delight",
      },
      {
        image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/19/fa747205-3c4d-497c-a948-65f3c224a4cf_11129959-8182-4b8c-bbb5-db49665fba19.jpg",
        name: "Peri Peri Fries",
        price: "Under ₹89",
        description: "Spicy Potato Fries",
      },
      {
        image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/4/c9494d62-a7f7-4976-9d1f-df89dd26b183_6853c1b4-f67d-42ba-a02e-076d9bfbc5a4.jpg",
        name: "Coke",
        price: "Under ₹95",
        description: "Cold Drink",
      },
    ],
  },
];


const Home = () => {
  const [thalis, setThalis] = useState([]);
  // const [restaurantName, setRestaurantName] = useState([]);
  // const [restaurantId, setRestaurantId] = useState([]);
  // const [dish, setDish] = useState([]);
  const [vegDish, setVegDish] = useState([]);
  const [nonVegDish, setNonVegDish] = useState([]);
  const [southDish, setSouthDish] = useState([]);

  const handleThali = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/thali/all`);
      if (response.status === 200) {
        setThalis(response.data);
      }
    } catch (error) {
      console.error('Error fetching thalis:', error);
    }
  };

  // const handleHeroRestaurant = async () => {
  //   try {
  //     const resVeg = await axios.get(`${import.meta.env.VITE_URL}/vegrestaurant/all`);
  //     const resNonVeg = await axios.get(`${import.meta.env.VITE_URL}/nonvegrestaurant/all`);

  //     let allIds = [];
  //     let allNames = [];

  //     if (resVeg.status === 200 && Array.isArray(resVeg.data)) {
  //       allIds = [...resVeg.data.map(r => r.res_id).slice(0, 3)];
  //       allNames = [...resVeg.data.map(r => r.res_name).slice(0, 3)];
  //     }

  //     if (resNonVeg.status === 200 && Array.isArray(resNonVeg.data)) {
  //       allIds = [...allIds, ...resNonVeg.data.map(r => r.res_id).slice(0, 3)];
  //       allNames = [...allNames, ...resNonVeg.data.map(r => r.res_name).slice(0, 3)];
  //     }

  //     setRestaurantId(allIds);
  //     setRestaurantName(allNames);

  //     // Fetch all 6 dishes in parallel
  //     const dishRequests = allIds.map((id, index) => {
  //       const menuType = index < 3 ? 'vegmenu' : 'nonvegmenu';
  //       return axios.get(`${import.meta.env.VITE_URL}/${menuType}/id/${id}`);
  //     });

  //     const dishResponses = await Promise.all(dishRequests);
  //     const dishes = dishResponses.map(res => res.data.slice(0, 3));

  //     // Flatten dish arrays and store in state
  //     const flatDishes = dishes.flat();
  //     setDish(flatDishes);

  //   } catch (error) {
  //     console.error("Error fetching hero restaurants:", error);
  //   }
  // };

  const handleVeg = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/vegmenu/restaurant/2`);
      if (response.status == 200) {
        setVegDish(response.data);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleNonVeg = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/nonvegmenu/id/1`);
      if (response.status == 200) {
        setNonVegDish(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSouth = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/southindianmenu/id/1`);
      if (response.status == 200) {
        setSouthDish(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    handleThali();
    // handleHeroRestaurant();
    handleVeg();
    handleNonVeg();
    handleSouth();
  }, []);
  return (
    <>
      <Hero />
      <div className="h-auto grid grid-cols-1 lg:grid-cols-3 mt-4 mx-4 sm:mx-8 lg:ml-20 gap-4">
        {restaurantData.map((restaurant, index) => (
          <HeroRestaurant
            key={index}
            restaurantName={restaurant.restaurantName}
            dishes={restaurant.dishes}
            link={restaurant.link}
          />
        ))}
      </div>
      <Banner />
      <Thali thalis={thalis} />
      <Veg vegDish={vegDish} />
      <Banner />
      <NonVeg nonVegDish={nonVegDish} />
      <Banner />
      <SouthIndian southDish={southDish}/>
      <Choose />
      <Contact />
    </>
  );
};

export default Home;
