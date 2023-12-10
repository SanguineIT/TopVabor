import React, { useState } from "react";
import Logo2 from "../../../assets/image/Logo2.png";
import Country_1 from "../../../assets/image/Country_1.png";
import ChooseCountry_sideIm from "../../../assets/image/ChooseCountry_sideImg.png";
import Country_2 from "../../../assets/image/Country_2.png";
import { CountryEnum } from "../../Country";
import { useNavigate } from "react-router-dom";
import WithAuth from "../../../authProvider/withAuth";
import { axiosClient } from "../../../utils/axiosConfig";
import { useAuth } from "../../../authProvider/AuthProvider";

function ChooseCountry() {
  const [selectCountry, setSelectCountry] = useState(CountryEnum.UZBEKISTAN);
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user || null;

  const SaveCountry = async () => {
    localStorage.setItem("country", selectCountry);
    await updateUserCountry();
    navigate("/category");
  };

  const updateUserCountry = async () => {
    await axiosClient.post("/user/update/Country", {
      userId: user?.id,
      country: selectCountry,
    });
  };

  return (
    <div>
      <section className="container-fluid">
        <div className="container ChooseCountry_section">
          <div className="ChooseCountry_area">
            <div className="row w-100 m-0">
              <div className="col-xl-6 col-lg-6 col-md-12 p-0">
                <div className="ChooseCountry_contentSide">
                  <div className="ChooseCountry_contentSide_Logo mb-4">
                    <img src={Logo2} alt="" />
                  </div>
                  <h3 className="fw-bolder">Please choose your Country.</h3>
                  <p>
                    Established in 2023, TopvaBor is your go-to travel
                    companion, proudly serving two vibrant nations, the United
                    Arab Emirates and Uzbekistan. We specialize in delivering
                    exceptional services, including car rentals, tour tickets,
                    hotel and resort bookings, and city transfers.
                  </p>
                  <div className="row pt-4">
                    <div
                      className="col-md-6 col-12 mb-3"
                      onClick={() => setSelectCountry(CountryEnum.UZBEKISTAN)}
                    >
                      <div
                        className={`Country_item text-center  ${
                          selectCountry == CountryEnum.UZBEKISTAN
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="Country_select  mb-2">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <img
                          src={Country_2}
                          width="95%"
                          className="rounded-2"
                          alt=""
                        />
                        <h4 className="mt-3 mb-0">Uzbekistan</h4>
                      </div>
                    </div>
                    <div
                      className="col-md-6 col-12 mb-3"
                      onClick={() => setSelectCountry(CountryEnum.UAE)}
                    >
                      <div
                        className={`Country_item text-center ${
                          selectCountry == CountryEnum.UAE ? "active" : ""
                        }`}
                      >
                        <div className="Country_select mb-2">
                          <i className="fa-solid fa-check"></i>{" "}
                        </div>
                        <img
                          src={Country_1}
                          width="95%"
                          className="rounded-2"
                          alt=""
                        />
                        <h4 className="mt-3 mb-0">U.A.E</h4>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn_success w-100 mt-4"
                    onClick={() => SaveCountry()}
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 p-0">
                <div className="ChooseCountry_sideImg">
                  <img src={ChooseCountry_sideIm} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WithAuth(ChooseCountry);
