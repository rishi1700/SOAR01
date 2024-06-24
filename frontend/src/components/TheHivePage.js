import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const TheHivePage = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/thehive/cases');
        setCases(response.data);
      } catch (error) {
        console.error('Error fetching cases from TheHive:', error);
      }
    };

    fetchCases();
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ marginTop: 50 }}>
        <Box p={3}>
          <Typography component="h1" variant="h5">
            TheHive Cases
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cases.map((caseItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{caseItem.title}</TableCell>
                    <TableCell>{caseItem.description}</TableCell>
                    <TableCell>{caseItem.severity}</TableCell>
                    <TableCell>{caseItem.status}</TableCell>
                    <TableCell>{caseItem.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default TheHivePage;
