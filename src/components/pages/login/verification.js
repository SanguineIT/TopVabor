import React, { useState, useRef, useEffect } from "react";
import Logo2 from "../../../assets/image/Logo2.png";
import Header from "../../common/header";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useApi from "../../../useApi/useApi";
import { userVerifyotp,userForgotpassword } from "../../../useApi/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Backdrop,
  Box,
  CircularProgress,
} from "../../../../node_modules/@mui/material/index";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  otp1: yup.string().max(1).min(1).required().trim(),
  otp2: yup.string().max(1).min(1).required().trim(),
  otp3: yup.string().max(1).min(1).required().trim(),
  otp4: yup.string().max(1).min(1).required().trim(),
});

function Verification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [ Spinner , SetSpinner ] = useState(false)


  
  // const handleKeydown = (event, index) => {
  //   if (event.key === 'Backspace' && index >= 0) {
  //     const updatedOtp = [...otp];
  //     updatedOtp[index] = '';
  //     setOtp(updatedOtp);
  //     inputRefs[index > 0 ? index - 1 : index].current.focus();
  //   }
  // };

  // useEffect(() => {
  //   inputRefs.forEach((ref, index) => {
  //     if (ref.current) {
  //       ref.current.addEventListener('keydown', (event) => handleKeydown(event, index));
  //     }
  //   });

  //   return () => {
  //     inputRefs.forEach((ref, index) => {
  //       if (ref.current) {
  //         ref.current.removeEventListener('keydown', (event) => handleKeydown(event, index));
  //       }
  //     });
  //   };
  // }, [inputRefs]);



  // const handleOtpChange = (e, index) => {
  //   const inputOtp = e.target.value;

  //   if (/^[0-9]$/.test(inputOtp)) {
  //     const updatedOtp = [...otp];
  //     updatedOtp[index] = inputOtp;
  //     setOtp(updatedOtp);

  //     // Focus on the next input field, if available
  //     if (index < 3 && inputOtp !== "") {
  //       inputRefs[index + 1 ].current.focus();
  //     }
  //   }
  // };
  const handleOtpChange = (e, index) => {
    const inputOtp = e.target.value;
  
    if (inputOtp === "" || /^[0-9]$/.test(inputOtp)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = inputOtp;
      setOtp(updatedOtp);
  
      // Handle backspace
      if (inputOtp === "" && index > 0) {
        inputRefs[index - 1].current.focus();
      }
  
      // Focus on the next input field, if available
      if (index < 3 && inputOtp !== "") {
        inputRefs[index + 1].current.focus();
      }
    }
  };
  

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log("enteredOtp  ==> ", enteredOtp);
    hanldeVerify(enteredOtp);
    // Replace '123456' with your actual OTP for verification
    if (enteredOtp === "9879879") {
      Swal.fire("success");
      // OTP is correct
      // Set some state to indicate successful verification
    } else {
      // OTP is incorrect
      // Display an error message or reset the input fields
      setOtp(["", "", "", ""]);
      inputRefs[0].current.focus();
    }
  };

  const { data, loading, error, setUrl, setConfig } = useApi();
  let [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const hanldeVerify = async (userCred) => {
    try {
      const getConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          otp: userCred,
        }),
      };
      setUrl(userVerifyotp);
      setConfig(getConfig);
    } catch (err) {
      console.log(err.message);
    }
  };
  const NavigaeHandler = () => {
    navigate("/ResetPassword");
  };



const hanldeResend =async()=>{
   try{
    SetSpinner(true)
        let apiUrl = `${userForgotpassword}?email=${localStorage.getItem("email")}`

        const response = await axios.post(apiUrl);
        console.log(response.data.data ,"this is APi response ")    
        if(response.data.statusCode == 200){
            console.log('inside the if ')
            Swal.fire({
                icon: 'success',
            
                text: ' OTP Resend Successfully.',
            
              })
        }
        SetSpinner(false)
    } catch (error) {
      console.error('Error:', error.message);
    }

}

  if (data) {
    NavigaeHandler();
  }

//   if ( Spinner) {
//     return <div>
// <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100%",
//         width: "100%",
//       }}
//     >
//       <Backdrop
//         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={Spinner}
//       >
//         <CircularProgress />
//       </Backdrop>
//     </Box>

//     </div>
// }

  return (
    <div>
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
          open={loading ||  Spinner}
        >
          <CircularProgress />
        </Backdrop>
      </Box>
     

      <section className="SignIn_section container-fluid">
        <div className="container">
          <div className="SignIn_contetn_area">
            <div className="row w-100">
              <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-10 col-12 m-auto">
                <div className="SignIn_logoImages text-center">
                  <img src={Logo2} alt="" />
                </div>
                <div className="SignIn_form_area text-center">
                  <div className="SignIn_form_heading">
                    <h1 className="fw-bolder">Verification Code</h1>
                    <p className="fw-bold font_21">Please enter 4 digit code here</p>
                  </div>

                  <form onSubmit={handleVerify} className="mt-5">
                    <div className="Verify_InputBoxs mb-3">
                      {otp.map((digit, index) => (
                        <input
                          type="text"
                          key={index}
                          value={digit}
                          ref={inputRefs[index]}
                          onChange={(e) => handleOtpChange(e, index)}
                        />
                      ))}

                      {/* <p style={{ color: "red" }}>{errors.otp1?.message}</p> */}
                    </div>
                 
               
                    <button className="btn btn_success mt-5" type="submit">
                      Verify <i className="fa-solid fa-arrow-right-long ms-2"></i>
                    </button>
                  </form>
                  
                  <div className="text-center mt-3 ">
                      <a className="resend-code" onClick={hanldeResend}  >Resend Code</a>
                    </div>

                  <div className="signUp_link_area mt-4 mb-5">
                    <p>
                      Use a different Email{" "}
                      <Link to="/ForgotPassword">Edit</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Verification;
