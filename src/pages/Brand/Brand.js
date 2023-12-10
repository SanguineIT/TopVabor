import React, { useState , useEffect } from 'react';
import { Button, Modal, TextField, Table, TableBody, TableCell,TableContainer, Grid,  TableHead, TableRow, Paper, Input, Card, CardMedia } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import '../../../src/App.css';
import { Close } from '../../../node_modules/@mui/icons-material/index';

import useApi from 'Services/useApi';

import { BrandCreate } from 'Services/Api';

      

const Brand = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [brands, setbrands] = useState([]);
  const [brandData, setbrandData] = useState({
    
    image: null, // Use null to represent the selected file
    brand: '',
    
  });
  const [validationErrors, setValidationErrors] = useState({
    
    image: '',
    brand: '',
    
  });
  const [editIndex, setEditIndex] = useState(-1);

    const handleDeletebrand = (index) => {
      const updatedbrands = [...brands];
      updatedbrands.splice(index, 1);
      setbrands(updatedbrands);
    };
  useEffect(() => {
    if (editIndex !== -1) {
      // If editing an existing brand, populate the image in the file input
      const selectedBrand = brands[editIndex];
      setbrandData({
        image: selectedBrand.image, // Set the image from the existing brand
        brand: selectedBrand.brand,
    
      });
    }
  }, [editIndex, brands]);

    const handleEditbrand = (index) => {
      setEditIndex(index);
      const selectedBrand = brands[index];
      setbrandData({
        image: null, // Clear the selected file when editing
        brand: selectedBrand.brand,
      });
      setModalOpen(true);
  };

  // const handleModalOpen = () => {
  //   setbrandData({
      
  //     image: null,
  //     brand:""
  //   });
  //   setModalOpen(true);
  // };

  const handleModalClose = () => {
    setModalOpen(false);
    setValidationErrors({
      image: '',
      brand: '',
      
    });
    setEditIndex(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setbrandData({ ...brandData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Extract the base64 string
        setbrandData({ ...brandData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };
  

  //   const errors = {};
    
    
  //   if (!brandData.image) {
  //     errors.image = 'Image is required';
  //   }
  //   if (!brandData.brand) {
  //     errors.brand = 'Brand is required';
  //   }
 

  //   if (Object.keys(errors).length === 0) {
  //     if (editIndex !== -1) {
  //       const updatedbrands = [...brands];
  //       updatedbrands[editIndex] = brandData;
  //       setbrands(updatedbrands);
  //     } else {
  //       setbrands([...brands, brandData]);
  //     }

  //     setbrandData({
  //       image: null,
  //        brand: '',
        
  //     });
  //     setModalOpen(false);
  //     setEditIndex(-1);
  //   } else {
  //     setValidationErrors(errors);
  //   }
  // };

  
const columns = [
   {
    id: '',
    label: 'Sr. No.',
    minWidth: 10,
    align: 'center',
    
  }, 
  {
    id: 'image',
    label: 'Logo',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'brand',
    label: 'Brand',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
 
  
  {
    id: 'action',
    label: 'Action',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }, 
];



const {  loading } = useApi();

// const apiUrl = BrandCreate; 
// const formData = new FormData();
//   formData.append("file",brandData.image);
//   formData.append("brandName",brandData.brand);
//   formData.append("id",0);
  
// const apiConfig = {
//   method: 'POST',
//   headers: {
//     // Correct Content-Type for FormData
//     'Content-Type': 'multipart/form-data',
//   },
  
//   body: formData,
// };

const handleBrandCreate = async () => {
  // setConfig(apiConfig);
  // setUrl(apiUrl);
  fetch(BrandCreate, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          title: "Brand created successfully ",
          text: "Brand created successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "error ",
        text: error?.response?.message,
        icon: "error",
     
      });
    });
};
  // useEffect(() => {
  //   if (!loading && !error && data) {
  //     // Process the data received from the API
  //     console.log('Data received:', data);
  //   }
  //   if (error) {
  //     // Handle the error
  //     console.error('Error:', error);
  //   }
  // }, [data, loading, error]);


  // if(loading) {
  //    return <h1>loading</h1>
  // }

  
  return (
    <div>
      {/* <Button variant="contained" onClick={handleModalOpen}   style={{float:"right", marginBottom:"10px"}}>
        Add Brand
      </Button> */}
      
      <Modal open={modalOpen} onClose={handleModalClose} className="modal">
        <div className="modal-content" >
          <div>
          <h3 style={{float:"left"}}>{editIndex !== -1 ? 'Edit Brand' : 'Add Brand '} </h3>
          <button  style={{ float:"right", border: "none",
   }} onClick={handleModalClose}>   < Close /></button>
          </div>
          <Grid container spacing={2}>
         
          <Grid item xs={12}>
              <TextField
                name="brand"
                label="Brand"
                value={brandData.brand}
                onChange={handleInputChange}
                error={!!validationErrors.brand}
                helperText={validationErrors.brand}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <>
                <Input
                name = "image"
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                  id="image-input"
                />
                <label htmlFor="image-input" >
                  <Button
                    variant="outlined"
                    component="span"
                    color="primary"
                     style={{ width:'100%' }}
                  >
                    Upload Image
                  </Button>
                  
                  {brandData.image && (
                  <div>
                    <Card style={{ marginTop: '20px' }}>
                      <CardMedia
                        component="img"
                        alt="brand Image"
                        width="100%" // Adjust this value to change the image width
                        height="100%" // Adjust this value to change the image height
                         image={brandData.image}
                      />
                    </Card>
                  </div>
                )}
                </label>
              
              </>
              {validationErrors.image && (
                <div className="error">{validationErrors.image}</div>
              )}
            </Grid>
           
         
            <Grid item xs={12}>
              {loading ?  (
        <button disabled>Loading...</button>
      ) : ( <Button variant="contained" onClick={handleBrandCreate} fullWidth>
      {editIndex !== -1 ? 'Update' : 'Submit'}
    </Button>)}
             
            </Grid>

          </Grid>
        </div>
      </Modal>



      <>
    <Paper sx={{ width: '100%', overflow: 'hidden' }} className="mt-2">
      <TableContainer >
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
          <TableBody >
          {brands.map((brand, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                   {index+1}
                </TableCell>
                
                <TableCell align="center">
                  <Card>
                    <CardMedia
                      component="img"
                      alt="brand Image"
                      height="100"
                      //width="25"
              // Adjust this value to change the image width
                      image={URL.createObjectURL(brand.image)}
                    />
                  </Card>
                </TableCell>
                <TableCell align="center">{brand.brand}</TableCell>
                
                <TableCell align="center">
                  <Button  onClick={() => handleEditbrand(index)}>
                    < Edit />
                  </Button>
                  <Button  onClick={() => handleDeletebrand(index)}>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             
           
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
    </div>
  );
};

export default Brand;
