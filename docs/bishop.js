import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Bishop extends Piece {
    constructor(color, posX, posY) {
        super("Bishop", color, posX, posY);
        this.spritePosition = 100;
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 1], [-1, -1], [-1, 1], [1, -1]], -1, false);
    }
}