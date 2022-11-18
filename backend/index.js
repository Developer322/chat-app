const config = require('./utils/config.js');
const { app, sessionMiddleware } = require('./app.js');
const addMessageHandler = require('./socket.js');
const http = require('http');
const server = http.createServer(app);

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

addMessageHandler(server, sessionMiddleware);
