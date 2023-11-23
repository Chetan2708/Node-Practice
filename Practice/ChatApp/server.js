const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Connected...');

    socket.on('message', (msg) => {
        if (msg.type === 'request') {
            // Handle request message
            socket.broadcast.emit('message', {
                user:  msg.user,
                message: `${msg.user} team sent a request of team size ${msg.size}. Do you want to accept it?`,
                type: 'request',
                requestId: socket.id,  // Use socket ID as a unique identifier for the request
                teamName: msg.user,
            });
        } else {
            // Handle regular chat message
            socket.broadcast.emit('message', msg);
        }
    });

    socket.on('response', (response) => {
        // Handle response to request (accept/decline)
        io.to(response.requestId).emit('message', {
            user: 'Server',
            message: `${response.teamName}'s team has ${response.action} your request.`,
            type: 'info',
        });
    });

    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
});
