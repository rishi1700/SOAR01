import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Paper, Typography, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, CircularProgress, Alert, MenuItem, Snackbar
} from '@mui/material';

const RulesPage = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRule, setEditingRule] = useState(null);
    const [updatedRule, setUpdatedRule] = useState({});
    const [newRule, setNewRule] = useState({
        name: '',
        params: {
            query: '',
            description: '',
            author: [],
            falsePositives: [],
            from: 'now-360s',
            ruleId: '',
            immutable: false,
            outputIndex: '',
            maxSignals: 100,
            riskScore: 0,
            severity: 'low'
        },
        schedule: {
            interval: '1m'
        },
        actions: [{
            id: '',
            group: 'default',
            params: {
                level: '',
                message: ''
            }
        }],
        throttle: null,
        notify_when: 'onActionGroupChange',
        rule_type_id: 'siem.queryRule',
        consumer: 'alerts'
    });
    const [isCreating, setIsCreating] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rules');
                setRules(response.data.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    const handleEditClick = (rule) => {
        setEditingRule(rule);
        setUpdatedRule({
            name: rule.name,
            params: {
                query: rule.params.query,
                description: rule.params.description || '',
                author: rule.params.author || [],
                falsePositives: rule.params.falsePositives || [],
                from: rule.params.from || '',
                ruleId: rule.params.ruleId || '',
                immutable: rule.params.immutable || false,
                outputIndex: rule.params.outputIndex || '',
                maxSignals: rule.params.maxSignals || 100,
                riskScore: rule.params.riskScore || 0,
                severity: rule.params.severity || 'low'
            },
            schedule: {
                interval: rule.schedule.interval || '1m'
            },
            actions: rule.actions || [{
                id: '',
                group: 'default',
                params: {
                    level: '',
                    message: ''
                }
            }]
        });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'interval') {
            setUpdatedRule((prev) => ({
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [name]: value
                }
            }));
        } else if (name === 'name') {
            setUpdatedRule((prev) => ({
                ...prev,
                [name]: value
            }));
        } else if (name.startsWith('actions')) {
            const [_, index, key] = name.split('.');
            setUpdatedRule((prev) => {
                const actions = [...prev.actions];
                actions[index] = {
                    ...actions[index],
                    [key]: value
                };
                return { ...prev, actions };
            });
        } else {
            setUpdatedRule((prev) => ({
                ...prev,
                params: {
                    ...prev.params,
                    [name]: value
                }
            }));
        }
    };

    const formatActions = (actions) => {
        return actions.map(action => ({
            ...action,
            params: {
                ...action.params,
                message: action.params.message || '',
                level: action.params.level || ''
            }
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedRule = {
            ...updatedRule,
            actions: formatActions(updatedRule.actions)
        };

        try {
            const response = await axios.put(`http://localhost:5000/api/rules/${editingRule.id}`, formattedRule);
            setRules((prev) =>
                prev.map((rule) => (rule.id === editingRule.id ? response.data : rule))
            );
            setEditingRule(null);
            setSnackbarMessage('Rule updated successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'interval') {
            setNewRule((prev) => ({
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [name]: value
                }
            }));
        } else if (name === 'name') {
            setNewRule((prev) => ({
                ...prev,
                [name]: value
            }));
        } else if (name.startsWith('actions')) {
            const [_, index, key] = name.split('.');
            setNewRule((prev) => {
                const actions = [...prev.actions];
                actions[index] = {
                    ...actions[index],
                    [key]: value
                };
                return { ...prev, actions };
            });
        } else {
            setNewRule((prev) => ({
                ...prev,
                params: {
                    ...prev.params,
                    [name]: value
                }
            }));
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedRule = {
            ...newRule,
            actions: formatActions(newRule.actions)
        };

        try {
            const response = await axios.post('http://localhost:5000/api/rules', formattedRule);
            setRules((prev) => [...prev, response.data]);
            setNewRule({
                name: '',
                params: {
                    query: '',
                    description: '',
                    author: [],
                    falsePositives: [],
                    from: 'now-360s',
                    ruleId: '',
                    immutable: false,
                    outputIndex: '',
                    maxSignals: 100,
                    riskScore: 0,
                    severity: 'low'
                },
                schedule: {
                    interval: '1m'
                },
                actions: [{
                    id: '',
                    group: 'default',
                    params: {
                        level: '',
                        message: ''
                    }
                }],
                throttle: null,
                notify_when: 'onActionGroupChange',
                rule_type_id: 'siem.queryRule',
                consumer: 'alerts'
            });
            setIsCreating(false);
            setSnackbarMessage('Rule created successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setIsCreating(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreating(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container>
            <Paper>
                <Typography variant="h4" gutterBottom>
                    Elasticsearch Rules
                </Typography>
                <List>
                    {rules.map((rule) => (
                        <ListItem key={rule.id}>
                            <ListItemText primary={rule.name} />
                            <Button variant="contained" color="primary" onClick={() => handleEditClick(rule)}>
                                Edit
                            </Button>
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="secondary" onClick={handleCreateClick}>
                    Create New Rule
                </Button>
            </Paper>

            {/* Edit Rule Dialog */}
            <Dialog open={Boolean(editingRule)} onClose={() => setEditingRule(null)}>
                <DialogTitle>Edit Rule</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleUpdateSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            value={updatedRule.name || ''}
                            onChange={handleUpdateChange}
                            fullWidth
                        />
                        <TextField
                            label="Query"
                            name="query"
                            value={updatedRule.params?.query || ''}
                            onChange={handleUpdateChange}
                            fullWidth
                        />
                        <TextField
                            label="Interval"
                            name="interval"
                            value={updatedRule.schedule?.interval || ''}
                            onChange={handleUpdateChange}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={updatedRule.params?.description || ''}
                            onChange={handleUpdateChange}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Severity"
                            name="severity"
                            value={updatedRule.params?.severity || 'low'}
                            onChange={handleUpdateChange}
                            fullWidth
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                        </TextField>
                        {updatedRule.actions?.map((action, index) => (
                            <div key={index}>
                                <TextField
                                    label="Action ID"
                                    name={`actions.${index}.id`}
                                    value={action.id || ''}
                                    onChange={handleUpdateChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Group"
                                    name={`actions.${index}.group`}
                                    value={action.group || 'default'}
                                    onChange={handleUpdateChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Level"
                                    name={`actions.${index}.params.level`}
                                    value={action.params.level || ''}
                                    onChange={handleUpdateChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Message"
                                    name={`actions.${index}.params.message`}
                                    value={action.params.message || ''}
                                    onChange={handleUpdateChange}
                                    fullWidth
                                />
                            </div>
                        ))}
                        <DialogActions>
                            <Button type="submit" color="primary">
                                Update
                            </Button>
                            <Button onClick={() => setEditingRule(null)} color="secondary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Rule Dialog */}
            <Dialog open={isCreating} onClose={handleCloseCreateDialog}>
                <DialogTitle>Create New Rule</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleCreateSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            value={newRule.name || ''}
                            onChange={handleCreateChange}
                            fullWidth
                        />
                        <TextField
                            label="Query"
                            name="query"
                            value={newRule.params.query || ''}
                            onChange={handleCreateChange}
                            fullWidth
                        />
                        <TextField
                            label="Interval"
                            name="interval"
                            value={newRule.schedule.interval || ''}
                            onChange={handleCreateChange}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={newRule.params.description || ''}
                            onChange={handleCreateChange}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Severity"
                            name="severity"
                            value={newRule.params.severity || 'low'}
                            onChange={handleCreateChange}
                            fullWidth
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                        </TextField>
                        {newRule.actions?.map((action, index) => (
                            <div key={index}>
                                <TextField
                                    label="Action ID"
                                    name={`actions.${index}.id`}
                                    value={action.id || ''}
                                    onChange={handleCreateChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Group"
                                    name={`actions.${index}.group`}
                                    value={action.group || 'default'}
                                    onChange={handleCreateChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Level"
                                    name={`actions.${index}.params.level`}
                                    value={action.params.level || ''}
                                    onChange={handleCreateChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Message"
                                    name={`actions.${index}.params.message`}
                                    value={action.params.message || ''}
                                    onChange={handleCreateChange}
                                    fullWidth
                                />
                            </div>
                        ))}
                        <DialogActions>
                            <Button type="submit" color="primary">
                                Create
                            </Button>
                            <Button onClick={handleCloseCreateDialog} color="secondary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default RulesPage;
