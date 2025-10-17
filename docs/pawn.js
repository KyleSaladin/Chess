import { Piece } from "./piece.js";
import { Queen } from './queen.js';

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
            if (!this.hasMoved && board.pieces[x][this.posY + forward *  2] == null) {
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

    getCapturedPiece(move, x, y) {
        if (Math.abs(move[0] - x) == 1 && Math.abs(move[1] - y) == 1) {
            return this.pieces[move[0]][y];
        }
        super.getCapturedPiece(move, x, y);
    }

    move(tX, tY, board, previousMove) {
        if (this.isEnPassant(previousMove)) {
            board[tX][this.posY] = null;
        }
        super.move(tX, tY, board, previousMove);
        this.hasMoved = true;

        console.log("Pawn moved to", tX, tY, ",   Is it at: ", board.length - 1, '?');

        if (this.color == "white" && tY == board.length - 1) {
            console.log("Promote white pawn");

            board[tX][tY] = new Queen("white", tX, tY);
        }
        if (this.color == "black" && tY == 0) {
            console.log("Promote black pawn");
            board[tX][tY] = new Queen("black", tX, tY);
        }
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