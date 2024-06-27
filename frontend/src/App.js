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
import CortexPage from './components/CortexPage';
import RulesPage from './components/RulesPage';
import AlertTrends from './components/AlertTrends';
import ThreatIntelligence from './components/ThreatIntelligence';
import PlaybookExecutor from './components/PlaybookExecutor';
import Alerting from './components/Alerting';
import ExecutePlaybook from './components/ExecutePlaybook';
import CreateCase from './components/CreateCase'; // Import CreateCase
import LaunchAnalysis from './components/LaunchAnalysis'; // Import LaunchAnalysis
import VirusTotalAnalysis from './components/VirusTotalAnalysis';
import IsolateHost from './components/IsolateHost';
import CorrelatedAlerts from './components/CorrelatedAlerts';
import AutoResponse from './components/AutoResponse';
import AlertDetails from './components/AlertDetails'; // Import AlertDetails

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
      const { role } = JSON.parse(atob(token.split('.')[1])); 
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
                    <Button color="inherit" component={Link} to="/create-case">
                      Create Case
                    </Button>
                    <Button color="inherit" component={Link} to="/launch-analysis">
                      Launch Analysis
                    </Button>
                    <Button color="inherit" component={Link} to="/virustotal-analysis">
                      VirusTotal Analysis
                    </Button>
                    <Button color="inherit" component={Link} to="/isolate-host">
                      Isolate Host
                    </Button>
                    <Button color="inherit" component={Link} to="/correlated-alerts">
                      Correlated Alerts
                    </Button>
                    <Button color="inherit" component={Link} to="//alert/:id">
                      Alert Details
                    </Button>
                    <Button color="inherit" component={Link} to="/auto-response">
                      Auto Response
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
          <Route path="/rules" element={isAuthenticated ? <RulesPage /> : <Navigate to="/login" />} />
          <Route path="/trends" element={isAuthenticated ? <AlertTrends /> : <Navigate to="/login" />} />
          <Route path="/threat-intelligence" element={isAuthenticated && userRole === 'admin' ? <ThreatIntelligence /> : <Navigate to="/login" />} />
          <Route path="/register" element={isAuthenticated && userRole === 'admin' ? <Register /> : <Navigate to="/login" />} />
          <Route path="/execute-playbook" element={isAuthenticated && userRole === 'admin' ? <ExecutePlaybook /> : <Navigate to="/login" />} />
          <Route path="/set-alert" element={isAuthenticated && userRole === 'admin' ? <Alerting /> : <Navigate to="/login" />} />
          <Route path="/create-case" element={isAuthenticated && userRole === 'admin' ? <CreateCase /> : <Navigate to="/login" />} />
          <Route path="/launch-analysis" element={isAuthenticated && userRole === 'admin' ? <LaunchAnalysis /> : <Navigate to="/login" />} />
          <Route path="/virustotal-analysis" element={isAuthenticated && userRole === 'admin' ? <VirusTotalAnalysis /> : <Navigate to="/login" />} />
          <Route path="/isolate-host" element={isAuthenticated && userRole === 'admin' ? <IsolateHost /> : <Navigate to="/login" />} />
          <Route path="/correlated-alerts" element={isAuthenticated && userRole === 'admin' ? <CorrelatedAlerts /> : <Navigate to="/login" />} />
          <Route path="/auto-response" element={isAuthenticated && userRole === 'admin' ? <AutoResponse /> : <Navigate to="/login" />} />
          <Route path="/alert/:id" element={isAuthenticated ? <AlertDetails /> : <Navigate to="/login" />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;