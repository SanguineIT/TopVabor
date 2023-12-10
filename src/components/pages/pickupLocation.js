import React, { useRef, useState, useEffect } from "react";
import Header from "../common/header";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import WithAuth from "../../authProvider/withAuth";
import Swal from "sweetalert2";
import backgroundImage from "../../assets/image/tourTickets.png";
function PickupLocation() {
  const [startDate, setStartDate] = useState(  moment(new Date()).toDate());
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "days").toDate()
  );
  const datePickerRef = useRef(null);
  const datePickerRefEnd = useRef(null);


  const handleStartDateChange = (date) => {
    console.log("date start when handle change" , date)
    setStartDate(date);
    if (endDate && moment(endDate).isBefore(date, "day")) {
      setEndDate(date);
    }
    // Store startDate in local storage
    localStorage.setItem("startDate", JSON.stringify(date));
  };

  useEffect(() => {
    localStorage.setItem("startDate", JSON.stringify(startDate));
    localStorage.setItem("endDate", JSON.stringify(endDate));
  }, [startDate, endDate]);

  const handleEndDateChange = (date) => {
    console.log("date end when handle change " , date)
    if (moment(date).isAfter(startDate, "day")) {
      setEndDate(date);
    }

    localStorage.setItem("endDate", JSON.stringify(date));
  };

  // const calculateDateDifference = () => {
  //   if (startDate && endDate) {
  //     const differenceInTime = endDate.getTime() - startDate.getTime();
  //     const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  //     localStorage.setItem("dateDifference", JSON.stringify(differenceInDays));
  //     return differenceInDays;
  //   }
  //   return 0;
  // };
  const calculateDateDifference = () => {
    if (startDate && endDate) {
      const start = moment(startDate).startOf('day'); // Start of the day
      const end = moment(endDate).startOf('day'); // Start of the day
  
      const differenceInTime = end.diff(start, 'days');
      const differenceInDays = Math.max(differenceInTime, 0); // Ensure non-negative value
  
      localStorage.setItem("dateDifference", JSON.stringify(differenceInDays));
      return differenceInDays;
    }
    return 0;
  };
  

useEffect(()=>{
  calculateDateDifference()
},[startDate,endDate])



const onSearch = () => {
  const sDate = moment(startDate);
  const eDate = moment(endDate);

  const duration = moment.duration(eDate.diff(sDate));

  if (duration.asDays() >= 1) {
    window.location.href = "/RentCarOptions";
  } else {
    Swal.fire({
      icon: "warning",
      title: "End date must be greater than start date by more than 1 day."
    });
  }
}







  return (
    <div>
      <Header />
      <div className="VisaOption_section ">

      <div className="container-fluid VisaOption_topbar_section position-relative" style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.47) 0%, rgba(0, 0, 0, 0.47) 100%), url(${backgroundImage})` }}>
      <div className="container">
      <div className="row  " >
          <Link to="/category" className="back_arrow_hp"><i className="fa-solid fa-arrow-left"></i></Link>
          <div className="col-12">
            <div className="VisaOption_topbar_heading text-center">
              <h1>Choose your Date</h1>
              <p>Find the best city tour and guide</p>
            </div>
          </div>
        </div>
      </div>
       
      </div>
      <div className="container mt-3">
        <div className="row">
          <div className="col-12">
            <div className="main-card">
              <div className="row justify-content-center">
                <div className="col-lg-4 mb-3 ">
                  <div className="loaction-card">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="Pick-tittle">Car Rentals Dates</h5>
                      <h6 className="day-color">
                        {calculateDateDifference()} Days
                      </h6>
                    </div>
                    <div
                      className="row"
                      id="date_picter_loaction"
                      style={{ position: "relative" }}
                    >
                      <div
                        className="col-md-6 date-location border-date-laction"
                        onClick={() => {
                          datePickerRef?.current?.onInputClick();
                        }}
                      >
                        {startDate && <h4>{moment(startDate).format('D')}</h4>}
                        <div className="date-time">
                          {startDate && <p>{moment(startDate).format(' ddd | MMMM')}</p>}
                          {startDate && <p>{moment(startDate).format('h:mm A')}</p>}

                        </div>
                        <div className="arrow-icon">
                          <i className="fa-solid fa-arrow-right"></i>
                        </div>

                      </div>

                      <div
                        className="col-md-6 date-location"
                        onClick={() => {
                          datePickerRefEnd?.current?.onInputClick();
                        }}
                      >
                        {endDate && <h4>{moment(endDate).format('D')}</h4>}
                        <div className="date-time">
                          {/* <p>Sat | September</p>
                                            <p>10:00 AM</p> */}
                          {endDate && <p>{moment(endDate).format('  ddd | MMMM')}</p>}
                          {endDate && <p>{moment(endDate).format('h:mm A')}</p>}

                        </div>
                      </div>
                      <div className="col-md-12">
                        <DatePicker
                          // showTimeSelect
                          selected={startDate}
                          onChange={handleStartDateChange}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Start Date"
                          className="d-none"
                          minDate={moment().toDate()}
                          ref={datePickerRef}

                        />

                        <DatePicker
                          //showTimeSelect
                          selected={endDate}
                          onChange={handleEndDateChange}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="End Date"
                          className="d-none"
                          minDate={moment().toDate()}
                          ref={datePickerRefEnd}
                        />
                      </div>

                      <input
                        type="text"
                        name="datefilter"
                        value=""
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-4 mt-3">
                  <button
                    onClick={onSearch}
                    className="btn btn-Search-location"

                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
}

export default WithAuth(PickupLocation);
