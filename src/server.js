const path = require('path');

const express = require('express');
const server = express();

// Static Files
server.use(express.static('build'));

server.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, './views/selection.html'));
});

server.get('/index_user', (request, response) => {
  response.sendFile(path.join(__dirname, './views/user/index_user.html'));
});

server.get('/index_admin', (request, response) => {
  response.sendFile(path.join(__dirname, './views/admin/index_admin.html'));
});

server.listen(8080);