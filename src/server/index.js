const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {
    console.log(socket.id);
});

server.listen(PORT, () => {
    console.log('Connected to port:' + PORT);
});
