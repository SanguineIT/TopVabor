import React,{ useState,useEffect} from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

 import {
  Grid,
  Typography
} from '@mui/material';

 import OrdersTable from './BookingList'; 
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
 
import { useAuth } from 'AuthContext/AuthContext';
import axios from '../../../node_modules/axios/index';
import Swal from 'sweetalert2';
import { API_URL } from 'Services/Service';
 
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => { 


  const { user } = useAuth(); 
  const isLoggedIn = !!user;
  const [usercount,setUsercount] =useState(null)
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/admin/login';  
    } else {
      TotalData()
    }
  }, [isLoggedIn, ]);



  const TotalData = async()=>{
    try{
      setLoading(true)
      const response = await axios.get(`${API_URL}api/dashboard/All-Count`,  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response?.data?.statusCode == 200) {
        setUsercount(response?.data?.data);
         setLoading(false);
      } else  {
         setLoading(false);
       }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while fetching data.',  
      });
      console.error(error);
      setLoading(false);
     }
  }
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
       <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total  User" count={usercount?.Totaluser  ?? 0} percentage={59.3} extra="35,000" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Car" count={usercount?.Totalcar ?? 0} percentage={70.5} extra="8,900" />
      </Grid>
       <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Booking" count={usercount?.TotalcarBooking ?? 0} percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid> 
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Tour Ticket" count={usercount?.TotaltourTicket ?? 0} percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid> 
      

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Booking</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
     
     
    </Grid>
  );
};

export default DashboardDefault;
