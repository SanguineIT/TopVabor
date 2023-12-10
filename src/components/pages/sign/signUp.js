import React, { useEffect, useState } from "react";
import Logo2 from "../../../assets/image/Logo2.png";
import Google_icon from "../../../assets/image/Google_icon.png";
import Facebook_icon from "../../../assets/image/Facebook_icon.png";
import Apply_icon from "../../../assets/image/Apply_icon.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment/moment";

import useApi from "../../../useApi/useApi";

import { userSignup, userTerms } from "../../../useApi/api";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  Box,
  CircularProgress,
} from "../../../../node_modules/@mui/material/index";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../authProvider/AuthProvider";

const schema = yup.object().shape({
  name: yup.string().min(2).max(55).required().trim(),
  dateOfBirth: yup
    .date()
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      const result = moment(originalValue).format("dd.MM.yyyy");
      return result;
    })
    .typeError("please enter a valid date")
    .required()
    .min("1969-11-13", "Date is too early")
    .max(moment(), "future date not valid."),
  email: yup
    .string()
    .email()
    .required()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email format"
    ),
  password: yup
    .string()
    .min(8)
    .max(32)
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    })
    .required(),
});

function SignUp() {
  const [CheckboxChecked, setCheckboxChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const { data, loading, error, setUrl, setConfig } = useApi();
  let [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const hanldeSignUp = async (userCred) => {
    try {
      const getConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCred),
      };
      setUrl(userSignup);
      setConfig(getConfig);
    } catch (err) {
      console.log(err.message);
    }
  };
  const {  user } = useAuth();


  useEffect(() => {
    if (user) {
      window.location.href = "/chooseCountry";
    }
  }, [user]);
  const NavigaeHandler = () => {
    Swal.fire({
      icon: "success",

      text: " SignUp Successfully.",
    });
    navigate("/signIn");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = async (userData) => {
    const dateObject = new Date(userData.dateOfBirth);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Months are zero-based (0 = January)
    const day = dateObject.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    userData.dateOfBirth = formattedDate;
    await hanldeSignUp(userData);

    reset();
  };
  if (data) {
    NavigaeHandler();
  }

  const handleCheckboxChange = () => {
    setCheckboxChecked(!CheckboxChecked);
  };

  // const handleTerms = async () => {
  //   try {
  //     let apiUrl = `${userTerms}`;
  //     axios
  //       .get(
  //         apiUrl,
  //         { responseType: "blob" } // !!!
  //       )
  //       .then((response) => {
  //         // Create a blob URL from the response data
  //         window.open(URL.createObjectURL(response.data));
  //       });
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   }
  // };

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
              <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-10 col-12 m-auto p-0">
                <div className="SignIn_logoImages text-center">
                  <img src={Logo2} alt="" />
                </div>
                <div className="SignIn_form_area text-center">
                  <div className="SignIn_form_heading">
                    <h1 className="fw-bolder">Create Your Account</h1>
                    <p className="fw-bold font_21">
                      Please enter your details here
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmitHandler)}
                    className="mt-4"
                  >
                    <div className="form-group mb-3">
                      <input
                        {...register("name")}
                        type="text"
                        name="name"
                        id=""
                        className="form-control"
                        required
                        placeholder="Name*"
                      />
                      <p className="text-start text-danger">
                        {errors.name?.message}
                      </p>
                    </div>
                    <div className="form-group mb-3">
                      <input
                        {...register("dateOfBirth")}
                        max="2005-12-31"
                        type="date"
                        name="dateOfBirth"
                        id=""
                        className="form-control"
                        required
                        placeholder="Date of birth*"
                      />
                      <p className="text-start text-danger">
                        {errors.dateOfBirth?.message}
                      </p>
                    </div>
                    <div className="form-group mb-3">
                      <input
                        {...register("email")}
                        type="email"
                        name="email"
                        id=""
                        className="form-control"
                        required
                        placeholder="Email Id*"
                      />
                      <p className="text-start text-danger">
                        {errors.email?.message}
                      </p>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id=""
                        className="form-control"
                        required
                        placeholder="Password *"
                      />
                      <p className="text-start text-danger">
                        {errors.password?.message}
                      </p>

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
                      <div className="form-check text-start">
                        <input
                          className="form-check-input Check_box"
                          type="checkbox"
                          checked={CheckboxChecked}
                          onChange={handleCheckboxChange}
                          value=""
                          id="flexCheckDefault"
                        />
                        <label className="form-check-label">
                          Accept{" "}
                          <a className="resend-code" href={"https://restroreff.microlent.com/api/TopvaborTermsofUse.pdf"} target="_blank"  download={true}>
                            terms and conditions
                          </a>
                        </label>
                      </div>
                    </div>
                    <button
                      className="btn btn_success mt-4"
                      type="submit"
                      disabled={!CheckboxChecked}
                    >
                      Sign Up{" "}
                      <i className="fa-solid fa-arrow-right-long ms-2"></i>
                    </button>
                  </form>

                  <div className="signUp_link_area mt-4 mb-4">
                    <p>
                      Already have a account? <Link to="/SignIn">Sign In</Link>
                    </p>
                  </div>
                  <div className="signUp_link_area mt-4 mb-4">
                    <p className=" fw-normal">
                      <span className="text-danger"> Note:</span> Please fill
                      valid data, it will be used while creating invoice.
                    </p>
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

export default SignUp;
