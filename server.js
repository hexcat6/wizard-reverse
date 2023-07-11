const http = require('http');
const express = require('express');
const app = express();
app.use(express.static(`${__dirname}`));
const server = http.createServer(app);

server.on('error', (err) => {
    console.error(err);
});
  
server.listen(process.env.PORT || 80, () => {
    console.log('server is ready on port 80');
});
  