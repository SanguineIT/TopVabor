import React ,{useState,useEffect} from "react";
import Header from "../../common/header";
import { Link } from "react-router-dom";
import WithAuth from "../../../authProvider/withAuth";
import { carDetialPagination, categoryGetAll } from "../../../useApi/api";

import { Backdrop, Box, CircularProgress } from "@mui/material";
import { CountryEnum } from "../../Country";
import useApi from "../../../useApi/useApi";

import { currencySymbols, isNumber, onError, selectedCountry } from "../../../utils/helper";
import { axiosClient } from "../../../utils/axiosConfig";
import { useAuth } from "../../../authProvider/AuthProvider"; 
import { craeteTourbooking, stripeTourLink } from "../../../useApi/api";

function ChooseCar() {

    const [loading, setLoading] = useState(false);

  const { data, error, setUrl, setConfig } = useApi();
  const {
    data: carData,
    setUrl: setCarUrl,
    setConfig: setCarConfig,
    loading:mainLoader,
  } = useApi();
  const [activeFilter, setActiveFilter] = useState(null);
//   const [selectedCar, setSelectedCar] = useState(null);
//   const [orderBy, setOrderBy] = useState(null);
console.log(carData,"======")

  const handleCarDetailPagination = async () => {
    try {
      let url = `${carDetialPagination}`;
      const getConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          curPage: 1,
          perPage: 100,
          sortBy: "price",
          direction: "string",
          whereClause: [
            {
              key: "categoryId",
              value: activeFilter,
              operator: "string",
            },
            {
              key: "country",
              value:
                localStorage.getItem("country") == CountryEnum.UAE
                  ? "UAE"
                  : "UZBEKISTAN",
              operator: "string",
            },
          ],
        }),
      };
      setCarUrl(url);
      setCarConfig(getConfig);
    } catch (error) {
      console.log(error?.message);
    }
  };

  const handleCategoryPagination = async () => {
    try {
      let url = `${categoryGetAll}`;

      const getConfig = {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      setUrl(url);
      setConfig(getConfig);
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    handleCarDetailPagination();
  }, [activeFilter]);

  useEffect(() => {
    handleCategoryPagination();
  }, []);

  const createBooking = async () => {
 
    try {
        setLoading(true);
      const payload = new FormData();
      payload.append("id", 0);
      payload.append("startDate", "2023-09-26"); // Replace with your desired dates
      payload.append("endDate", "2023-09-30");   // Replace with your desired dates
      payload.append("UserId", 123);            // Replace with your user ID
      payload.append("BookingType", "Car");
      payload.append("CarId", 456);             // Replace with your car ID
      payload.append("DrivingLicence", "base64EncodedLicense"); // Replace with your base64 encoded license
      const res = await axiosClient.post(craeteTourbooking, payload);
      const data = res?.data;
      if (data?.statusCode == 200) {
        const BookingId = data?.data?.id;
        axiosClient
          .get(stripeTourLink, {
            params: {
              BookingId: BookingId,
              amount: 2000,
             
            },
          })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              if (res?.data?.statusCode == 200) {
                window.location.href = res?.data?.data;
              } else {
                onError(res?.data?.message || "Bad Request");
              }
            } else {
              onError(res?.data?.message || "Bad Request");
            }
            setLoading(false);
          }).catch(e => {
            onError(e?.message);
            setLoading(false);
          });
      }
    } catch (e) {
      onError(e.message);
      setLoading(false);
    }
  };

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
      <section className="container-fluid VisaDocUpload_section mt-3">
          <div className="container">
        <div className="row">
        <div className="col-12">
            <div className="d-flex align-items-center">
              <Link to="/ChooseCity" className="back_arrow">
                <i className="fa-solid fa-arrow-left"></i>{" "}
              </Link>
              <h4 className="fw-bolder ms-2 mb-0">Dubai</h4>
            </div>
          </div>
          </div>
         
        </div>
      </section>

      <section className="container-fluid ChooseCar_section my-4">
      <div className="container">
        <div className="row">
          <div className="col-12 m-auto">
            <ul
              className="nav nav-pills mb-3 ChooseCar_tabs"
              id="pills-tab"
              role="tablist"
            >

        {data?.map((category)=>(
            <>
            <li className="nav-item" role="presentation"   onClick={() => setActiveFilter(category?.id)} key={category.id}>
        <button
            className={`nav-link ${
                activeFilter == category?.id ? "active" : ""
              }`}
            id="pills-Economy-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-Economy"
            type="button"
            role="tab"
            aria-controls="pills-Economy"
            aria-selected="true"
        >
        {category?.categoryName}
        </button>
        </li>
        </>
        ))
       }
            </ul>
            <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-Economy" role="tabpanel"
                        aria-labelledby="pills-Economy-tab">
                        <div class="row">
                       {carData?.map((car)=>(<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
                                <div class="ChooseCar_caritem">
                                    <div class="ChooseCar_car_Img">
                                        <img src={car.CarpicturePathUrl} alt="fdsfsf"/>
                                    </div>
                                    <div class="ChooseCar_Itme_content">
                                        <h6>{car.seats} Seats</h6>
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="mb-0 fw-bold">{car.pricePerDay}{currencySymbols[selectedCountry]}</p>
                                            <button class="btn btn_success"  data-bs-target="#SelectPayment" onClick={()=> createBooking()}>Buy Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>))    
                            }
                            {/* <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
                                <div class="ChooseCar_caritem">
                                    <div class="ChooseCar_car_Img">
                                        <img src="img/Car2.png" alt="freds"/>
                                    </div>
                                    <div class="ChooseCar_Itme_content">
                                        <h6>Economy 07 Seat</h6>
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="mb-0 fw-bold">$300.92</p>
                                            <button class="btn btn_success">Buy Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    {/* <div class="tab-pane fade" id="pills-Luxury" role="tabpanel" aria-labelledby="pills-Luxury-tab">
                        <div class="row"> */}
                            {/* <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
                                <div class="ChooseCar_caritem">
                                    <div class="ChooseCar_car_Img">
                                        <img src={Car1} alt="dewdw"/>
                                    </div>
                                    <div class="ChooseCar_Itme_content">
                                        <h6>Luxury 06 Seat</h6>
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="mb-0 fw-bold">$350.92</p>
                                            <button class="btn btn_success">Buy Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
                                <div class="ChooseCar_caritem">
                                    <div class="ChooseCar_car_Img">
                                        <img src="img/Car4.png" alt="">
                                    </div>
                                    <div class="ChooseCar_Itme_content">
                                        <h6>Luxury 07 Seat</h6>
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="mb-0 fw-bold">$400.92</p>
                                            <button class="btn btn_success">Buy Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        {/* </div>
                    </div> */}
                </div>
          </div>
        </div>
        </div>
      </section>
{/* 
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
      </div> */}
    </div>
  );
}

export default WithAuth(ChooseCar);
