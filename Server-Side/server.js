import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.get("/", (req, res) => {
    res.send("Server is running");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        socket.data.roomId = roomId;

        const room = io.sockets.adapter.rooms.get(roomId);
        const numPlayers = room ? room.size : 0;
        let color;

        if (numPlayers == 1) {
            color = "white";
        }
        else if (numPlayers == 2) {
            color = "black";
        }
        else {
            color = "spectator";
        }

        socket.data.color = color;
        socket.emit("assignColor", color);
        io.to(roomId).emit("requestBoardPosition");

        console.log("A user connected");
    });
    socket.on("move", (data) => {
        console.log("Server is running");
        socket.to(socket.data.roomId).emit("updateBoard", data);
    });
    socket.on("returnBoardPosition", (data) => {
        console.log("Returning board position");
        socket.to(socket.data.roomId).emit("retrieveBoardPosition", data);
    });
    socket.on("disconnectUser", () => {
        socket.disconnect(true);
    }

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});