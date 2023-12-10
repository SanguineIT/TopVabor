import React, { useState, useEffect } from 'react';
import {
  Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, Grid, TableHead,
  TableRow, Paper, IconButton
} from '@mui/material';

//import {Box, Input, Card, CardMedia, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { Delete, Edit, Close as CloseIcon } from '@mui/icons-material';
import '../../../src/App.css';


const Color = () => {
  const [modalOpen, setModalOpen] = useState(false);

  //const [nextSNumber, setNextSNumber] = useState(1);
  
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    snumber: '',
    //image: null, // Use null to represent the selected file
    color: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    snumber: '',
    //image: '',
    color: ''
  });
  const [editIndex, setEditIndex] = useState(-1);

  const handleDeleteCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
  };
  useEffect(() => {
    if (editIndex !== -1) {
      // If editing an existing category, populate the image in the file input
      const selectedCategory = categories[editIndex];
      setCategoryData({
        snumber: selectedCategory.snumber,
        //image: selectedCategory.image, // Set the image from the existing category
        color: selectedCategory.color,
      });
    }
  }, [editIndex, categories]);

  const handleEditCategory = (index) => {
    setEditIndex(index);
    const selectedCategory = categories[index];
    setCategoryData({
      snumber: selectedCategory.snumber,
      //image: null, // Clear the selected file when editing
      color: selectedCategory.color,
    });
    setModalOpen(true);

  };

  const handleModalOpen = () => {
    const newSNumber = categories.length + 1;
    setCategoryData({
      snumber: newSNumber,
      //image: null,
      color: '',
    });
    //setNextSNumber(newSNumber);
    setModalOpen(true);

  };

  const handleModalClose = () => {
    setModalOpen(false);
    setValidationErrors({
      snumber: '',
      //image: '',
      color: ''
    });
    setEditIndex(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  // const handleFileInputChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setCategoryData({ ...categoryData, image: file });
  //   }
  // };

  const handleSubmit = () => {
    const errors = {};
    if (!categoryData.snumber) {
      errors.name = 'S.No. is required';
    }
    // if (!categoryData.image) {
    //   errors.image = 'Image is required';
    // }
    if (!categoryData.color) {
      errors.color = 'Color is required';
    }

    if (Object.keys(errors).length === 0) {
      if (editIndex !== -1) {
        const updatedCategories = [...categories];
        updatedCategories[editIndex] = categoryData;
        setCategories(updatedCategories);
      } else {
        setCategories([...categories, categoryData]);
      }

      setCategoryData({
        snumber: '',
        //image: null,
        color: ''
      });
      setModalOpen(false);
      setEditIndex(-1);
    } else {
      setValidationErrors(errors);
    }
  };

  const columns = [
    {
      id: 'snumber',
      label: 'S.No.',
      align: 'left',
      minWidth: 170,
      cellStyle: {
        // Add padding to the left and right of the cell
        paddingLeft: 60
      }
    },
    // {
    //   id: 'image',
    //   label: 'Image',
    //   minWidth: 170,
    //   align: 'center',
    //   format: (value) => value.toLocaleString('en-US'),
    // },
    {
      id: 'color',
      label: 'Color',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
      cellStyle: {
        // Add padding to the left and right of the cell
        paddingLeft: 65
      }
    },
    {
      id: 'action',
      label: 'Action',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
      cellStyle: {
        // Add padding to the left and right of the cell
        paddingLeft: 115
      }
    }
  ];

  // const colors = [
  //   { label: 'Red', value: 'Red', color: 'Red' },
  //   { label: 'Blue', value: 'Blue', color: 'Blue' },
  //   { label: 'Green', value: 'Green', color: 'Green' },
  //   { label: 'Yellow', value: 'Yellow', color: 'Yellow' },
  //   { label: 'Purple', value: 'Purple', color: 'Purple' },
  // ];



  return (
    <div>
      <Button variant="contained" onClick={handleModalOpen} className="mb-2" style={{ float: "right",marginBottom:"10px" }}>
        Add Color
      </Button>

      <Modal open={modalOpen} onClose={handleModalClose} className="modal">
        <div className="modal-content">
          <div>
            <h3 style={{ float: "left" }}>{editIndex !== -1 ? 'Edit Color' : 'Add Color'} </h3>
            <IconButton className="close-button" style={{ width: "30px", float: "right", }}
              onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <TextField
                name="snumber"
                label="S.No."
                value={nextSNumber}
                onChange={handleInputChange}
                error={!!validationErrors.snumber}
                helperText={validationErrors.snumber}
                fullWidth
                disabled
              />
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                name="color"
                label="Color"
                value={categoryData.color}
                onChange={handleInputChange}
                error={!!validationErrors.color}
                helperText={validationErrors.color}
                fullWidth
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Input
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                  id="image-input"
                />
                <label htmlFor="image-input">
                  <Button
                    variant="outlined"
                    component="span"
                    color="primary"
                    style={{ marginRight: '8px' }}
                  >
                    Upload Image
                  </Button>
                </label>
                {categoryData.image && (
                  <div>
                    <Card>
                      <CardMedia
                        component="img"
                        alt="Category Image"
                        width="80" // Adjust this value to change the image width
                        height="60" // Adjust this value to change the image height
                        image={URL.createObjectURL(categoryData.image)}
                      />
                    </Card>
                  </div>
                )}
              </Box>
              {validationErrors.image && (
                <div style={{ color: 'red' }}>{validationErrors.image}</div>
              )}
            </Grid> */}
            {/* <Grid item xs={12}>
              <TextField
                name="color"
                label="Color"
                value={categoryData.color}
                onChange={handleInputChange}
                error={!!validationErrors.color}
                helperText={validationErrors.color}
                required
                fullWidth
              />
            </Grid> */}
            {/* <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="color">Color</InputLabel>
                <Select
                  name="color"
                  label="Color"
                  value={categoryData.color}
                  onChange={handleInputChange}
                  error={!!validationErrors.color}
                >
                  {colors.map((colorOption, index) => (
                    <MenuItem key={index} value={colorOption.value}>
                      <div style={{ width: '20px', height: '20px', marginRight: '8px', display: 'inline-block', backgroundColor: colorOption.color }}></div>
                      {colorOption.label}
                    </MenuItem>
                  ))}
                </Select>
                {!!validationErrors.color && (
                  <div style={{ color: 'red' }}>{validationErrors.color}</div>
                )}
              </FormControl>
            </Grid> */}



            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit} fullWidth>
                {editIndex !== -1 ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, ...column.cellStyle }}>
                  {column.label}
                </TableCell>
              ))}

            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={index}>
                 
                <TableCell align="left" style={{ paddingLeft: 70 }}>{index+1}</TableCell>

                {/* <TableCell align="center">
                  {category.image instanceof Blob ? (
                    <Card>
                      <CardMedia
                        component="img"
                        alt="Category Image"
                        height="60"
                        width="80"
                        image={URL.createObjectURL(category.image)}
                      />
                    </Card>
                  ) : (
                    // Display a placeholder or some default image here
                    <div>No Image</div>
                  )}
                </TableCell> */}

                <TableCell align="left" style={{ paddingLeft: 70 }}>{category.color}</TableCell>
                <TableCell align="left" style={{ paddingLeft: 100 }}>
                  <IconButton onClick={() => handleEditCategory(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default Color
