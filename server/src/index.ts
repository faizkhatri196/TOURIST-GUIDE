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

// Root Welcome Splash
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; background-color: #030712; color: #f4f4f5; text-align: center; padding: 20px;">
      <h1 style="color: #3b82f6; margin-bottom: 8px;">Let's Travel World API Node</h1>
      <p style="color: #9ca3af; margin-top: 0;">Production backend active and running on Render.</p>
      <div style="margin-top: 20px; background-color: #111827; padding: 12px 24px; border-radius: 12px; border: 1px solid #1f2937; font-family: monospace; font-size: 13px;">
        STATUS: <span style="color: #10b981; font-weight: bold;">ONLINE // SEED OK</span>
      </div>
      <p style="margin-top: 30px; font-size: 13px; color: #6b7280; max-width: 400px; line-height: 1.5;">
        This is the API backend server. Please visit your frontend client website deployed on Vercel to access the Let's Travel World UI!
      </p>
    </div>
  `);
});

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
