import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const ForgetPassword = Loadable(lazy(() => import('pages/authentication/ForgetPassword')));
const OtpVerification = Loadable(lazy(() => import('pages/authentication/OtpVerification')));
const ResetPassword = Loadable(lazy(() => import('pages/authentication/ResetPassword')));
const NotFound = Loadable(lazy(() => import('pages/NotFound')));





// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'forgetPassword',
      element: <ForgetPassword />
    },
    {
      path: 'otpVerification',
      element: <OtpVerification />
    },
    {
      path: 'ResetPassword',
      element: <ResetPassword />
    },
    {
      path: '*',
      element: <NotFound />
    },

  ]
};

export default LoginRoutes;
