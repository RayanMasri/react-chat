const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 4001;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        io.emit('message', message);
    });
});

server.listen(PORT, () => {
    console.log('Connected to port:' + PORT);
});
