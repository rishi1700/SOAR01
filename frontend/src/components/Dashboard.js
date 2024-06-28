import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, CircularProgress, Alert, Card, CardContent, List, ListItem, ListItemText, Chip, Paper, Badge } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Label } from 'recharts';
import io from 'socket.io-client';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [realTimeAlerts, setRealTimeAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dashboard/alert-stats');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching alert stats:', error);
        setError('Error fetching alert stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const socket = io('http://localhost:5000');
    socket.on('dataUpdate', (newAlerts) => {
      setRealTimeAlerts(newAlerts);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <Typography>No data available</Typography>
      </Container>
    );
  }

  const getColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alert Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.by_severity.buckets}
                    dataKey="doc_count"
                    nameKey="key"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ key }) => key}
                  >
                    {data.by_severity.buckets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f5f5f5', border: 'none' }}
                    itemStyle={{ color: '#333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alerts Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.by_time.buckets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key_as_string">
                    <Label value="Time" offset={0} position="insideBottom" />
                  </XAxis>
                  <YAxis label={{ value: 'Alerts', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f5f5f5', border: 'none' }}
                    itemStyle={{ color: '#333' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="doc_count" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Source IPs
              </Typography>
              <List>
                {data.top_src_ips.buckets.map((ip, index) => (
                  <ListItem key={index}>
                    <PublicIcon color="primary" />
                    <ListItemText primary={`${ip.key}: ${ip.doc_count} alerts`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Destination IPs
              </Typography>
              <List>
                {data.top_dst_ips.buckets.map((ip, index) => (
                  <ListItem key={index}>
                    <LocationOnIcon color="secondary" />
                    <ListItemText primary={`${ip.key}: ${ip.doc_count} alerts`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-Time Alerts
              </Typography>
              {realTimeAlerts.length === 0 ? (
                <Typography>No real-time alerts available</Typography>
              ) : (
                <List>
                  {realTimeAlerts.map((alert, index) => (
                    <ListItem button component={Link} to={`/alert/${alert._id}`} key={index}>
                      <ListItemText
                        primary={`Timestamp: ${alert._source['@timestamp']}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              {`Message: ${alert._source.observable_alert_message || alert._source.event.original} `}
                            </Typography>
                            <Chip
                              icon={<PublicIcon />}
                              label={`Source IP: ${alert._source.observable_src_ip}`}
                              style={{ backgroundColor: getColor(alert._source.alert_priority), color: '#fff' }}
                            />
                            <Chip
                              icon={<LocationOnIcon />}
                              label={`Destination IP: ${alert._source.observable_dst_ip}`}
                              style={{ backgroundColor: getColor(alert._source.alert_priority), color: '#fff' }}
                            />
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;