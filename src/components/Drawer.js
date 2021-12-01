import React, { useEffect, useState } from "react";
import { Drawer as MUIDrawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ExploreIcon from '@mui/icons-material/Explore';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import auth from '../services/auth'
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from '@mui/material/Typography';




const useStyles = makeStyles({
  drawer: {
    width: "190px"
  },
  tooBar: {
    height: "60px"
  },
  icon: {
    minWidth: '35px',
  }
});



const drawerWidth = 180;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [isOpenMenu2, setIsOpenMenu2] = React.useState(false);
  


  useEffect(() => {
    console.log("USE EFFF WORK !!!!!!!")
    setIsOpenMenu2(true)
  }, [])


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };



  const handleChange = (event) => {
  /*   setAuth(event.target.checked); */
  };

  const handleMenu = (event) => {
    console.log("WORK !!!")
    setIsOpenMenu(true)
  
  };

  const handleClose = () => {
 
    setIsOpenMenu(false)
  };
  const handleMenuLogout = () => {
    setIsOpenMenu2(false)
    localStorage.setItem("token", "")
    history.push("/login");
  /*   setAnchorEl(null);
    handleMobileMenuClose(); */
  };

  const goProfile = () => {
    setIsOpenMenu(false)


    if(props.location.pathname !== '/profile'){
      history.push("/profile");
    }


  };

  const { history } = props;
  const classes = useStyles();
  const itemsList = [
    {
      text: "Explore",
      icon: <ExploreIcon />,
      onClick: () => history.push("/explore")
    },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {itemsList.map((item, index) => {
          const { text, icon, onClick } = item;
          return (
            <ListItem button key={text} onClick={onClick}>
              {icon && <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>}
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

    return (<>
      {auth.isAuthenticated() && <Box sx={{ display: 'flex', width: { sm: `${drawerWidth}px`, xs: 0 }, }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >

          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Infinite Travel
          </Typography>
            {auth.isAuthenticated() && <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu open={isOpenMenu2 && isOpenMenu}
                id="menu-appbar"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              /*   open={Boolean(anchorEl)} */
                onClose={handleClose}
              >
                <MenuItem onClick={goProfile}>Profile</MenuItem>
                <MenuItem onClick={handleMenuLogout}>Log out</MenuItem>
              </Menu>
            </div>}
          </Toolbar>
        </AppBar>
      
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, pt : 3 , pl : 3 , pr : 3 , pb : 0 , width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
        </Box>
      </Box>}
      </>
    );
  
 

}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

/*   export default ResponsiveDrawer; */
export default withRouter(ResponsiveDrawer);