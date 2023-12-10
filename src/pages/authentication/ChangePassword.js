// src/CarForm.js

import React, {  } from 'react';
import { Container, TextField, Grid, Button, Box, Divider } from '@mui/material';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { ChangeUserPassword } from 'Services/Api';
import Swal from 'sweetalert2';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { useAuth } from 'AuthContext/AuthContext';

const ChangePassword = () => {
  const Navigate = useNavigate();
  const {logout } = useAuth();

  const validationSchema = Yup.object({
    oldPassword: Yup .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#*()_+,.;'":?><[\]{}|\\])[A-Za-z\d@$!%*?&^#*()_+,.;'":?><[\]{}|\\]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
     )
    .required('Old Password Required'),
    newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#*()_+,.;'":?><[\]{}|\\])[A-Za-z\d@$!%*?&^#*()_+,.;'":?><[\]{}|\\]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required('New Password Required'),
    confirmPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#*()_+,.;'":?><[\]{}|\\])[A-Za-z\d@$!%*?&^#*()_+,.;'":?><[\]{}|\\]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
     )
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required('Confirm Password Required'),
  });
  // const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values , { setValues }) => {
      // Handle form submission here
      console.log(values);
      // Handle form submission here
      let rObj = {
          oldPassword:values.oldPassword,
          newPassword:values.newPassword,
      }
      try {
        console.log(ChangeUserPassword)
        const response = await fetch(ChangeUserPassword, {
          method: 'POST',
          body: JSON.stringify(rObj),
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          if(data.statusCode === 200)
          {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: data.message,
            });
            setValues({
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
            logout();
            Navigate('/login');
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.message,
            });
          }          
        }
        

      } catch (error) {
        console.error(error);
        // Handle error
      }
    },
  });

  // const ResetButton = () => {
  //   setValues({
  //     oldPassword: '',
  //     newPassword: '',
  //     confirmPassword: '',
  //   });
  // }

  return (
    <>
      <FormikProvider value={formik}>
        <Container maxWidth="lg">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
            <Grid item xs={3} ></Grid>

              <Grid item xs={6} >
                 <TextField
                  fullWidth
                  label="Old Password"
                  variant="outlined"
                  name="oldPassword"
                  id="oldPassword"
                  type="password"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                  helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                />
              </Grid>
              <Grid item xs={3} ></Grid>
              <Grid item xs={3} ></Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  variant="outlined"
                  name="newPassword"
                  id="newPassword"
                  type="password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                  helperText={formik.touched.newPassword && formik.errors.newPassword}
                />
              </Grid>
              <Grid item xs={3} ></Grid>
              <Grid item xs={3} ></Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  variant="outlined"
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </Grid>
              <Grid item xs={3} ></Grid>

            </Grid>

            <Box mt={4} display="flex" justifyContent="center" spacing={2}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              {/* <Button variant="contained" color="primary"  onClick={ResetButton}>
                Reset
              </Button> */}
            </Box>
            <Divider sx={{ my: 4 }} />

            {/* <Box mt={0} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box> */}
          </form>
        </Container>
       </FormikProvider>
    </>
  );
};

export default ChangePassword;
