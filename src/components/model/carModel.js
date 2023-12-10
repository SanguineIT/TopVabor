import React, { useEffect, useRef, useState } from "react";
import image_6 from "../../assets/image/image 6.png";
import seat from "../../assets/image/seat.png";
import Car from "../../assets/image/Car.png";
import moment from "moment";
import { axiosClient } from "../../utils/axiosConfig";
import { useAuth } from "../../authProvider/AuthProvider";
import Swal from "sweetalert2";
import { CountryEnum } from "../Country";
import Document_Upload from "../../assets/image/driving-licence.png";
import { currencySymbols, onError, selectedCountry } from "../../utils/helper";
import { bookingCreate, stripeLink } from "../../useApi/api";
import { Backdrop, Box, CircularProgress } from "@mui/material";

function CarModel({ car }) {
  const [active, setActive] = useState(1);
  const { user } = useAuth();
  const startDate = JSON.parse(localStorage.getItem("startDate") || "{}");
  const endDate = JSON.parse(localStorage.getItem("endDate") || "{}");
  const dateDifference = localStorage.getItem("dateDifference");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  let startDateGet = null;
  let endDateGet = null;
  let fullStartDate = null;
  let fullEndDate = null;
  if (startDate && endDate) {
    startDateGet = moment(startDate).format("MMMM Do");
    endDateGet = moment(endDate).format("Do");
    fullEndDate = moment(endDate).format("LLL");
    fullStartDate = moment(startDate).format("LLL");
  }

  const createBooking = async () => {
    try {
      if (!document) {
        onError("Driving Licence Required.");
        return;
      }
      setLoading(true);
      const place = localStorage.getItem("country") || "";
      const country = place == CountryEnum.UAE ? "UAE" : "UZBEKISTAN";
      const payload = new FormData();
      payload.append("id", 0);
      payload.append("startDate", startDate);
      payload.append("endDate", endDate);
      payload.append("UserId", user?.id);
      payload.append("BookingType", "Car");
      payload.append("CarId", car.id);
      payload.append("DrivingLicence", document);
      payload.append("Place", country);
      const res = await axiosClient.post(bookingCreate, payload);
      const data = res?.data;
      if (data?.statusCode == 200) {
        setDocument(null);
        const bookingId = data?.data.id;
        axiosClient
          .get(stripeLink, {
            params: {
              BookingId: bookingId,
              amount: dateDifference * parseInt(car?.pricePerDay, 0),
              currency: "usd",
            },
          })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              if (res.data.statusCode == 200) {
                setDocument(null);
                setActive(1);
                window.location.href = res?.data?.data;
              } else {
                onError(res?.data?.message || "Bad Request");
              }
            } else {
              onError("Bad Request");
            }
          })
          .catch((e) => onError(e.message));
      } else {
        onError(data.message);
      }
    } catch (e) {
      onError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };
  const [selectedImg, setSelectedImg] = useState(null);
  const handleImageClick = (image) => {
    setSelectedImg(image);
  };

  return (
<div>     <Box
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

    <div
      className="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static" // Set the backdrop option to 'static' to prevent closing on outside click
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
        {active == 1 && (
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Car Detail
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setActive(1);
                  setSelectedImg(null);
                  setDocument(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-6 car-main-left mb-3">
                  <div className="car-booking ">
                    {/* <h5 className="d-flex align-items-center fw-bold">
                      <div className="cancel-car me-2 position-static d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-info"></i>
                      </div>{" "}
                      Free Cancellation
                    </h5> */}
                    <img
                      src={selectedImg ? selectedImg : car?.CarpicturePathUrl}
                      alt=""
                    />
                    <h3>{car?.model}</h3>
                    {car?.year && <span>{car?.year}</span>}
                    <div className="car-select">
                      {car?.imagePathArray &&
                        car?.imagePathArray?.map((image) => (
                          <img
                            src={
                              image ??
                              "https://th.bing.com/th/id/R.0d92d616a62a206e25ff225aa8eb895e?rik=6n9%2bIzamBXhHMg&riu=http%3a%2f%2fwww.clker.com%2fcliparts%2fq%2fL%2fP%2fY%2ft%2f6%2fno-image-available-hi.png&ehk=nNlk%2b17NB%2bDCsszga53NPRne4iPI2is1ZToy%2fHBX9Hk%3d&risl=&pid=ImgRaw&r=0"
                            }
                            alt=""
                            className={`${
                              selectedImg == image ? "img-selct-active" : ""
                            }`}
                            onClick={() => handleImageClick(image)}
                          />
                        ))}
                      {/* <img src={car?.CarpicturePathUrl || Car} alt=""  />
                    <img src={car?.CarpicturePathUrl || Car} alt="" /> */}
                    </div>
                    <h5 className="my-3">Specifications</h5>
                    <div className="Specifications">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="seat-Availability">
                            <img src={seat} alt="" />{" "}
                          </div>
                          <h6 className="ms-2  mb-0"> Seat Availability</h6>
                        </div>
                        <h5 className="mb-0">{car?.seats} Seats</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="cost_right">
                    <h4 className="cost-title mb-4">Cost</h4>
                    <div className="d-flex justify-content-between align-items-center mb-4 car_header_1">
                      <div className="car_header_1">
                        <h6>
                          Rent for {dateDifference >= 1 ? dateDifference : 1}{" "}
                          {dateDifference > 1 ? "days" : "day"}
                        </h6>
                        <p>
                          {/* Burgas,  */}
                          {startDateGet} — {endDateGet}
                        </p>
                      </div>
                      <h6>
                        {dateDifference * parseInt(car?.pricePerDay, 0)}
                        {currencySymbols[selectedCountry]}
                      </h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1">
                      <h6>Delivery</h6>
                      <h6>0 {currencySymbols[selectedCountry]}</h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1">
                      <p>At pick-up</p>
                      <p>0 {currencySymbols[selectedCountry]}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1 mb-4">
                      <p>At drop-off</p>
                      <p>0 {currencySymbols[selectedCountry]}</p>
                    </div>
                    <div className="car_header_1 mb-4">
                      <h6>Other</h6>

                      <div className="d-flex justify-content-between align-items-center car_header_1">
                        <p>TPL</p>
                        <p>0 {currencySymbols[selectedCountry]}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1 mb-4">
                      <h6>Total</h6>
                      {/* <h6>336€</h6> */}
                      <h6>
                        {dateDifference * parseInt(car?.pricePerDay, 0)}{" "}
                        {currencySymbols[selectedCountry]}
                      </h6>
                    </div>
                    <button
                      className="btn btn-booking"
                      onClick={() => {
                        setActive(2);
                        setSelectedImg(null);
                      }}
                    >
                      Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {active == 2 && (
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Payment Confirmation
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setActive(1);
                  setSelectedImg(null);
                  setDocument(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-6 car-main-left mb-3">
                  <div className="car-booking ">
                    {/* <h5 className="d-flex align-items-center fw-bold">
                      <div className="cancel-car me-2 position-static d-flex justify-content-center align-items-center">
                        <i className="fa-solid fa-xmark"></i>
                      </div>{" "}
                      Free Cancellation
                    </h5> */}
                    <img src={car?.CarpicturePathUrl || Car} alt="" />
                    <h3>{car?.model}</h3>
                    {car?.year && <span>{car?.year}</span>}
                    <div className="payment-content">
                      {/* <div className="d-flex align-items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 35 35"
                          fill="none"
                        >
                          <path
                            d="M17.2883 8.9142C16.2732 8.9142 15.2809 9.21521 14.4369 9.77916C13.5929 10.3431 12.935 11.1447 12.5466 12.0825C12.1581 13.0203 12.0565 14.0523 12.2545 15.0479C12.4526 16.0435 12.9414 16.958 13.6592 17.6758C14.3769 18.3936 15.2914 18.8824 16.287 19.0804C17.2826 19.2784 18.3146 19.1768 19.2524 18.7883C20.1902 18.3999 20.9918 17.742 21.5558 16.898C22.1197 16.054 22.4207 15.0617 22.4207 14.0466C22.4207 12.6854 21.88 11.38 20.9175 10.4174C19.955 9.45493 18.6495 8.9142 17.2883 8.9142ZM17.2883 17.5583C16.5938 17.5583 15.9148 17.3523 15.3373 16.9664C14.7599 16.5806 14.3098 16.0321 14.044 15.3905C13.7782 14.7488 13.7086 14.0427 13.8441 13.3615C13.9796 12.6803 14.3141 12.0546 14.8052 11.5635C15.2963 11.0724 15.922 10.7379 16.6032 10.6024C17.2844 10.4669 17.9905 10.5365 18.6322 10.8023C19.2738 11.0681 19.8223 11.5182 20.2081 12.0956C20.594 12.6731 20.8 13.3521 20.8 14.0466C20.8 14.978 20.43 15.8712 19.7714 16.5297C19.1129 17.1883 18.2197 17.5583 17.2883 17.5583ZM17.2883 2.43114C14.2088 2.43472 11.2564 3.65964 9.07889 5.83718C6.90134 8.01473 5.67643 10.9671 5.67285 14.0466C5.67285 18.2214 7.60966 22.6556 11.2739 26.8695C12.9278 28.7809 14.7892 30.5023 16.8237 32.002C16.9599 32.0973 17.1221 32.1484 17.2883 32.1484C17.4545 32.1484 17.6167 32.0973 17.7529 32.002C19.7875 30.5023 21.6488 28.7809 23.3027 26.8695C26.967 22.6556 28.9038 18.2255 28.9038 14.0466C28.9002 10.9671 27.6753 8.01473 25.4977 5.83718C23.3202 3.65964 20.3678 2.43472 17.2883 2.43114ZM17.2883 30.3231C15.2624 28.7591 7.29361 22.0991 7.29361 14.0466C7.29361 11.3959 8.34662 8.85366 10.221 6.97929C12.0954 5.10492 14.6376 4.05191 17.2883 4.05191C19.9391 4.05191 22.4813 5.10492 24.3556 6.97929C26.23 8.85366 27.283 11.3959 27.283 14.0466C27.283 22.0991 19.3143 28.7591 17.2883 30.3231Z"
                            fill="#666666"
                          />
                        </svg>
                        <h5 className="ms-3">Dubai</h5>
                      </div> */}
                      <div className="d-flex align-items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                        >
                          <path
                            d="M8.5095 0C8.78798 0 9.05505 0.110625 9.25196 0.307538C9.44888 0.504451 9.5595 0.771523 9.5595 1.05V3.0135H20.835V1.0635C20.835 0.785023 20.9456 0.517951 21.1425 0.321038C21.3395 0.124125 21.6065 0.0135 21.885 0.0135C22.1635 0.0135 22.4305 0.124125 22.6275 0.321038C22.8244 0.517951 22.935 0.785023 22.935 1.0635V3.0135H27C27.7954 3.0135 28.5582 3.32936 29.1208 3.89165C29.6834 4.45393 29.9996 5.21661 30 6.012V27.0015C29.9996 27.7969 29.6834 28.5596 29.1208 29.1219C28.5582 29.6841 27.7954 30 27 30H3C2.20461 30 1.44178 29.6841 0.87921 29.1219C0.316644 28.5596 0.000397695 27.7969 0 27.0015L0 6.012C0.000397695 5.21661 0.316644 4.45393 0.87921 3.89165C1.44178 3.32936 2.20461 3.0135 3 3.0135H7.4595V1.0485C7.4599 0.770283 7.5707 0.503596 7.76757 0.307007C7.96444 0.110418 8.23128 -2.83895e-07 8.5095 0ZM2.1 11.613V27.0015C2.1 27.1197 2.12328 27.2367 2.16851 27.3459C2.21374 27.4551 2.28003 27.5543 2.3636 27.6379C2.44718 27.7215 2.54639 27.7878 2.65558 27.833C2.76478 27.8782 2.88181 27.9015 3 27.9015H27C27.1182 27.9015 27.2352 27.8782 27.3444 27.833C27.4536 27.7878 27.5528 27.7215 27.6364 27.6379C27.72 27.5543 27.7863 27.4551 27.8315 27.3459C27.8767 27.2367 27.9 27.1197 27.9 27.0015V11.634L2.1 11.613ZM10.0005 21.9285V24.4275H7.5V21.9285H10.0005ZM16.2495 21.9285V24.4275H13.7505V21.9285H16.2495ZM22.5 21.9285V24.4275H19.9995V21.9285H22.5ZM10.0005 15.963V18.462H7.5V15.963H10.0005ZM16.2495 15.963V18.462H13.7505V15.963H16.2495ZM22.5 15.963V18.462H19.9995V15.963H22.5ZM7.4595 5.112H3C2.88181 5.112 2.76478 5.13528 2.65558 5.18051C2.54639 5.22574 2.44718 5.29203 2.3636 5.3756C2.28003 5.45918 2.21374 5.55839 2.16851 5.66758C2.12328 5.77678 2.1 5.89381 2.1 6.012V9.5145L27.9 9.5355V6.012C27.9 5.89381 27.8767 5.77678 27.8315 5.66758C27.7863 5.55839 27.72 5.45918 27.6364 5.3756C27.5528 5.29203 27.4536 5.22574 27.3444 5.18051C27.2352 5.13528 27.1182 5.112 27 5.112H22.935V6.5055C22.935 6.78398 22.8244 7.05105 22.6275 7.24796C22.4305 7.44488 22.1635 7.5555 21.885 7.5555C21.6065 7.5555 21.3395 7.44488 21.1425 7.24796C20.9456 7.05105 20.835 6.78398 20.835 6.5055V5.112H9.5595V6.492C9.5595 6.77048 9.44888 7.03755 9.25196 7.23446C9.05505 7.43138 8.78798 7.542 8.5095 7.542C8.23102 7.542 7.96395 7.43138 7.76704 7.23446C7.57012 7.03755 7.4595 6.77048 7.4595 6.492V5.112Z"
                            fill="#666666"
                          />
                        </svg>
                        {/* <h5 className="ms-3"> Sep. 22, 2023 , 11:30 AM</h5> */}
                        <h5 className="ms-3"> {fullStartDate}</h5>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                        >
                          <path
                            d="M8.5095 0C8.78798 0 9.05505 0.110625 9.25196 0.307538C9.44888 0.504451 9.5595 0.771523 9.5595 1.05V3.0135H20.835V1.0635C20.835 0.785023 20.9456 0.517951 21.1425 0.321038C21.3395 0.124125 21.6065 0.0135 21.885 0.0135C22.1635 0.0135 22.4305 0.124125 22.6275 0.321038C22.8244 0.517951 22.935 0.785023 22.935 1.0635V3.0135H27C27.7954 3.0135 28.5582 3.32936 29.1208 3.89165C29.6834 4.45393 29.9996 5.21661 30 6.012V27.0015C29.9996 27.7969 29.6834 28.5596 29.1208 29.1219C28.5582 29.6841 27.7954 30 27 30H3C2.20461 30 1.44178 29.6841 0.87921 29.1219C0.316644 28.5596 0.000397695 27.7969 0 27.0015L0 6.012C0.000397695 5.21661 0.316644 4.45393 0.87921 3.89165C1.44178 3.32936 2.20461 3.0135 3 3.0135H7.4595V1.0485C7.4599 0.770283 7.5707 0.503596 7.76757 0.307007C7.96444 0.110418 8.23128 -2.83895e-07 8.5095 0ZM2.1 11.613V27.0015C2.1 27.1197 2.12328 27.2367 2.16851 27.3459C2.21374 27.4551 2.28003 27.5543 2.3636 27.6379C2.44718 27.7215 2.54639 27.7878 2.65558 27.833C2.76478 27.8782 2.88181 27.9015 3 27.9015H27C27.1182 27.9015 27.2352 27.8782 27.3444 27.833C27.4536 27.7878 27.5528 27.7215 27.6364 27.6379C27.72 27.5543 27.7863 27.4551 27.8315 27.3459C27.8767 27.2367 27.9 27.1197 27.9 27.0015V11.634L2.1 11.613ZM10.0005 21.9285V24.4275H7.5V21.9285H10.0005ZM16.2495 21.9285V24.4275H13.7505V21.9285H16.2495ZM22.5 21.9285V24.4275H19.9995V21.9285H22.5ZM10.0005 15.963V18.462H7.5V15.963H10.0005ZM16.2495 15.963V18.462H13.7505V15.963H16.2495ZM22.5 15.963V18.462H19.9995V15.963H22.5ZM7.4595 5.112H3C2.88181 5.112 2.76478 5.13528 2.65558 5.18051C2.54639 5.22574 2.44718 5.29203 2.3636 5.3756C2.28003 5.45918 2.21374 5.55839 2.16851 5.66758C2.12328 5.77678 2.1 5.89381 2.1 6.012V9.5145L27.9 9.5355V6.012C27.9 5.89381 27.8767 5.77678 27.8315 5.66758C27.7863 5.55839 27.72 5.45918 27.6364 5.3756C27.5528 5.29203 27.4536 5.22574 27.3444 5.18051C27.2352 5.13528 27.1182 5.112 27 5.112H22.935V6.5055C22.935 6.78398 22.8244 7.05105 22.6275 7.24796C22.4305 7.44488 22.1635 7.5555 21.885 7.5555C21.6065 7.5555 21.3395 7.44488 21.1425 7.24796C20.9456 7.05105 20.835 6.78398 20.835 6.5055V5.112H9.5595V6.492C9.5595 6.77048 9.44888 7.03755 9.25196 7.23446C9.05505 7.43138 8.78798 7.542 8.5095 7.542C8.23102 7.542 7.96395 7.43138 7.76704 7.23446C7.57012 7.03755 7.4595 6.77048 7.4595 6.492V5.112Z"
                            fill="#666666"
                          />
                        </svg>
                        {/* <h5 className="ms-3"> Sep. 27, 2023 , 9.30 AM</h5> */}
                        <h5 className="ms-3"> {fullEndDate}</h5>
                      </div>
                      <div className="VisaDocUpload_section ">
                        <div className="VisaDocUpload_area p-0">
                          <div class="VisaDocUpload_PasspostPhoto_area  justify-content-start">
                            <div class="dropzone">
                              <img src={Document_Upload} class="upload-icon" />

                              <input
                                type="file"
                                onChange={onChange}
                                class="upload-input"
                                accept=".pdf, image/*"
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            {document && <span>{document?.name}</span>}
                          </div>
                        </div>
                      </div>

                      {/* <div className="my-4">
                        <h6 className="fw-bold">Notes</h6>
                        <p>
                          By pressing the select payment option you are going to
                          pay partial 15% of total amount and your car will be
                          reserve for you,
                        </p>
                      </div> */}
                      <div
                        className="accordion accordion-flush accordion_rent_car"
                        id="accordionFlushExample"
                      >
                        {/* <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingOne"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseOne"
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              Information's
                            </button>
                          </h2>
                          <div
                            id="flush-collapseOne"
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              Placeholder content for this accordion, which is
                              intended to demonstrate the{" "}
                              <code>.accordion-flush</code>
                              class. This is the first item's accordion body.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingTwo"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseTwo"
                              aria-expanded="false"
                              aria-controls="flush-collapseTwo"
                            >
                              Refund Policy
                            </button>
                          </h2>
                          <div
                            id="flush-collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingTwo"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              Placeholder content for this accordion, which is
                              intended to demonstrate the{" "}
                              <code>.accordion-flush</code>
                              class. This is the second item's accordion body.
                              Let's imagine this being filled with some actual
                              content.
                            </div>
                          </div>
                        </div> */}
                        {/* <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingThree"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseThree"
                              aria-expanded="false"
                              aria-controls="flush-collapseThree"
                            >
                              Rent Policy
                            </button>
                          </h2>
                          <div
                            id="flush-collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingThree"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              Placeholder content for this accordion, which is
                              intended to demonstrate the{" "}
                              <code>.accordion-flush</code>
                              class. This is the third item's accordion body.
                              Nothing more exciting happening here in terms of
                              content, but just filling up the space to make it
                              look, at least at first glance, a bit more
                              representative of how this would look in a
                              real-world application.
                            </div>
                          </div>
                        </div> */}
                        <a
                          href="https://restroreff.microlent.com/api/termsandconditionD.pdf"
                          className="resend-code" target="_blank" download={true}
                        >
                          Vehicle terms and conditions
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="cost_right">
                    <h4 className="cost-title mb-4">Cost</h4>
                    <div className="d-flex justify-content-between align-items-center mb-4 car_header_1">
                      <div className="car_header_1">
                        <h6>
                          Rent for {dateDifference >= 1 ? dateDifference : 1}{" "}
                          {dateDifference > 1 ? "days" : "day"}
                        </h6>
                        <p>
                          {" "}
                          {startDateGet} — {endDateGet}
                        </p>
                      </div>
                      <h6>
                        {dateDifference * parseInt(car?.pricePerDay, 0)}{" "}
                        {currencySymbols[selectedCountry]}
                      </h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1">
                      <h6>Delivery</h6>
                      <h6>0 {currencySymbols[selectedCountry]}</h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1">
                      <p>At pick-up</p>
                      <p>0 {currencySymbols[selectedCountry]}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1 mb-4">
                      <p>At drop-off</p>
                      <p>0 {currencySymbols[selectedCountry]}</p>
                    </div>
                    <div className=" car_header_1 mb-4">
                      <h6>Other</h6>
                      <div className="d-flex justify-content-between align-items-center car_header_1">
                        <p>TPL</p>
                        <p>0 {currencySymbols[selectedCountry]}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center car_header_1 mb-4">
                      <h6>Total</h6>
                      <h6>
                        {dateDifference * parseInt(car?.pricePerDay, 0)}{" "}
                        {currencySymbols[selectedCountry]}
                      </h6>
                    </div>
                    <button
                      className="btn btn-booking"
                      disabled={loading}
                      onClick={() => {
                        createBooking();
                        setSelectedImg(null);
                      }}
                    >
                      {loading ? "Loading" : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default CarModel;
