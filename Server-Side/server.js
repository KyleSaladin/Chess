import express from "express";
import http from "http";
import { server } from "socket.io";

const app = express();
const PORT = 3000;
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("move", (data) => {
        io.emit("updateBoard", data);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected: ", socket.id);
    });
});

server.listen(3000, () => { console.log("Server is running on port", PORT); });