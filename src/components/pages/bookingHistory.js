import React,{useEffect , useState} from 'react'
import { Link } from 'react-router-dom';
import { bookingPagination } from '../../useApi/api';
import useAuth from "../../authProvider/AuthProvider"
import useApi from '../../useApi/useApi';
import moment from 'moment';
import { Backdrop, Box, CircularProgress } from "@mui/material";
import ReactPaginate from 'react-paginate';
import Paginate from 'react-paginate';

function BookingHistory() {

  const { data, error, setUrl, setConfig , loading ,count} = useApi();
  const [currentPage, setCurrentPage] = useState(0);

  const HandlebookingPagination = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("id"));
      let url = `${bookingPagination}`;

      const getConfig = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          curPage: currentPage + 1,
          perPage: 12,
          sortBy: "string",
          direction: "string",
          whereClause: [
            {
              key: "userId",
              value:userId ,
              operator: "string",
            },
          ]
        })
      };
      setUrl(url);
      setConfig(getConfig);
   
    } catch (error) {
      console.log(error?.message);
    }
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    HandlebookingPagination(currentPage);
  }, [currentPage]);

  const getStatusClass = (PaymnetStatus) => {
    switch (PaymnetStatus) {
      case 'Approve':
        return 'btn_Booking';
      case 'Reject':
        return 'btn_Reject';
      case 'Pending':
        return 'btn_Pending';
      default:
        return '';
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
          open={loading}
        >
          <CircularProgress />
        </Backdrop>
      </Box>

    <section className="container Profile_section mt-3">
      <div className="row">
        <div className="col-12">
          <div className='d-flex align-items-center'>
            <Link to="/profile" className="back_arrow me-2"><i className="fa-solid fa-arrow-left"></i></Link> <h5 className='mb-0 text-dark'>Booking History  </h5>

          </div>

        </div>
      </div>

     <div className="row my-3">
     {data?.map((data)=>( <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-12 mb-3">
          <div className="Profile_area_visa">

       <div className='row'>
          <div className='col-lg-6 col-md-6 mb-2 profile-visa_content'>
            <label>User Name</label>
            <h6>{data?.user?.name }</h6></div>
          <div className='col-lg-6 col-md-6 mb-2 profile-visa_content'>
            <label>Booking Type </label>
            <h6>{data?.BookingType} </h6></div>
          <div className='col-lg-6 col-md-6 mb-2 profile-visa_content'>
            <label>Start Date  </label>
            <h6>{moment(data?.stateDate).format('L')}</h6></div>
          <div className='col-lg-6 col-md-6 mb-2 profile-visa_content'>
            <label>End Date  </label>
            <h6>{moment(data?.endDate).format('L')}</h6></div>
          <div className='col-lg-6 col-md-6 mb-2 profile-visa_content'>
            <button className={`btn ${getStatusClass(data?.PaymnetStatus)}`}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <path d="M12.0937 7.8125L7.96641 11.75L5.90625 9.78125M3.83203 14.668C3.18516 14.0211 3.61406 12.6641 3.28359 11.8695C2.95312 11.075 1.6875 10.3789 1.6875 9.5C1.6875 8.62109 2.93906 7.95312 3.28359 7.13047C3.62812 6.30781 3.18516 4.97891 3.83203 4.33203C4.47891 3.68516 5.83594 4.11406 6.63047 3.78359C7.425 3.45312 8.12109 2.1875 9 2.1875C9.87891 2.1875 10.5469 3.43906 11.3695 3.78359C12.1922 4.12812 13.5211 3.68516 14.168 4.33203C14.8148 4.97891 14.3859 6.33594 14.7164 7.13047C15.0469 7.925 16.3125 8.62109 16.3125 9.5C16.3125 10.3789 15.0609 11.0469 14.7164 11.8695C14.3719 12.6922 14.8148 14.0211 14.168 14.668C13.5211 15.3148 12.1641 14.8859 11.3695 15.2164C10.575 15.5469 9.87891 16.8125 9 16.8125C8.12109 16.8125 7.45312 15.5609 6.63047 15.2164C5.80781 14.8719 4.47891 15.3148 3.83203 14.668Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            </svg> {data?.PaymnetStatus}</button></div>
        </div>
          </div>
        </div>))}

      </div>
      <Paginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(count / 12)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName='activeP'
        forcePage={currentPage}
      />

    </section>
    </div>
  )
}

export default BookingHistory