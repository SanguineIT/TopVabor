import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';
// material-ui
import { logIn } from 'store/reducers/User';
import axios from '../../../../node_modules/axios/index';
import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';
import { useAuth } from 'AuthContext/AuthContext';
import {
  Button,
 // Divider,
  FormHelperText,
  Grid,
  Link,
  // IconButton,
  // InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import Swal from 'sweetalert2'; // Import SweetAlert
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch  } from 'react-redux';
// project import
//import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { Backdrop, Box, CircularProgress } from '../../../../node_modules/@mui/material/index';

import { LoginUser } from 'Services/Api';

// assets
//import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  // const [checked, setChecked] = React.useState(false);
  let Navigate = useNavigate()
 // const [showPassword, setShowPassword] = React.useState(false);
  const {  login } = useAuth();
  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };
  let dispatch = useDispatch()
  const [ loading , SetLoading ] = useState(false)

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };

  
  return (
    <div>  

     <Box  sx= {{display: 'flex', justifyContent: 'center' ,  alignItems: 'center', height:"100%", width:"100%" }} >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
       
      >
    <CircularProgress />
    </Backdrop>
    </Box> 
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, {  setStatus, setSubmitting }) => {
          SetLoading(true)
          try {
            let logInData = await axios.post(LoginUser, values )
            logInData = logInData.data
            let response = logInData.data
            console.log('reposne ===> ' , logInData)
            if (response?.role == "user"){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid Credentials!',
                // footer: '<a href="">Why do I have this issue?</a>'
              })
              SetLoading(false)
                return
            }else{ 
            if(logInData.statusCode == 200){
              console.log('logInData ==>' , logInData)
              await dispatch(logIn(response))
              login(response)

              // Swal.fire(
              //   'Success',
              //   'Admin Login Successfully  ',
              //   'success'
              // )
              localStorage.setItem('adminData' ,JSON.stringify(response))
              localStorage.setItem('token' ,response.token )
              localStorage.setItem('id' ,response.id )
              SetLoading(false)

              Navigate('/')
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid Credentials!',
                // footer: '<a href="">Why do I have this issue?</a>'
              })
              SetLoading(false)

            }}
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Enter Valid Email',
              // footer: '<a href="">Why do I have this issue?</a>'
            })
            SetLoading(false)

            // setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    // endAdornment={
                    //   <InputAdornment position="end">
                    //     <IconButton
                    //       aria-label="toggle password visibility"
                    //       onClick={handleClickShowPassword}
                    //       onMouseDown={handleMouseDownPassword}
                    //       edge="end"
                    //       size="large"
                    //     >
                    //       {/* {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />} */}
                    //     </IconButton>
                    //   </InputAdornment>
                    // }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                {/* <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Link variant="h6" component={RouterLink} to="/forgetPassword" color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack> */}
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                  <Link variant="h6" component={RouterLink} to="/forgetPassword" color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
             
              
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AuthLogin;
