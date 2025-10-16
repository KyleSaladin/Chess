import { Board } from './board.js';
import { Pawn } from './pawn.js';
import { Bishop } from './bishop.js';
import { Rook } from './rook.js';
import { Queen } from './queen.js';
import { King } from './king.js';
import { Knight } from './knight.js';

export class DefaultBoard extends Board {

    constructor(posX, posY, tileSize) {
        super(posX, posY, 8, 8, tileSize);

        this.layout = "rnbkqbnrpppppppp--------------------------------PPPPPPPPRNBKQBNR"; //"rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR";

        this.pieceTypes = {
            r: (row, col) => new Rook("white", row, col),
            n: (row, col) => new Knight("white", row, col),
            b: (row, col) => new Bishop("white", row, col),
            q: (row, col) => new Queen("white", row, col),
            k: (row, col) => new King("white", row, col),
            p: (row, col) => new Pawn("white", row, col),
            R: (row, col) => new Rook("black", row, col),
            N: (row, col) => new Knight("black", row, col),
            B: (row, col) => new Bishop("black", row, col),
            Q: (row, col) => new Queen("black", row, col),
            K: (row, col) => new King("black", row, col),
            P: (row, col) => new Pawn("black", row, col)
        }

        this.generatePieces(this.layout);
    }

    generatePieces(layout) {
        for (let y = 0; y < 8; y++) {
            this.pieces[y] = [];
            for (let x = 0; x < 8; x++) {
                this.pieces[y][x] = null;
            }
        }

        for (let i = 0; i < this.layout.length; i++) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            const char = layout.charAt(i);
            this.pieces[x][y] = this.pieceTypes[char]?.(x, y) || null;
            if (this.pieces[x][y] != null && this.pieces[x][y].type == "King") {
                this.assignKings(this.pieces[x][y]);
            }
        }
    }

    tempMovePiece(fX, fY, tX, tY) {
        const piece = this.pieces[fX][fY];

        if (piece.type == "Pawn") {
            const moved = piece.moved;
            let enPassantCapturePosition = piece.move(tX, tY, this.pieces, this.previousMove);
            if (enPassantCapturePosition != null) {
                this.pieces[enPassantCapturePosition[0]][enPassantCapturePosition[1]] = new Pawn(((piece.color == "black") ? "white" : "black"), enPassantCapturePosition[0], enPassantCapturePosition[1]);
                this.pieces[enPassantCapturePosition[0]][enPassantCapturePosition[1]].hasMoved = enPassantCapturePosition[2];
            }
            piece.hasMoved = moved;
        }
        else {
            this.pieces[tX][tY] = piece;
            this.pieces[fX][fY] = null;
        }
    }
}
