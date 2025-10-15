import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Queen extends Piece {
    constructor(color, posX, posY) {
        super("Queen", color, posX, posY);
        this.spritePosition = 60;
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]], -1, false);
    }
}
