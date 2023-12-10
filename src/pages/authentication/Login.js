//import { Link } from 'react-router-dom';

// material-ui
// import { Grid, Stack, Typography } from '@mui/material';

import { Grid } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';
import Logo from 'components/Logo/Logo';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
     
    <Grid container spacing={3}>
   
      <Grid item xs={12}>
      <Grid item xs={12} sx={{ display:"flex",justifyContent:"center", mt:2 ,mb:2}}>
        <Logo />
      </Grid>
        {/* <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Login</Typography>
          
        </Stack> */}
      </Grid>
      <Grid item xs={12} >
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
