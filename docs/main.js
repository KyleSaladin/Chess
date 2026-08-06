import { DefaultChess } from './defaultChess.js';
import { PowChess } from './powChess.js';
import { ShogiGame } from './shogi.js';
import { RandomAI } from './RandomAI.js';
import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";

// Initialize socket connection
const socket = io("https://chess-4bq0.onrender.com");

// Get DOM elements
const canvas = document.getElementById("MainCanvas");
const ctx = canvas.getContext("2d");
const colorPickerDark = document.getElementById("ColorPickerDark");
const colorPickerLight = document.getElementById("ColorPickerLight");
const colorPickerHighlight = document.getElementById("ColorPickerHighlight");
const gameEndOverlay = document.getElementById("endGameOverlay");
let gameEndText = document.getElementById("EndGameText");

gameEndOverlay.style.display = "none";

const selectedVariant = document.getElementById("SelectedVariant");
const variantList = document.getElementById("VariantList");
const variantArrow = document.getElementById("VariantArrow"); 

//Select default variant on load
document.querySelector(".variant-text").dataset.variant = "Chess";

selectedVariant.addEventListener("click", () => {
    const isOpen = variantList.classList.contains("open");
    if (isOpen) {
        variantList.classList.remove("open");
        variantArrow.textContent = "▶"; // arrow right
    } else {
        variantList.classList.add("open");
        variantArrow.textContent = "▼"; // arrow down
    }
});

const colorPanelWrapper = document.getElementById("ColorPanelWrapper");
const colorToggle = document.getElementById("ColorToggle");

colorToggle.addEventListener("click", () => {
    colorPanelWrapper.classList.toggle("collapsed");
});

variantList.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    const variantTextEl = document.querySelector(".variant-text");
    variantTextEl.textContent = item.textContent;
    variantTextEl.dataset.variant = item.dataset.variant; // ✅ set code name
    variantList.classList.remove("open");
    variantArrow.textContent = "▶"; // reset arrow right
  });
});

document.getElementById("PlayButton").addEventListener("click", () => setChessVariant());

// Add event listeners for return button
document.getElementById("ReturnButton").addEventListener("click", leaveMatch);

// Add event listeners for room controls
document.getElementById("JoinRoomButton").addEventListener("click", joinRoom);
document.getElementById("SinglePlayerButton").addEventListener("click", joinSinglePlayer);
document.getElementById("AIButton").addEventListener("click", joinAgainstAI)

// Setup canvas with proper DPI scaling
const DPR = window.devicePixelRatio || 1;
const displayWidth = Math.min(window.innerWidth, window.innerHeight) - 25;
const displayHeight = Math.min(window.innerWidth, window.innerHeight) - 25;

canvas.width = displayWidth * DPR;
canvas.height = displayHeight * DPR;
canvas.style.width = `${displayWidth}px`;
canvas.style.height = `${displayHeight}px`;

// Scale context to match DPR and disable smoothing for crisp pixels
ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
ctx.imageSmoothingEnabled = false;

// Initialize colors from color pickers
let darkColor = hexToRgba(colorPickerDark.value, 1);
let lightColor = hexToRgba(colorPickerLight.value, 1);
let highlightColor = hexToRgba(colorPickerHighlight.value, 0.5);

// Update colors when color pickers change
colorPickerDark.addEventListener("input", () => {
    darkColor = hexToRgba(colorPickerDark.value, 1);
});

colorPickerLight.addEventListener("input", () => {
    lightColor = hexToRgba(colorPickerLight.value, 1);
});

colorPickerHighlight.addEventListener("input", () => {
    highlightColor = hexToRgba(colorPickerHighlight.value, 0.5);
});

// Socket event handlers
socket.on("assignColor", (color) => {
    console.log("Assigned color:", color);
    myBoard.clientColor = color;
});

socket.on("updateBoard", (data) => {
    // Update board with move from opponent
    if (data && data[0] && data[0].length > 0) {
        myBoard.movePieceWithoutValidation(data);
    }
});

socket.on("requestBoardPosition", () => {
    // Only white player sends board position (host)
    if (myBoard.clientColor === "white") {
        const boardString = myBoard.getBoardString();
        console.log("Sending board position:", boardString);
        socket.emit("returnBoardPosition", boardString);
    }
});

socket.on("retrieveBoardPosition", (data) => {
    // Only black player receives board position (guest)
    if (myBoard.clientColor === "black") {
        console.log("Received board position:", data);
        myBoard.generatePieces(data);
    }
});

//Only start game when both players are connected
socket.on("startGame", () => {
    console.log("Starting game, clientColor =", myBoard.clientColor);
    myBoard.gameStarted = true;
    console.log("gameStarted =", myBoard.gameStarted);
});


function leaveMatch() {
    leaveRoom();
    document.getElementById("variantOverlay").style.display = "flex";
    document.getElementById("roomOverlay").style.display = "flex";
}

