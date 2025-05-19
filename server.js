const express = require("express");
const app = express();

const installDB = {}; // Keeps track of device IDs per version

app.use(express.json());

app.post("/reportInstall", (req, res) => {
  const { version, deviceId } = req.body;
  if (!version || !deviceId) return res.sendStatus(400);

  if (!installDB[version]) installDB[version] = new Set();
  installDB[version].add(deviceId);
  res.sendStatus(200);
});

app.get("/installStats", (req, res) => {
  const stats = {};
  for (let version in installDB) {
    stats[version] = installDB[version].size;
  }
  res.json(stats); // Shows how many devices installed each version
});

app.listen(3111, () => console.log("Server running on port 3111"));
