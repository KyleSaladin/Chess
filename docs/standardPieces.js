import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

/**
 * Queen - moves any distance in straight or diagonal lines
 */
export class Queen extends Piece {
    constructor(color, posX, posY) {
        super("Queen", color, posX, posY);
    }

    getMoves(board) {
        return getSlideMoves(
            this,
            board,
            [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]],
            -1, // Unlimited distance
            false
        );
    }

    getTypeChar() {
        return this.color === "white" ? 'q' : 'Q';
    }
}

/**
 * Rook - moves any distance horizontally or vertically
 */
export class Rook extends Piece {
    constructor(color, posX, posY) {
        super("Rook", color, posX, posY);
        this.hasMoved = false;
    }

    getMoves(board) {
        return getSlideMoves(
            this,
            board,
            [[1, 0], [0, -1], [-1, 0], [0, 1]],
            -1,
            false
        );
    }

    move(tX, tY, board, previousMove) {
        super.move(tX, tY, board, previousMove);
        this.hasMoved = true;
    }

    getTypeChar() {
        return this.color === "white" ? 'r' : 'R';
    }
}

/**
 * Bishop - moves any distance diagonally
 */
export class Bishop extends Piece {
    constructor(color, posX, posY) {
        super("Bishop", color, posX, posY);
    }

    getMoves(board) {
        return getSlideMoves(
            this,
            board,
            [[1, 1], [-1, -1], [-1, 1], [1, -1]],
            -1,
            false
        );
    }

    getTypeChar() {
        return this.color === "white" ? 'b' : 'B';
    }
}

/**
 * Knight - moves in L-shape (2+1 squares), can jump over pieces
 */
export class Knight extends Piece {
    constructor(color, posX, posY) {
        super("Knight", color, posX, posY);
    }

    getMoves(board) {
        return getSlideMoves(
            this,
            board,
            [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
            1,
            true // Can jump
        );
    }

    getTypeChar() {
        return this.color === "white" ? 'n' : 'N';
    }
}