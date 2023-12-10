import React, { useEffect, useState } from 'react'
import Logo2 from '../../assets/image/Logo2.png'
import info_img from '../../assets/image/info_img.png'
import { Link } from 'react-router-dom';
import Splacescreen from "../splacescreen"
import WithAuth from "../../authProvider/withAuth";
  
  










function SplashInfo() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        setTimeout(() => {
          setIsLoading(false); // Once loading is done, hide the splash screen
        }, 2000); // Adjust the delay as needed
      }, []);
  return (

    
    <div>
      
   { isLoading ? < Splacescreen/> :
  <section className="Splash_Info container-fluid">
        <div className="container">
            <div className="Splash_Info_logoImages text-center">
                <img src={Logo2} alt=""/>
            </div>
            <div className="Splash_Info_Images text-center mt-4 mb-5">
                <img src={info_img} alt=""/>
            </div>
            <div className="Splash_Info_content text-center ">
                <p className=" pb-4">From car rentals to attraction tickets, and luxury stays.</p>
                <Link to="/SignIn" className="btn GetStarted_btn mt-4">
                    Get Started <i className="fa-solid fa-arrow-right-long ms-2"></i>
                </Link>
            </div>
        </div>
    </section>}

    </div>
  )
}

export default WithAuth(SplashInfo)