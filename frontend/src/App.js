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
import RulesPage from './components/RulesPage';
import AlertTrends from './components/AlertTrends';
import ThreatIntelligence from './components/ThreatIntelligence';
import PlaybookExecutor from './components/PlaybookExecutor';
import Alerting from './components/Alerting';
import ExecutePlaybook from './components/ExecutePlaybook';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
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
      const { role } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      setIsAuthenticated(true);
      setUserRole(role);
      console.log('User authenticated:', true, 'Role:', role);
    } else {
      console.log('User not authenticated');
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
                <Button color="inherit" component={Link} to="/rules">
                  Rules
                  </Button>
                {userRole === 'admin' && (
                  <>
                    <Button color="inherit" component={Link} to="/register">
                      Register User
                    </Button>
                    <Button color="inherit" component={Link} to="/threat-intelligence">
                      Threat Intelligence
                    </Button>
                    <Button color="inherit" component={Link} to="/execute-playbook">
                      Execute Playbook
                    </Button>
                    <Button color="inherit" component={Link} to="/set-alert">
                      Set Alert
                    </Button>
                  </>
                )}
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
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/thehive" element={isAuthenticated ? <TheHivePage /> : <Navigate to="/login" />} />
          <Route path="/misp" element={isAuthenticated ? <MISPPage /> : <Navigate to="/login" />} />
          <Route path="/virustotal" element={isAuthenticated ? <VirusTotalPage /> : <Navigate to="/login" />} />
          <Route path="/cortex" element={isAuthenticated ? <CortexPage /> : <Navigate to="/login" />} />
          <Route path="/rules" element={isAuthenticated ? <RulesPage /> : <Navigate to="/login" />} />
          <Route path="/trends" element={isAuthenticated ? <AlertTrends /> : <Navigate to="/login" />} />
          <Route path="/threat-intelligence" element={isAuthenticated && userRole === 'admin' ? <ThreatIntelligence /> : <Navigate to="/login" />} />
          <Route path="/register" element={isAuthenticated && userRole === 'admin' ? <Register /> : <Navigate to="/login" />} />
          <Route path="/execute-playbook" element={isAuthenticated && userRole === 'admin' ? <ExecutePlaybook /> : <Navigate to="/login" />} />
          <Route path="/set-alert" element={isAuthenticated && userRole === 'admin' ? <Alerting /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
