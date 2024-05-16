const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(cors());

// Backend servers
const servers = [
  "http://localhost:6001",
  "http://localhost:6002",
  "http://localhost:6003",
];

const healthCheckEndopint = "/health";

let healthyServers = [];

// Current index of backend server
let currentIndex = 0;

// Function for getting next backend server
function getNextServer() {
  currentIndex++;
  if (currentIndex >= servers.length) {
    currentIndex = 0;
  }

  return servers[currentIndex];
}

// Health check
const healthCheck = async () => {
  try {
    for (let i = 0; i < servers.length; i++) {
      const curr = servers[i];
      try {
        const res = await axios.get(`${curr}${healthCheckEndopint}`);
        const index = healthyServers.indexOf(curr);
        if (index < 0) healthyServers.push(curr);
      } catch (error) {
        const index = healthyServers.indexOf(curr);
        index > -1 && healthyServers.splice(index, 1);
      }
    }
    const healthyServersCount = healthyServers.length;
    const deadServersCount = servers.length - healthyServers.length;
    console.log(
      `Healthy servers: ${healthyServersCount}, Dead servers: ${deadServersCount}`
    );
  } catch (error) {
    console.log(error);
  }
};

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Handler for incoming requests
app.get("*", async (req, res) => {
  // Get next backend server
  const server = getNextServer();

  // Forward request
  try {
    const result = await axios.get(server + req.url);
    console.log(`Forwarded to ${server}`);
    res.status(result.status).send(result.data);
  } catch (err) {
    res.status(500).send("Failed to connect to backend");
  }
});

app.listen(80, () => {
  console.log("Load balancer running on port 80");
  const healthCheckCronJob = cron.schedule(`*/3 * * * * *`, () => {
    healthCheck();
  });
});
