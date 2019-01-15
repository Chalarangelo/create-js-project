const http = require('http');
const port = '8888';
const html = `<!DOCTYPE html>
<html>
<head>
  <title>Node.js app</p>
</head>
<body>
  <p>Hello world!</p>
</body>
</html>`;

const app = new http.Server();

app.on('request', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(html);
  res.end('\n');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});