// assets
import { DashboardOutlined,UserOutlined,  ContactsOutlined,UserAddOutlined ,CarOutlined ,
  FileProtectOutlined,BarsOutlined ,BgColorsOutlined ,InsertRowLeftOutlined,MoneyCollectOutlined,SlackSquareOutlined ,DingdingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  ContactsOutlined ,
  UserAddOutlined,
  CarOutlined ,
  FileProtectOutlined ,
  BarsOutlined,
  BgColorsOutlined,
  MoneyCollectOutlined,
  SlackSquareOutlined,
  DingdingOutlined,
  InsertRowLeftOutlined
  
  
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'booking',
      title: 'Bookings',
      type: 'item',
      url: '/booking',
      icon: icons.MoneyCollectOutlined,
      breadcrumbs: false
      
    },
    // {
    //   id: 'category',
    //   title: 'Car Category',
    //   type: 'item',
    //   url: '/category',
    //   icon: icons.BarsOutlined,
    //   breadcrumbs: false
      
    // },
    {
      id: 'car',
      title: 'Cars List',
      type: 'item',
      url: '/car',
      icon: icons.CarOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'cityTour',
    //   title: 'CityTour',
    //   type: 'item',
    //   url: '/cityTour',
    //   icon: icons.InsertRowLeftOutlined,
    //   breadcrumbs: false
     
    // },
    {
      id: 'tourList',
      title: 'Tour Tickets',
      type: 'item',
      url: '/tour',
      icon: icons.DingdingOutlined,
      breadcrumbs: false
    },
   
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
   
    //  {
    //    id: 'visa',
    //    title: 'Visa',
    //    type: 'item',
    //    url: '/visa',
    //    icon: icons.FileProtectOutlined,
    //    breadcrumbs: false
      
    //  },
    
    // {
    //   id: 'brand',
    //   title: 'Brand',
    //   type: 'item',
    //   url: '/brand',
    //   icon: icons.SlackSquareOutlined,
    //   breadcrumbs: false
    // },
   
    // {
    //   id: 'color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/color',
    //   icon: icons.BgColorsOutlined,
    //   breadcrumbs: false
      
    // },
   
  ]
  
  
}




export default dashboard;



