import React, { useState, useEffect } from 'react';
import axios from 'axios';
import money from "../pic/money.png";
import gearshift from "../pic/gearshift.png";
import fuel from "../pic/fuel.png";
import { Link } from 'react-router-dom';;




const Overview = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState({
    carCost: false,
    basicInfo: false,
    region: false,
    color: false,
    moreDetails: false,
    image: false,
  });

  useEffect(() => {
    axios.get('http://localhost:4000/api/prod/allproduct', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      },
    })
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);



  return (
    <div>

      <div className=" mx-auto px-34   py-8">


        <div className=" grid grid-cols-1 md:grid-cols-4 gap-12 mx-auto px-2 py-8 max-w-1xl ">
          {products.map((product) => (
            <div className=" bg-gray-400 rounded-lg overflow-hidden shadow-md" key={product._id}>
              <div className=' bg-gray-400 py-2 px-4 flex justify-between items-center'>
                <span className='text-black font-bold uppercase'>{product.name}</span>
                <button className=" rounded-full text-white text-sm py-1 px-4" style={{ backgroundColor: product.status === 'NEW' ? '#3182ce' : '#e53e3e' }}>{product.status}</button>
              </div>
              <div className=" p-4 cursor-pointer" >
                <div onClick={() => openModal(product)}>
                  {product.photo && product.photo.length > 0 && (
                    <div className="border rounded-lg overflow-hidden shadow-md">
                      <img src={`http://localhost:4000/${product.photo[0].path}`} className="w-full h-64 object-cover" alt={`Product Image`} />
                    </div>
                  )}
                  <div className="details ml-5 mt-4">
                    <div class="lg:flex text-center">
                      <div class="item">
                        <img src={money} alt="price" class="ml-6 w-9 h-9" />
                        <span class="font-bold text-md ml-4 text-gray-900">{product.price}</span>
                      </div>
                      <div class="item">
                        <img src={gearshift} alt="gearbox" class="ml-8 w-9 h-9" />
                        <span class="font-bold text-md ml-5 text-gray-900">{product.gearbox}</span>
                      </div>
                      <div class="item">
                        <img src={fuel} alt="tank" class=" ml-6 w-9 h-9" />
                        <span class="font-bold text-md ml-5 text-gray-900">{product.tank}</span>
                      </div>

                    </div>


                  </div>
                </div>
                <button className='btn-purchase w-full py-2 px-4 bg-white text-lg text-black font-semibold rounded-lg mt-4'>

                  <Link to="/clientlogin" className="">
                    Read more...
                  </Link></button>
              </div>
              <div className=" flex ml-24 mb-4 items-center">
                {/* <span className="mr-2">{product.rating.toFixed(1)}</span> */}
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`h-5 w-5 fill-current ${index < product.rating ? "text-yellow-600" : "text-gray-400"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon points="10,0 13,7 20,7 15,12 17,20 10,16 3,20 5,12 0,7 7,7" />
                  </svg>
                ))}
              </div>


            </div>

          ))}
        </div>
      </div>

    </div>
  );
};

export default Overview;

