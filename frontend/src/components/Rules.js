const express = require('express');
const axios = require('axios');
const router = express.Router();

const KIBANA_URL = process.env.KIBANA_URL;
const KIBANA_USERNAME = process.env.KIBANA_USERNAME;
const KIBANA_PASSWORD = process.env.KIBANA_PASSWORD;

// Fetch all rules
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${KIBANA_URL}/api/alerting/rules/_find`, {
            headers: {
                'kbn-xsrf': 'true'
            },
            auth: {
                username: KIBANA_USERNAME,
                password: KIBANA_PASSWORD
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new rule
router.post('/', async (req, res) => {
    const {
        name,
        tags,
        params,
        schedule,
        actions,
        notify_when,
        rule_type_id,
        consumer
    } = req.body;

    const ruleData = {
        name: name || 'New Rule',
        tags: tags || [],
        params: params || {
            aggType: "avg",
            termSize: 6,
            thresholdComparator: ">",
            timeWindowSize: 5,
            timeWindowUnit: "m",
            groupBy: "top",
            threshold: [1000],
            index: ["snort-logs-*"],
            timeField: "@timestamp",
            aggField: "sheet.version",
            termField: "name.keyword"
        },
        consumer: consumer || 'alerts',
        rule_type_id: rule_type_id || '.index-threshold',
        schedule: schedule || { interval: '1m' },
        actions: actions || [{
            id: 'dceeb5d0-6b41-11eb-802b-85b0c1bc8ba2', // Replace with your connector ID
            group: 'threshold met',
            params: {
                level: 'info',
                message: "Rule '{{rule.name}}' is active for group '{{context.group}}':\n\n- Value: {{context.value}}\n- Conditions Met: {{context.conditions}} over {{rule.params.timeWindowSize}}{{rule.params.timeWindowUnit}}\n- Timestamp: {{context.date}}"
            }
        }],
        notify_when: notify_when || 'onActionGroupChange'
    };

    console.log('Creating rule with data:', JSON.stringify(ruleData, null, 2));

    try {
        const response = await axios.post(
            `${KIBANA_URL}/api/alerting/rule`,
            ruleData,
            {
                headers: {
                    'kbn-xsrf': 'true'
                },
                auth: {
                    username: KIBANA_USERNAME,
                    password: KIBANA_PASSWORD
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error creating rule:', error.response ? error.response.data : error.message);
        res.status(500).json(error.response ? error.response.data : { error: error.message });
    }
});

// Update a specific rule
router.put('/:ruleId', async (req, res) => {
    const { ruleId } = req.params;
    const {
        name,
        tags,
        params,
        schedule,
        actions,
        throttle,
        notify_when
    } = req.body;

    const ruleData = {
        name: name || 'SQL Injection',
        tags: tags || [],
        params: params || {
            author: [],
            description: 'SQL Injection',
            falsePositives: [],
            from: 'now-360s',
            ruleId: '297aa6fb-54d1-4eb5-94f0-edf95524dd37',
            immutable: false,
            index: ['snort-logs-*'],
            license: '',
            outputIndex: '',
            meta: {},
            maxSignals: 100,
            riskScore: 99,
            riskScoreMapping: [],
            severity: 'critical',
            severityMapping: [],
            threat: [],
            to: 'now',
            references: [],
            version: 1,
            exceptionsList: [],
            relatedIntegrations: [],
            requiredFields: [],
            setup: '',
            type: 'query',
            language: 'kuery',
            query: 'event.original : *SQL Injection*',
            filters: [],
            dataViewId: ''
        },
        schedule: schedule || { interval: '1m' },
        actions: actions || [{
            group: 'default',
            id: '8aa88aab-3578-4f0f-998a-357187dfb822', // Replace with your connector ID
            params: {
                level: 'info',
                body: '{ "Alert": "{{context.alerts}}" }'
            }
        }],
        throttle: throttle || null,
        notify_when: notify_when || 'onActionGroupChange'
    };

    console.log('Updating rule with data:', JSON.stringify(ruleData, null, 2));

    try {
        const response = await axios.put(
            `${KIBANA_URL}/api/alerting/rule/${ruleId}`,
            ruleData,
            {
                headers: {
                    'kbn-xsrf': 'true'
                },
                auth: {
                    username: KIBANA_USERNAME,
                    password: KIBANA_PASSWORD
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error(`Error updating rule ${ruleId}:`, error.response ? error.response.data : error.message);
        res.status(500).json(error.response ? error.response.data : { error: error.message });
    }
});

module.exports = router;
