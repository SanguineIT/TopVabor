import React from 'react'
import Logo2 from '../../assets/image/Logo2.png'
import category_img1 from '../../assets/image/category_img1.png'
import category_img2 from '../../assets/image/category_img2.png'
import category_img3 from '../../assets/image/category_img3.png'
import category_img4 from '../../assets/image/category_img4.png'
import { Link } from 'react-router-dom';
import WithAuth from '../../authProvider/withAuth';
import Header from '../common/header'


function Category() {
  return (
    <div>
     <Header />

    <section className="container-fluid category_section">
        <div className="container ChooseCountry_section">
            <div className="ChooseCountry_area">
                {/* <div className="category_Page_Logo mb-3">
                    <img src={Logo2} alt=""/>
                </div> */}
                <div className="category_Page_heading text-center">
                    <h1>All Begins here</h1>
                    <p>From hassle-free car rentals to coveted attraction tickets, and luxurious hotel and resort accommodations</p>
                </div>
                <div className="row">
                    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12">
                        <div className="category_item">
                            <div className="category_item_img">
                                <img src={category_img1} alt=""/>
                            </div>
                            <div className="category_item_content">
                                <h5>Rent A Car</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                                <Link to="/PickupLocation" className="btn btn_success w-75">Explore Now</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12">
                        <div className="category_item">
                            <div className="category_item_img">
                                <img src={category_img2} alt=""/>
                            </div>
                            <div className="category_item_content">
                                <h5>City tour & airport transfers</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                                <Link to="/ChooseCity" className="btn btn_success w-75">Explore Now</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12">
                        <div className="category_item">
                            <div className="category_item_img">
                                <img src={category_img3} alt=""/>
                            </div>
                            <div className="category_item_content">
                                <h5>Tour Tickets</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                                <Link to="/TourTickets" className="btn btn_success w-75">Explore Now</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12">
                        <div className="category_item">
                            <div className="category_item_img">
                                <img src={category_img4} alt=""/>
                            </div>
                            <div className="category_item_content">
                                <h5>Visa</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                                <Link to="/VisaOptions" className="btn btn_success w-75">Explore Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default WithAuth(Category)