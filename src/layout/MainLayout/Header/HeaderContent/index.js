// material-ui
import { Box,  useMediaQuery } from '@mui/material';
import Profile from './Profile';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <div style={{width: "100%",
      display: "flex",
      justifyContent: "end"}}>
      
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      <Profile />
      
    </div>
  );
};

export default HeaderContent;
