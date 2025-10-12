import { Piece } from "./piece.js";

export class Pawn extends Piece{
    constructor(color, posX, posY) {
        super("Pawn", color, posX, posY);
        this.moved = false;
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 20, lightColor, darkColor);
    }

    getMoves(board) {
        let moves = [];
        let forward = (this.color == "white") ? 1 : -1;
        let x = this.posX;
        let y = this.posY;

        if (board.pieces[x][this.posY + forward] == null) {
            moves.push([x, this.posY + forward]);
            if (!this.moved && board.pieces[x][this.posY + forward *  2] == null) {
                moves.push([x, y + forward * 2]);
            }
        }
        if (this.posX > 1 && board.pieces[x - 1][y + forward] != null && board.pieces[x - 1][y + forward].color != this.color) {
            moves.push([x - 1, y + forward]);
        }
        if (this.posX < board.sizeX - 1 && board.pieces[x + 1][y+forward] != null && board.pieces[x + 1][y + forward].color != this.color) {
            moves.push([x + 1, y + forward]);
        }

        return moves;
    }
}