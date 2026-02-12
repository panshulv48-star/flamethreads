const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (CSS, images, html)
app.use(express.static(__dirname));

// When user opens website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Save responses
app.post("/save-response", (req, res) => {
  const { gui, text } = req.body;

  if (!gui || !text) {
    return res.status(400).json({ message: "Missing gui or text" });
  }

  const entry = `[${new Date().toLocaleString()}] ${gui}: ${text}\n`;

  fs.appendFile("responses.txt", entry, (err) => {
    if (err) {
      console.log("Error saving:", err);
      return res.status(500).json({ message: "Failed to save response" });
    }

    res.json({ message: "Saved successfully" });
  });
});

app.get("/responses", (req, res) => {
  fs.readFile("responses.txt", "utf8", (err, data) => {
    if (err) {
      return res.send("No responses yet OR file not found.");
    }
    res.send(`<pre>${data}</pre>`);
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

