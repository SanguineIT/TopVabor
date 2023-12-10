import React ,{useEffect} from 'react'
import { TextField, Button, Stack,TextareaAutosize } from '@mui/material';
//import { Link } from "react-router-dom"
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DeleteOutlineOutlined } from '../../../node_modules/@mui/icons-material/index';
import { useParams } from 'react-router-dom';
// import { API_URL } from 'Services/Service';
// import axios from '../../../node_modules/axios/index';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from 'AuthContext/AuthContext';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import * as Yup from 'yup';
import { useFormik } from 'formik';


const validationSchema = Yup.object().shape({
  packageName: Yup.string().required('Title is required').min(2, 'Title must be at least 2 characters').max(20,"maximum 20 characters").trim(),
  amount: Yup.number().required('Amount is required').min(0, 'Please enter a valid number greater than or equal to 0'),
  duration: Yup.string().required('Duration is required'),
  description: Yup.string().required('Description is required').min(2,'Description must be at least 2 characters').max(225,"maximum 225 characters").trim(),
  features:Yup.array(Yup.string().required("features is required").min(2,'features must be at least 2 characters').max(40,"maximum 40 characters").trim())

  

});




const UpdateSubscription = () => {
    const [loading,setLoading] = React.useState(false)
    const { id } = useParams();
    const navigate= useNavigate()

    const { user } = useAuth();

  const isLoggedIn = !!user;

  



    
  useEffect(() => {
    // Check if the user is not logged in
    if (!isLoggedIn) {
      // Redirect to the login page
      window.location.href = '/admin/login'; // Replace '/login' with the actual login page path
    }
    userupdatedata();
  }, [isLoggedIn])
  
  const formik = useFormik({
    initialValues: {
      packageName: '',
      amount: '',
      duration: '',
      description: '',
      features: [''],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = {
          id: values.id,
          amount: Number(values.amount),
          packageName: values.packageName,
          features: values.features,
          duration: values.duration,
          description: values.description,
        };
   
        // const createSubscription = await axios.post(`${API_URL}/subscription/create-update`, data, {
        //   headers: { 'authorization': `bearer ${localStorage.getItem("token")}` },
        // });
        const response = createSubscription.data;
        if (response.statusCode === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Subscription updated successfully',
          });
          navigate("/SubscriptionList");
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message,
          });
        }
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.message,
        });
        setLoading(false);
      }
    },
    // transform: (values) => {
    //   return {
    //     ...values,
    //     packageName: values.packageName.trim(),
    //     amount: values.amount.trim(),
    //     description: values.description.trim(),
    //     features: values.features.map((feature) => feature.trim()),
    //   };
    // },
  });

  const handleAddFeatures = () => {
    formik.setFieldValue('features', [...formik.values.features, '']);
  };

  const handleRemoveFeatures = (index) => {
    const updatedFeatures = [...formik.values.features];
    updatedFeatures.splice(index, 1);
    formik.setFieldValue('features', updatedFeatures);
  };


  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
  
    // Allow only numeric characters and backspace
    const numericRegex = /^[0-9\b]+$/;
    if (!numericRegex.test(keyValue)) {
      event.preventDefault();
    }
  };



    //   updatedFields.splice(index, 1);
    //   setFeatures(updatedFields);
    // };
    
  

    if(loading){
      return<Box  sx= {{display: 'flex', justifyContent: 'center' ,  alignItems: 'center',  height: '80vh' }} 
      >
   <CircularProgress />
  </Box> }

  const userupdatedata= async()=>{
    try{
        let userdata= await axios.get(`${API_URL}/subscription/getOne/${id}`,
         { headers: { 'authorization': `bearer ${localStorage.getItem("token")}` } } )
      
      const subscriptionData =userdata.data.data;
      formik.setValues(subscriptionData)
  


            // Navigate('/logi 
    }
    catch(error){
        console.log(error)

    }

  }


    




  return (
    
        <React.Fragment>
      <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', margin: "auto" }}>

        <form onSubmit={formik.handleSubmit} style={{ height: '100%', width: "100%", backgroundColor: "#e0e00e0", border: "2px solid #3333", borderRadius: "8px", padding: "20px", boxSizing: "border-box" }}>

          <Stack spacing={2} direction="row" sx={{ marginBottom: 2}}>
            <div style={{ height: '100%', width: "100%"}}>
            <TextField
              type="text"
              variant='outlined'
              color='secondary'
              label="Title"
              // onChange={e => setPackageName(e.target.value)}

              {...formik.getFieldProps('packageName')}
              fullWidth
            />
            {formik.touched.packageName && formik.errors.packageName && <div style={{color:"red"}}>{formik.errors.packageName}</div>}
            </div>
            <div style={{ height: '100%', width: "100%"}}>
            
            <TextField
              type="text"
              variant='outlined'
              color='secondary'
              label="Amount"
              onKeyPress={handleKeyPress}
              // onChange={e => setAmount(e.target.value)}

              {...formik.getFieldProps('amount')}
              fullWidth
            
              error={formik.touched.amount && Boolean(formik.errors.amount)}
            />
            {formik.touched.amount && formik.errors.amount && <div style={{color:"red"}}>{formik.errors.amount}</div>}
            </div>
            <Box>
              <FormControl sx={{ width: "150px" }} fullWidth>
                <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...formik.getFieldProps('duration')}
                  // onChange={e => setDuration(e.target.value)}

                >
                  <MenuItem value={"1-Month"}>1 Month</MenuItem>
                  <MenuItem value={"3-Months"}>3 Months</MenuItem>
                  <MenuItem value={"6-Months"}>6 Months</MenuItem>
                  <MenuItem value={"1-year"}>1 Year</MenuItem>
                </Select>
                
              </FormControl>
              {formik.touched.duration && formik.errors.duration && <div style={{color:"red"}}>{formik.errors.duration}</div>}

              

            </Box>
          </Stack>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Description"
            style={{ width: '100%', minHeight: 30, resize: 'none', }}
            minRows={3}
            maxRows={6}
            // onChange={e => setDescription(e.target.value)}

            {...formik.getFieldProps('description')}
            color='secondary'
            variant='outlined'
          />
          {formik.touched.description && formik.errors.description && <div style={{marginBottom:15,color:"red"}}>{formik.errors.description}</div>}

          {formik.values.features.map((field, index) => (
            <Stack key={index} spacing={2} direction="row" sx={{ marginTop: 2 }}>
              <div style={{ height: '100%', width: "100%",marginBottom:5}}>
              <TextField
                type="text"
                variant='outlined'
                color='secondary'
                label="Features"
                // onChange={e => setFeatures(e.target.value)}

                {...formik.getFieldProps(`features[${index}]`)}
                fullWidth
              />
               {formik.touched.features?.[index] && formik.errors.features?.[index] && <div style={{marginBottom:5,color:"red"}}>{formik.errors.features[index]} </div>}
             </div>
                  

              <DeleteOutlineOutlined onClick={() => handleRemoveFeatures(index)} />
            </Stack>
            
          ))}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" color="primary" type="button" onClick={handleAddFeatures}><AddCircleIcon />Features</Button>
            <Button variant="outlined" color="primary" type="submit">Submit</Button>
          </div>
        </form>
      </div>
      
    </React.Fragment>
      
     


  
  )
}

export default UpdateSubscription