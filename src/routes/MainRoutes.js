import { lazy } from 'react';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import ChangePassword from 'pages/authentication/ChangePassword';
import Details from 'pages/Car/Details';  
import ViewTour from 'pages/Tour/ViewTour';
 // import EditCarDetailPage from 'pages/carDetail/editCarDetailPage';
// import EditCarDetail from 'pages/Car/EditCarDetail';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const Pagiantion = Loadable(lazy(() => import('pages/UserList/UserList')));
 
 const Visa = Loadable(lazy(() => import('pages/Visa/Visa')));
 const CreateVisa = Loadable(lazy(() => import('pages/Visa/CreateVisa')));
const Category = Loadable(lazy(() => import('pages/Category/Category')));
// const Brand = Loadable(lazy(() => import('pages/Brand/Brand')));

const Car = Loadable(lazy(() => import('pages/Car/Car')));
// const Color = Loadable(lazy(() => import('pages/Color/Color')));
const Payment = Loadable(lazy(() => import('pages/Booking/Booking')));
const CarDetail = Loadable(lazy(() => import('pages/carDetail/carDetailpage')));
const EditCarDetail = Loadable(lazy(() => import('pages/Car/EditCarDetail')));
const TourList = Loadable(lazy(() => import('pages/Tour/TourList')));
const CreateTour = Loadable(lazy(() => import('pages/Tour/CreateTour')));
const EditTour = Loadable(lazy(() => import('pages/Tour/EditTour')));

const CityTourPagination = Loadable(lazy(() => import('pages/CityTour/CityTourPagination')));

const CityTour = Loadable(lazy(() => import('pages/CityTour/CityTour')));
const PreviewCityTour = Loadable(lazy(() => import('pages/CityTour/PreviewCityTour')));
const EditCityTour = Loadable(lazy(() => import('pages/CityTour/EditCityTour')));


// render - utilities

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'users',
      element: <Pagiantion />
    },
    {
      path: 'Category',
      element: <Category />
    },
    // {
    //   path: 'Brand',
    //   element: <Brand />
    // },
    {
      path: 'Car',
      element: <Car />
    },
    {
      path: 'carDetails/:id',
      element: <Details />
    },
    // {
    //   path: 'Color',
    //   element: <Color />
    // },
      {
        path: 'Visa',
        element: <Visa />
      },
      {
        path: 'CreateVisa',
        element: <CreateVisa />
      },
    {
      path: 'booking',
      element: <Payment />
    },
    {
      path: 'tour',
      element: <TourList />
    },
    {
      path: 'tour/TourList',
      element: <CreateTour />
    },
    {
      path: 'tour/Edit/:id',
      element: <EditTour />
    },
    {
      path: 'tour/:id',
      element: <ViewTour />
    },
    {
      path: 'car/Cars',
      element: <CarDetail />
    },
    {
      path: 'Cars/update/{id}',
      element: <CarDetail />
    },
    // {
    //   path: 'cars/edit/:id',
    //   element: <EditCarDetailPage />
    // },
    {
      path: 'cars/edit/:id',
      element: <EditCarDetail />
    },
    {
      path: 'ChangePassword',
      element: <ChangePassword />
    },
    {
      path: 'CityTour',
      element: <CityTourPagination />
    },
    {
      path: 'CityTour/CityTour',
      element: <CityTour />
    },
    {
      path: 'CityTour/:id',
      element: <PreviewCityTour />
    },
    {
      path: 'CityTour/Edit/:id',
      element: <EditCityTour />
    },
   
    

  ]
};

export default MainRoutes;
