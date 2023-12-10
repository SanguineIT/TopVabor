import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import '../../../src/App.css';
import { Box, TablePagination } from '../../../node_modules/@mui/material/index';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Delete, Edit } from '../../../node_modules/@mui/icons-material/index'; 
//  import FormControl from '@mui/material/FormControl';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import axios from '../../../node_modules/axios/index';
// import { cityTourPaginationApi } from 'Services/Api';
import { API_URL } from 'Services/Service';
import axios from '../../../node_modules/axios/index';
// import ApiService from 'Services/index';
import { TextField } from '../../../node_modules/@mui/material/index';

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

function CityTourPagination() {

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 1000);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [cityData, setCityData] = useState([]);
     const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const columns = [
        {
            id: 'Index',
            label: 'S. No.',
            minWidth: 70,
            align: 'center',
            sorting: false
        },
        { id: 'cityTourName', label: 'City Tour Name', align: 'center', minWidth: 120, sorting: false },
        {
            id: 'city',
            label: 'City',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
            sorting: false
        },
        {
            id: 'country',
            label: 'Country',
            minWidth: 60,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
            sorting: true
        },

        {
            id: 'image',
            label: 'Image',
            minWidth: 110,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
            sorting: false
        },
        {
            id: 'action',
            label: 'Action',
            minWidth: 140,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
            sorting: false
        },
    ];



    const handleModalOpen = () => {
        navigate('CityTour');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event?.target?.value);
        setPage(0);
    };


    const getCityTourList = async (search) => {
        try {
          setLoading(true);
          const response = await axios.post(`${API_URL}api/city-tour/pagination`, {
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
                      ],
       
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response?.data?.statusCode === 200) {
            setCityData(response?.data?.data);
             setCount(response?.data?.count);
            setLoading(false);
          } else if (response?.data?.statusCode === 400) {
            setCityData(response?.data?.data);
              setCount(response?.data?.count);
             setLoading(false);
           }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response?.data?.message ||'An error occurred while fetching data.',  
          });
          console.error(error);
          setLoading(false);
         }
      };


    useEffect(() => {
        getCityTourList(debouncedSearch)
    }, [page, rowsPerPage, debouncedSearch])

    const handleEdit = (id) => {
        navigate('/cityTour/Edit/' + id);
      }

      const handleView = (id) => {
        navigate("/cityTour/" + id)
      }

      const handleDelete = async (id) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
          });
      
          if (confirmResult.isConfirmed) {
            setLoading(true);     
            const response = await axios.post(`${API_URL}api/city-tour/delete/${id}`,{}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,          
                  },
              });            
              if (response.data.statusCode === 200) {
                Swal.fire('Deleted!', 'Record has been deleted.', 'success');
      
                setCityData((prevData) => prevData.filter((item) => item.id !== id));
                setLoading(false)
              } else {
                Swal.fire('Error',response?.data?.message, 'Failed to delete the record.');
              }
            }
        } catch (error) {
          Swal.fire('Error', 'An error occurred while deleting the record.', 'error');
          setLoading(false);
        }
      };
      const handleSearchQueryChange = (event) => {
        setSearch(event?.target?.value);
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
            <stack spacing={2} direction="row" style={{ marginBottom: 10, display: "flex", justifyContent: 'flex-end' }} >
               <TextField
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={handleSearchQueryChange}
                />

                <Button variant="contained" onClick={handleModalOpen} style={{ marginBottom: '10px', marginLeft: '10px', float: 'right', height: '40px' }}>
                    Add City Tour
                </Button>
            </stack>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {cityData.length > 0 ? (<> 
                <TableContainer>
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
                            {cityData.map((CityData, index) => (
                               <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                               <TableCell align={'center'}> {index + 1 + page * rowsPerPage}</TableCell>
                               <TableCell align={'center'}>{CityData?.citytourName}</TableCell>
                               <TableCell align={'center'}>{CityData?.cityName}</TableCell>
                               <TableCell align={'center'}>{CityData?.country}</TableCell>
                               <TableCell align="center">
                      <img
                        src={CityData.picturePathUrl}
                        alt={CityData.picturePath}
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <Edit onClick={() => handleEdit(CityData?.id)} />
                      </IconButton>
                      <IconButton onClick={() => handleView(CityData?.id)}>
                        <RemoveRedEyeOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(CityData?.id)}>
                        <Delete />
                      </IconButton>
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
                </>):(<div> <p style={{ display: 'flex', justifyContent: 'center'  }}>Record not found</p></div>)}

            </Paper>
        </div>
    )
}

export default CityTourPagination