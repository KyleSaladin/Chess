import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Knight extends Piece {
    constructor(color, posX, posY) {
        super("Knight", color, posX, posY);
        this.spritePosition = 0;
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]], 1, true);
    }

    getTypeChar() {
        if (this.color == "white") {
            return 'n';
        }
        return 'N';
    }
}