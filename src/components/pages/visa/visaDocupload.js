import React, { useState } from "react";
import Passport_Upload from "../../../assets/image/Passport_Upload.png";
import PhotoUpload from "../../../assets/image/PhotoUpload.png";
import Header from "../../common/header";
import { Link } from "react-router-dom";
import { onError } from "../../../utils/helper";
import { axiosClient } from "../../../utils/axiosConfig";
import { visaDetails } from "../../../useApi/api";
import Swal from "sweetalert2";
import {
  Backdrop,
  Box,
  CircularProgress,
} from "../../../../node_modules/@mui/material/index";

function VisaDocupload() {
  const [photo, setPhoto] = useState(null);
  const [passport, setPassport] = useState(null);
  const [loading, setloading] = useState(false);
  const [number, setNumber] = useState(null);
  const [date, setDate] = useState(null);

  
console.log(number,"=======================")

const today = new Date().toISOString().split('T')[0]; // Get today's date in the format YYYY-MM-DD


  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };
  
  const OnNumberChange =(e)=>{
    const file = e.target.value;
    const numericValue = file.replace(/[^0-9]/g, '')
    setNumber(numericValue);
    
 }

 const OnDateChange =(e)=>{
  const file = e.target.value;
  setDate(file);
}



  const onPassportChange = (e) => {
    const file = e.target.files[0];
    setPassport(file);
  };

  const onUploadVisa = async () => {
    // if (!passport || !photo || !number || !date) {
    //   onError("Documents required.");
    //   return;
    // }
  
     if (!number) {
      onError("Visa number is required.");
      return;
    } else if (!date) {
      onError("Visa expiration date is required.");
      return;
    }  if (!passport) {
      onError("Passport photo is required.");
      return;
    } else if (!photo) {
      onError("User photo is required.");
      return;}

    try {
      setloading(true);

      const visaMonths = localStorage.getItem("visaOption") || "";
      const formData = new FormData();
      formData.append("id", 0);
      formData.append("visaNumber",number);
      formData.append("expiryDate",date);
      formData.append("passportImage", passport);
      formData.append("userImage", photo);
      formData.append("visaOption", visaMonths);
      const res = await axiosClient.post(visaDetails, formData);
      console.log(res, "something here 12");

      if(res.status == 200 ||res.status == 201){
        const data = res?.data;
        console.log(data, "something here");
        if (data?.statusCode == 200) {
          setPhoto(null);
          setPassport(null);
          setDate("dd-mm-yyyy");
          setNumber("");
        
          setloading(false);
          Swal.fire({
            icon: "success",
            text: "Visa uploaded successfully",
          });
        } else {
          setloading(false);
          Swal.fire({
            icon: "warning",
            text: data?.message,
          });
        }
      }else{
         onError(res.data?.message || "Bad Request")
      }

      
    } catch (e) {
      onError(e?.message);
      setloading(false);
    }
  };

  return (
    <div>
      <Header />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress />
        </Backdrop>
      </Box>

      <section className="container-fluid VisaDocUpload_section mt-3">
        <div className="container">
        <div className="row">
            <Link to="/VisaOptions" className="back_arrow">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
        </div>
                <div className="row my-3">
          <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-9 col-12 m-auto">
            <div className="VisaDocUpload_area ">
              <h3 className="fw-bolder text-center">Document Upload</h3>
              <div className="row">
              <div className="col-lg-6 mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                Visa Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={number}
                  onChange={OnNumberChange}
                                   
                />
                                    </div>
              <div className="col-lg-6 mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                Visa Validity
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={date}
                  onChange={OnDateChange}
                  min={today}  // Set the minimum date to today
                  
                  
                />
                                                    </div>
              </div>
             
              
              <div className="VisaDocUpload_PasspostPhoto_area mt-4">
                <div className="dropzone">
                  <img src={Passport_Upload} className="upload-icon" />

                  <input
                    type="file"
                    onChange={onPassportChange}
                    accept=".pdf, image/*"
                    className="upload-input"
                  />
                  <span>{passport?.name}</span>
                </div>

                <div className="dropzone">
                  <img src={PhotoUpload} className="upload-icon" />

                  <input
                    type="file"
                    onChange={onPhotoChange}
                    accept=" image/*"
                    className="upload-input"
                  />
                  <span>{photo?.name}</span>
                </div>
              </div>
              <div className="text-start mt-4 mb-5">
                <h5 className="fw-bold">Description</h5>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur ma.
                </p>
              </div>
              <div className="text-center">
              <button
                className="btn btn_success"
                onClick={() => onUploadVisa()}
              >
                Submit
              </button>
              </div>
              
            </div>
          </div>
        </div>
                </div>
      </section>

      <div
        className="modal fade SelectPayment_modal"
        id="SelectPayment"
        tabindex="-1"
        data-bs-backdrop="static"
        aria-labelledby="SelectPaymentLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bolder" id="SelectPaymentLabel">
                Select Payment
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="payment_Option_item mb-3">
                <p className="mb-0">Visa & Master & Union Pay</p>
                <input
                  type="radio"
                  className="form-check-input"
                  name="payment_Option"
                  id=""
                />
              </div>
              <div className="payment_Option_item mb-3">
                <p className="mb-0">Uz Card & humo</p>
                <input
                  type="radio"
                  className="form-check-input"
                  name="payment_Option"
                  id=""
                />
              </div>
              <div className="payment_Option_item mb-3">
                <p className="mb-0">Crypto</p>
                <input
                  type="radio"
                  className="form-check-input"
                  name="payment_Option"
                  id=""
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger fw-bolder"
                data-bs-dismiss="modal"
              >
                Discard
              </button>
              <button type="button" className="btn btn-success fw-bolder">
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisaDocupload;
