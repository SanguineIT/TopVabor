import React from 'react'
import Header from "../../common/header"
import { Link } from 'react-router-dom';
import backgroundImage1 from "../../../assets/image/VisaOption_item_bg1.png"



function VisaOptions() {




  const  handleDocupload=(value)=>{
    localStorage.setItem("visaOption",value)

    window.location.href="/visaDocupload"

  }



  return (
    <div>
        <Header/>
<div className='VisaOption_section'>
<div className="container-fluid VisaOption_topbar_section position-relative ">
        <div className="container">
        <div className="row ">
            <Link to="/category" className="back_arrow_hp"><i className="fa-solid fa-arrow-left"></i></Link>
            <div className="col-12">
                <div className="VisaOption_topbar_heading text-center">
                    <h1>Choose Visa Option</h1>
                    <p>Your Key to the Best Visa Deal</p>
                </div>
            </div>
        </div>
    </div>

        </div>
        <div className="container">

        <div className="row mt-5">
            <div onClick={()=>handleDocupload( "1 Month")}   className="col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
                <div className="VisaOption_item" style={{ backgroundImage: `url(${backgroundImage1})` }}>
                    <p>1 Month</p>
                </div>
            </div>
            <div  onClick={()=>handleDocupload("2 Month")} className="col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
                <div className="VisaOption_item"  >
                    <p>2 Month</p>
                </div>
            </div>
            <div onClick={()=>handleDocupload("3 Month")} className="col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
                <div className="VisaOption_item" >
                    <p>3 Month</p>
                </div>
            </div>
        </div>
    </div>

</div>

    
    </div>
  )
}

export default VisaOptions