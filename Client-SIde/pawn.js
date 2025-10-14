import { Piece } from "./piece.js";

export class Pawn extends Piece{
    constructor(color, posX, posY) {
        super("Pawn", color, posX, posY);
        this.moved = false;
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 20, lightColor, darkColor);
    }

    getMoves(board, previousMove) {
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
        if (this.isEnPassant(previousMove)) {
            if (previousMove[0] == this.posX - 1) {
                moves.push([x - 1, y + forward]);
            }
            if (previousMove[0] == this.posX + 1) {
                moves.push([x + 1, y + forward]);
            }
        }

        return moves;
    }

    move(tX, tY, board, previousMove) {
        if (this.isEnPassant(previousMove)) {
            console.log("EnPassant");
            board[tX][this.posY] = null;
        }

        board[this.posX][this.posY] = null;
        board[tX][tY] = this;
        this.posX = tX;
        this.posY = tY;
        this.moved = true;

        return [tX, this.posY];
    }

    isEnPassant(previousMove) {
        let forward = (this.color == "white") ? 1 : -1;
        return previousMove[4] == "Pawn" && Math.abs(previousMove[3] - previousMove[1]) == 2 && previousMove[1] == this.posY + forward * 2; 
    }

    clone() {
        return new Pawn(this.color, this.posX, this.posY);
    }
}