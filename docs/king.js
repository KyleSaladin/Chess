import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

export class King extends Piece {
    constructor(color, posX, posY) {
        super("King", color, posX, posY);

        this.hasMoved = false;
        this.spritePosition = 80;
    }

    getMoves(board) {
        let castleLeft = true;
        let castleRight = true;
        let moves = getSlideMoves(this, board, [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]], 1, false);

        if (board.pieces[0][this.posY] != null && board.pieces[0][this.posY].type == "Rook") {
            if (board.pieces[0][this.posY].hasMoved == false && this.hasMoved == false) {
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
            if (board.pieces[board.sizeX - 1][this.posY].hasMoved == false && this.hasMoved == false) {
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
        return moves;
    }


    move(tX, tY, board) {
        super.move(tX, tY, board);

        if (tX == this.posX + 2) {
            let rook = board[board.length - 1][tY];
            rook.move(tX - 1, tY, board);
        }

        if (tX == this.posX - 2) {
            let rook = board[0][tY]
            rook.move(tX + 1, tY, board);
        }

        this.hasMoved = true;
    }


    isInCheck(board, previousMove, newX, newY) {
        for (let y = 0; y < board.sizeY; y++) {
            for (let x = 0; x < board.sizeX; x++) {
                let piece = board.pieces[x][y];
                if (piece == null || piece.color == this.color) {
                    continue;
                }
                let moves = piece.getMoves(board, previousMove);

                let kingPosX = this.posX;
                let kingPosY = this.posY;

                if (newX != null || newY != null) {
                    kingPosX = newX;
                    kingPosY = newY;
                }

                if (this.containsArray(moves, [kingPosX, kingPosY])) {
                    return true;
                }
            }
        }
        return false;
    }

    containsArray(array, pair) {
        if (array.length == 0) {
            return false;
        }
        return array.some(sub =>
            sub.length === pair.length && sub.every((val, i) => val === pair[i])
        );
    }

    getTypeChar() {
        if (this.color == "white") {
            return 'k';
        }
        return 'K';
    }
}