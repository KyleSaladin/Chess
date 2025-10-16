import { Piece } from "./piece.js";

export class Pawn extends Piece{
    constructor(color, posX, posY) {
        super("Pawn", color, posX, posY);
        this.hasMoved = false;
        this.spritePosition = 20;
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
        if (this.posX > 0 && board.pieces[x - 1][y + forward] != null && board.pieces[x - 1][y + forward].color != this.color) {
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
        let enPassantPiece = null;

        if (this.isEnPassant(previousMove)) {
            enPassantPiece = [tX, this.posY, board[tX][this.posY].hasMoved];
            board[tX][this.posY] = null;
        }

        this.hasMoved = true;
        super.move(tX, tY, board);
        return enPassantPiece;
    }

    isEnPassant(previousMove) {
        let forward = (this.color == "white") ? 1 : -1;
        return previousMove[4] == "Pawn" && Math.abs(previousMove[3] - previousMove[1]) == 2 && previousMove[1] == this.posY + forward * 2; 
    }

    getTypeChar() {
        if (this.color == "white") {
            return 'p';
        }
        return 'P';
    }
}