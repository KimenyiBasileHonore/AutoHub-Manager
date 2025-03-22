import React from 'react';
import { Link } from 'react-router-dom';
import black from "../pic/black.jpg";
import personal from "../pic/personal.png";
import vendor from "../pic/vendor.png";

function HomePage() {
  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${black})` }}>
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-4xl w-full mx-auto ">
          <div className="grid grid-cols-2 gap-36">
            {/* Card 1 */}
            <div className="card-container flex flex-col justify-center items-center">
              <div className="card bg-white p-32 rounded-xl shadow-md hover:shadow-lg w-full">
                <Link to="/Clientsignup">
                  <img src={personal} alt="Personal" className="mx-auto" />
                  <br/><br/><br/>
                  <span className='text-black font-bold text-md'>Signup as </span><span className='text-md font-bold text-blue-900'>Client</span>
                </Link>
              </div>
              {/* Additional Link 1 */}
              <div className="text-center mt-4">
              <p className='text-black font-bold text-lg block'>Already joined us<Link to="/Clientlogin" className="text-blue-900 font-bold text-lg block"> Sign in</Link></p></div>
            </div>

            {/* Card 2 */}
            <div className="card-container flex flex-col justify-center items-center">
              <div className="card bg-white p-32 rounded-xl shadow-md hover:shadow-lg w-full">
                <Link to="/Vendorsignup">
                  <img src={vendor} alt="Vendor" className="mx-auto" />
                  <br/><br/><br/>
                  <span className='text-black font-bold text-md'>Signup as </span><span className='text-blue-900 text-md font-bold'>vendor</span>
                </Link>
              </div>
              {/* Additional Link 2 */}
              <div className="text-center mt-4">
                <p className='text-black font-bold text-lg block'>Already joined us<Link to="/Vendorlogin" className="text-blue-900 font-bold text-lg block"> Sign in</Link></p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
