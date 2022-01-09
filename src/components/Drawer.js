import React, { useEffect, useState } from "react";
import { Drawer as MUIDrawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ExploreIcon from "@mui/icons-material/Explore";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import auth from "../services/auth";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import FlightIcon from "@mui/icons-material/Flight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import StarBorder from "@mui/icons-material/StarBorder";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PublicIcon from '@mui/icons-material/Public';

const useStyles = makeStyles({
  drawer: {
    width: "190px",
  },
  tooBar: {
    height: "60px",
  },
  icon: {
    minWidth: "35px",
  },
});

const drawerWidth = 180;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [isOpenMenu2, setIsOpenMenu2] = React.useState(false);
  const [openCollapse, setOpenCollapse] = React.useState({
    ticket: false,
    test : false
  });

  useEffect(() => {
    setIsOpenMenu2(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChange = (event) => {
    /*   setAuth(event.target.checked); */
  };

  const handleMenu = (event) => {
    console.log("WORK !!!");
    setIsOpenMenu(true);
  };

  const handleClose = () => {
    setIsOpenMenu(false);
  };
  const handleMenuLogout = () => {
    setIsOpenMenu2(false);
    localStorage.setItem("token", "");
    history.push("/login");
  };

  const goProfile = () => {
    setIsOpenMenu(false);
    if (props.location.pathname !== "/profile") {
      history.push("/profile");
    }
  };

  const goChangePassword = () => {
    setIsOpenMenu(false);
    if (props.location.pathname !== "/change-password") {
      history.push("/change-password");
    }
  };

  function handleOpenSettings(text) {
    setOpenCollapse(!openCollapse);
  }

  const { history } = props;
  const classes = useStyles();
  const itemsList = [
    {
      text: "Explore",
      icon: <ExploreIcon />,
      onClick: () => history.push("/explore"),
      hasCollapse: false,
    },
    {
      text: "Flight",
      icon: <PublicIcon />,
      onClick: () => history.push("/flight"),
      hasCollapse: false,
    },
    {
      text: "Ticket",
      icon: <AirplaneTicketIcon />,
   
      hasCollapse: true,
      collapsedText: "ticket",
      child: [
        {
          text: "List",
          icon: <ListAltIcon />,
          onClick: () => history.push("/ticket/list"),
        },
        {
          text: "Seat",
          icon: <AirlineSeatReclineNormalIcon />,
          onClick: () => history.push("/ticket/search"),
        },
       
      ],
    },
    {
      text: "Plane",
      icon: <FlightIcon />,
      onClick: () => history.push("/plane"),
      hasCollapse: false,
    },
 
  ];

  const handleClick = (text) => {
    setOpenCollapse({ ...openCollapse, [text] : !openCollapse[text] });

    console.log(text);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {itemsList.map((item, index) => {
          const { text, icon, onClick, collapsedText, child } = item;
          return (
            <div>
              {!item.hasCollapse ? (
                <ListItem button key={text} onClick={onClick}>
                  {icon && <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                </ListItem>
              ) : (
                <ListItem button key={text} onClick={() => handleClick(collapsedText)}>
                  {icon && <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                  {openCollapse[collapsedText] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              )}
              {item.hasCollapse ? (
                <Collapse in={openCollapse[collapsedText]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {child.map((itemChild, index) => {
                      const { text, icon ,onClick } = itemChild;
                      return (
                        <ListItemButton  onClick={onClick} sx={{ pl: 3 }}>
                          <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              ) : (
                <div> </div>
              )}
            </div>
          );
        })}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      {auth.isAuthenticated() && (
        <Box sx={{ display: "flex", width: { sm: `${drawerWidth}px`, xs: 0 } }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Infinite Travel
              </Typography>
              {auth.isAuthenticated() && (
                <div>
                  <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    open={isOpenMenu2 && isOpenMenu}
                    id="menu-appbar"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    /*   open={Boolean(anchorEl)} */
                    onClose={handleClose}
                  >
                    <MenuItem onClick={goProfile}>Profile</MenuItem>
                    <MenuItem onClick={goChangePassword}>Change Password</MenuItem>
                    <MenuItem onClick={handleMenuLogout}>Log out</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>

          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
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
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box component="main" sx={{ flexGrow: 1, pt: 3, pl: 3, pr: 3, pb: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
            <Toolbar />
          </Box>
        </Box>
      )}
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
