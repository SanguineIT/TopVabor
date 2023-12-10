import React, { useEffect, useState } from 'react';
import { Container, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Button, Divider,IconButton } from '@mui/material';
import { useFormik, Field, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'; 
import CircularProgress from '@mui/material/CircularProgress';
import { Box, FormHelperText } from '../../../node_modules/@mui/material/index';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { Close } from '../../../node_modules/@mui/icons-material/index';

// ========================Car Add Page===========================
const Car = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 5000000; // 5MB

  const validationSchema = Yup.object({
      categoryId: Yup.number().when([], {
      is: (categoryId) => categoryId !== '', 
      then: Yup.number().required('Required'), 
    }),
    model: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(20, 'Maximum 20 characters').required('Required'),
    pricePerDay: Yup.number()
    .required('Required')
    .test('is-positive', 'Price must be greater than 0', (value) => value !== 0),
     seats: Yup.number()
    .required('Required')
    .positive('Seat must be a positive number')
    .integer('Seat must be a whole number')
    .min(1, 'Seat must be at least 1')
    .max(10, 'Seat must be between 1 and 10'),
    remark: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(255, 'Maximum 255 characters').required('Required!'),
    country: Yup.string().required('Required!'),
    carPicturePath: Yup.array()
      .min(1, 'At least one image is required')
      .max(10, 'max 10 images can be upload')
      .test('fileSize', 'File size too large', (value) => {
        if (value && value.length) {
          return value.every((file) => file.file.size <= MAX_FILE_SIZE);  
        }
        return true;  
      })
      .test('fileType', 'Unsupported File Format, only PNG file is accepted', (value) => {
        if (value && value.length) {
          return value.every((file) => file.file.type === 'image/png');
        }
        return true;
      }),
    ImageList: Yup.array()
      .min(1, 'At least one image is required')
      .max(5, 'max 5 images can be upload')
      .test('fileSize', 'File size too large', (value) => {
        if (value && value.length) {
          return value.every((file) => file.file.size <= MAX_FILE_SIZE);  
        }
        return true;  
      })
      .test('fileType', 'Unsupported File Format, only PNG file is accepted', (value) => {
        if (value && value.length) {
          return value.every((file) => file.file.type === 'image/png');
        }
        return true;
      }),  
  });

  const countries = [
    { id: 1, name: 'UAE' },
    { id: 2, name: 'Uzbekistan' },
   ];

  const formik = useFormik({
    initialValues: {
      id: 0,
      categoryId: '',
      model: '',
      pricePerDay: '',
      seats: '',
      carPicturePath: [], 
      remark: '',
      country:'',
      ImageList:[],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
 
      formData.append('id', values.id);
      formData.append('categoryId', values.categoryId);
      formData.append('model', values.model);
      formData.append('pricePerDay', values.pricePerDay);
      formData.append('seats', values.seats);
      formData.append('remark', values.remark);
      formData.append('carPicturePath', imagePath);
      formData.append('country', values.country)
      multipleImagePath.map((item)=>{
        formData.append('ImageList', item.file); 
      }) 
      try {
        setLoading(true)
        const response = await fetch(
          'https://restroreff.microlent.com/api/car-details/create-or-update',
          {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
             },
          }
        );
        const data = await response.json();
        if (data.statusCode === 200){
            setLoading(false)
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Car details added successfully.',
            });
            formik.resetForm();
            navigate('/car');
          
        } else {
          throw new Error('Error uploading images');
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error while creating car details',
        });      
        setLoading(false)
      }
    },
  });

  const [imagePath, setImagePath] = useState();
  const [multipleImagePath, setMultipleImagePath] = useState([]);

  const handleImageChange = (event) => {
    const files = event.currentTarget.files;
    setImagePath(event.target.files[0]);
    const imageList = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    formik.setFieldValue('carPicturePath', imageList);
    
  };

  const handleFeatureImageChange = (event) => {
    const files = event.currentTarget.files;
    console.log(files)
    
    const imageList = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setMultipleImagePath(imageList)
    console.log(imageList)
    formik.setFieldValue('ImageList', imageList);
    
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.carPicturePath];
    updatedImages.splice(index, 1);
    formik.setFieldValue('carPicturePath', updatedImages);
  };

  const handleFeatureRemoveImage = (index) => {
    const updatedImages = [...formik.values.ImageList];
    updatedImages.splice(index, 1);
    formik.setFieldValue('ImageList', updatedImages);
  };

  const [categoryData, setCategoryData]= useState()

  const getCategoryList = async() =>{
    try {
      setLoading(true)
      const response = await fetch('https://restroreff.microlent.com/api/category/get-All', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

       if (data.statusCode == 200) {
        // console.log(data);
        setCategoryData(data.data)
        
        setLoading(false)

      } else {
        throw new Error('Error uploading images');
      }
    } catch (error) {
      console.error(error);
      setLoading(false)

     }
  }

  useEffect(()=>{
    getCategoryList()
  },[])

  const BackButton = () =>{
    navigate('/car');
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <>
     <Button variant="contained" onClick={BackButton} style={{ marginLeft:'25px', float: 'left', }}>
        Back
      </Button>
      <FormikProvider value={formik}>
        <Container maxWidth="lg">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel style={{
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                  error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                  >Car-Category</InputLabel>
                 <Field
                    as={Select}
                    name="categoryId"
                    label="carCategory"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('categoryId', e.target.value);
                    }}
                    InputLabelProps={{
                      style: { fontSize: '10px'},
                    }}
                    InputProps={{
                      style: {
                        borderColor: formik.touched.categoryId && formik.errors.categoryId ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                    }}
                  >
                    {categoryData &&
                      categoryData.map((category, index) => (
                        <MenuItem key={`category-${index}`} value={category.id}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                  </Field>
                  {formik.touched.categoryId && formik.errors.categoryId ? (
                    <FormHelperText style={{ color: 'red' }}>{formik.errors.categoryId}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Model"
                  variant="outlined"
                  name="model"
                  id="model"
                  value={formik.values.model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.model && Boolean(formik.errors.model)}
                  helperText={formik.touched.model && formik.errors.model}
                  InputLabelProps={{
                    style: { fontSize: '12px',lineHeight: '1', },
                  }}
                 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="PricePerDay"
                  variant="outlined"
                  name="pricePerDay"
                  id="pricePerDay"
                  type="number"
                 
                  value={formik.values.pricePerDay}
                  onChange={(e) => {
                    const value = e.target.value;
                     if (/^\d{0,6}(\.\d{0,2})?$/.test(value)) {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pricePerDay && Boolean(formik.errors.pricePerDay)}
                  helperText={formik.touched.pricePerDay && formik.errors.pricePerDay}
                  InputLabelProps={{
                    style: { fontSize: '12px',lineHeight: '1', },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Seats"
                  variant="outlined"
                  name="seats"
                  id="seats"
                  type="number"
                  value={formik.values.seats}
                    onChange={(e) => {
                  
                      const value = e.target.value;
                      if (/^\d{0,2}$/.test(value)) {
                        formik.handleChange(e);
                      }
                    }}         
                  onBlur={formik.handleBlur}
                  error={formik.touched.seats && Boolean(formik.errors.seats)}
                  helperText={formik.touched.seats && formik.errors.seats}
                  InputLabelProps={{
                    style: { fontSize: '12px',lineHeight: '1', },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Remark"
                  variant="outlined"
                  name="remark"
                  id="remark"
                  value={formik.values.remark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.model && Boolean(formik.errors.remark)}
                  helperText={formik.touched.remark && formik.errors.remark}
                  InputLabelProps={{
                    style: { fontSize: '12px',lineHeight: '1', },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth>
                  <InputLabel style={{
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                  error={formik.touched.country && Boolean(formik.errors.country)}
                  >Country</InputLabel>
                  <Field
                    as={Select}
                    name="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('country', e.target.value);
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.name} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {formik.touched.country && formik.errors.country ? (
            <FormHelperText style={{ color: 'red' }}>{formik.errors.country}</FormHelperText>
    ) : null}
                </FormControl>
              </Grid>
            </Grid>

          
             <Grid item xs={12} spacing={2}>
              <Grid container >
                {formik?.values?.carPicturePath.map((image, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', alignItems: 'center', margin: '20px', position: 'relative' }}
                  >
                    <img
                      src={image.url}
                      alt={`uploaded-${index}`}
                      style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.5)' }}
                    >
                      <Close />
                    </IconButton>
                  </div>
                ))}    
              </Grid>
            </Grid>

            <Grid item xs={12}  style={{ marginTop: '15px' }}>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                onBlur={formik.handleBlur}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {formik.touched.carPicturePath && formik.errors.carPicturePath ? (
                <div style={{ color: 'red' }}>{formik.errors.carPicturePath}</div>
              ) : null}

               <label htmlFor="image-upload">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
            </Grid>

            
            <Grid item xs={12} spacing={2}>
              <Grid container >  
                {console.log(formik?.values?.ImageList)}
                {formik?.values?.ImageList.map((image, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', alignItems: 'center', margin: '20px', position: 'relative' }}
                  >
                    <img
                      src={image.url}
                      alt={`uploaded-${index}`}
                      style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                    />
                     <IconButton
                      onClick={() => handleFeatureRemoveImage(index)}
                      style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.5)' }}
                    >
                      <Close />
                    </IconButton>
                  </div>
                ))}
              </Grid>
            </Grid> 


            <Grid item xs={12}  style={{ marginTop: '15px' }}>
              <input
                accept="image/*"
                type="file"
                id="image-uploads"
                 onChange={handleFeatureImageChange}
                multiple
                style={{ display: 'none' }}
              />
              {formik.touched.ImageList && formik.errors.ImageList ? (
                <div style={{ color: 'red' }}>{formik.errors.ImageList}</div>
              ) : null}

               <label htmlFor="image-uploads">
                <Button variant="outlined" component="span">
                  Upload Feature Images
                </Button>
              </label>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box mt={0} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        </Container>
      </FormikProvider>
    </>
  );
};

export default Car;
