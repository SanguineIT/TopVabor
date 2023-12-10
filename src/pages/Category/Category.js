import React, { useState ,useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,Box} from '@mui/material';
// import { Button,Grid, Modal, TextField} from '@mui/material';
// import { Delete, Edit } from '@mui/icons-material';
import '../../../src/App.css';
// import { Close } from '../../../node_modules/@mui/icons-material/index';
import Swal from 'sweetalert2';
// import { CategoryCreate } from 'Services/Api';
import { API_URL } from 'Services/Service';
import axios from '../../../node_modules/axios/index';
import TablePagination from '@mui/material/TablePagination';

// import { useFormik, FormikProvider } from 'formik';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'AuthContext/AuthContext';
// import { FormikProvider } from '../../../node_modules/formik/dist/FormikContext';
import CircularProgress from '@mui/material/CircularProgress';
const validationSchema = Yup.object({
  categoryName: Yup.string().required('Category is required').min(2, 'min 2 character').max(20, 'max 20 character'),
  description: Yup.string().required('Description is required').min(2, 'min 2 character').max(200, 'max 200 character')
  // Add validations for other fields if needed
});

const Category = () => {



  const [loading,setLoading] = useState(false);



  const { user } = useAuth();
  const formik = useFormik({
    initialValues: {
      categoryName: '',
      description: '',
      id:0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      // Handle form submission here
      alert(JSON.stringify(values, null, 2));

      try {
        
        const response = await axios.post(`${API_URL}api/category/create-or-update`, values
        ,
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          },}) ;
        if (response.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "category  created.",
            confirmButtonText: "OK", // Add the "OK" button
          }).then(() => {
            formik.resetForm();
            setModalOpen(false);
            // This code will run after the user clicks the "OK" button
            // window.location.reload();
          })
          await fetchData()
       
      }
      else if (response?.data.statusCode === 400 || response?.data.statusCode === 401)
      {
        Swal.fire({
          icon: "error",
          title: "eroor",
          text:response?.data.message ||response?.message ,
          confirmButtonText: "OK", // Add the "OK" button
        })
      }
      formik.resetForm();
      setModalOpen(false);
    }
      catch (error) {
        // Display error message using Swal.fire
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong in server!'
        });
      }
    }
  });



  // const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

 
 

 
 
  // const [editIndex, setEditIndex] = useState(-1);

  // const handleDeleteCategory = (index) => {
  //   const updatedCategories = [...categories];
  //   updatedCategories.splice(index, 1);
  //   setCategories(updatedCategories);
  // };

  // const handleModalOpen = () => {
  //   // setCategoryData({
  //   //   category: '',
  //   //   description: '',
  //   // });
  //   setModalOpen(true);
  // };

  // const handleModalClose = () => {
  //   setModalOpen(false);

  //   setEditIndex(-1);
  // };


  const columns = [
    {
      id: '',
      label: 'Sr. No.',
      minWidth: 100,
      align: 'center'
    },
    { id: 'category', label: 'Category', align: 'center', minWidth: 170 },
    {
      id: 'image',
      label: 'Image',
      minWidth: 170,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 170,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
   

    // {
    //   id: 'action',
    //   label: 'Action',
    //   minWidth: 170,
    //   align: 'center',
    //   format: (value) => value.toLocaleString('en-US')
    // }
  ];

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  useEffect(() => {
    fetchData(); // Call API with debounced search query
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response = await axios.post(`${API_URL}api/category/pagination`,
        {
          curPage: page + 1,
          perPage: rowsPerPage,
          sortBy: 'createdAt',
          direction: 'desc',
          whereClause: [
            {
              // key: 'all',
              // value: searchQuery,
              // operator: 'string',
            },
          ],
        },
        { headers: { authorization: `bearer ${localStorage.getItem('token')}` } }
      );
      console.log('response ==> ' , response.data)
      setCategories(response.data.data);
      setCount(response.data?.count);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: response.data.message,
      });
      setLoading(false);
      // navigate('/login');
    }
  };
// // Assuming you have a function to handle the delete action
// const handleDeleteCategory = async (categoryId) => {
//   try {
//     const response = await axios.delete(`${API_URL}api/category/delete${categoryId}`, {
//       headers: {
//         Authorization: `Bearer ${user?.token}`,
//       },
//     });

//     if (response.data.statusCode === 200) {
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Category deleted successfully.",
//         confirmButtonText: "OK",
//       }).then(() => {
//         // After deletion, you may want to refresh the list of categories
//         fetchData();
//       });
//     } else if (response?.data.statusCode === 400 || response?.data.statusCode === 401) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: response?.data.message || response?.message,
//         confirmButtonText: "OK",
//       });
//     }
//   } catch (error) {
//     // Display error message using Swal.fire
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: "Something went wrong in server!",
//     });
//   }
// };



   
     
  if(loading){
    return<Box  sx= {{display: 'flex', justifyContent: 'center' ,  alignItems: 'center',  height: '80vh' }} 
    >
 <CircularProgress />
</Box> }   
 




  return (
    <div>
      {/* <Button variant="contained" onClick={handleModalOpen} style={{ float: 'right', marginBottom: '10px' }}>
        Add Category
      </Button> */}
{/*       
          <Modal open={modalOpen} onClose={handleModalClose} className="modal">
            
            <div className="modal-content">
              <div>
                <h3 style={{ float: 'left' }}>{editIndex !== -1 ? 'Edit Category' : 'Add Category'} </h3>
                <button className="close-button" style={{ float: 'right', border: 'none' }} onClick={handleModalClose}>
                  {' '}
                  <Close />
                </button>
              </div>
            
              <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="categoryName"
                    id="categoryName"
                    label="Category"
                    fullWidth
                    value={formik.values.categoryName}
                    onChange={formik.handleChange}
                    error={formik.touched.categoryName && formik.errors.categoryName}
                    helperText={formik.touched.categoryName && formik.errors.categoryName}
                  />
                </Grid>
                <Grid item xs={12}>
            
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && formik.errors.description}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
             
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth type="submit" >
                    {editIndex !== -1 ? 'Update' : 'Submit'}
                  </Button>
                </Grid>
                </Grid>
                </form>
      </FormikProvider>
            
            </div>
          </Modal>
        */}

      <>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
              <TableBody sx={{padding:'0px'}}>
                {categories.map((category, index) => (
                  console.log(categories,category,index),
                  <TableRow key={index }>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{category.categoryName}</TableCell>
                    {/* <TableCell align="center">{category.picturePath}</TableCell> */}
                      <TableCell align="center">
                        <img
                          src={category.picturePathUrl}
                          alt={category.picturePath}
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      </TableCell>
                    <TableCell align="center">{category.description}</TableCell>
                    
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
            <Table/>
        </Paper>
      </>
    </div>
  );
};

export default Category;
