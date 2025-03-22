import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Maindashboard.css';
import approved from "../pic/approved.png";
import bell from "../pic/bell.png";
import database from "../pic/database.png";
import handshake from "../pic/handshake.png";
import thumbnails from "../pic/thumbnails.png";
import chat from "../pic/chat.png"
import Filereport from "./Filereport";
import Admoders from "./Admoders";
import Aggrement from "./Aggrement";
import AdmData from "./AdmData";
import AdmOverview from "./AdmOverview"
import VendorChat from './VendorChat';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("AdmOverview");
  const mainContentRef = useRef(null);

  const handleLogout = () => {
    navigate('/VendorLogin');
    // Handle logout logic here
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="font-serif container mx-auto mt-8">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white flex justify-between items-center mb-4 fi">
        <h1 className="text-3xl font-bold text-blue-500 mt-8 text-center flex-grow">Autohub Manager</h1>
        <ul className='flex font-bold fixed right-0'>
          <li className="cursor-pointer mr-8 text-xl text-gray-600 mr-4" onClick={() => handleLogout()}>
            <br />
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </li>
        </ul>
      </div>
      <div className="flex">
        <ul className="flex-col fixed mt-12 ml-8 border-r-4 border-gray-400">
          <li
            className={`text-lg font-md 
              ${selectedItem === 'AdmOverview' ? 'text-bold border-r-4 pl-4 pr-2 underline-space border-black' : ''}`}
            onClick={() => handleItemClick('AdmOverview')}
          >
            <img src={thumbnails} alt="AdmOverview" className='w-9 h-9 mb-12' />
          </li>
          <li
            className={`text-lg font-md 
              ${selectedItem === 'AdmData' ? 'text-bold border-r-4 pl-4 pr-2 underline-space border-black' : ''}`}
            onClick={() => handleItemClick('AdmData')}
          >
            <img src={database} alt="AdmData" className='w-9 h-9 mb-12' />
          </li>
          <li
            className={`text-lg font-md 
              ${selectedItem === 'handshake' ? 'text-bold border-r-4 pl-4 pr-2 underline-space border-black' : ''}`}
            onClick={() => handleItemClick('handshake')}
          >
            <img src={handshake} alt="handshake" className='w-9 h-9 mb-12' />
          </li>
          <li
            className={`text-lg font-md 
              ${selectedItem === 'bell' ? 'text-bold border-r-4 pl-4 pr-2 underline-space border-black' : ''}`}
            onClick={() => handleItemClick('bell')}
          >
            <img src={bell} alt="bell" className='w-9 h-9 mb-12' />
          </li>
          <li
            className={`text-lg font-md 
              ${selectedItem === 'approved' ? 'text-bold border-r-4 pl-4 pr-2 underline-space border-black' : ''}`}
            onClick={() => handleItemClick('approved')}
          >
            <img src={approved} alt="approved" className='w-9 h-9 mb-12' />
          </li>
          <li
            className={`text-lg font-md 
              ${selectedItem === 'chat' ? 'text-bold border-r-4 pl-4 pr-2 underline-space border-black' : ''}`}
            onClick={() => handleItemClick('chat')}
          >
            <img src={chat} alt="chat" className='w-9 h-9 mb-12' />
          </li>
        </ul>
        <div className="w-3/4 ml-20 bg-white">
          <div className="p-6" ref={mainContentRef}>
            {selectedItem === "AdmOverview" && (
              <section className="text-gray-600 body-font">
                <div className="container px-5 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <AdmOverview />
                  </div>
                </div>
              </section>
            )}
            {selectedItem === "AdmData" && (
              <section className="text-gray-600 body-font">
                <div className="container px-5 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <AdmData />
                  </div>
                </div>
              </section>
            )}
            {selectedItem === "handshake" && (
              <section className="text-gray-600 body-font">
                <div className="container px-5 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <Aggrement />
                  </div>
                </div>
              </section>
            )}
            {selectedItem === "bell" && (
              <section className="text-gray-600 body-font">
                <div className="container px-5 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <Admoders />
                  </div>
                </div>
              </section>
            )}
            {selectedItem === "approved" && (
              <section className="text-gray-600 body-font">
                <div className="container px-5 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <Filereport />
                  </div>
                </div>
              </section>
            )}
            {selectedItem === "chat" && (
              <section className="text-gray-600 body-font">
                <div className="container px-5 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <VendorChat />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
