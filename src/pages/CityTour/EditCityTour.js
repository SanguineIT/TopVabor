import React, { useState, useEffect } from 'react';
import { Container, TextField, Grid, Button, Divider, IconButton } from '@mui/material';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, } from '../../../node_modules/@mui/material/index';
import { useNavigate, useParams } from '../../../node_modules/react-router-dom/dist/index';
import { Close } from '../../../node_modules/@mui/icons-material/index';


function EditCityTour() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState();
    const MAX_FILE_SIZE = 5000000; // 5MB

    const validationSchema = Yup.object({

        CityTourName: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(50, 'Maximum 50 characters').required('Required'),
        country: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(50, 'Maximum 50 characters').required('Required!'),
        cityName: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(50, 'Maximum 50 characters').required('Required!'),

        picturePath: Yup.array()
            .nullable() 
            .min(1, 'At least one image is required')
            //   .max(10, 'max 10 images can be upload')
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

    });



    const formik = useFormik({
        initialValues: {
            id: 0,
            CityTourName: '',
            country: '',
            cityName: '',
            picturePath: [],

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
          
            const formData = new FormData();

            formData.append('id', values.id);
            formData.append('citytourName', values.CityTourName);
            formData.append('cityName', values.cityName);
            formData.append('country', values.country);
            formData.append('picturePath', imagePath);


            try {
                setLoading(true)
                const response = await fetch(
                    'https://restroreff.microlent.com/api/city-tour/create-or-update',
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.statusCode === 200) {
                    setLoading(false)
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'CityTour details added successfully.',
                    });
                    formik.resetForm();
                    navigate('/cityTour');

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: data?.message,
                    });
                    setLoading(false)
                }
            } catch (error) {
                // console.error(error,"---errormssg---");
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: data?.message || 'Failed to create the record.',
                });
                setLoading(false)
            }
        },
    });

    const [imagePath, setImagePath] = useState();

    const handleImageChange = (event) => {
        const files = event.currentTarget.files;
        setImagePath(event.target.files[0]);
        const imageList = Array.from(files).map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));
       
        setImageUrl(imageList[0]?.url)
        formik.setFieldValue('picturePath', imageList);

    };

    
    const handleRemoveImage = () => {
        formik.setFieldValue('picturePath', []);
        setImageUrl(null);

    };




    const BackButton = () => {
        navigate('/cityTour');
    }


    const getSingleCityTour = async (id) => {
        try {
            setLoading(true)
            const response = await fetch('https://restroreff.microlent.com/api/city-tour/getOne/' + id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();

                formik.setValues({
                    id: data?.data?.id || 0,
                    CityTourName: data?.data?.citytourName || '',
                    country: data?.data?.country || '',
                    cityName: data?.data?.cityName || '',
                    picturePath: data?.data?.picturePath || '',


                });
                setLoading(false)
            } else {
                throw new Error('Error uploading images');
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getSingleCityTour(id)
    }, [id])

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
                <Button variant="contained" onClick={BackButton} style={{ marginLeft: '25px', float: 'left', }}>
                    Back
                </Button>
                <FormikProvider value={formik}>
                    <Container maxWidth="lg">
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="CityTourName"
                                        variant="outlined"
                                        name="CityTourName"
                                        id="CityTourName"
                                        value={formik.values.CityTourName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.CityTourName && Boolean(formik.errors.CityTourName)}
                                        helperText={formik.touched.CityTourName && formik.errors.CityTourName}
                                        InputLabelProps={{
                                            style: { fontSize: '12px', lineHeight: '1', },
                                        }}

                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="City-Name"
                                        variant="outlined"
                                        name="cityName"
                                        id="cityName"
                                        value={formik.values.cityName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.cityName && Boolean(formik.errors.cityName)}
                                        helperText={formik.touched.cityName && formik.errors.cityName}
                                        InputLabelProps={{
                                            style: { fontSize: '12px', lineHeight: '1', },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="country"
                                        variant="outlined"
                                        name="country"
                                        id="country"
                                        value={formik.values.country}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.country && Boolean(formik.errors.country)}
                                        helperText={formik.touched.country && formik.errors.country}
                                        InputLabelProps={{
                                            style: { fontSize: '12px', lineHeight: '1', },
                                        }}
                                    />
                                </Grid>


                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <div
                                        style={{ display: 'flex', alignItems: 'center', margin: '20px', position: 'relative' }}
                                    >
                                        <img
                                            src={imagePath === undefined ? "https://restroreff.microlent.com/api/cityTour/" + formik?.values?.picturePath : imageUrl}
                                            alt={formik?.values?.picturePath?.length > 0 ? "uploaded" : ""}
                                            style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                                        />
                                        {formik?.values?.picturePath?.length > 0 ? (<IconButton
                                            onClick={() => handleRemoveImage(0)}
                                            style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.5)' }}
                                        >
                                            <Close />
                                        </IconButton>) : ""}
                                    </div>

                                </Grid>
                            </Grid>


                            <Grid item xs={12} style={{ marginTop: '15px' }}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="image-upload"
                                    onBlur={formik.handleBlur}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                {formik.touched.picturePath && formik.errors.picturePath ? (
                                    <div style={{ color: 'red' }}>{formik.errors.picturePath}</div>
                                ) : null}

                                <label htmlFor="image-upload">
                                    <Button variant="outlined" component="span">
                                        Upload Image
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
        </div>
    )
}

export default EditCityTour