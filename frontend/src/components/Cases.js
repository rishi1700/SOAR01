import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Cases = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/integrations/thehive/cases');
        setCases(res.data);
      } catch (err) {
        console.error('Error fetching cases', err);
      }
    };

    fetchCases();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cases
      </Typography>
      <Paper elevation={3}>
        <Box p={2}>
          <List>
            {cases.map((caseItem) => (
              <ListItem key={caseItem.id}>
                <ListItemText
                  primary={caseItem.title}
                  secondary={caseItem.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cases;
