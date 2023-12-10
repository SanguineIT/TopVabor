import AuthForgetPassword from './auth-forms/AuthForgetPassword'
//import { Link } from 'react-router-dom';

// material-ui
// import { Grid, Stack, Typography } from '@mui/material';
import { Grid} from '@mui/material';

import Logo from 'components/Logo/Logo';

// project import
import AuthWrapper from './AuthWrapper';

const ForgetPassword = () => {
  return (
    <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Grid item xs={12} sx={{ display:"flex",justifyContent:"center", mt:2,mb:2 }}>
        <Logo />
      </Grid>
        {/* <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Forget Password</Typography>
        </Stack> */}
      </Grid>
      <Grid item xs={12}>
       <AuthForgetPassword/>
      </Grid>
    </Grid>
  </AuthWrapper>
  )
}

export default ForgetPassword
