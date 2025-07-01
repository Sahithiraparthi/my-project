const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create HTTP server to serve static files
const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT'){
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found', 'utf-8');
      }
      else {
        res.writeHead(500);
        res.end('Server Error: '+error.code);
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Mock flight delay prediction function
function getMockFlightDelayPrediction() {
  // Random delay between 0 and 120 minutes
  const delay = Math.floor(Math.random() * 121);
  // Random flight number
  const flightNumber = 'FL' + Math.floor(1000 + Math.random() * 9000);
  // Current timestamp
  const timestamp = new Date().toISOString();
  return { flightNumber, delay, timestamp };
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send a flight delay prediction every 5 seconds
  const interval = setInterval(() => {
    const prediction = getMockFlightDelayPrediction();
    ws.send(JSON.stringify(prediction));
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
