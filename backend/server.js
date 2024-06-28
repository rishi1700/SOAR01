const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const https = require('https');
const axios = require('axios');
const bodyParser = require('body-parser');

dotenv.config();

const authRoutes = require('./routes/auth');
const elasticRoutes = require('./routes/elasticsearch');
const thehiveRoutes = require('./routes/thehive');
const cortexRoutes = require('./routes/cortex');
const actionsRoutes = require('./routes/actions');
const rulesRoutes = require('./routes/rules');
const alertsRouter = require('./routes/alerts');
const threatIntelligenceRouter = require('./routes/threatIntelligence');
const playbooksRoute = require('./routes/playbooks');
const alertingRouter = require('./routes/alerting');
const virustotalRoutes = require('./routes/virustotal');
const correlationRoutes = require('./routes/correlation');
const dashboardRoutes = require('./routes/dashboard'); // Import the dashboard route

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/api', elasticRoutes);
app.use('/api/thehive', thehiveRoutes);
app.use('/api/cortex', cortexRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/alerts', alertsRouter);
app.use('/api/threat-intelligence', threatIntelligenceRouter);
app.use('/playbooks', playbooksRoute);
app.use('/api/alerting', alertingRouter);
app.use('/api/virustotal', virustotalRoutes);
app.use('/api/correlation', correlationRoutes);
app.use('/dashboard', dashboardRoutes); // Use the dashboard route

const PORT = process.env.PORT || 5000; // Define PORT here
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  setInterval(async () => {
    try {
      const elasticResponse = await axios.get(`${process.env.ELASTICSEARCH_HOST}/snort-logs-*/_search`, {
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        data: {
          size: 5, // Fetch the most recent 5 alerts
          query: {
            match_all: {}
          },
          sort: [
            {
              '@timestamp': {
                order: 'desc'
              }
            }
          ]
        },
        headers: {
          'Content-Type': 'application/json',
          'source': true,
          'source_content_type': 'application/json'
        },
      });

      const hits = elasticResponse.data.hits.hits;
      socket.emit('dataUpdate', hits);
    } catch (error) {
      console.error('Error fetching data from Elasticsearch:', error.response ? error.response.data : error.message);
    }
  }, 5000);
});


