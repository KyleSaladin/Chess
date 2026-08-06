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
        if (numPlayers === 1) {
            color = "white";
        } else if (numPlayers === 2) {
            color = "black";
            io.to(roomId).emit("startGame");
        } else {
            color = "spectator";
        }

        socket.data.color = color;
        socket.emit("assignColor", color);

        if (color !== "spectator") {
            io.to(roomId).emit("requestBoardPosition");
        }

        console.log("A user connected");
    });

    socket.on("move", (data) => {
        if (!socket.data.roomId) return;
        socket.to(socket.data.roomId).emit("updateBoard", data);
    });

    socket.on("returnBoardPosition", (data) => {
        if (!socket.data.roomId) return;
        socket.to(socket.data.roomId).emit("retrieveBoardPosition", data);
    });

    socket.on("disconnectUser", () => {
        socket.disconnect(true);
    });

    socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        const color = socket.data.color;

        console.log(`User disconnected: ${color} in room ${roomId}`);

        if (!roomId) return;

        // If a player (white or black) disconnects, end the room
        if (color === "white" || color === "black") {
            console.log("Player disconnected — ending room:", roomId);

            // Notify everyone in the room
            io.to(roomId).emit("roomClosed");

            // Kick everyone out of the room
            const room = io.sockets.adapter.rooms.get(roomId);
            if (room) {
                for (const socketId of room) {
                    const s = io.sockets.sockets.get(socketId);
                    if (s) {
                        s.leave(roomId);
                        s.data.roomId = null;
                        s.data.color = null;
                    }
                }
            }
        }
    });
});


const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});