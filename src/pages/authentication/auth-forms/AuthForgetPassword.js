import React, { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';
// material-ui
// import { logIn } from 'store/reducers/User';
// import axios from '../../../../node_modules/axios/index';
import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';
// import { useAuth } from 'AuthContext/AuthContext';
import { useDispatch } from 'react-redux';
import { SaveEmail } from 'store/reducers/UserEmail';
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

const AuthForgetPassword = () => {

   let Navigate = useNavigate()
   const dispatch = useDispatch()
   const [ loading , SetLoading ] = useState(false)


   

   
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
           submit: null
         }}
         validationSchema={Yup.object().shape({
           email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
         })}
         onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                SetLoading(true)
                dispatch(SaveEmail(values))
                localStorage.setItem('email',values.email)
                let Userdata = await axios.post(`${API_URL}/api/user/forget-password`+`?email=${values.email}` , )
                let response = Userdata.data
            
                if(response.statusCode == 200 ){
                  Swal.fire(
                    'Success',
                    'Check your email inbox OTP has been sent',
                    'success'
                  )
                  Navigate('/otpVerification')
                }
                if(response.statusCode == 203 ){
                  Swal.fire(
                    'Oops...',
                      `${response.message}`,
                    'error'
                  )
                  
                }
                setStatus({ success: false });
                setSubmitting(false);
                SetLoading(false)
                return
               
              } catch (err) {
                Swal.fire(
                  'Error',
                  `Enter Valid Mail`,
                  'error'
                )
                setStatus({ success: false });
                setErrors({ submit: "" });
                SetLoading(false)
               return
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
            
               {errors.submit && (
                 <Grid item xs={12}>
                   <FormHelperText error>{errors.submit}</FormHelperText>
                 </Grid>
               )}
               <Grid item xs={12}>
                 <AnimateButton>
                   <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                     Send OTP
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

export default AuthForgetPassword