function setChessVariant() {
    const variant = document.querySelector(".variant-text").dataset.variant;
    if (variant === "PowChess") {

        // Calculate tile size and center the board
        const tileSize = Math.min(displayWidth, displayHeight) / 11; // Divide by max board dimension
        const boardWidth = tileSize * 11; // PowChess is 11x10
        const boardHeight = tileSize * 10;
        const offsetX = (displayWidth - boardWidth) / 2;
        const offsetY = (displayHeight - boardHeight) / 2;

        // Initialize the chess board
        myBoard = new PowChess(offsetX, offsetY, tileSize);

        document.getElementById("VariantLabel").textContent += "Pow Chess";

    } else if (variant === "Chess") {

        // Calculate tile size and center the board
        const tileSize = Math.min(displayWidth, displayHeight) / 8; // Divide by max board dimension
        const boardWidth = tileSize * 8; // PowChess is 11x10
        const boardHeight = tileSize * 8;
        const offsetX = (displayWidth - boardWidth) / 2;
        const offsetY = (displayHeight - boardHeight) / 2;

        // Initialize the chess board
        myBoard = new DefaultChess(offsetX, offsetY, tileSize);

        document.getElementById("VariantLabel").textContent += "Chess";
    } else if (variant === "Shogi") {
        // Calculate tile size and center the board
        const tileSize = Math.min(displayWidth, displayHeight) / 9; // Divide by max board dimension
        const boardWidth = tileSize * 9; // Shogi is 9x9
        const boardHeight = tileSize * 9;
        const offsetX = (displayWidth - boardWidth) / 2;
        const offsetY = (displayHeight - boardHeight) / 2;
        // Initialize the chess board
        myBoard = new ShogiGame(offsetX, offsetY, tileSize);
        document.getElementById("VariantLabel").textContent += "Shogi";
    } else {
        const variantTextEl = document.querySelector(".variant-text");
        variantTextEl.textContent = "Variant Unavailable";
        return; // Invalid variant
    }
    
    document.getElementById("variantOverlay").style.display = "none";
}


// Room management functions

function closeRoomOverlay() {
    document.getElementById("roomOverlay").style.display = "none";
}

/**
 * Shows promotion popup and returns a promise that resolves with the selected piece class
 */
export function showPromotionPopup(color, promotionPieces) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('promotionOverlay');
        const piecesContainer = document.getElementById('promotionPieces');

        // Clear existing pieces
        piecesContainer.innerHTML = '';

        // Display each piece type from the promotionPieces array
        promotionPieces.forEach(PieceClass => {
            const pieceDiv = document.createElement('div');
            pieceDiv.className = 'promotion-piece';

            // Create a temporary instance to get the image path
            const tempPiece = new PieceClass(color, 0, 0);

            // Create image element
            const img = document.createElement('img');
            img.src = tempPiece.image.src;
            img.alt = 'promotion option';

            pieceDiv.appendChild(img);

            // Handle selection
            pieceDiv.addEventListener('click', () => {
                overlay.classList.remove('active');
                resolve(PieceClass);
            });

            piecesContainer.appendChild(pieceDiv);
        });

        overlay.classList.add('active');
    });
}

function joinRoom() {
    const roomId = document.getElementById("JoinRoomInput").value.trim();
    if (roomId) {
        socket.emit("joinRoom", roomId + myBoard.variant);
        closeRoomOverlay();
        connected = true;
    }
}

function leaveRoom() {
    gameEndOverlay.style.display = "none";
    socket.emit("disconnectUser");
    connected = false;
}

export function openCheckmateOverlay(winner) {
    gameEndText.textContent = winner === "white" ? "White Wins by Checkmate!" : "Black Wins by Checkmate!";
    document.getElementById("endGameOverlay").style.display = "flex";
}

export function openStalemateOverlay() {
    gameEndText.textContent = "Game Drawn by Stalemate!";
    document.getElementById("endGameOverlay").style.display = "flex";
}

function joinSinglePlayer() {
    singlePlayer = true;
    closeRoomOverlay();
    connected = true;
    myBoard.gameStarted = true;
    // In single player, allow both colors to be controlled
    myBoard.clientColor = "both";
}

function joinAgainstAI() {
    singlePlayer = true;
    closeRoomOverlay();
    connected = true;
    myBoard.gameStarted = true;
    // Against AI, choose random color to play as
    let playerColor = 0 //Math.round(Math.random())
    myBoard.clientColor = (playerColor == 0) ? "white" : "black";
    let aiColor = (playerColor == 1) ? "white" : "black";
    myAI = new RandomAI(myBoard, aiColor)
}

// Handle mouse clicks on the board
document.addEventListener("mousedown", (event) => {
    if (!connected) return;

    const move = myBoard.onClick(event);

    // Send move to server if valid and not in single player mode
    if (move != null && !singlePlayer) {
        console.log("Sending move to server:", move);
        socket.emit("move", move);
    }

    if (move != null && myAI != null){
        myAI.move()
    }
});

// Game state variables
let singlePlayer = false;
let connected = false;

let myBoard = new DefaultChess(0, 0, 60); // Temporary initialization
let myAI = null

// Start animation loop
animate();

function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Draw the board
    myBoard.draw(ctx, lightColor, darkColor, highlightColor);

    requestAnimationFrame(animate);
}

/**
 * Converts hex color to RGBA format
 * @param {string} hex - Hex color code (e.g., "#FBF3D7")
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
function hexToRgba(hex, alpha) {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
