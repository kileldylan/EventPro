import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  AccountCircle, 
  CalendarMonth,  
  Event, 
  LocationCity, 
  Logout, 
  Menu as MenuIcon,
  People,
  Receipt,
  Settings
} from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuEl, setMobileMenuEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Constants for role types
  const ROLES = {
    ADMIN: 1,
    USER: 2
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  // Safe user data access
  const userInitial = user?.email?.charAt(0)?.toUpperCase() || 'U';
  const userRole = user?.role || null;

  // Navigation links based on role
  const adminLinks = [
    { path: "/events", label: "Events", icon: <CalendarMonth /> },
    { path: "/venues", label: "Venues", icon: <LocationCity /> },
    { path: "/participants", label: "Participants", icon: <People /> },
    { path: "/logs", label: "Activity Log", icon: <Receipt /> }
  ];

  const userLinks = [
    { path: "/events", label: "Events", icon: <CalendarMonth /> },
    { path: "/venues", label: "Venues", icon: <LocationCity /> },
    { path: "/tickets", label: "My Tickets", icon: <Receipt /> }
  ];

  // Determine which links to show based on role
  const navLinks = userRole === ROLES.ADMIN ? adminLinks : userLinks;

  // Determine dashboard path based on role
  const dashboardPath = userRole === ROLES.ADMIN ? "/admin_dashboard" : "/user_dashboard";

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'background.paper',
      color: 'text.primary',
      boxShadow: 'none',
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        padding: { xs: '0.5rem 1rem', md: '0.5rem 2rem' }
      }}>
        {/* Left side - Logo and main links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to={user ? dashboardPath : "/"}
            sx={{ 
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Event fontSize="large" />
            EventPro
          </Typography>

          {user && !isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((link) => (
                <Button 
                  key={link.path}
                  component={Link} 
                  to={link.path}
                  startIcon={link.icon}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    display: { xs: 'none', md: 'flex' }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Right side - User controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!user ? (
            <>
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/signup" 
                variant="contained"
                color="primary"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              {/* Mobile menu button */}
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                sx={{ display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              {/* Desktop user menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ 
                    bgcolor: 'primary.main',
                    width: 36,
                    height: 36,
                    fontSize: '1rem'
                  }}>
                    {userInitial}
                  </Avatar>
                </IconButton>
              </Box>

              {/* Mobile menu dropdown */}
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(mobileMenuEl)}
                onClose={handleMenuClose}
                sx={{ 
                  mt: 1,
                  '& .MuiPaper-root': {
                    minWidth: '200px'
                  }
                }}
              >
                {navLinks.map((link) => (
                  <MenuItem 
                    key={link.path}
                    component={Link} 
                    to={link.path}
                    onClick={handleMenuClose}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {React.cloneElement(link.icon, { sx: { mr: 1.5, fontSize: '1.25rem' } })}
                      {link.label}
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem 
                  component={Link} 
                  to="/profile" 
                  onClick={handleMenuClose}
                >
                  <AccountCircle sx={{ mr: 1.5, fontSize: '1.25rem' }} /> 
                  Profile
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/settings" 
                  onClick={handleMenuClose}
                >
                  <Settings sx={{ mr: 1.5, fontSize: '1.25rem' }} /> 
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1.5, fontSize: '1.25rem' }} /> 
                  Logout
                </MenuItem>
              </Menu>

              {/* Desktop user menu dropdown */}
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ 
                  mt: 1,
                  '& .MuiPaper-root': {
                    minWidth: '200px'
                  }
                }}
              >
                <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {user.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem 
                  component={Link} 
                  to="/profile" 
                  onClick={handleMenuClose}
                >
                  <AccountCircle sx={{ mr: 1.5, fontSize: '1.25rem' }} /> 
                  My Profile
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/settings" 
                  onClick={handleMenuClose}
                >
                  <Settings sx={{ mr: 1.5, fontSize: '1.25rem' }} /> 
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1.5, fontSize: '1.25rem' }} /> 
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;