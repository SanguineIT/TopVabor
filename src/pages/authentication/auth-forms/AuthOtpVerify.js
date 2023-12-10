import React, {  useState } from 'react';
//  import { Link as RouterLink } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';
// material-ui
// import { logIn } from 'store/reducers/User';
// import axios from '../../../../node_modules/axios/index';
// import { useAuth } from 'AuthContext/AuthContext';
import {
  Button,
 // Divider,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  
  
} from '@mui/material';
// import Swal from 'sweetalert2'; // Import SweetAlert
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// import { useDispatch  } from 'react-redux';
// project import
//import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { Backdrop, Box, CircularProgress } from '../../../../node_modules/@mui/material/index';
import axios from '../../../../node_modules/axios/index';
import { API_URL } from 'Services/Service';

// assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';


const AuthOtpVerify = () => {
    const [ loading , SetLoading ] = useState(false)
    
   
const handleOtpSubmit = async  ()=>{
  try{
  SetLoading(true)
  let Userdata = await axios.post(`${API_URL}/api/user/forget-password`+`?email=${localStorage.getItem('email')}` , )
  let response = Userdata.data
   console.log("response ===> " ,response)
  if(response.statusCode == 200 ){
    Swal.fire(
      'Success',
      'OTP Resend Successfully',
      'success'
    )
    SetLoading(false)
    return

   
  }
  if(response.statusCode == 203 ){
    Swal.fire(
      'Oops...',
        `${response.message}`,
      'error'
    )
    SetLoading(false)
   return 
  }
  SetLoading(false)

 
} catch (err) {
  Swal.fire(
    'Error',
    `Enter Valid Mail`,
    'error'
  )
  SetLoading(false)
 return
}


}


const handleKeyPress = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Allow only numeric characters and backspace
  const numericRegex = /^[0-9\b]+$/;
  if (!numericRegex.test(keyValue)) {
    event.preventDefault();
  }
};

const Navigate= useNavigate()
if(localStorage.getItem('email') == null ){
  console.log('dk exivure ')
  return window.location.href = 'admin/login'
}
// if(loading)  {
//    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <CircularProgress />
//     </Box>}
 
    
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
            submit: null
          }}
          validationSchema={Yup.object().shape({
            otp : Yup.string().max(255).required('otp is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
             try {
                 SetLoading(true)
                 let Userdata = await axios.post(`${API_URL}/api/user/verify-otp`,
                 {
                    "email": localStorage.getItem("email"),
                    "otp": String(values.otp)
                  } )
                 let response = Userdata.data
                 if(response.statusCode == 200 ){
                   Swal.fire(
                     'success',
                     'OTP verified successfully ',
                     'success'
                   )
                   
                   Navigate('/ResetPassword')
                 }
                 if(response.statusCode == 400 ){
                   Swal.fire(
                     'error',
                       `${response.message}`,
                     'error'
                   )
                   Navigate('/otpVerification')
                 }
                 setStatus({ success: false });
                 setSubmitting(false);
                 SetLoading(false)
                
               } catch (err) {
                console.log(err)
                 Swal.fire(
                   'Success',
                   `somthing went wrong`,
                   'error'
                 )
                 setStatus({ success: false });
                 setErrors({ submit: err.message });
                 SetLoading(false)
                 Navigate('/otpVerification')
               }
          }}
        >
          
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-login">OTP</InputLabel>
                    <OutlinedInput
                      id="email-login"
                      type="text"
                      value={values.otp}
                      name="otp"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter OTP "
                      onKeyPress={handleKeyPress}
                      
                   
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
             
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Verify OTP
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                    <Button  onClick={()=>  handleOtpSubmit()}> Resend OTP</Button>
                   
              </Grid>
               
                
              </Grid>
            </form>
          )}
        </Formik>
      </div>
    );
}

export default AuthOtpVerify
