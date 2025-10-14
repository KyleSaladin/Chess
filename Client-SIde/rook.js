import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Rook extends Piece {
    constructor(color, posX, posY) {
        super("Rook", color, posX, posY);
        this.hasMoved = false;
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 40, lightColor, darkColor)
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 0], [0, -1], [-1, 0], [0, 1]], -1, false);
    }

    clone() {
        return new Rook(this.color, this.posX, this.posY);
    }
}