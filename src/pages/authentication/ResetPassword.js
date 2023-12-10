import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthWrapper from './AuthWrapper';
import AuthResetPassword from './auth-forms/AuthResetPassword';
import Logo from 'components/Logo/Logo';

const ResetPassword = () => {
  return (
    <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Grid item xs={12} sx={{ display:"flex",justifyContent:"center", mt:2,mb:2 }}>
        <Logo />
      </Grid>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Reset Password </Typography>
          
        </Stack>
      </Grid>
      <Grid item xs={12}>
         <AuthResetPassword/>
      </Grid>
    </Grid>
  </AuthWrapper>
  )
}

export default ResetPassword
