import React,{useState} from 'react'
import Logo2 from '../../../assets/image/Logo2.png'
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useApi from '../../../useApi/useApi'
import { userForgotpassword } from '../../../useApi/api'
import { useNavigate } from 'react-router-dom'
import { Backdrop, Box, CircularProgress } from '../../../../node_modules/@mui/material/index'



const schema = yup.object().shape({
    email: yup.string().email().required(),

  });





function ForgotPassword() {


    const {data , loading  , error , setUrl  ,setConfig} = useApi();
    let [ userData , setUserData ]= useState(null)
    const navigate = useNavigate()
    
    const hanldeForgot = async (userCred)=>{
        try{
            let url = `${userForgotpassword}?email=${userCred.email}`
            const getConfig = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                // body: JSON.stringify(userCred),
              };
            setUrl(url) 
            setConfig(getConfig)
         
        }catch(err){
          console.log(err.message)
        }
    }
    const NavigaeHandler = ()=>{

        navigate('/Verification')
    }


    
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });

      const onSubmitHandler = async (userData) => {
        await hanldeForgot(userData)
        localStorage.setItem('email',userData.email)
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
                                <h1 className="fw-bolder">Forgot Password</h1>
                                <p className="fw-bold font_21">Please enter your email here</p>
                            </div>


                            <form onSubmit={handleSubmit(onSubmitHandler)}  className="mt-5">
                                <div className="form-group mb-3">
                                    <input  {...register("email")}  type="email" name="email" id="" className="form-control" required
                                        placeholder="Email id*" aria-describedby="helpId"/>
                                         <p className='text-start text-danger'>{errors.email?.message}</p>
                                </div>
                                <button className="btn btn_success mt-5"type="submit" >Verify<i className="fa-solid fa-arrow-right-long ms-2"></i></button>
                            </form>


                            <div className="signUp_link_area mt-4 mb-5">
                                {/* <p>Back to <Link to="/SignIn">Sign In</Link></p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default ForgotPassword