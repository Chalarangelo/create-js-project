const http = require('http');

const html = `<!DOCTYPE html>
<html>
<head>
  <title>Node.js app</title>
</head>
<body>
  <p>Hello world!</p>
</body>
</html>`;

const app = new http.Server();

app.on('request', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(html);
  res.end('\n');
});

module.exports = app;
