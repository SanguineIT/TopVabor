import { getSingleCarData } from 'Services/Api';
import ApiService from 'Services/index';
import { Card, CardContent, Typography, CardActionArea, CardMedia, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '../../../node_modules/@mui/material/index';

import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

//==============================preview page of car============================
const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carData, setCarData] = useState();
  const [loading, setLoading] = useState(false);

  const getSingleRecordById = async (id) => {
    try {
      setLoading(true)
      const response = await ApiService.getOne(getSingleCarData + '/' + id);
      if (response.data.statusCode === 200) {
        setCarData(response.data.data);
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
    getSingleRecordById(id);
  }, [id]);

  const BackButton = () => {
    navigate('/car');
  }


  const [showMore, setShowMore] = useState(false);
  const remark = carData?.remark || '';

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleImageChange = (imagePath) => {
    setCarData({ ...carData, CarpicturePathUrl: imagePath });
  };


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
                <CardMedia
                  component="img"
                  height="60%"
                  width="80%"
                  image={carData?.CarpicturePathUrl}
                  alt="Car"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {carData?.model}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card sx={{ margin: 2, maxWidth: 500, padding: 1 }}>
              <CardActionArea sx={{ display: 'flex', }}>
                {carData?.ImagesPitcher.map((item, index) => (<>
                  <Grid xs={5} spacing={1} >

                    <CardMedia
                      component="img"
                      height="55"
                      width="55"
                      image={item}
                      alt={index}
                      onClick={() => handleImageChange(item)}
                    /></Grid>
                </>))}
              </CardActionArea>
            </Card>
          </Grid>


          <Grid item xs={6} >
            <div style={{ padding: '20px' }}>
              <Typography variant="h4" style={{ color: 'blue' }}>
                Car Details
              </Typography>
              <ul style={{ listStyleType: 'none', padding: 0, fontFamily: "Public Sans" }}>
                <li style={{ display: "flex", }}>
                  <strong style={{ width: "22%" }} >Price Per Day  : </strong><li> {carData?.pricePerDay}</li>
                </li>

                <li style={{ display: "flex", }}>
                  <strong style={{ width: "22%" }} >Category  : </strong><li> {carData?.category?.categoryName}</li>
                </li>

                <li style={{ display: "flex", }}>
                  <strong style={{ width: "22%" }}>Seats  : </strong><li> {carData?.seats}</li>
                </li>

                <li style={{ display: 'flex' }}>
                  <strong style={{ width: '22%' }}>Remark : </strong>
                  <div>
                    {showMore ? (
                      <textarea
                        value={remark}
                        readOnly
                        style={{ maxWidth: '350px', maxHeight: '400px' }}
                        rows={Math.ceil(remark.length / 20)}
                      />
                    ) : (
                      remark.length <= 20 ? (
                        <li>{remark}</li>
                      ) : (
                        <>
                          <li>{remark.substring(0, 20)}...</li>
                          <button onClick={toggleShowMore}>Show More</button>
                        </>
                      )
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Details;
