import React,{useState}from 'react';
// import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';
// material-ui
// import { API_URL } from 'Services/Service';
// import axios from '../../../../node_modules/axios/index';
//import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';
import {
  Button,
 // Divider,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import Swal from 'sweetalert2'; // Import SweetAlert
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project import
//import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
//import { useAuth } from 'AuthContext/AuthContext';
import WithOutAuth from 'components/WithOutAuth ';
import { Backdrop,Box, CircularProgress } from '../../../../node_modules/@mui/material/index';
import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';
import { ResetPassword } from 'Services/Api';

// assets



const AuthResetPassword = () => {
  let Navigate = useNavigate()
  const [ loading , SetLoading ] = useState(false)

// const [checked, setChecked] = React.useState(false);
// let Navigate = useNavigate()
// const {user}= useAuth();
// useEffect(()=> {
//    if(user){
//      return window.location.href = "/admin"
//    }
// },[user])

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
        newPassword : '',
        confirmPassword : '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        newPassword: Yup.string().max(255)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#*()_+,.;'":?><[\]{}|\\])[A-Za-z\d@$!%*?&^#*()_+,.;'":?><[\]{}|\\]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required('NewPassword is required'),
        confirmPassword: Yup.string().max(255).oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#*()_+,.;'":?><[\]{}|\\])[A-Za-z\d@$!%*?&^#*()_+,.;'":?><[\]{}|\\]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required('ConfirmPassword is required')
      })}
      onSubmit={async (values, {  setStatus, setSubmitting }) => {
        SetLoading(true)
        try {
            let data = {
              "email": localStorage.getItem('email'),
              "new_password": values.newPassword
            }
            console.log(data);
            const responseData = await fetch(ResetPassword, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            'Content-Type': 'application/json'
          }
            });
            console.log(responseData)
            localStorage.removeItem('email')
            if(responseData.ok)
            {
              let response = await responseData.json();
              console.log(response)
              if(response.statusCode === 200 ){
                Swal.fire(
                    'success',
                    'Password change successfully',
                    'success'
                  )                
                  Navigate('/login')
                  SetLoading(false)
                  return
              }else{
                Swal.fire(
                  'error',
                  'something went wrong',
                  'error'
                )
              }
            }
            setStatus({ success: false });
            setSubmitting(false);
            SetLoading(false)
        }catch (err) {
          Navigate('/ResetPassword')
          SetLoading(false) 
          setStatus({ success: false });
          //setErrors({ submit: err.message });
          setSubmitting(false);
          SetLoading(false)
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">New Password</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="password"
                  value={values.newPassword}
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter New Password"
                  fullWidth
                  error={Boolean(touched.newPassword && errors.newPassword)}
                />
                {touched.newPassword && errors.newPassword && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.newPassword}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Confirm Password</InputLabel>
              <OutlinedInput
                id="email-login"
                type="Password"
                value={values.confirmPassword}
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter Confirm Password"
                fullWidth
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
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
                 Reset Password 
                </Button>
              </AnimateButton>
            </Grid>
           
            
          </Grid>
        </form>
      )}
    </Formik>
  </div>
);
}

export default WithOutAuth(AuthResetPassword)
