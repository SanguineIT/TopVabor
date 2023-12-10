import PropTypes from 'prop-types';


// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import {   LogoutOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const theme = useTheme();

  // const [selectedIndex, setSelectedIndex] = useState(0);
  // const handleListItemClick = (event, index) => {
  //   setSelectedIndex(index);
  // };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { color: theme.palette.grey[500] } }}>
      <ListItemButton onClick={handleLogout} >
        <ListItemIcon sx={{pl:2}}>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText sx={{pl:3}} primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
