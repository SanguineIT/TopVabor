import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthWrapper from './AuthWrapper';
import AuthOtpVerify from './auth-forms/AuthOtpVerify';
import Logo from 'components/Logo/Logo';

const OtpVerification = () => {
  return (
    <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Grid item xs={12} sx={{ display:"flex",justifyContent:"center", mt:2,mb:2 }}>
        <Logo />
      </Grid>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">OTP Verification</Typography>
          
        </Stack>
      </Grid>
      <Grid item xs={12}>
         <AuthOtpVerify/>
      </Grid>
    </Grid>
  </AuthWrapper>
  )
}

export default OtpVerification
