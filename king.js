import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class King extends Piece {
    constructor(color, posX, posY) {
        super("Rook", color, posX, posY);

        this.hasMoved = false;
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 80, lightColor, darkColor);
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]], 1, false);
    }
}