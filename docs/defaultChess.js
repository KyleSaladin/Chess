import { ChessLikeGame } from './chessLikeGame.js';
import { Pawn } from './pawn.js';
import { Bishop } from './standardPieces.js';
import { Rook } from './standardPieces.js';
import { Queen } from './standardPieces.js';
import { King } from './king.js';
import { Knight } from './standardPieces.js';

/**
 * Standard 8x8 chess game
 */
export class DefaultChess extends ChessLikeGame {
    constructor(posX, posY, tileSize) {
        super(posX, posY, 8, 8, tileSize);

        // Standard chess starting position
        this.layout = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR";

        this.pieceTypes = {
            r: (x, y) => new Rook("white", x, y),
            n: (x, y) => new Knight("white", x, y),
            b: (x, y) => new Bishop("white", x, y),
            q: (x, y) => new Queen("white", x, y),
            k: (x, y) => new King("white", x, y),
            p: (x, y) => new Pawn("white", x, y),
            R: (x, y) => new Rook("black", x, y),
            N: (x, y) => new Knight("black", x, y),
            B: (x, y) => new Bishop("black", x, y),
            Q: (x, y) => new Queen("black", x, y),
            K: (x, y) => new King("black", x, y),
            P: (x, y) => new Pawn("black", x, y)
        };

        this.variant = "defaultChess";

        this.generatePieces(this.layout);
    }

    generatePieces(layout) {
        // Place pieces from layout string
        // (Board array is already initialized in parent constructor)
        for (let i = 0; i < layout.length; i++) {
            const x = i % this.sizeX;
            const y = Math.floor(i / this.sizeX);
            const char = layout.charAt(i);

            if (char !== '-') {
                const piece = this.pieceTypes[char]?.(x, y);
                this.pieces[x][y] = piece;

                if (piece && piece.type === "King") {
                    this.assignKings(piece);
                }
            }
        }
    }
}