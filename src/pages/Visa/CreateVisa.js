import React, { useState, useEffect } from 'react'
import { Container, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Button, Divider } from '@mui/material';
import { useFormik, Field, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, FormHelperText } from '../../../node_modules/@mui/material/index';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';


function CreateVisa() {
    const [loading, setLoading] = useState(false);
    const [VisaData, setVisaData] = useState([])
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        visaOption: Yup.number().when([], { is: (visaOption) => visaOption !== '', then: Yup.number().required('Required'), }),

        description: Yup.string().test('is-not-whitespace', 'Cannot be whitespace', (value) => !(/^\s+$/.test(value))).min(2, 'Mininum 2 characters').max(255, 'Maximum 255 characters').required('Required!'),

    });

    const formik = useFormik({
        initialValues: {
            id: 0,
            visaOption: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            const formData = new FormData();

            formData.append('id', values.id);
            formData.append('visaOption', values.visaOption);

            formData.append('description', values.description);


            try {
                setLoading(true)
                const response = await fetch(
                    'https://restroreff.microlent.com/api/visa-option/create-or-update',
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.statusCode == 200) {
                    setLoading(false)
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Visa details added successfully.',
                    });
                    formik.resetForm();
                    navigate('/visa');

                } else {
                    Swal.fire({
                        text: 'Error while fetching data',
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error while creating visa details',
                });
                setLoading(false)
            }
        },
    });

    const getVisaDetails = async () => {
        try {
            setLoading(true)
            const response = await fetch('https://restroreff.microlent.com//api/visa-option/get-All', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.statusCode == 200) {
                setVisaData(data.data)

                setLoading(false)

            } else {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            setLoading(false)

        }
    }

    useEffect(() => {
        getVisaDetails()
    }, [])

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <div>
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
                                        error={formik.touched.visaOption && Boolean(formik.errors.visaOption)}
                                    >Visa-Option</InputLabel>
                                    <Field
                                        as={Select}
                                        name="visaOption"
                                        label="visaOption"
                                        variant="outlined"
                                        fullWidth
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            formik.setFieldValue('visaOption', e.target.value);
                                        }}
                                        InputLabelProps={{
                                            style: { fontSize: '10px' },
                                        }}
                                        InputProps={{
                                            style: {
                                                borderColor: formik.touched.visaOption && formik.errors.visaOption ? 'red' : 'rgba(0, 0, 0, 0.23)',
                                            },
                                        }}
                                    >
                                        {VisaData &&
                                            VisaData.map((visaOption, index) => (
                                                <MenuItem key={`visaOption-${index}`} value={visaOption.id}>
                                                    {visaOption.visaOption}
                                                </MenuItem>
                                            ))}
                                    </Field>
                                    {formik.touched.visaOption && formik.errors.visaOption ? (
                                        <FormHelperText style={{ color: 'red' }}>{formik.errors.visaOption}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>



                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    name="description"
                                    id="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    InputLabelProps={{
                                        style: { fontSize: '12px', lineHeight: '1', },
                                    }}
                                />
                            </Grid>

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
        </div>
    )
}

export default CreateVisa