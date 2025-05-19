const express = require("express");
const app = express();

app.use(express.json());

const installDB = {}; // version => array of device info

app.post("/reportInstall", (req, res) => {
  const { version, deviceId, username } = req.body;
  if (!version || !deviceId) return res.sendStatus(400);

  if (!installDB[version]) installDB[version] = [];

  // Avoid duplicate entries per deviceId
  const exists = installDB[version].some(entry => entry.deviceId === deviceId);
  if (!exists) {
    installDB[version].push({
      deviceId,
      username: username || null,
      timestamp: new Date().toISOString()
    });
  }

  res.sendStatus(200);
});

app.get("/installStats", (req, res) => {
  const stats = {};
  for (let version in installDB) {
    stats[version] = installDB[version].length;
  }
  res.json(stats);
});

app.get("/installDetails", (req, res) => {
  res.json(installDB); // full data: deviceId, version, timestamp, optional username
});

app.listen(3111, () => console.log("Server running on port 3111"));
