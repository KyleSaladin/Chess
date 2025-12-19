import { Board } from "./board.js";
import { openCheckmateOverlay } from "./main.js";
import { openStalemateOverlay } from "./main.js";

/**
 * ChessLikeGame class - handles game logic, moves, and turn management
 * Extends the Board class to add chess-specific gameplay
 */
export class ChessLikeGame extends Board {
    constructor(posX, posY, sizeX, sizeY, tileSize) {
        super(posX, posY, sizeX, sizeY, tileSize);

        this.turn = 1; // 1 = white's turn, -1 = black's turn
        this.previousX = -1; // Last selected piece X coordinate
        this.previousY = -1; // Last selected piece Y coordinate
        this.whiteKing = null; // Reference to white king for check detection
        this.blackKing = null; // Reference to black king for check detection
    }

    /**
     * Assigns king references for check detection
     * Called when kings are placed on the board
     */
    assignKings(piece) {
        if (piece.color === "white") {
            this.whiteKing = piece;
        } else if (piece.color === "black") {
            this.blackKing = piece;
        }
    }

    /**
     * Detects checkmate whenever a move is played
     * Returns true if there is at least one playable move
     */
    detectCheckmate(previousMove) {
        let currentPlayerColor = (this.turn == 1) ? "white" : "black"
        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                if (this.pieces[x][y] == null || this.pieces[x][y].color != currentPlayerColor) continue;
                if (this.validateMoves(this.getPieceMoves(x, y, currentPlayerColor), x, y).length != 0) {
                    return
                }
            }
        }
        console.log("Checkmate detected for " + currentPlayerColor);
        if (currentPlayerColor == "white" ? this.whiteKing.isInCheck(this, previousMove) : this.blackKing.isInCheck(this, previousMove)) {
            console.log("Checkmate");
            openCheckmateOverlay((this.turn == -1) ? "white" : "black");
        }
        else {
            console.log("Stalemate");
            openStalemateOverlay((this.turn == -1) ? "white" : "black");
        }
    }

    /**
     * Gets valid moves for a piece at given coordinates
     * Checks if it's the correct turn and if the client can move that piece
     */
    getPieceMoves(x, y, desiredColor = this.clientColor) {

        // Check bounds
        if (x < 0 || x >= this.sizeX || y < 0 || y >= this.sizeY) {
            return [];
        }

        const piece = this.pieces[x][y];
        if (!piece) return [];

        // Check if it's this piece's turn and if client can move it
        const isWhiteTurn = this.turn === 1;
        const isBlackTurn = this.turn === -1;
        const canMoveWhite = desiredColor === "white" || desiredColor === "both";
        const canMoveBlack = desiredColor === "black" || desiredColor === "both";

        if ((isWhiteTurn && piece.color === "white" && canMoveWhite) ||
            (isBlackTurn && piece.color === "black" && canMoveBlack)) {
            return piece.getMoves(this, this.previousMove);
        }

        return [];
    }

    /**
     * Attempts to move a piece from (fX, fY) to (tX, tY)
     * Returns true if the move was successful
     */
    movePiece(fX, fY, tX, tY, previousMove) {
        // Check if the target square is in the list of valid moves
        if (!this.containsArray(this.moves, [tX, tY])) {
            return false;
        }

        const piece = this.pieces[fX][fY];
        piece.move(tX, tY, this.pieces, previousMove);

        console.log("Detected move:")

        this.turn *= -1; // Switch turns
        this.previousMove = [fX, fY, tX, tY, piece.type];

        this.detectCheckmate(previousMove)

        return true;
    }

    /**
     * Moves a piece without validation (for syncing with server)
     * Used when receiving moves from opponent
     */
    movePieceWithoutValidation(move) {
        if (!move || !move[0]) return;

        const [fromX, fromY, toX, toY] = move[0];
        const piece = this.pieces[fromX][fromY];

        if (!piece) return;

        piece.move(toX, toY, this.pieces, move[1]);
        this.turn *= -1;
        this.previousMove = [fromX, fromY, toX, toY, piece.type];

        this.detectCheckmate(this.previousMove)
    }

    /**
     * Handles click events on the board
     * Manages piece selection and movement
     */
    onClick(event) {
        // Get the bounding rectangle of the canvas to get accurate coordinates
        const rect = event.target.getBoundingClientRect();

        // Convert click coordinates to canvas space (accounting for CSS scaling)
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Convert canvas coordinates to board position (accounting for board offset)
        let x = Math.floor((canvasX - this.posX) / this.tileSize);
        let y = Math.floor((canvasY - this.posY) / this.tileSize);

        // Flip coordinates if viewing from white's perspective
        if (this.clientColor !== "black") {
            x = this.sizeX - x - 1;
            y = this.sizeY - y - 1;
        }

        // Check bounds
        if (x < 0 || x >= this.sizeX || y < 0 || y >= this.sizeY) {
            return null;
        }

        let data = null;
        const lastPreviousMove = this.previousMove;

        // Left click only
        if (event.button === 0) {
            if (this.moves.length === 0) {
                // No piece selected - select this piece and show its moves
                const potentialMoves = this.getPieceMoves(x, y);
                this.moves = this.validateMoves(potentialMoves, x, y);
            } else {
                // Piece already selected - try to move it
                const moved = this.movePiece(this.previousX, this.previousY, x, y, this.previousMove);

                if (!moved) {
                    // Invalid move - select new piece instead
                    const potentialMoves = this.getPieceMoves(x, y);
                    this.moves = this.validateMoves(potentialMoves, x, y);
                } else {
                    // Valid move - clear moves and return data for server
                    this.moves = [];
                    data = [this.previousMove, lastPreviousMove];
                }
            }

            // Store the clicked position for next click
            this.previousX = x;
            this.previousY = y;
        }

        return data;
    }

    /**
     * Filters out moves that would put the king in check
     * Returns only legal moves
     */
    validateMoves(potentialMoves, x, y) {
        const validMoves = [];

        for (const move of potentialMoves) {
            if (!this.willBeInCheck(move, x, y)) {
                validMoves.push(move);
            }
        }

        return validMoves;
    }

    /**
     * Checks if a move would result in the king being in check
     * Temporarily makes the move, checks for check, then undoes it
     */
    willBeInCheck(move, x, y) {
        const capturedPiece = this.getCapturedPiece(move, x, y);
        const piece = this.pieces[x][y];

        // Temporarily make the move
        this.tempMovePiece(x, y, move[0], move[1]);

        // Check if king is in check after this move
        const inCheck = this.checkForCheck(piece, move);

        // Undo the move
        this.tempMovePiece(move[0], move[1], x, y);
        this.pieces[move[0]][move[1]] = capturedPiece;

        return inCheck;
    }

    /**
     * Gets the piece that would be captured by a move
     * Can be overridden by pieces like Pawn for en passant
     */
    getCapturedPiece(move, x, y) {
        return this.pieces[move[0]][move[1]];
    }

    /**
     * Temporarily moves a piece (for check validation)
     * Updates the piece's position so check detection works correctly
     */
    tempMovePiece(fX, fY, tX, tY) {
        const piece = this.pieces[fX][fY];
        this.pieces[tX][tY] = piece;
        this.pieces[fX][fY] = null;

        // Update piece position for accurate check detection
        if (piece) {
            piece.posX = tX;
            piece.posY = tY;
        }
    }

    /**
     * Checks if the current player's king is in check
     */
    checkForCheck(piece, move) {
        if (this.turn === 1) {
            // White's turn - check if white king is in check
            if (piece.type === "King") {
                // King is moving - check new position
                return this.whiteKing.isInCheck(this, this.previousMove, move[0], move[1]);
            }
            // Other piece moving - check king's current position
            return this.whiteKing.isInCheck(this, this.previousMove);
        } else {
            // Black's turn - check if black king is in check
            if (piece.type === "King") {
                return this.blackKing.isInCheck(this, this.previousMove, move[0], move[1]);
            }
            return this.blackKing.isInCheck(this, this.previousMove);
        }
    }

    /**
     * Converts the board to a string representation for syncing with server
     * Format: each piece represented by its type character, '-' for empty
     */
    getBoardString() {
        let boardString = "";

        for (let y = 0; y < this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
                const piece = this.pieces[x][y];
                boardString += piece ? piece.getTypeChar() : "-";
            }
        }

        return boardString;
    }

    /**
     * Utility function to check if array contains a specific coordinate pair
     */
    containsArray(array, pair) {
        if (array.length === 0) return false;

        return array.some(sub =>
            sub.length === pair.length &&
            sub.every((val, i) => val === pair[i])
        );
    }
}