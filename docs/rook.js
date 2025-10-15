import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Rook extends Piece {
    constructor(color, posX, posY) {
        super("Rook", color, posX, posY);
        this.hasMoved = false;
        this.spritePosition = 40
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 0], [0, -1], [-1, 0], [0, 1]], -1, false);
    }
}