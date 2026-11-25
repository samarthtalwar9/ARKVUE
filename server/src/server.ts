
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import leadsRouter from "./routes/leads";
import { pool, initDatabase } from "./config/db";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Lead management REST APIs
app.use("/api/leads", leadsRouter);

// API health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "ARKVUE Lead Management API is running!"
  });
});

// Dashboard statistics
app.get("/api/dashboard/stats", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'New') AS new,
        COUNT(*) FILTER (WHERE status = 'Contacted') AS contacted,
        COUNT(*) FILTER (WHERE status = 'Qualified') AS qualified,
        COUNT(*) FILTER (WHERE status = 'Converted') AS converted
      FROM leads
    `);

    res.status(200).json({
      success: true,
      stats: result.rows[0]
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics"
    });
  }
});

// Handle unknown endpoints
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Start server after database connection
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log("--------------------------------");
      console.log("       ARKVUE BACKEND");
      console.log("--------------------------------");
      console.log(`Server running: http://localhost:${PORT}`);
      console.log("PostgreSQL connected successfully");
      console.log("Leads table initialized");
      console.log("REST APIs registered");
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("Failed to start ARKVUE:", error);
    await pool.end();
    process.exit(1);
  }
}

startServer();
