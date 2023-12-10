import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import '../../../src/App.css';
import { TablePagination } from '../../../node_modules/@mui/material/index';
import axios from '../../../node_modules/axios/index';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from 'AuthContext/AuthContext';
import { API_URL } from 'Services/Service';
import { TextField } from '../../../node_modules/@mui/material/index';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


// ================================Bookings===================================

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
const Payment = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);



  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [selectedBooking, setSelectedBooking] = useState('Car');

  const handleBookingChange = (event) => {
    setSelectedBooking(event.target.value)
    setPage(0)
    setRowsPerPage(10)

  };

  const getBookingList = async (search) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}api/booking/pagination`, {
        curPage: page + 1,
        perPage: rowsPerPage,
        sortBy: 'createdAt',
        direction: 'desc',
        whereClause: [
          {
            key: 'all',
            value: search,
            // operator: 'string',
          },
          {
            key: 'BookingType',
            value: selectedBooking,
            // operator: 'string',
          },
        ],
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response?.data?.statusCode == 200) {
        setPaymentData(response?.data?.data);
        setCount(response?.data?.count);
        setLoading(false);
      } else if (response?.data?.statusCode == 400) {
        setPaymentData(response?.data?.data);
        setCount(response?.data?.count);
        setLoading(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while fetching data.',
      });
      console.error(error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event?.target?.value);
    setPage(0);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/admin/login';
    } else {
      getBookingList(debouncedSearch);
    }
  }, [isLoggedIn, page, rowsPerPage, debouncedSearch, selectedBooking]);


  const columns = [
    {
      id: 'S. No',
      label: 'S. No',
      minWidth: 60,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'name',
      label: 'User Name',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'BookingType',
      label: 'Booking Type',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 170,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'startDate',
      label: 'Start Date',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'endDate',
      label: 'End Date',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'paymentStatus',
      label: 'Status',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
  ];

  function formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      // timeZoneName: 'short',
    };

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  const handleSearchQueryChange = (event) => {
    setSearch(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div>
      <stack spacing={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' }} >


        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchQueryChange}
        />

        <FormControl style={{ width: '150px', marginLeft: '10px' }}>
          <InputLabel style={{
            fontSize: '14px',
            lineHeight: '1',
          }}>Booking Type</InputLabel>
          <Select
            value={selectedBooking}
            onChange={handleBookingChange}
            label="Booking"
          >
            <MenuItem>All Bookings</MenuItem>
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="Trip">Trip </MenuItem>
            <MenuItem value="CityTrip">CityTrip </MenuItem>
          </Select>
        </FormControl>


      </stack>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {paymentData.length > 0 ? (<> <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentData.map((data, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {/* <TableCell align="center">{index + 1}</TableCell> */}
                  <TableCell align="center"> {index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell align="center">{data?.user?.name}</TableCell>
                  <TableCell align="center">{data?.BookingType}</TableCell>
                  <TableCell align="center">{data?.user?.email}</TableCell>
                  <TableCell align="center">{formatDate(data?.startDate)}</TableCell>
                  <TableCell align="center">{formatDate(data?.endDate)}</TableCell>
                  <TableCell align="center">{data?.PaymnetStatus}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>) : (<div> <p style={{ display: 'flex', justifyContent: 'center' }}>Record not found</p></div>)}

      </Paper>
    </div>
  )
}

export default Payment