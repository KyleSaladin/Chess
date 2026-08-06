
// ==================== SHOGI GAME BOARD ====================
import { ChessLikeGame } from './chessLikeGame.js';
import { DragonHorse, ShogiKing, Tokin } from './shogiPieces.js';
import { GoldGeneral } from './shogiPieces.js';
import { SilverGeneral } from './shogiPieces.js';
import { ShogiBishop } from './shogiPieces.js';
import { ShogiRook } from './shogiPieces.js';
import { ShogiKnight } from './shogiPieces.js';
import { ShogiPawn } from './shogiPieces.js';
import { Lance } from './shogiPieces.js';


/**
 * Standard 9x9 Shogi game
 */
export class ShogiGame extends ChessLikeGame {
    constructor(posX, posY, tileSize) {
        super(posX, posY, 9, 9, tileSize);

        // Shogi starting position (9x9 board)
        // Layout from white's perspective (bottom to top):
        // l = lance, n = knight, s = silver, g = gold, k = king, b = bishop, r = rook, p = pawn
        // Uppercase for black pieces
        this.layout =
            "lnsgkgsnl" +
            "-r-----b-" +
            "ppppppppp" +
            "---------" +
            "---------" +
            "---------" +
            "PPPPPPPPP" +
            "-B-----R-" +
            "LNSGKGSNL"

        this.pieceTypes = {
            // White pieces (lowercase)
            l: (x, y) => new Lance("white", x, y),
            n: (x, y) => new ShogiKnight("white", x, y),
            s: (x, y) => new SilverGeneral("white", x, y),
            g: (x, y) => new GoldGeneral("white", x, y),
            k: (x, y) => new ShogiKing("white", x, y),
            b: (x, y) => new ShogiBishop("white", x, y),
            r: (x, y) => new ShogiRook("white", x, y),
            p: (x, y) => new ShogiPawn("white", x, y),
            h: (x, y) => new DragonHorse("white", x, y), // Promoted Bishop
            d: (x, y) => new DragonKing("white", x, y), // Promoted Rook
            z: (x, y) => new PromotedSilverGeneral("white", x, y), // Promoted Silver
            m: (x, y) => new PromotedKnight("white", x, y), // Promoted Knight
            v: (x, y) => new PromotedLance("white", x, y), // Promoted Lance
            t: (x, y) => new Tokin("white", x, y), // Promoted Pawn

            // Black pieces (uppercase)
            L: (x, y) => new Lance("black", x, y),
            N: (x, y) => new ShogiKnight("black", x, y),
            S: (x, y) => new SilverGeneral("black", x, y),
            G: (x, y) => new GoldGeneral("black", x, y),
            K: (x, y) => new ShogiKing("black", x, y),
            B: (x, y) => new ShogiBishop("black", x, y),
            R: (x, y) => new ShogiRook("black", x, y),
            P: (x, y) => new ShogiPawn("black", x, y),
            H: (x, y) => new DragonHorse("black", x, y), // Promoted Bishop
            D: (x, y) => new DragonKing("black", x, y), // Promoted Rook
            Z: (x, y) => new PromotedSilverGeneral("black", x, y), // Promoted Silver
            M: (x, y) => new PromotedKnight("black", x, y), // Promoted Knight
            V: (x, y) => new PromotedLance("black", x, y), // Promoted Lance
            T: (x, y) => new Tokin("black", x, y) // Promoted Pawn
        };

        this.variant = "shogi";

        this.generatePieces(this.layout);
    }

    generatePieces(layout) {
        // Place pieces from layout string
        for (let i = 0; i < layout.length; i++) {
            const x = i % this.sizeX;
            const y = Math.floor(i / this.sizeX);
            const char = layout.charAt(i);

            if (char !== '-') {
                const piece = this.pieceTypes[char]?.(x, y);
                this.pieces[x][y] = piece;

                if (piece && (piece.type === "ShogiKing")) {
                    console.log("Assigning king:", piece);
                    this.assignKings(piece);
                }
            }
        }
    }
}