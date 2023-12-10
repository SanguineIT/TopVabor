import React, { useState, useEffect } from 'react'; 
import TablePagination from '@mui/material/TablePagination';
import axios from '../../../node_modules/axios/index';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { useAuth } from 'AuthContext/AuthContext';
import { API_URL } from 'Services/Service';
import { TextField } from '../../../node_modules/@mui/material/index';
import { Button, Table, TableBody, TableCell, TableContainer, IconButton , Grid, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
 
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Delete, Edit } from '../../../node_modules/@mui/icons-material/index';

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

function TourList() {
  const navigate = useNavigate();


    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 1000);
    const [loading, setLoading] = useState(false);
    const [TourData, setTourData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);  
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const columns = [
        { id: 's.no', label: 'S. No.',    align: 'center',  minWidth: 20, sorting:false
    },
        {
          id: 'tourName',
          label: 'Tour Name',
          minWidth: 170,
          align: 'center',
          format: (value) => value.toLocaleString('en-US'),
          sorting:false

        },
        {
          id: 'title',
          label: 'Title',
          minWidth: 170,
          align: 'center',
          format: (value) => value.toLocaleString('en-US'),
          sorting:false

        },
       
        {
          id: 'price',
          label: 'Price',
          minWidth: 120,
          align: 'center',
          format: (value) => value.toLocaleString('en-US'),
          sorting:true

        },
        {
            id: 'image',
            label: 'Image',
            minWidth: 170,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
            sorting:false

          },
          {
            id: 'Action',
            label: 'Action',
            minWidth: 170,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
            sorting:false

          },
        
      ];


      const [sortColumn, setSortColumn] = useState('');  
      const [sortOrder, setSortOrder] = useState('asc');  
    
      const handleSort = (columnId) => {
        if (columnId === sortColumn) {
           setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
           setSortColumn(columnId);
          setSortOrder('asc');
        }
      };
    
         const sortedData = [...TourData].sort((a, b) => {
        if (a?.[sortColumn] && b?.[sortColumn]) {
          // Sort by pricePerDay
          return sortOrder === 'asc' ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn];
        }  
        
        return 0;
      });
    

      
const getTourList = async (search) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}api/tour-tickts/pagination`, {
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
        setTourData(response?.data?.data);
         setCount(response?.data?.count);
        setLoading(false);
      } else if (response?.data?.statusCode === 400) {
        setTourData(response?.data?.data);
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
        getTourList(debouncedSearch);
    }
  }, [isLoggedIn, page, rowsPerPage,debouncedSearch]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event?.target?.value);
      setPage(0);
    };

    const handleEdit = (id) => {
      navigate('/tour/Edit/' + id);
    }

    const handleView = (id) => {
      navigate("/tour/" + id)
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
          const response = await axios.post(`${API_URL}api/tour-tickts/delete/${id}`,{}, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem("token")}`,          
                },
            });            
            if (response.data.statusCode == 200) {
              Swal.fire('Deleted!', 'Record has been deleted.', 'success');
    
              setTourData((prevData) => prevData.filter((item) => item.id !== id));
              setLoading(false)
            } else {
              Swal.fire('Error',response.data.message, 'Failed to delete the record.');
            }
          }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while deleting the record.', 'error');
        setLoading(false);
      }
    };
   
  
    const handleSearchQueryChange = (event) => {
      setSearch(event.target.value);
    };

    const handleModalOpen = () => {
      navigate('TourList');
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
          <>
 
 <stack  spacing={2} direction="row" style={{marginBottom: 15,display:"flex",justifyContent: 'flex-end' }} >
 <Grid container xs={2.2} >
   <TextField
     id="outlined-basic"
     label="Search"
     variant="outlined"
    value={search}
   onChange={handleSearchQueryChange}
   />
   </Grid>
   <Button variant="contained" onClick={handleModalOpen} style={{ marginBottom: '10px', marginLeft: '10px', float: 'right', height: '40px' }}>
                    Add Tour
                </Button>
 </stack>
 
 <Paper sx={{ width: '100%', overflow: 'hidden' }}>
 {TourData.length > 0 ? (<> <TableContainer >
     <Table stickyHeader aria-label="sticky table">
       <TableHead>
         <TableRow>
           {/* {columns.map((column) => (
             <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
               {column.label}
             </TableCell>
           ))} */}

                                  {columns.map((column) => (
                                      <TableCell
                                          key={column.id}
                                          align={column.align}
                                          style={{ minWidth: column.minWidth,cursor: 'pointer' }}
                                          onClick={() => handleSort(column.id)}
                                      >
                                          {column.label}{' '}
                                          {sortColumn === column.id && column?.sorting && (
                                              <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                          )}
                                      </TableCell>
                                  ))}
         </TableRow>
       </TableHead>
       <TableBody>
       {sortedData?.map((TourData, index) => (
         
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
               <TableCell align={'center'}>{index + 1 + page * rowsPerPage}</TableCell>
               <TableCell align={'center'}>{TourData?.tourName}</TableCell>
               <TableCell align={'center'}>{TourData?.title}</TableCell>
               <TableCell align={'center'}>{TourData?.price}</TableCell>
               <TableCell align="center">
                        <img
                          src={TourData.picturePathUrl}
                          alt={TourData.picturePath}
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                      <IconButton>
                        <Edit onClick={() => handleEdit(TourData?.id)} />
                      </IconButton>
                      <IconButton onClick={() => handleView(TourData?.id)}>
                        <RemoveRedEyeOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(TourData?.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
              </TableRow> 
       ))}
       </TableBody>
     </Table>
   </TableContainer>
   <TablePagination
     rowsPerPageOptions={[5,10,50,100]}
     component="div"
      count={count}
     rowsPerPage={rowsPerPage}
     page={page}
     onPageChange={handleChangePage}
     onRowsPerPageChange={handleChangeRowsPerPage}
   />
    </>):(<div> <p style={{ display: 'flex', justifyContent: 'center'  }}>Record not found</p></div>)}
       
 </Paper>
</>

    </div>
  )
}

export default TourList