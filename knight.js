import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Knight extends Piece {
    constructor(color, posX, posY) {
        super("Knight", color, posX, posY);
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 0, lightColor, darkColor)
    }

    getMoves(board) {
        return getSlideMoves(this, board, [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]], 2, true);
    }
}