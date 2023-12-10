import React, { useEffect, useState } from "react";
import Logo2 from "../../../assets/image/Logo2.png";
import Google_icon from "../../../assets/image/Google_icon.png";
import Facebook_icon from "../../../assets/image/Facebook_icon.png";
import Apply_icon from "../../../assets/image/Apply_icon.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useApi from "../../../useApi/useApi";
import { userSignin,userAbout } from "../../../useApi/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../authProvider/AuthProvider";
import {
  Backdrop,
  Box,
  CircularProgress,
} from "../../../../node_modules/@mui/material/index";
import Swal from "sweetalert2";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(12).required(),
});

function SignIn() {
  const { data, loading, error, setUrl, setConfig } = useApi();
  let [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const hanldeSignIn = async (userCred) => {
    try {
      const getConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCred),
      };
      setUrl(userSignin);
      setConfig(getConfig);
    } catch (err) {
      console.log(err.message);
    }
  };
  const NavigaeHandler = () => {
    Swal.fire({
      icon: "success",

      text: " Login Successfully.",
    });
    navigate("/ChooseCountry");
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/chooseCountry";
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = async (userData) => {
    console.log("datat from handler ==> ", userData);
    await hanldeSignIn(userData);

    reset();
  };

  // if(loading){
  //         return <div>Loading ...

  //         </div>
  // }
  if (data) {
    login(data);
    NavigaeHandler();
  }

  const handleAbout=( )=>{
    try{
      let apiUrl=`${userAbout}`
      axios
      .get(
        apiUrl
      )
      .then((response) => {
        // Create a blob URL from the response data
        if(response?.data?.statusCode ==200){
          window.open(response.data.data?.About,"_blank");
        }
      });

    }
    catch (error) {
      console.error("Error:", error.message);
    }
  }










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
          open={loading}
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
                    <h1 className="fw-bolder">Let’s Get Started</h1>
                    <p className="fw-bold font_21">
                      Enter your details to continue
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmitHandler)}
                    className="mt-5"
                  >
                    <div className="form-group mb-3">
                      <input
                        {...register("email")}
                        type="email"
                        name="email"
                        id=""
                        className="form-control"
                        required
                        placeholder="Enter your email id"
                        aria-describedby="helpId"
                      />
                      {/* <p style={{color:"red"}}>{errors.email?.message}</p> */}
                    </div>

                    <div className="form-group mb-3 position-relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id=""
                        className="form-control"
                        required
                        placeholder="Password"
                        aria-describedby="helpId"
                      />
                      {/* <p style={{color:"red"}}>{errors.password?.message}</p> */}

                      <div
                        className="password_eyes_icon"
                        onClick={handleTogglePassword}
                      >
                        <i
                          className={`fa-solid ${
                            showPassword ? "fa-eye" : "fa-eye-slash"
                          }`}
                        ></i>
                      </div>
                    </div>

                    <div className="ForgotPassword_arae">
                      <Link to="/ForgotPassword">Forgot Password?</Link>
                    </div>
                    <button className="btn btn_success mt-5" type="submit">
                      Login{" "}
                      <i className="fa-solid fa-arrow-right-long ms-2"></i>
                    </button>
                  </form>

                  <div className="signUp_link_area mt-4 mb-5">
                    <p>
                      New Here? <Link to="/SignUp">Sign Up </Link>
                    </p>
                    <a className="text-muted text-decoration-underline " style={{ cursor: "pointer"}}  onClick={handleAbout}>         About Us   </a>
                  </div>
                  {/* <div className="signIn_ContinueWith_area">
                                <p>Or Continue With </p>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Link to="">
                                        <img src={Google_icon} alt=""/>
                                    </Link>
                                    <Link to="">
                                        <img src={Facebook_icon} alt=""/>
                                    </Link>
                                    <Link to="">
                                        <img src={Apply_icon} alt=""/>
                                    </Link>
                                </div>
                            </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
