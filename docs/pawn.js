import { PromotablePiece } from "./promotablePiece.js";
import { Queen } from './standardPieces.js';
import { Knight } from './standardPieces.js';
import { Rook } from './standardPieces.js';
import { Bishop } from './standardPieces.js';

import { showPromotionPopup } from "./main.js";

/**
 * Pawn piece - moves forward, captures diagonally, can promote
 */
export class Pawn extends PromotablePiece {
    constructor(color, posX, posY) {
        super("Pawn", color, posX, posY, [ Queen, Knight, Rook, Bishop ], 8);
        this.hasMoved = false;
    }

    getMoves(board, previousMove) {
        const moves = [];
        const forward = this.color === "white" ? 1 : -1;
        const x = this.posX;
        const y = this.posY;

        // Forward one square
        if (y + forward >= 0 && y + forward < board.sizeY) {
            if (board.pieces[x][y + forward] == null) {
                moves.push([x, y + forward]);

                // Forward two squares (first move only)
                if (!this.hasMoved &&
                    y + forward * 2 >= 0 &&
                    y + forward * 2 < board.sizeY &&
                    board.pieces[x][y + forward * 2] == null) {
                    moves.push([x, y + forward * 2]);
                }
            }
        }

        // Diagonal captures
        if (x > 0 && y + forward >= 0 && y + forward < board.sizeY) {
            const diagLeft = board.pieces[x - 1][y + forward];
            if (diagLeft && diagLeft.color !== this.color) {
                moves.push([x - 1, y + forward]);
            }
        }

        if (x < board.sizeX - 1 && y + forward >= 0 && y + forward < board.sizeY) {
            const diagRight = board.pieces[x + 1][y + forward];
            if (diagRight && diagRight.color !== this.color) {
                moves.push([x + 1, y + forward]);
            }
        }

        // En passant
        if (previousMove && this.isEnPassant(previousMove)) {
            if (previousMove[0] === x - 1) {
                moves.push([x - 1, y + forward]);
            }
            if (previousMove[0] === x + 1) {
                moves.push([x + 1, y + forward]);
            }
        }

        return moves;
    }

    /**
     * Override getCapturedPiece for en passant
     */
    getCapturedPiece(move, x, y, pieces) {
        // En passant capture
        if (Math.abs(move[0] - x) === 1 && pieces[move[0]][move[1]] == null) {
            return pieces[move[0]][y];
        }
        return pieces[move[0]][move[1]];
    }

    async move(tX, tY, pieces, previousMove) {
        // Handle en passant capture
        if (previousMove && this.isEnPassant(previousMove)) {
            if (Math.abs(tX - this.posX) === 1 && pieces[tX][tY] == null) {
                pieces[tX][this.posY] = null;
            }
        }

        // Move the pawn
        super.move(tX, tY, pieces, previousMove);
        this.hasMoved = true;


        await this.tryPromote(tX, tY, pieces)
        return true;
    }

    async tryPromote(tX, tY, pieces) {
        const shouldPromote = (this.color === "white" && tY === pieces[0].length - 1) ||
            (this.color === "black" && tY === 0);

        if (shouldPromote) {
            // Show promotion popup and wait for selection
            const SelectedPieceClass = await showPromotionPopup(this.color, this.promotionPieces);

            // Create the promoted piece
            pieces[tX][tY] = new SelectedPieceClass(this.color, tX, tY);
        }
    }

    /**
     * Checks if en passant is possible
     */
    isEnPassant(previousMove) {
        if (!previousMove || previousMove[4] !== "Pawn") return false;

        const forward = this.color === "white" ? 1 : -1;

        // Check if enemy pawn moved two squares and is adjacent
        return Math.abs(previousMove[3] - previousMove[1]) === 2 &&
            previousMove[3] === this.posY &&
            Math.abs(previousMove[2] - this.posX) === 1;
    }

    getTypeChar() {
        return this.color === "white" ? 'p' : 'P';
    }
}