import React from 'react'
import { Link } from 'react-router-dom';
import visa_img from '../../assets/image/Visa.png'
import visa_2_img from '../../assets/image/Visa_2.png'
import visa_3_img from "../../assets/image/Pending1.png"
import rejected_img from '../../assets/image/rejected.png'
import pending_img from "../../assets/image/pending.png"
import booking_history_img from '../../assets/image/booking.png'
import Approved_img from '../../assets/image/Approved.png'
import { useAuth } from '../../authProvider/AuthProvider';
import {visaList} from "../../useApi/api"
import { CountryEnum } from "../Country";
import useApi from '../../useApi/useApi';
import { useEffect,useState } from 'react';



function Profile() {

  const {user} =  useAuth()
  
  // const { data, error, setUrl, setConfig } = useApi();
  const {
    data: visaData,
    setUrl: setvisaUrl,
    setConfig: setVisaConfig,
    loading:mainLoader,
  } = useApi();
  // console.log(data,"============",setvisaUrl)


   
  const handleHistory=()=>{
    window.location.href="/bookingHistory"
  }
  
// const [visaDataA, setVisaDataA] = useState([]);

  const handleVisa = async ()=>{
    try {
      let url = `${visaList}`;
      const getConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          curPage: 1,
          perPage: 100,
          sortBy: "createdAt",
          direction: "desc",
          whereClause: [
            {
              key: "string",
              value: "string",
              operator: "string",
            },
            // {
            //   key: "country",
            //   value:
            //     localStorage.getItem("country") == CountryEnum.UAE
            //       ? "UAE"
            //       : "UZBEKISTAN",
            //   operator: "string",
            // },
          ],
        }),
      };
      setvisaUrl(url);
    
      setVisaConfig(getConfig);
      // console.log(data,"============",visaData)

    } catch (error) {
      console.log(error?.message);
    }

  }
  useEffect(() => {
    handleVisa();
  }, []);

  const visa = {
    expiryDate: "expiryDate"
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };





  return (
    <section className="container Profile_section mt-3">
      <div className="row">
        <div className="col-12">
          <div className='d-flex align-items-center'>
            <Link to="/category" className="back_arrow me-2"><i className="fa-solid fa-arrow-left"></i></Link> <h5 className='mb-0 text-dark'>Profile </h5>

          </div>

        </div>
      </div>
      <div className="row my-3">
        <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-12 col-12">
          <div className="Profile_area">
            <div className='d-flex'>
              <div className='profile-img'>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 0.75C24.2149 0.75 18.5597 2.46548 13.7496 5.67951C8.93945 8.89355 5.1904 13.4618 2.97654 18.8065C0.762674 24.1512 0.183426 30.0324 1.31204 35.7064C2.44066 41.3803 5.22645 46.5922 9.31714 50.6829C13.4078 54.7736 18.6197 57.5593 24.2936 58.688C29.9676 59.8166 35.8488 59.2373 41.1935 57.0235C46.5382 54.8096 51.1065 51.0606 54.3205 46.2504C57.5345 41.4403 59.25 35.7851 59.25 30C59.2418 22.2449 56.1575 14.8098 50.6738 9.32617C45.1902 3.84251 37.7551 0.758189 30 0.75ZM14.835 49.5469C16.4627 47.0012 18.705 44.9063 21.3553 43.4552C24.0056 42.004 26.9785 41.2434 30 41.2434C33.0215 41.2434 35.9945 42.004 38.6447 43.4552C41.295 44.9063 43.5373 47.0012 45.165 49.5469C40.8291 52.919 35.4929 54.7498 30 54.7498C24.5071 54.7498 19.1709 52.919 14.835 49.5469ZM21 27.75C21 25.97 21.5279 24.2299 22.5168 22.7499C23.5057 21.2698 24.9113 20.1163 26.5559 19.4351C28.2004 18.7539 30.01 18.5757 31.7558 18.9229C33.5017 19.2702 35.1053 20.1274 36.364 21.386C37.6226 22.6447 38.4798 24.2484 38.8271 25.9942C39.1743 27.74 38.9961 29.5496 38.3149 31.1941C37.6337 32.8387 36.4802 34.2443 35.0001 35.2332C33.5201 36.2222 31.78 36.75 30 36.75C27.6131 36.75 25.3239 35.8018 23.6361 34.114C21.9482 32.4261 21 30.1369 21 27.75ZM48.495 46.4278C45.9856 42.7915 42.4571 39.9782 38.3531 38.3419C40.5576 36.6056 42.1662 34.2255 42.9553 31.5325C43.7444 28.8396 43.6747 25.9677 42.7559 23.3162C41.8371 20.6647 40.1148 18.3655 37.8287 16.7382C35.5426 15.1109 32.8062 14.2364 30 14.2364C27.1939 14.2364 24.4574 15.1109 22.1713 16.7382C19.8852 18.3655 18.163 20.6647 17.2442 23.3162C16.3254 25.9677 16.2556 28.8396 17.0447 31.5325C17.8338 34.2255 19.4424 36.6056 21.6469 38.3419C17.5429 39.9782 14.0144 42.7915 11.505 46.4278C8.33411 42.862 6.26159 38.4556 5.53701 33.7392C4.81244 29.0228 5.46671 24.1975 7.42103 19.8443C9.37535 15.4912 12.5464 11.7957 16.5523 9.20307C20.5583 6.61039 25.2283 5.231 30 5.231C34.7718 5.231 39.4418 6.61039 43.4477 9.20307C47.4536 11.7957 50.6247 15.4912 52.579 19.8443C54.5333 24.1975 55.1876 29.0228 54.463 33.7392C53.7384 38.4556 51.6659 42.862 48.495 46.4278Z" fill="#05028D" fill-opacity="0.38" />
                </svg>
              </div>
              <div>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p>{user.dateOfBirth}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
      <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
          <div className="Profile_area_visa">
            <div className='text-center mb-3'>
              <img src={booking_history_img} />
            </div>
            <h4 className='text-center mt-4'>Booking History</h4>
            <div className='text-center mt-2'>
              <button className='btn btn_Booking' onClick={handleHistory} >Booking check</button>
            </div>
          </div>
        </div>
      {visaData?.map((visa)=>
   <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-12 mb-3" >
          <div className="Profile_area_visa  " >
            <div className='text-center mb-3'>
             
             {visa.status === "approved" ? (<img src={visa_2_img} alt="Approved" />) 
             :visa.status === "rejected" ? (<img src={visa_img} alt="Rejected" />)
              : (<img src={visa_3_img} alt="Rejected" />)  }

            </div>
            <div className='row'>

              <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                <label>Visa Number</label>
                <h6>{visa.visaNumber}</h6>  
                </div>
            <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
              <label>Visa Validity </label>

                
                <h6>{formattedDate(visa.expiryDate)}</h6></div>
              
             
              <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                
                <label> Visa Status </label>
                <h6  className="text-capitalize">{visa.status}    {visa.status === "rejected" ? <svg className='cp' data-bs-toggle="modal" data-bs-target="#exampleModal" xmlns="http://www.w3.org/2000/svg" width="19" height="17" viewBox="0 0 19 17" fill="none">
                  <path d="M8.71895 1.7002C7.76417 1.7002 6.84849 2.05841 6.17336 2.69603C5.49823 3.33366 5.11895 4.19846 5.11895 5.10019C5.11895 6.00193 5.49823 6.86673 6.17336 7.50436C6.84849 8.14198 7.76417 8.50019 8.71895 8.50019C9.67372 8.50019 10.5894 8.14198 11.2645 7.50436C11.9397 6.86673 12.3189 6.00193 12.3189 5.10019C12.3189 4.19846 11.9397 3.33366 11.2645 2.69603C10.5894 2.05841 9.67372 1.7002 8.71895 1.7002ZM6.01895 5.10019C6.01895 4.42389 6.30341 3.77529 6.80976 3.29707C7.31611 2.81886 8.00286 2.5502 8.71895 2.5502C9.43503 2.5502 10.1218 2.81886 10.6281 3.29707C11.1345 3.77529 11.4189 4.42389 11.4189 5.10019C11.4189 5.7765 11.1345 6.4251 10.6281 6.90332C10.1218 7.38154 9.43503 7.65019 8.71895 7.65019C8.00286 7.65019 7.31611 7.38154 6.80976 6.90332C6.30341 6.4251 6.01895 5.7765 6.01895 5.10019ZM4.22705 9.35019C3.99002 9.3493 3.75514 9.3926 3.53587 9.47763C3.3166 9.56265 3.11726 9.68771 2.94928 9.84565C2.7813 10.0036 2.64798 10.1913 2.55698 10.398C2.46597 10.6047 2.41906 10.8263 2.41895 11.0502C2.41895 12.4875 3.16865 13.5713 4.34045 14.2776C5.49425 14.9721 7.04945 15.3002 8.71895 15.3002C9.08794 15.3002 9.45335 15.284 9.80795 15.2517C9.59318 14.9992 9.40678 14.7263 9.25175 14.4374C9.07715 14.4459 8.89895 14.4502 8.71895 14.4502C7.15744 14.4502 5.78765 14.1408 4.82465 13.5602C3.87965 12.9907 3.31895 12.1637 3.31895 11.0502C3.31895 10.5801 3.72215 10.2002 4.22705 10.2002H9.25805C9.42365 9.89589 9.62255 9.61114 9.85024 9.35019H4.22795H4.22705ZM13.1064 10.6252C13.1064 10.4843 13.1657 10.3492 13.2712 10.2495C13.3767 10.1499 13.5198 10.0939 13.6689 10.0939C13.8181 10.0939 13.9612 10.1499 14.0667 10.2495C14.1722 10.3492 14.2314 10.4843 14.2314 10.6252C14.2314 10.7661 14.1722 10.9012 14.0667 11.0008C13.9612 11.1005 13.8181 11.1564 13.6689 11.1564C13.5198 11.1564 13.3767 11.1005 13.2712 11.0008C13.1657 10.9012 13.1064 10.7661 13.1064 10.6252ZM14.1189 14.0252C14.1189 14.1379 14.0715 14.246 13.9871 14.3257C13.9028 14.4054 13.7883 14.4502 13.6689 14.4502C13.5496 14.4502 13.4351 14.4054 13.3507 14.3257C13.2664 14.246 13.2189 14.1379 13.2189 14.0252V12.3252C13.2189 12.2125 13.2664 12.1044 13.3507 12.0247C13.4351 11.945 13.5496 11.9002 13.6689 11.9002C13.7883 11.9002 13.9028 11.945 13.9871 12.0247C14.0715 12.1044 14.1189 12.2125 14.1189 12.3252V14.0252ZM9.61895 12.3252C9.61895 11.3107 10.0456 10.3378 10.8052 9.62051C11.5647 8.90318 12.5948 8.50019 13.6689 8.50019C14.7431 8.50019 15.7732 8.90318 16.5327 9.62051C17.2922 10.3378 17.7189 11.3107 17.7189 12.3252C17.7189 13.3396 17.2922 14.3126 16.5327 15.0299C15.7732 15.7472 14.7431 16.1502 13.6689 16.1502C12.5948 16.1502 11.5647 15.7472 10.8052 15.0299C10.0456 14.3126 9.61895 13.3396 9.61895 12.3252ZM10.5189 12.3252C10.5189 12.7159 10.6004 13.1027 10.7587 13.4637C10.917 13.8246 11.1491 14.1526 11.4416 14.4288C11.7341 14.7051 12.0813 14.9242 12.4635 15.0737C12.8457 15.2232 13.2553 15.3002 13.6689 15.3002C14.0826 15.3002 14.4922 15.2232 14.8744 15.0737C15.2566 14.9242 15.6038 14.7051 15.8963 14.4288C16.1888 14.1526 16.4209 13.8246 16.5792 13.4637C16.7375 13.1027 16.8189 12.7159 16.8189 12.3252C16.8189 11.5362 16.4871 10.7795 15.8963 10.2216C15.3056 9.66363 14.5044 9.35019 13.6689 9.35019C12.8335 9.35019 12.0323 9.66363 11.4416 10.2216C10.8508 10.7795 10.5189 11.5362 10.5189 12.3252Z" fill="#F81515" />
                </svg> : ""          }</h6></div>
            </div>
            {visa.status === "approved" ? (<img className='rejected_img' src={Approved_img} />) 
            :  visa.status === "rejected" ?( <img className='rejected_img' src={rejected_img} />) 
            : ( <img className='rejected_img' src={pending_img} />)}

          </div>
        </div>)} 
        {/* <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
          <div className="Profile_area_visa">
            <div className='text-center mb-3'>
              <img src={visa_2_img} />
            </div>
            <div className='row'>
              <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                <label>Visa Number</label>
                <h6>XXXX XXXX 0934</h6></div>
              <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                <label>Visa Validity </label>
                <h6>23-12-2023</h6></div>
              <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                <label>Visa Status  </label>
                <h6>Approved</h6></div>
            </div>
            <img className='rejected_img' src={Approved_img} />
          </div>
        </div> */}
       
      </div>

      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bolder" id="SelectPaymentLabel">XXXX XXXX 0934</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body Profile_area_visa">
              <div className='row'>
                <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                  <label>Visa Number</label>
                  <h6>XXXX XXXX 0934</h6></div>
                <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                  <label>Visa Validity </label>
                  <h6>23-12-2023</h6></div>
                <div className='col-lg-6 col-md-6 mb-3 profile-visa_content'>
                  <label>Visa Status  </label>
                  <h6>Rejected </h6></div>
                <div className='col-lg-12 col-md-12 mb-3 profile-visa_content'>
                  <h6>What is reasons ?  </h6>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p></div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </section>

  )
}

export default Profile