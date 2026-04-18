import React, { useContext } from "react";
import Img1 from "../../assets/prodimg/prodimg1.png";
import Img2 from "../../assets/prodimg/prodimg2.png";
import Img3 from "../../assets/prodimg/prodimg3.png";
import Img4 from "../../assets/prodimg/prodimg4.png";
import Img5 from "../../assets/prodimg/prodimg5.png";
import { FaStar } from "react-icons/fa6";
import { CartContext } from "../../context/CartContext";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Center Logo Print",
    rating: 4.1,
    color: "Yellow",
    price: 29.99,
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Texture Print",
    rating: 4.7,
    color: "Red",
    price: 34.99,
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Texture Print",
    rating: 4.3,
    color: "Green",
    price: 34.99,
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Exotic Patterns",
    rating: 5.0,
    color: "Orange",
    price: 39.99,
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    title: "Center Logo Print",
    rating: 4.5,
    color: "Black",
    price: 29.99,
    aosDelay: "800",
  },
];

const Products = () => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Products We Sell on our website
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="space-y-3 cursor-pointer hover:scale-105 duration-300"
              >
                <div className="relative group">
                  <img
                    src={data.img}
                    alt=""
                    className="h-[220px] w-[150px] object-cover rounded-md"
                  />
                  <button
                    onClick={() => addToCart(data)}
                    className="absolute bottom-0 left-0 right-0 bg-primary text-white py-2 px-2 text-sm rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-secondary"
                  >
                    Add to Cart
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm text-gray-600">{data.color}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span>{data.rating}</span>
                    </div>
                    <span className="font-bold text-primary">${data.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md hover:bg-secondary duration-200">
              View All Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductsData };
export default Products;
