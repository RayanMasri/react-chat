const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uuid = require('uuid');

const PORT = process.env.PORT || 4001;

app.use(express.static(__dirname + '/../../build'));

var messages = [];

io.on('connection', (socket) => {
    socket.on('message', (object) => {
        if (object.message) {
            const message = {
                id: uuid.v4(),
                object: object,
            };
            messages.push(message);
            io.emit('message', message);
            // io.emit('message', object);
        }
    });

    socket.on('chat.received', (id) => {
        const message = messages.find((message) => message.id == id);

        if (message) {
            io.to(message.object.id).emit('chat.received', id);
        }
    });

    socket.on('chat.read', (id) => {
        const message = messages.find((message) => message.id == id);

        if (message) {
            io.to(message.object.id).emit('chat.read', id);
        }
    });
});

server.listen(PORT, () => {
    console.log('Connected to port:' + PORT);
});
