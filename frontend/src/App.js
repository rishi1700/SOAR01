import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import TheHivePage from './components/TheHivePage';
import MISPPage from './components/MISPPage'; 
import VirusTotalPage from './components/VirusTotalPage';
import CortexPage from './components/CortexPage';
import RulesPage from './components/RulesPage';  // Import RulesPage

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Centralized Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleThemeChange}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {isAuthenticated && (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/thehive">
                  TheHive
                </Button>
                <Button color="inherit" component={Link} to="/notifications">
                  Notifications
                </Button>
                <Button color="inherit" component={Link} to="/misp">
                  MISP
                </Button>
                <Button color="inherit" component={Link} to="/virustotal">
                  VirusTotal
                </Button>
                <Button color="inherit" component={Link} to="/cortex">
                  Cortex
                </Button>
                <Button color="inherit" component={Link} to="/rules"> {/* Add Rules Link */}
                  Rules
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />}
          />
          <Route
            path="/thehive"
            element={isAuthenticated ? <TheHivePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/misp"
            element={isAuthenticated ? <MISPPage /> : <Navigate to="/login" />}
          />
          <Route path="/virustotal" element={isAuthenticated ? <VirusTotalPage /> : <Navigate to="/login" />} />
          <Route path="/cortex" element={isAuthenticated ? <CortexPage /> : <Navigate to="/login" />} />
          <Route path="/rules" element={isAuthenticated ? <RulesPage /> : <Navigate to="/login" />} /> {/* Add Route for RulesPage */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
