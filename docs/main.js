import { DefaultBoard } from './defaultBoard.js';

import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";
let socket = io("https://chess-4bq0.onrender.com");


const canvas = document.getElementById("MainCanvas");
const ctx = canvas.getContext("2d");

const colorPickerDark = document.getElementById("ColorPickerDark");
const colorPickerLight = document.getElementById("ColorPickerLight");
const colorPickerHighlight = document.getElementById("ColorPickerHighlight");

document.getElementById("JoinRoomButton").addEventListener("click", joinRoom);
document.getElementById("SinglePlayerButton").addEventListener("click", joinSinglePlayer);

// Get device pixel ratio
const DPR = window.devicePixelRatio || 1;

// Set desired display size (CSS size)
const displayWidth = Math.min(window.innerWidth, window.innerHeight) - 25;
const displayHeight = Math.min(window.innerWidth, window.innerHeight) - 25;

// Set internal resolution scaled by DPR
canvas.width = displayWidth * DPR;
canvas.height = displayHeight * DPR;

// Set CSS size to match display size (not scaled)
canvas.style.width = `${displayWidth}px`;
canvas.style.height = `${displayHeight}px`;

// Scale the context to match DPR
ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // replaces ctx.scale for clarity

// Disable smoothing for pixel art
ctx.imageSmoothingEnabled = false;

let darkColor = hexToRgba(colorPickerDark.value, 1);
let lightColor = hexToRgba(colorPickerLight.value, 1);
let highlightColor = hexToRgba(colorPickerHighlight.value, 0.5);

colorPickerDark.addEventListener("input", (event) => {
    darkColor = hexToRgba(colorPickerDark.value, 1);
});

colorPickerLight.addEventListener("input", (event) => {
    lightColor = hexToRgba(colorPickerLight.value, 1);
});

colorPickerHighlight.addEventListener("input", (event) => {
    highlightColor = hexToRgba(colorPickerHighlight.value, 0.5);
});

document.addEventListener("mousedown", (event) => {
    if (!connected) return;
    let move = myBoard.onClick(event);
    if (move != null && !singlePlayer) {
        console.log("Send move", move);
        socket.emit("move", move);
    }
});

socket.on("assignColor", (color) => {
    let clientColor = color;
    myBoard.clientColor = clientColor;
});

socket.on("updateBoard", (data) => {
    if (data != [[],[]]) {
        myBoard.movePieceWithoutValidation(data);
    }
});

socket.on("requestBoardPosition", (data) => {
    if (myBoard.clientColor == "white") {
        let piecesToSend = "";
        for (let y = 0; y < myBoard.sizeY; y++) {
            for (let x = 0; x < myBoard.sizeX; x++) {
                console.log(myBoard.pieces[x][y]);
                if (myBoard.pieces[x][y] == null) {
                    piecesToSend += "-";
                    continue;
                }
                piecesToSend += myBoard.pieces[x][y].getTypeChar();
           }
        }
        socket.emit("returnBoardPosition", piecesToSend);
    }
});

socket.on("retrieveBoardPosition", (data) => {
    if (myBoard.clientColor == "black") { return; }
    console.log("Board position retrieved");
    console.log(data);
    myBoard.generatePieces(data);
    console.log(myBoard.pieces);
});
function closeOverlay() {
    document.getElementById("roomOverlay").style.display = "none";
}

function joinRoom() {
    const roomId = document.getElementById("JoinRoomInput").value.trim();
    if (roomId) {
        console.log("Joining room:", roomId);
        socket.emit("joinRoom", roomId);
        closeOverlay();

        connected = true;
    }
}
function joinSinglePlayer() {
    singlePlayer = true;
    closeOverlay();
    connected = true;

    const random = Math.round(Math.random());
    if (random == 0) {
        myBoard.clientColor = "white";
    }
    else {
        myBoard.clientColor = "black";
    }
    myBoard.clientColor = "both";
}

let singlePlayer = false;

const tileSize = Math.min(displayWidth, displayHeight) / 8
let myBoard = new DefaultBoard(0, 0, tileSize);

let connected = false;

animate();
function animate() {
    myBoard.draw(ctx, lightColor, darkColor, highlightColor);

    requestAnimationFrame(animate);
}

function hexToRgba(hex, alpha) {
    // Remove the '#' if present
    hex = hex.replace(/^#/, '');

    // Parse the hex color
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
