import React, { useEffect, useState } from "react";
import Tour_Tickets from "../../assets/image/Tour_Tickets.png";
import backgroundImage from "../../assets/image/tourTickets.png";
import { Link } from "react-router-dom";
import WithAuth from "../../authProvider/withAuth";
import { tourPagination } from "../../useApi/api";
import useApi from "../../useApi/useApi";
import { currencySymbols, isNumber, onError, selectedCountry } from "../../utils/helper";
import { axiosClient } from "../../utils/axiosConfig";
import { useAuth } from "../../authProvider/AuthProvider";
import { craeteTourbooking, stripeTourLink } from "../../useApi/api";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import Header from "../common/header";
import TourModel from "../model/tourModel";




function TourTickets() {
  const { data, error, setUrl, setConfig, loading: mainLoader } = useApi();
  const [qty, setQty] = useState(1);
  const [selectedTicket,setSelectedTicket] = useState(null)

  const [loading, setLoading] = useState(false);

  const handleTourdata = async () => {
    try {



      let url = `${tourPagination}`;

      const getConfig = {
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json", // Make sure to set the content type
        },

        body: JSON.stringify({
          curPage: 1,
          perPage: 50,
          sortBy: "",
          direction: "",
          whereClause: [
            {
              key: "string",
              value: "string",
              operator: "string",
            },
          ],
        }),
      };
      setUrl(url);
      setConfig(getConfig);
    } catch (error) {
      console.log(error?.message);
    }

  };

  useEffect(() => {
    handleTourdata();
  }, []);

  // const createBooking = async (tour, qty) => {
  //   if (!tour) {
  //     return
  //   }
  //   try {
  //     setLoading(true);

  //     const TourId = tour.Id
  //     const res = await axiosClient.post(craeteTourbooking, { TourId, TickedQty: qty });
  //     const data = res?.data;
  //     if (data?.statusCode == 200) {
  //       const BookingId = data?.data?.id;
  //       axiosClient
  //         .get(stripeTourLink, {
  //           params: {
  //             BookingId: BookingId,
  //             amount: tour.price * qty,

  //           },
  //         })
  //         .then((res) => {
  //           if (res.status == 200 || res.status == 201) {
  //             if (res?.data?.statusCode == 200) {
  //               window.location.href = res?.data?.data;
  //             } else {
  //               onError(res?.data?.message || "Bad Request");
  //             }
  //           } else {
  //             onError(res?.data?.message || "Bad Request");
  //           }
  //           setLoading(false);
  //         }).catch(e => {
  //           onError(e?.message);
  //           setLoading(false);
  //         });
  //     }
  //   } catch (e) {
  //     onError(e.message);
  //     setLoading(false);
  //   }
  // };

  // const onHandleBuy = (tour) => {
  //   Swal.fire({
  //     title: 'Submit your ticket Qty',
  //     input: 'text',
  //     inputAttributes: {
  //       autocapitalize: 'off',
  //       pattern: '[0-9]*', // Allow only numeric input
  //     },
  //     inputValue: qty,
  //     inputValidator: (value) => {
  //       if (!value || isNaN(value) || parseInt(value) <= 0) {
  //         return 'Please enter a valid numeric value greater than 0.';
  //       }
  //       if (value > 100) {
  //         return "Qty should not more than 100"
  //       }
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'Payment',
  //     showLoaderOnConfirm: true,
  //     preConfirm: (qty) => {
  //       createBooking(tour, qty);
  //     }
  //   });

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
          open={loading || mainLoader}
        >
          <CircularProgress />
        </Backdrop>
      </Box>
      <Header />
      <div className="VisaOption_section">
      <div class="container-fluid  VisaOption_topbar_section position-relative" style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.47) 0%, rgba(0, 0, 0, 0.47) 100%), url(${backgroundImage})` }}>
        <div className="container  " >
          <div className="row " >
            <Link to="/category" className="back_arrow_hp"><i className="fa-solid fa-arrow-left"></i></Link>




            <div className="col-12">
              <div className="VisaOption_topbar_heading text-center">
                <h1>Choose your Ticket</h1>
                <p>Find the best city tour and guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="container">
          <div className="row  justify-content-center">
            <div className="row mt-5 Choose_your_Ticket">
              {data?.map((tour) => (
                <div className="col-xl-3 col-lg-3 col-md-4 col-12 mb-3">
                  <div className="card h-100">
                    <img src={tour.picturePathUrl} alt="" />
                    <div className="card-body pb-0">
                      <div className="d-flex justify-content-between my-1">
                        <h4>{tour.tourName}</h4>

                        <h4>   {currencySymbols[selectedCountry]} {tour.price}</h4>
                      </div>
                     
                      {/* <!-- <img src="img/Tour_Tickets_backgound.png" alt=""/> --> */}

                    </div>
                    <div className="card-footer bg-white border-0 pt-0">
                    <div className="ticketRip">
                        <div className="circleLeft"></div>
                        <div className="ripLine"></div>
                        <div className="circleRight"></div>
                      </div>
                      {/* <button
                        className="btn btn-buy mt-4"

                        onClick={() => onHandleBuy(tour)}
                        disabled={loading}
                      >
                        {loading ? 'Buy Now' : 'Buy Now'}
                      </button> */}
                      <button type="button" onClick={()  => setSelectedTicket(tour)} className="btn btn-buy mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      {loading ? 'Buy Now' : 'Buy Now'}
               </button>
              
                    </div>
                  </div>
                </div>
              ))}


<TourModel ticket={selectedTicket}/>
              {/* <div className="col-xl-3 col-lg-3 col-md-4 col-12 mb-3">
                <div className="card">
                  <img src={Tour_Tickets} alt="" />
                  <div className="card-body">
                    <div className="d-flex justify-content-between my-1">
                      <h4>Burj khalifa</h4>

                      <h4>€ 20.00</h4>
                    </div>
                    <div className="ticketRip">
                      <div className="circleLeft"></div>
                      <div className="ripLine"></div>
                      <div className="circleRight"></div>
                    </div>
                    <!-- <img src="img/Tour_Tickets_backgound.png" alt=""/> -->
                    <button className="btn btn-buy" data-bs-toggle="modal"
                      data-bs-target="#SelectPayment">Buy Now</button>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-12 mb-3">
                <div className="card">
                  <img src={Tour_Tickets} alt="" />
                  <div className="card-body">
                    <div className="d-flex justify-content-between my-1">
                      <h4>Burj khalifa</h4>

                      <h4>€ 20.00</h4>
                    </div>
                    <div className="ticketRip">
                      <div className="circleLeft"></div>
                      <div className="ripLine"></div>
                      <div className="circleRight"></div>
                    </div>
                    <!-- <img src="img/Tour_Tickets_backgound.png" alt=""/> -->
                    <button className="btn btn-buy" data-bs-toggle="modal"
                      data-bs-target="#SelectPayment">Buy Now</button>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-12 mb-3">
                <div className="card">
                  <img src={Tour_Tickets} alt="" />
                  <div className="card-body">
                    <div className="d-flex justify-content-between my-1">
                      <h4>Burj khalifa</h4>

                      <h4>€ 20.00</h4>
                    </div>
                    <div className="ticketRip">
                      <div className="circleLeft"></div>
                      <div className="ripLine"></div>
                      <div className="circleRight"></div>
                    </div>
                    <!-- <img src="img/Tour_Tickets_backgound.png" alt=""/> -->
                    <button className="btn btn-buy" data-bs-toggle="modal"
                      data-bs-target="#SelectPayment">Buy Now</button>
                  </div>
                </div>
              </div>
 */}
            </div>
          </div>
        </div>
      </div>
     

      {/* <div
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
      </div> */}
    </div>
  );
}

export default WithAuth(TourTickets);
