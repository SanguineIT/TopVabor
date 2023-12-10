import React,{useState} from 'react'
import Logo2 from '../../../assets/image/Logo2.png'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useApi from '../../../useApi/useApi'
import { userResetpassword } from '../../../useApi/api'
import { useNavigate } from 'react-router-dom'
import { Backdrop, Box, CircularProgress } from '../../../../node_modules/@mui/material/index'
import Swal from "sweetalert2";
import Successfully from "../../../assets/image/Successfully.png"





const schema = yup.object().shape({
    password: yup
    .string()
    .required("Password is required")
    .min(8).max(32).matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "Password must contain at least one uppercase letter, one number, and one special character"}).trim(),
      
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required").trim(),

  });



function ResetPassword() {



    const {data , loading  , error , setUrl  ,setConfig} = useApi();
    let [ userData , setUserData ]= useState(null)
    const navigate = useNavigate()


    const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
    
    const hanldeReset = async (userCred)=>{
        try{
            const getConfig = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    
                        "email":  localStorage.getItem('email'),
                        "new_password":userCred.password
                      
                }),
              };
            setUrl(userResetpassword) 
            setConfig(getConfig)
         
        }catch(err){
          console.log(err.message)
        }
    }
    const NavigaeHandler = ()=>{
      Swal.fire({
        // icon: 'success',
        imageUrl:Successfully,
        showConfirmButton:false,
        timer:3000,
       // imageHeight:"25em",
        imageWidth:"25em",
        // backgroundColor:"0,0,0,.5"
         width:"25em",
        
        
        // text: ' Password Reset Successfully.',
    
      })
        navigate('/SignIn')
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });
    const onSubmitHandler = async (userData) => {
        console.log('datat from handler ==> ' , userData)
        await hanldeReset(userData)
     
        reset();
      };

// if(loading){
//         return <div>Loading ...</div>
// }
if(data){
            
    NavigaeHandler()
}






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


<section className="SignIn_section container-fluid">
        <div className="container">
            <div className="SignIn_contetn_area">
                <div className="row w-100">
                    <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-10 col-12 m-auto">
                        <div className="SignIn_logoImages text-center">
                            <img src={Logo2} alt=""/>
                        </div>
                        <div className="SignIn_form_area text-center">
                            <div className="SignIn_form_heading">
                                <h1 className="fw-bolder">Reset Password</h1>
                                <p className="fw-bold font_21">Please enter your new password here </p>
                            </div>


                            <form   onSubmit={handleSubmit(onSubmitHandler)} className="mt-5">
                                <div className="form-group mb-3 position-relative">
                                    <input  {...register("password")}    type={showPassword ? 'text' : 'password'} name="password" id="" className="form-control" required placeholder="New Password"/>
                                    <p className='text-start text-danger'>{errors.password?.message}</p>

                                    <div className="password_eyes_icon" onClick={handleTogglePassword}>
                           <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                           </div>
                                </div>
                                <div className="form-group mb-3 position-relative">
                                    <input  {...register("confirmPassword")}    type={showPassword ? 'text' : 'password'} name="confirmPassword" id="" className="form-control" required placeholder="Confirm Password"/>
                                    <p className='text-start text-danger' >{errors.confirmPassword?.message}</p>

                                    <div className="password_eyes_icon" onClick={handleTogglePassword}>
                             <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </div>
                                </div>
                                
                                <button className="btn btn_success mt-5" type="submit">Reset Password  <i className="fa-solid fa-arrow-right-long ms-2"></i></button>
                            </form>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </div>
  )
}

export default ResetPassword