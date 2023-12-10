import React, { useEffect, useState } from 'react';
import { Container, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Button, Divider, IconButton } from '@mui/material';
import { useFormik, Field, FormikProvider } from 'formik';
import * as Yup from 'yup';
// import { Close } from '@mui/icons-material';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '../../../node_modules/@mui/material/index';
import { useParams } from 'react-router-dom';
import { Close } from '../../../node_modules/@mui/icons-material/index';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

function EditCarDetail() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [multipleImagePath, setMultipleImagePath] = useState([]);
  const [imageUrl, setImageUrl] = useState();
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
    // seats:Yup.number().required('Required').test('is-positive', 'Seat must be greater than 0', (value) => value !== 0),
    seats: Yup.number()
      .required('Required')
      .positive('Seat must be a positive number')
      .integer('Seat must be a whole number')
      .min(1, 'Seat must be at least 1')
      .max(10, 'Seat must be between 1 and 10'),
    remark: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(255, 'Maximum 255 characters').required('Required!'),
    country: Yup.string().required('Required!'),
    carPicturePath: Yup.array()
      .nullable() // Allow null as a valid value
      .min(1, 'At least one image is required')
      .max(10, 'max 10 images can be upload')
      .test('fileSize', 'File size too large', (value) => {
        if (value && value.length) {
          return value.every((file) => file?.file?.size <= MAX_FILE_SIZE);
        }
        return true;
      })
      .test('fileType', 'Unsupported File Format, only PNG file is accepted', (value) => {
        if (value && value.length) {
          return value.every((file) => file?.file?.type === 'image/png');
        }
        return true;
      }),

    ImageList: Yup.array()
      .min(1, 'At least one image is required')
      .max(5, 'max 5 images can be upload')
      .test('fileSize', 'File size too large', (value) => {
        if (value && value.length) {
          console.log(multipleImagePath)
          if (multipleImagePath.length > 0) {
            return value.every((file) => file?.file?.size <= MAX_FILE_SIZE);
          }
          else {
            return true
          }

        }
        return true;
      })
      .test('fileType', 'Unsupported File Format, only PNG file is accepted', (value) => {
        if (value && value.length) {
          if (multipleImagePath.length > 0) {
            return value.every((file) => file?.file?.type === 'image/png');
          }
          else {
            return true
          }

        }
        return true;
      }),
  });

  const countries = [
    { id: '1', name: 'UAE' },
    { id: '2', name: 'Uzbekistan' },
    // Add more countries as needed
  ];

  const formik = useFormik({
    initialValues: {
      id: 0,
      categoryId: '',
      model: '',
      pricePerDay: '',
      seats: '',
      remark: '',
      country: '',
      carPicturePath: [],
      carPicturePathUrl: '',
      ImageList: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
      if (imagePath) {
        formData.append("carPicturePath", imagePath);
      }
      console.log(multipleImagePath);
      if (multipleImagePath.length > 0) {
        multipleImagePath.map((item) => {
          formData.append('ImageList', item.file);
        })
      }

      const { carPicturePath, carPicturePathUrl, ImageList, ...newData } = values;
      console.log(carPicturePath);
      console.log(carPicturePathUrl);
      console.log("newData", ImageList);
      Object.keys(newData).forEach((key) => {
        formData.append(key, values[key]);
      });

      // formik.values.carPicturePath.forEach((file, index) => {
      //   formData.append(`carPicturePath_${index}`, file.file);
      // });

      try {
        setLoading(true)
        const response = await fetch(
          'https://restroreff.microlent.com/api/car-details/create-or-update',
          {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              //'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
            },
          }
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.statusCode === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Car details updated successfully.',
            });
            formik.resetForm();
            setLoading(false)
            navigate("/car")
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'We found some error.',
          });
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

  // const handleImageChange = (event) => {
  //   const file = event.currentTarget.files[0];
  //   // console.log(event.currentTarget.files);
  //   // console.log(event.target.files[0]);
  //   setImagePath(event.target.files[0]);

  //   //  const imageList = Array.from(files).map((file) => ({
  //   //    url: URL.createObjectURL(file),
  //   //    file,
  //   //  }));
  //   console.log(file,"========image up==========", imagePath);
  //   formik.setFieldValue('carPicturePath', URL.createObjectURL(file));
  // };


  const handleImageChange = (event) => {
    const files = event.currentTarget.files;
    setImagePath(event.target.files[0]);
    const imageList = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    console.log(imageList[0]?.url)
    console.log(imageUrl)
    setImageUrl(imageList[0]?.url)
    formik.setFieldValue('carPicturePath', imageList);

  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.carPicturePath];
    updatedImages.splice(index, 1);
    formik.setFieldValue('carPicturePath', updatedImages);
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

  const [categoryData, setCategoryData] = useState()

  const getCategoryList = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://restroreff.microlent.com/api/category/get-All', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCategoryData(data.data)
        setLoading(false)

      } else {
        throw new Error('Error uploading images');
      }
    } catch (error) {
      console.error(error);
      setLoading(false)

      // Handle error
    }
  }




  const getSingleCarData = async (id) => {
    try {
      const response = await fetch('https://restroreff.microlent.com/api/car-details/getOne/' + id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();

        formik.setValues({
          id: data?.data?.id || 0,
          categoryId: data?.data?.categoryId || '',
          model: data?.data?.model || '',
          pricePerDay: data?.data?.pricePerDay || '',
          seats: data?.data?.seats || '',
          remark: data?.data?.remark || '',
          country: data?.data?.country || '',
          carPicturePath: data?.data?.carPicturePath || [],
          carPicturePathUrl: data?.data?.CarpicturePathUrl,
          ImageList: data?.data?.ImageList || [],
        });
      } else {
        throw new Error('Error uploading images');
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getCategoryList()
    getSingleCarData(id)
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleFeatureRemoveImage = (index) => {
    const updatedImages = [...formik.values.ImageList];
    updatedImages.splice(index, 1);
    formik.setFieldValue('ImageList', updatedImages);
  };

  const BackButton = () => {
    navigate('/car');
  }

  return (
    <>
      <Button variant="contained" onClick={BackButton} style={{ marginLeft: '25px', float: 'left', }}>
        Back
      </Button>
      <FormikProvider value={formik}>
        <Container maxWidth="lg">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Car Category</InputLabel>
                  <Field
                    as={Select}
                    name="categoryId"
                    label="carCategory"
                    variant="outlined"
                    fullWidth
                    required
                    value={formik.values.categoryId}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('categoryId', e.target.value);
                    }}
                  >
                    {categoryData &&
                      categoryData.map((category, index) => (
                        <MenuItem key={`category-${index}`} value={category.id}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                  </Field>
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
                    style: { fontSize: '12px', lineHeight: '1', },
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
                    if (/^\d{0,3}$/.test(value)) {
                      formik.handleChange(e);
                    }
                  }}

                  onBlur={formik.handleBlur}
                  error={formik.touched.seats && Boolean(formik.errors.seats)}
                  helperText={formik.touched.seats && formik.errors.seats}
                  InputLabelProps={{
                    style: { fontSize: '12px', lineHeight: '1', },
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
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Field
                    as={Select}
                    name="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    required
                    value={formik.values.country}
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
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <div
                  style={{ display: 'flex', alignItems: 'center', margin: '20px', position: 'relative' }}
                >
                  <img
                    src={imagePath === undefined ? "https://restroreff.microlent.com/api/cardetail/" + formik?.values?.carPicturePath : imageUrl}
                    alt={`uploaded`}
                    style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(0)}
                    style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.5)' }}
                  >
                    <Close />
                  </IconButton>
                </div>

              </Grid>
            </Grid>

            <Grid item xs={12}>
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

              {console.log(formik.errors.carPicturePath, 'images errors')}
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span">
                  Upload Images
                </Button>
              </label>
            </Grid>

            <Grid item xs={12} spacing={2}>
              <Grid container >
                {formik?.values?.ImageList.map((image, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', alignItems: 'center', margin: '20px', position: 'relative' }}
                  >
                    <img
                      src={image.url !== undefined ? image.url : "https://restroreff.microlent.com/api/cardetail/" + image}
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


            <Grid item xs={12} style={{ marginTop: '15px' }}>
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
}

export default EditCarDetail