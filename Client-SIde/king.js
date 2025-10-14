import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class King extends Piece {
    constructor(color, posX, posY) {
        super("King", color, posX, posY);

        this.hasMoved = false;
    }

    draw(ctx, size, lightColor, darkColor) {
        this.drawPiece(ctx, size, 80, lightColor, darkColor);
    }

    getMoves(board) {
        let castleLeft = true;
        let castleRight = true;
        let moves = getSlideMoves(this, board, [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]], 1, false);

        if (board.pieces[0][this.posY] != null && board.pieces[0][this.posY].type == "Rook") {
            if (board.pieces[0][this.posY].hasMoved == false) {
                for (let i = 1; i < this.posX; i++) {
                    if (board.pieces[i][this.posY] != null) {
                        castleLeft = false;
                    }
                }
                if (castleLeft) {
                    moves.push([this.posX - 2, this.posY]);
                }
            }
        }
        if (board.pieces[board.sizeX - 1][this.posY] != null && board.pieces[board.sizeX-1][this.posY].type == "Rook") {
            if (board.pieces[board.sizeX - 1][this.posY].hasMoved == false) {
                for (let i = board.sizeX - 2; i > this.posX; i--) {
                    if (board.pieces[i][this.posY] != null) {
                        castleRight = false;
                    }
                }
                if (castleRight) {
                    moves.push([this.posX + 2, this.posY]);
                }
            }
        }

        console.log(moves);
        return moves;
    }


    move(tX, tY, board) {
        board[this.posX][this.posY] = null;
        board[tX][tY] = this;

        if (tX == this.posX + 2) {
            let rook = board[board.length - 1][tY];
            rook.move(tX - 1, tY, board);
        }

        if (tX == this.posX - 2) {
            let rook = board[0][tY]
            rook.move(tX + 1, tY, board);
        }

        this.posX = tX;
        this.posY = tY;

        if (this.type == "Pawn" || this.type == "King" || this.type == "Rook") {
            this.moved = true;
        }
    }
}