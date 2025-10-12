import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class Bishop extends Piece {
    constructor(color, posX, posY) {
        super("Bishop", color, posX, posY);
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 100, lightColor, darkColor);
    }

    getMoves(board) {
        console.log(board);
        return getSlideMoves(this, board, [[1, 1], [-1, -1], [-1, 1], [1, -1]], -1, false);
    }
}