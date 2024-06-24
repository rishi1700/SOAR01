import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Grid, Paper, Box } from '@mui/material';

const RulesManager = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rules');
        setRules(response.data);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  const handleAddRule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/rules', { rule: newRule });
      setRules([...rules, response.data]);
      setNewRule('');
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/rules/${ruleId}`);
      setRules(rules.filter(rule => rule.id !== ruleId));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Elasticsearch Rules
      </Typography>
      <Box mb={3}>
        <TextField
          label="New Rule"
          variant="outlined"
          fullWidth
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddRule}>
          Add Rule
        </Button>
      </Box>
      <Grid container spacing={3}>
        {rules.map((rule, index) => (
          <Grid item xs={12} key={index}>
            <Paper>
              <Box p={2}>
                <Typography>{rule.description}</Typography>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteRule(rule.id)}>
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RulesManager;
