import React, { useEffect, useState } from "react";

import Header from "../common/header";
import { Link } from "react-router-dom";
import { carDetialPagination, categoryGetAll } from "../../useApi/api";
import useApi from "../../useApi/useApi";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import CarModel from "../model/carModel";
import WithAuth from "../../authProvider/withAuth";
import { CountryEnum } from "../Country";
import { currencySymbols, selectedCountry } from "../../utils/helper";

function RentCaroptions() {
  const { data, error, setUrl, setConfig } = useApi();
  const {
    data: carData,
    setUrl: setCarUrl,
    setConfig: setCarConfig,
    loading,
  } = useApi();
  const [activeFilter, setActiveFilter] = useState(15);
  const [selectedCar, setSelectedCar] = useState(null);
  const [orderBy, setOrderBy] = useState("asc");

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
          direction: orderBy,
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
  }, [activeFilter, orderBy]);

  useEffect(() => {
    handleCategoryPagination();
  }, []);

  const CategoryFilter = () => {
    return (
      <ul
        className="nav nav-pills mb-3 nav-pills Car-type"
        id="pills-tab"
        role="tablist"
      >
        {data &&
          data.map((category) => (
            <li
              className="nav-item"
              role="presentation"
              onClick={() => setActiveFilter(category?.id)}
              key={category.id}
            >
              <button
                className={`nav-link ${
                  activeFilter == category?.id ? "active" : ""
                }`}
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                {category?.categoryName}
              </button>
            </li>
          ))}
      </ul>
    );
  };

  const Car = () => {
    return (
      carData &&
      carData?.map((car) => (
        <div
          key={car?.id}
          className="col-lg-3 col-md-6 mb-3"
          onClick={() => setSelectedCar(car)}
        >
          <div
            className="card cars"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            key={car?.id}
          >
            {/* <div
              className="cancel-car d-flex justify-content-center align-items-center"
              data-bs-toggle="tooltip"
              data-bs-html="true"
              title="We will refund the full amount of advance payment of the booking if there are more than 24 hours before receiving the car. If the cancellation was made in less than 24 hours
before receiving the vehicle, the advance payment is not
refundable."
            >
              <i className="fa-solid fa-xmark"></i>
            </div> */}
            <img
              src={car?.CarpicturePathUrl}
              className="card-img-top"
              alt="..."
            />
            <div className="card-body  d-flex p-0 pt-2 justify-content-between">
              <div className="heading">
                <h5>{car?.model}</h5>
                {/* <p>Manual, 1.3l, TPL</p> */}
                <p className="car_price">{car?.category?.categoryName}</p>
              </div>
              <div className="price align-items-center">
                <h5 className="car_price ">
                  {car.pricePerDay} {currencySymbols[selectedCountry]}
                </h5>
                <p className="text-capitalize car-day">per day</p>
              </div>
            </div>
            <div className="card-footer bg-transparent d-flex p-0 pt-2 justify-content-between">
              <div className="heading">
                <p className="m-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 15 16"
                    fill="none"
                  >
                    <path
                      d="M4.73805 3.5C4.30501 3.5 3.93418 3.353 3.62554 3.059C3.31691 2.765 3.16286 2.412 3.16338 2C3.16338 1.5875 3.3177 1.23425 3.62633 0.940251C3.93497 0.646251 4.30554 0.499501 4.73805 0.500001C5.17108 0.500001 5.54191 0.647001 5.85055 0.941001C6.15918 1.235 6.31324 1.588 6.31271 2C6.31271 2.4125 6.15839 2.76575 5.84976 3.05975C5.54113 3.35375 5.17055 3.5005 4.73805 3.5ZM2.4351 14L0.407715 4.25H2.02175L3.75388 12.5H9.06838V14H2.4351ZM13.3987 15.5L11.1154 11.75H4.36406L3.24211 6.5375C3.09777 5.9375 3.24553 5.40625 3.68538 4.94375C4.12524 4.48125 4.65984 4.25 5.28918 4.25C5.74846 4.25 6.16522 4.38125 6.53946 4.64375C6.91371 4.90625 7.15306 5.2625 7.25751 5.7125L8.12358 9.5H11.5682L14.7765 14.75L13.3987 15.5Z"
                      fill="#05028D"
                    />
                  </svg>{" "}
                  <span className="total_amount"> {car?.seats} Seats </span>
                </p>
              </div>
              <div className="price">
                <h5 className="total_amount fw-700">
                  {car?.pricePerDay} {currencySymbols[selectedCountry]}
                </h5>
              </div>
            </div>
          </div>
        </div>
      ))
    );
  };

  const SearchInput = () => {
    return (
      <div className="col-md-12">
        <div className="input-group">
          <span className="mr-5">
            <Link to="/PickupLocation" className="back_arrow me-2 mb-0">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </span>
          {/* <input
          type="text"
          className="form-control"
          placeholder="loaction"
          value="Dubai International Airport, Dubai"
        />
        <span className="mr-5">
          <Link to="" className="Place_edit me-2 mb-0">
            <i className="fa-solid fa-pen-to-square"></i>
          </Link>
        </span> */}
        </div>
      </div>
    );
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
          open={loading}
        >
          <CircularProgress />
        </Backdrop>
      </Box>
      <Header />

      <div className="container mt-3">
        <div className="row justify-content-center">
          <SearchInput />
        </div>
        <div className="row mt-3 justify-content-center">
          <div className="col-md-12">
            <div className="d-flex justify-content-between flex-wrap">
              <CategoryFilter />

              <div className="Filters_button">
                <div className="dropdown d-grid">
                  <button
                    className="btn btn-rounded"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M1.54153 1.58331H13.4582C13.7257 1.67714 13.9348 1.88948 14.0245 2.15845C14.1141 2.42741 14.0743 2.72273 13.9165 2.95831L9.33319 7.99998V14.4166L5.66653 11.6666V7.99998L1.08319 2.95831C0.925459 2.72273 0.885613 2.42741 0.975268 2.15845C1.06492 1.88948 1.27399 1.67714 1.54153 1.58331"
                        stroke="#0AAA84"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>{" "}
                    Filters
                  </button>
                  <ul className="dropdown-menu">
                    <li onClick={() => setOrderBy(1)}>
                      <Link className="dropdown-item p-2" to="#">
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.4727 17.883C11.1812 17.7294 10.8327 17.7293 10.5411 17.8826L6.24717 20.1402C5.51353 20.5259 4.65606 19.9029 4.7962 19.086L5.6165 14.3041C5.67219 13.9794 5.56443 13.6482 5.3284 13.4184L1.85038 10.0329C1.25611 9.45446 1.58371 8.44564 2.40446 8.32669L7.20234 7.63135C7.5282 7.58412 7.80993 7.37951 7.95564 7.08425L10.1028 2.73352C10.4696 1.99027 11.5295 1.99027 11.8963 2.73352L14.0435 7.08425C14.1892 7.37951 14.4709 7.58412 14.7968 7.63135L19.5947 8.32669C20.4154 8.44564 20.743 9.45446 20.1488 10.0329L16.6707 13.4184C16.4347 13.6482 16.327 13.9794 16.3826 14.3041L17.2025 19.0836C17.3427 19.901 16.4844 20.524 15.7507 20.1374L11.4727 17.883Z"
                            fill="#FFC700"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.4727 17.883C11.1812 17.7294 10.8327 17.7293 10.5411 17.8826L6.24717 20.1402C5.51353 20.5259 4.65606 19.9029 4.7962 19.086L5.6165 14.3041C5.67219 13.9794 5.56443 13.6482 5.3284 13.4184L1.85038 10.0329C1.25611 9.45446 1.58371 8.44564 2.40446 8.32669L7.20234 7.63135C7.5282 7.58412 7.80993 7.37951 7.95564 7.08425L10.1028 2.73352C10.4696 1.99027 11.5295 1.99027 11.8963 2.73352L14.0435 7.08425C14.1892 7.37951 14.4709 7.58412 14.7968 7.63135L19.5947 8.32669C20.4154 8.44564 20.743 9.45446 20.1488 10.0329L16.6707 13.4184C16.4347 13.6482 16.327 13.9794 16.3826 14.3041L17.2025 19.0836C17.3427 19.901 16.4844 20.524 15.7507 20.1374L11.4727 17.883Z"
                            fill="white"
                            fill-opacity="0.2"
                          />
                        </svg>
                        Recommended */}
                      </Link>
                    </li>
                    <li onClick={() => setOrderBy("asc")}>
                      <Link
                        className={`dropdown-item p-2 ${
                          orderBy == "asc" ? "active-mj" : ""
                        }`}
                        to="#"
                      >
                        {" "}
                        <i className="fa-solid fa-arrow-down"></i> Lowest Price
                      </Link>
                    </li>
                    <li onClick={() => setOrderBy("desc")}>
                      <Link
                        className={`dropdown-item p-2 ${
                          orderBy == "desc" ? "active-mj" : ""
                        }`}
                        to="#"
                      >
                        <i className="fa-solid fa-arrow-up"></i> Highest Price
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                {" "}
                <div className="row mt-3">
                  <Car />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CarModel car={selectedCar} />
      {/* <PaymentModel paymentUrl={paymentUrl} /> */}
    </div>
  );
}

export default WithAuth(RentCaroptions);
