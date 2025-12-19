import { ChessLikeGame } from './chessLikeGame.js';
import { Pawn } from './pawn.js';
import { Bishop } from './standardPieces.js';
import { Rook } from './standardPieces.js';
import { Queen } from './standardPieces.js';
import { King } from './king.js';
import { Knight } from './standardPieces.js';
import { Dragon } from './customPieces.js';
import { Pown } from './customPieces.js';
import { Puppet } from './customPieces.js';
import { Amazon } from './customPieces.js';
import { Camel } from './customPieces.js';


/**
 * PowChess - custom 11x10 variant with special pieces
 */
export class PowChess extends ChessLikeGame {
    constructor(posX, posY, tileSize) {
        super(posX, posY, 11, 10, tileSize);

        // PowChess starting position
        // r=Rook, d=Dragon, c=Camel, b=Bishop, a=Amazon, k=King, q=Queen
        // p=Pawn, o=Pown, u=Puppet
        this.layout =
            "rdcbakqbcdr" +
            "popopppopop" +
            "-----------" +
            "-----------" +
            "-----------" +
            "-----------" +
            "-----------" +
            "-----------" +
            "POPOPPPOPOP" +
            "RDCBAKQBCDR";

        this.pieceTypes = {
            // White pieces (lowercase)
            r: (x, y) => new Rook("white", x, y),
            d: (x, y) => new Dragon("white", x, y),
            b: (x, y) => new Bishop("white", x, y),
            q: (x, y) => new Queen("white", x, y),
            k: (x, y) => new King("white", x, y),
            p: (x, y) => new Pawn("white", x, y),
            o: (x, y) => new Pown("white", x, y),
            u: (x, y) => new Puppet("white", x, y),
            a: (x, y) => new Amazon("white", x, y),
            c: (x, y) => new Camel("white", x, y),
            n: (x, y) => new Knight("white", x, y),

            // Black pieces (uppercase)
            R: (x, y) => new Rook("black", x, y),
            D: (x, y) => new Dragon("black", x, y),
            B: (x, y) => new Bishop("black", x, y),
            Q: (x, y) => new Queen("black", x, y),
            K: (x, y) => new King("black", x, y),
            P: (x, y) => new Pawn("black", x, y),
            O: (x, y) => new Pown("black", x, y),
            U: (x, y) => new Puppet("black", x, y),
            A: (x, y) => new Amazon("black", x, y),
            C: (x, y) => new Camel("black", x, y),
            N: (x, y) => new Knight("black", x, y)
        };

        this.variant = "powChess";

        this.generatePieces(this.layout);
    }

    generatePieces(layout) {
        // Initialize empty board
        for (let x = 0; x < this.sizeX; x++) {
            this.pieces[x] = [];
            for (let y = 0; y < this.sizeY; y++) {
                this.pieces[x][y] = null;
            }
        }

        // Place pieces from layout string
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