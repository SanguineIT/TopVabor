import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from '../../../node_modules/axios/index';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { useAuth } from 'AuthContext/AuthContext';
import { API_URL } from 'Services/Service';
import { TextField } from '../../../node_modules/@mui/material/index';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';


//==============================USER TABLE=====================================
const columns = [
  { id: 's. no', label: 'S. No.',    align: 'center',  minWidth: 50 },
  {
    id: 'name',
    label: 'User Name',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'dateOfBirth',
    label: 'Date Of Birth',
    minWidth: 170,
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
  // {
  //   id: 'userRole',
  //   label: 'Role',
  //   minWidth: 170,
  //   align: 'center',
  //   format: (value) => value.toLocaleString('en-US')
  // },
  
];

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

const Pagiantion = () => {
      
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);

  const [loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const { user } = useAuth();
  const isLoggedIn = !!user;


const getUserList = async (search) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}api/user/pagination`, {
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
     setUserData(response?.data?.data);
       setCount(response?.data?.count);
      setLoading(false);
    } else if (response?.data?.statusCode === 400) {
      setUserData(response?.data?.data);
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
    getUserList(debouncedSearch);
  }
}, [isLoggedIn, page, rowsPerPage,debouncedSearch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event?.target?.value);
    setPage(0);
  };


  const handleSearchQueryChange = (event) => {
    setSearch(event.target.value);
  };

  // const handleUserRoleChange = async (event, id) => {
  //   const newUserRole = event.target.value;
  //   try {
  //     setLoading(true);

  //     const response = await axios.post(`${API_URL}api/user/update/role`, {
  //       userId: id,
  //       role: newUserRole,

  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });

  //     if (response?.data?.statusCode === 200) {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Success',
  //         text: 'Role Updated Successfully',
  //       });



  //       await getUserList();
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Something went wrong!',
  //       });
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'An error occurred while updating the status.',
  //     });
  //     console.error(error);
  //     setLoading(false);
  //   }
  // }

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      );
    }

  return (
    <>
 
      <stack  spacing={2} direction="row" style={{marginBottom: 15,display:"flex",justifyContent: 'flex-end' }} >
         <Box sx={{ }}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
         value={search}
        onChange={handleSearchQueryChange}
        />
        </Box>
      </stack>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {UserData.length > 0 ? (<> <TableContainer >
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
            {UserData?.length>0 && UserData?.map((userData, index) => (
              
                   <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align={'center'}> {index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell align={'center'}>{userData?.name}</TableCell>
                    <TableCell align={'center'}>{userData?.dateOfBirth}</TableCell>
                    <TableCell align={'center'}>{userData?.email}</TableCell>
                  
                    {/*user Role - Admin/User  */}
                    {/* <Select
                      value={userData?.role}
                      onChange={(e) => handleUserRoleChange(e, userData.id)}
                       label={userData?.role}
                      style={{ minWidth: '120px',backgroundColor:
                      userData.status === "Admin" ? '#4ddb37' :
                      userData.status === "User" ? '#fc2121' : '#d6e7ff'}}
                    >
                      <MenuItem value="role">User Role</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select> */}
                   
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
  );
};

export default Pagiantion;
