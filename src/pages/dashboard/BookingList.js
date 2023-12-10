import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import axios from '../../../node_modules/axios/index';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import Swal from 'sweetalert2';
import { useAuth } from 'AuthContext/AuthContext';
import { API_URL } from 'Services/Service';
import axios from '../../../node_modules/axios/index';
 

const columns = [
  { id: 'userName', label: 'User Name', align: 'center', minWidth: 150 },
  {
    id: 'carModel',
    label: 'Car Model',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'place',
    label: 'Place ',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'startDate',
    label: 'Start Date',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'endDate',
    label: 'End Date',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'PaymentStatus',
    label: 'Status',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  
];

const Pagination = () => {
  const [bookingData, SetBookingData] = useState([]);
   const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const isLoggedIn = !!user;
  // const Navigate = useNavigate();




  const getBookingList = async ( ) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}api/booking/pagination`, {
        curPage: 1,
        perPage: 10,
        sortBy: "createdAt",
        direction: "desc",
        whereClause: [
          {
            // "key": "string",
            // "value": "string",
            // "operator": "string"
          }
        ]
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response?.data?.statusCode == 200) {
        SetBookingData(response?.data?.data);
        setLoading(false);
      } else  {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data not fond.',  
        });
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

  useEffect(() => {
     if (!isLoggedIn) {
       window.location.href = '/admin/login';  
    }
    getBookingList();
    // getDataCount();
  }, [isLoggedIn]);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{opacity: '0.5'}} />
      </Box>
    );
  }

  

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingData.map((data, index) => (
                   <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                   {/* <TableCell align="center">{index + 1}</TableCell> */}
                  <TableCell align="center">{data?.user?.name}</TableCell>
                  <TableCell align="center">{data?.cardetail?.model}</TableCell>
                  <TableCell align="center">{data?.user?.email}</TableCell>
                  <TableCell align="center">{formatDate(data?.startDate)}</TableCell>
                  <TableCell align="center">{formatDate(data?.endDate)}</TableCell>   
                  <TableCell align="center">{data?.PaymnetStatus}</TableCell>             
         
                </TableRow>
              ))} 
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default Pagination;
