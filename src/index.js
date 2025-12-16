require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./utils/db");

const app = express();

app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API routes
const generateRoute = require("./api/generate");
app.use("/api/generate", generateRoute);

const statusRoute = require("./api/status");
app.use("/api/status", statusRoute);

const explainRoute = require("./api/explain");
app.use("/api/explain", explainRoute);

const deploymentsRoute = require("./api/deployments");
app.use("/api/deployments", deploymentsRoute);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});