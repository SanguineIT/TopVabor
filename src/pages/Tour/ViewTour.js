import { Card, CardContent, Typography, CardActionArea, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '../../../node_modules/@mui/material/index';

import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { API_URL } from 'Services/Service';
import axios from '../../../node_modules/axios/index';

function ViewTour() {

    const BackButton = () => {
        navigate('/tour');
      }

      const { id } = useParams();
      const navigate = useNavigate();
    
      const [TourData, setTourData] = useState([]);
      const [loading, setLoading] = useState(false);
    
      const getTourById = async (id) => {
        try {
          setLoading(true)
          const response = await axios.get(`${API_URL}api/tour-tickts/getOne/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,          
              },
          }); 
           if (response.data.statusCode === 200) {
            setTourData(response.data.data);
            setLoading(false)
          } else {
            console.log('get error');
          }
        } catch (err) {
          console.log(err);
          setLoading(false)
        }
      };
      useEffect(() => {
        getTourById(id);
      }, [id]);
    
      if (loading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
          </Box>
        );
      }
  return (
   
    <div>
    <>
      <Button variant="contained" onClick={BackButton} style={{ float: 'left', }}>
        Back
      </Button>
      <br />
      <br />
    </>
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={5}  >
          <Card sx={{ maxWidth: 500, margin: 2 }}>
            <CardActionArea>
            <img
                      src={TourData.picturePathUrl}
                      alt={TourData.picturePath}
                      style={{ maxWidth: '400px', maxHeight: '400px' }}
                    />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {TourData?.tourName}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        
        </Grid>


        <Grid item xs={6} >
          <div style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ color: 'blue' }}>
              City-Tour Details
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, fontFamily: "Public Sans" }}>
              <li style={{ display: "flex", }}>
                <strong style={{ width: "25%" }} > Tour Name : </strong><li> {TourData?.tourName}</li>
              </li>      
              <li style={{ display: "flex", }}>
                <strong style={{ width: "25%" }}>Title  : </strong><li> {TourData?.title}</li>
              </li>
              <li style={{ display: "flex", }}>
                <strong style={{ width: "25%" }} >Price  : </strong><li> {TourData?.price}</li>
              </li>
            </ul>
          </div>
        </Grid>
      </Grid>
    </Card>
  </div>
  )
}

export default ViewTour