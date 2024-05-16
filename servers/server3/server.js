const express = require("express");
const jobRoutes = require("./routes/job.routes");

const app = express();
const PORT = process.env.PORT || 6003;

// Middleware
app.use(express.json());

// Routes
app.use("/api", jobRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
