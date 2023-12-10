import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useAuth } from 'AuthContext/AuthContext';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  //Tab,
  //Tabs,
  Typography,
} from '@mui/material';
// import { useNavigate } from '../../../../../../node_modules/react-router-dom/dist/index';
// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
// assets
//import {  UserOutlined } from '@ant-design/icons';
import {   WomanOutlined } from '@ant-design/icons';
import { List, ListItemButton, ListItemIcon,ListItemText } from '@mui/material';

import { deepOrange } from '@mui/material/colors';
import { useNavigate } from '../../../../../../node_modules/react-router-dom/dist/index'; 
// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// function a11yProps(index) {
//   return {
//     id: `profile-tab-${index}`,
//     'aria-controls': `profile-tabpanel-${index}`
//   };
// }

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const Navigate = useNavigate();
  const handleLogout = async () => {
    logout();
    Navigate('/login');
  };
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // const [value, setValue] = useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  const iconBackColorOpen = 'grey.300';

  const handleModalOpen = () => {
    Navigate("/ChangePassword")
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <ButtonBase
          sx={{
            p: 0.25,
            bgcolor: open ? iconBackColorOpen : 'transparent',
            borderRadius: 1,
            '&:hover': { bgcolor: 'secondary.lighter' }
          }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 0.5 }}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{user ? user.name[0] : null}</Avatar>
            <Typography variant="subtitle1" >{user ? user.name : null}</Typography>
          </Stack>
        </ButtonBase>
        <Popper
          placement="bottom-end"
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 9]
                }
              }
            ]
          }}
        >
          {({ TransitionProps }) => (
            <Transitions type="fade" in={open} {...TransitionProps}>
              {open && (
                <Paper
                  sx={{
                    boxShadow: theme.customShadows.z1,
                    width: 290,
                    minWidth: 240,
                    maxWidth: 290,
                    [theme.breakpoints.down('md')]: {
                      maxWidth: 250
                    }
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MainCard elevation={0} border={false} content={false}>
                      <CardContent sx={{ px: 2.5, pt: 2 ,pb:1}}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Stack direction="row" spacing={1.25} alignItems="center">
                              <Avatar sx={{ bgcolor: deepOrange[500] }}>{user ? user.name[0] : null}</Avatar>
                              <Stack>
                                <Typography variant="h6">{user ? user.name : null}</Typography>

                              </Stack>
                            </Stack>
                          </Grid>

                        </Grid>
                        {/* <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Stack>
                              
                                 <Typography variant="contained" onClick={"handleModalOpen"} style={{ marginLeft:'50px', marginTop:'10px'}}>Change Password</Typography>
                              </Stack>
                            </Stack>
                          </Grid>

                        </Grid> */}

                      </CardContent>

                      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { color: theme.palette.grey[500] } }}>

                        <ListItemButton onClick={handleModalOpen}>
                          <ListItemIcon sx={{ pl: 2 }}>
                            <WomanOutlined />
                          </ListItemIcon>
                          <ListItemText variant="contained" onClick={handleModalOpen} sx={{ pl: 3 }}>Change Password</ListItemText>

                        </ListItemButton>
                      </List>
                      {open && (
                        <>

                          {/* <TabPanel value={value} index={0} dir={theme.direction}> */}
                          <ProfileTab handleLogout={handleLogout} />
                          {/* </TabPanel> */}

                        </>
                      )}
                    </MainCard>
                  </ClickAwayListener>
                </Paper>
              )}
            </Transitions>
          )}
        </Popper>
      </Box>
    </>
  );
};

export default Profile;
