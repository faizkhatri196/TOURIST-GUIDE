import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isDBConnected } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import router from './routes/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading images/assets from other domains if needed
}));
app.use(cors({
  origin: '*', // Allow all origins for dev/testing ease
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Healthy Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), service: "Let's Travel World Backend" });
});

// Setup Main API Router
app.use('/api', router);

// Start Database and Server
const startServer = async () => {
  try {
    // 1. Connect database
    await connectDB();

    // 2. Seed default travel destinations if collection is empty
    if (isDBConnected) {
      await seedDatabase();
    } else {
      console.log("⚠️ Skipping database seed because MongoDB is offline. Starting server in sandbox mode.");
    }

    // 3. Start listener
    app.listen(PORT, () => {
      console.log(`🚀 Let's Travel World server running at http://localhost:${PORT}`);
      console.log(`🌿 Health check available at http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("🔴 Server initialization failed:", err);
    process.exit(1);
  }
};

startServer();
