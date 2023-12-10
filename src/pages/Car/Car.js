import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, IconButton, TableCell, TableContainer, Grid, TableHead, TableRow, Paper } from '@mui/material';
import '../../../src/App.css';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Box, TablePagination } from '../../../node_modules/@mui/material/index';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { carDetailsPagination, carDeletePagination } from 'Services/Api';
import ApiService from 'Services/index';
import { Delete, Edit } from '../../../node_modules/@mui/icons-material/index';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import axios from '../../../node_modules/axios/index';



const Car = () => {
  const [categorypage, setCategoryPage] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    setPage(0)
    setRowsPerPage(10)
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value)
    setPage(0)
    setRowsPerPage(10)
  };


  useEffect(() => {
    getCarList()
  }, [selectedCategory, page, rowsPerPage, selectedCountry])




  const handleModalOpen = () => {
    navigate('Cars');
  };

  const handleView = (id) => {
    navigate("/carDetails/" + id)
  }



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event?.target?.value);
    setPage(0);
  };



  const getCarList = async () => {
    try {
      setLoading(true);

      const rObj = {
        curPage: page + 1,
        perPage: rowsPerPage,
        sortBy: 'createdAt',
        direction: 'desc',
        whereClause: [
          {
            key: "categoryId",
            value: selectedCategory,

          },
          {
            key: 'country',
            value: selectedCountry,
            // operator: 'string',
          },
        ],
      };
      const response = await ApiService.post(carDetailsPagination, rObj);
      if (response?.data?.statusCode == 200) {
        setCarData(response?.data?.data);
        setCount(response?.data?.count);
        setLoading(false);
      } else if (response?.data?.statusCode == 400) {
        setCarData(response?.data?.data);
        setCount(response?.data?.count);
        setLoading(false);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while fetching data.',
      });
      setLoading(false)
    }
  };

  const columns = [
    {
      id: 'Index',
      label: 'S. No.',
      minWidth: 70,
      align: 'center',
      sorting: false
    },
    { id: 'categoryName', label: 'Car Category', align: 'center', minWidth: 120, sorting: false },
    {
      id: 'model',
      label: 'Model',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
      sorting: false
    },
    {
      id: 'seats',
      label: 'Seat',
      minWidth: 60,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
      sorting: true
    },
    {
      id: 'pricePerDay',
      label: 'Price Per Day',
      minWidth: 130,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
      sorting: true
    },

    {
      id: 'remark',
      label: 'Remark',
      minWidth: 90,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
      sorting: false
    },
    {
      id: 'country',
      label: 'Country',
      minWidth: 90,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
      sorting: false
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
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    }
  ];

  const ActiveStatus = async (id, status) => {
    try {
      setLoading(true)
      let UserStatus = await axios.post('https://restroreff.microlent.com/api/car-details/update/status', { carId: id, status: !status }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,

        }
      })
      let resposne = UserStatus.data
      if (resposne.statusCode == 200) {
        Swal.fire({
          icon: 'success',
          title: ' Success',
          text: 'Status Updated Successfully'
        });
      }
      await getCarList()

      setLoading(false)
      return
    }
    catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });

      setLoading(false)
      console.log(err.message, "err")

    }

  }

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

  const sortedData = [...carData].sort((a, b) => {
    if (a?.[sortColumn] && b?.[sortColumn]) {
      return sortOrder === 'asc' ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn];
    }

    return 0;
  });



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
        setLoading(true)
        const response = await ApiService.post(`${carDeletePagination}${id}`);
        if (response.data.statusCode === 200) {
          Swal.fire('Deleted!', 'Record has been deleted.', 'success');

          setCarData((prevData) => prevData.filter((item) => item.id !== id));
          setLoading(false)
        } else {
          Swal.fire('Error', 'Failed to delete the record.', 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', 'An error occurred while deleting the record.', 'error');
      setLoading(false)
    }
  };


  const getCategoryList = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://restroreff.microlent.com/api/category/get-All', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data?.statusCode == 200) {
        setCategoryPage(data.data);
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
    getCategoryList();
  }, []);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEdit = (id) => {
    navigate('/cars/edit/' + id);
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength) + '...';
    }
  }

  return (
    <div>
      <stack spacing={2} direction="row" style={{ marginBottom: 10, display: "flex", justifyContent: 'flex-end' }} >


        <Grid container xs={1.5} ml={1}>

          <FormControl fullWidth>
            <InputLabel style={{
              fontSize: '14px',
              lineHeight: '1',
            }}>Car Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value={""}>
                Select Category
              </MenuItem>
              {categorypage?.map((categoryItem, index) => (
                <MenuItem key={`category-${index}`} value={categoryItem.id}>
                  {categoryItem.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container xs={1.5} ml={1}>

          <FormControl fullWidth>
            <InputLabel style={{
              fontSize: '14px',
              lineHeight: '1',
            }}>Car Country</InputLabel>
            <Select
              value={selectedCountry}
              onChange={handleCountryChange}
              label="country"
            >
              <MenuItem >Car Country</MenuItem>
              <MenuItem value="Uzbekistan">Uzbekistan</MenuItem>
              <MenuItem value="UAE">UAE </MenuItem>

            </Select>
          </FormControl>
        </Grid>


        <Button variant="contained" onClick={handleModalOpen} style={{ marginBottom: '10px', marginLeft: '10px', float: 'right', height: '40px' }}>
          Add Car
        </Button>

      </stack>



      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {carData.length > 0 ? (<>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, cursor: 'pointer' }}
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
                {sortedData.map((data, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="center"> {index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell align="center">{data?.category?.categoryName}</TableCell>
                    <TableCell align="center">{truncateText(data?.model, 20)}</TableCell>

                    <TableCell align="center">{data?.seats}</TableCell>

                    <TableCell align="center">{data?.pricePerDay}</TableCell>
                    <TableCell align="center">{truncateText(data?.remark, 20)}</TableCell>
                    <TableCell align="center">{data?.country}</TableCell>

                    <TableCell align="center">
                      <img
                        src={data.CarpicturePathUrl}
                        alt={data.carPicturePath}
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <Edit onClick={() => handleEdit(data?.id)} />
                      </IconButton>
                      <IconButton onClick={() => handleView(data?.id)}>
                        <RemoveRedEyeOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(data?.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                    <TableCell align={'center'}  ><Button onClick={() => ActiveStatus(data.id, data.isActive)} variant="contained" color={data.isActive ? 'success' : 'error'}   >{data.isActive ? 'Enable' : 'Disable'}</Button></TableCell>
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
  );
};

export default Car;
