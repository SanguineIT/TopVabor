import React from 'react'
import backgroundImage from "../../../assets/image/VisaOption_topbar_img.png"

import backgroundImage1 from "../../../assets/image/choosecity_item_bg.png"
import backgroundImage2 from "../../../assets/image/choosecity_item_bg2.png"
import backgroundImage3 from "../../../assets/image/choosecity_item_bg3.png"
import Header from "../../common/header"
import { Link } from 'react-router-dom';
import WithAuth from '../../../authProvider/withAuth'




function ChooseCity() {


    const handleCity = () => {


        window.location.href = "/ChooseCar"

    }



    return (
        <div>
            <Header />

            <div className='VisaOption_section'>
                <div class="container-fluid  VisaOption_topbar_section position-relative" style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.47) 0%, rgba(0, 0, 0, 0.47) 100%), url(${backgroundImage})` }}>
                    <div class="container">
                        <div class="row "  >
                            <Link to="/category" class="back_arrow_hp"><i class="fa-solid fa-arrow-left"></i></Link>
                            <div class="col-12">
                                <div class="VisaOption_topbar_heading text-center">
                                    <h1> Choose your City</h1>
                                    <p>Find the best city tour and guide</p>
                                </div>




                            </div>
                        </div>
                    </div>  </div>
                    <div class="container">
                        <div class="row mt-5">
                            <div class="col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
                                <div class="VisaOption_item" onClick={() => handleCity()} style={{ backgroundImage: `url(${backgroundImage1})` }}>
                                    <p>Dubai City Tour</p>
                                </div>
                            </div>
                            <div class="col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
                                <div class="VisaOption_item" onClick={() => handleCity()} style={{ backgroundImage: `url(${backgroundImage2})` }}>
                                    <p>Abu Dhabi Tour</p>
                                </div>
                            </div>
                            <div class="col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
                                <div class="VisaOption_item" onClick={() => handleCity()} style={{ backgroundImage: `url(${backgroundImage3})` }}>
                                    <p>Airport Transfer</p>
                                </div>
                            </div>
                        </div>
                    </div>
              


            </div>

        </div>
    )
}

export default WithAuth(ChooseCity)