import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
// import MinimalLayout from 'layout/MinimalLayout';
const NotFound = Loadable(lazy(() => import('pages/NotFound')));


const NotFoundRoute = [
  {  path: '*',
    element: <NotFound />
    
    }
]


export default NotFoundRoute