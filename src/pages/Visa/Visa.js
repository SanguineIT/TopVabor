import React, { useState, useEffect } from 'react';
import { API_URL } from 'Services/Service';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { useAuth } from 'AuthContext/AuthContext';
import { Link, Table, TableBody, TableCell, TableContainer, Grid, TableHead, TableRow, Paper } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import axios from '../../../node_modules/axios/index';
 import { TextField } from '../../../node_modules/@mui/material/index';

// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
 
// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   backgroundColor: 'white',
//   borderRadius: '5px',
//    padding: '20px',
//   textAlign: 'center',
  
// };

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
const Visa = () => {

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);

  const [VisaCategory, setVisaCategory] = useState([]);
  const [selectedVisaCategory, setSelectedVisaCategory] = useState('');

  // const [openUserImageModal, setOpenUserImageModal] = useState(false);
  // const [openPassportImageModal, setOpenPassportImageModal] = useState(false);

  // const handleOpenUserImageModal = () => {
  //   setOpenUserImageModal(true);
  // };

  // const handleCloseUserImageModal = () => {
  //   setOpenUserImageModal(false);
  // };

  // const handleOpenPassportImageModal = () => {
  //   setOpenPassportImageModal(true);
  // };

  // const handleClosePassportImageModal = () => {
  //   setOpenPassportImageModal(false);
  // };
 
  const [loading, setLoading] = useState(false);
  const [visaData, setVisaData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const columns = [
    { id: 'index', label: 'S. No.', align: 'center', minWidth: 70 },
    {
      id: 'userName',
      label: 'User Name',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'visaNo',
      label: 'Visa No.',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    { id: 'visaOption', label: 'Visa Option', align: 'center', minWidth: 120 },
   
    {
      id: 'userPhoto',
      label: 'User Photo',
      minWidth: 110,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'passportPhoto',
      label: 'Passport Photo',
      minWidth: 130,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
  ];

  const handleActiveStatusChange = async (event, id , remarks) => {
    const newActiveStatus = event.target.value; 
   try {
     setLoading(true);

      const response = await axios.post(`${API_URL}api/visa-detail/update/status`, {
       visaId: id,
       status: newActiveStatus,
       remarks: remarks,
     }, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem('token')}`,
       },
     });

     if (response?.data?.statusCode === 200) {
       Swal.fire({
         icon: 'success',
         title: 'Success',
         text: 'Status Updated Successfully',
       });

       
      
       await getVisaList();
     } else {
       Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'Something went wrong!',
       });
     }

     setLoading(false);
   } catch (error) {
     Swal.fire({
       icon: 'error',
       title: 'Oops...',
       text: 'An error occurred while updating the status.',
     });
     console.error(error);
     setLoading(false);
   }
 };

 const handleSearchQueryChange = (event) => {
  setSearch(event.target.value);
};

  const getVisaList = async (search) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}api/visa-detail/pagination`, {
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
            key: 'visaOption',
            value: selectedVisaCategory,
            // operator: 'string',
          },
        ],

      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response?.data?.statusCode == 200) {
        setVisaData(response?.data?.data);
        setCount(response?.data?.count);
        setLoading(false);
      }
      else if (response?.data?.statusCode == 400) {
        setVisaData(response?.data);
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

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/admin/login';
    } else {
      getVisaList(debouncedSearch);
    }
  }, [isLoggedIn, page, rowsPerPage, selectedVisaCategory,debouncedSearch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event?.target?.value);
    setPage(0);
  };


  const handleCategoryChange = (event) => {

    setSelectedVisaCategory(event?.target?.value)
    setPage(0)
    setRowsPerPage(10)

  };

  const getVisaType = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://restroreff.microlent.com//api/visa-option/get-All', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data?.statusCode == 200) {
        setVisaCategory(data?.data);
        setLoading(false);
      } else {
        throw new Error('Error fetching categories');
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getVisaType();
  }, []);

  const handleUserImageClick = (imageURL) => {
    if (imageURL) {
      window.open(imageURL, '_blank');
    }
  };
  const handlePassportImageClick = (imageURL) => {
    if (imageURL) {
      window.open(imageURL, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>


      <stack spacing={2} direction="row" style={{ marginBottom: 15, display: "flex", justifyContent: 'flex-end', }} >
      <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchQueryChange}
        />

        <Grid container xs={1.6} ml={1} >

          <FormControl fullWidth>
            <InputLabel style={{
              fontSize: '14px',
              lineHeight: '1',
            }}>Visa Option</InputLabel>
            <Select
              value={selectedVisaCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value={""}>
                Visa Option
              </MenuItem>
              {VisaCategory?.map((categoryItem, index) => (
                <MenuItem key={`category-${index}`} value={categoryItem.visaOption}>
                  {categoryItem.visaOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </stack>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {visaData.length > 0 ? (<> <TableContainer >
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
              {visaData?.map((visaData, index) => (  
                

                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell align={'center'}> {index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell align={'center'}>{visaData?.user?.name}</TableCell>
                  <TableCell align={'center'}>{visaData?.visaNumber}</TableCell>
                  <TableCell align={'center'}>{visaData?.user?.email}</TableCell>
                  <TableCell align={'center'}>{visaData?.visaOption}</TableCell>

                   {/* <TableCell align="center">{formatDate(visaData?.issueDate)}</TableCell> */}
                  {/* <TableCell align="center">{formatDate(visaData?.expiryDate)}</TableCell> */}
 

                  {/* <TableCell align="center">
                    <Link onClick={handleOpenUserImageModal} sx={{ cursor: 'pointer' }}>View User Image</Link>
                    <Modal sx={{ backgroundColor: "rgb(0 0 0 / 6%)" }} open={openUserImageModal} onClose={handleCloseUserImageModal}>
                      <div style={modalStyle}>
                        <h2>User Image</h2>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton onClick={handleCloseUserImageModal} style={{ position: 'absolute', top: '0', right: '0' }}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                        <img
                          src={visaData.userPhotoPathUrl}
                          alt={visaData.userPhotoPath}
                          style={{ maxWidth: '100%', maxHeight: 'auto' }}
                        />
                      </div>
                    </Modal>
                  </TableCell> */}
                  {/* <TableCell align="center">
                    <Link onClick={handleOpenPassportImageModal} sx={{ cursor: 'pointer' }}>View Passport Image</Link>
                    <Modal open={openPassportImageModal} onClose={handleClosePassportImageModal}>
                      <div style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton onClick={handleClosePassportImageModal} style={{ position: 'absolute', top: '0', right: '0' }}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                        <h2>Passport Image</h2>
                        <img
                          src={visaData.passportImagePathUrl}
                          alt={visaData.passportImagePath}
                          style={{ maxWidth: '100%', maxHeight: 'auto' }}
                        />
                      </div>
                    </Modal>
                  </TableCell> */}
                 
                 <TableCell align={'center'}>
                    <Link
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleUserImageClick(visaData.userPhotoPathUrl)}
                    >
                        User Image
                    </Link>
                  </TableCell>
                  <TableCell align={'center'}>
                    <Link
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handlePassportImageClick(visaData.passportImagePathUrl)}
                    >
                        Passport Document
                    </Link>
                  </TableCell>


                   <TableCell align={'center'}  >
                    
                    <Select
                      value={visaData.status}
                      onChange={(e) => {
                        if (e.target.value === "rejected") {
                          Swal.fire({
                            input: "textarea",
                            inputPlaceholder: "Enter remarks.",
                            showCancelButton: true,
                            preConfirm: (value) => {
                               if (value.length < 2 || value.length > 500) {
                                Swal.showValidationMessage("Remarks must be between 2 and 500 characters.");
                              } else {
                                handleActiveStatusChange(e, visaData.id, value);
                              }
                            },
                          });
                        }
                        else {
                           handleActiveStatusChange(e, visaData.id, null);
                        }
                      }}
                      label={visaData.status}
                      style={{ minWidth: '120px',backgroundColor:
                      visaData.status === "approved" ? '#4ddb37' :
                      visaData.status === "rejected" ? '#fc2121' : '#d6e7ff'}}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approve</MenuItem>
                      <MenuItem value="rejected">Reject</MenuItem>
                    </Select>
                  </TableCell>

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
    </>
  )
}

export default Visa