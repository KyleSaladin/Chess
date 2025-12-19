import { Piece } from "./piece.js";
import { getSlideMoves } from "./pieceMovementFunctions.js";

/**
 * King piece - can move one square in any direction, can castle
 */
export class King extends Piece {
    constructor(color, posX, posY) {
        super("King", color, posX, posY);
        this.hasMoved = false;
    }

    getMoves(board) {
        // Normal king moves (one square in any direction)
        const moves = getSlideMoves(
            this,
            board,
            [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]],
            1,
            false
        );

        // Check for castling opportunities
        if (!this.hasMoved) {
            // Queenside castling (left)
            const leftRook = board.pieces[0][this.posY];
            if (leftRook && leftRook.type === "Rook" && !leftRook.hasMoved) {
                let canCastle = true;

                // Check if squares between king and rook are empty
                for (let x = 1; x < this.posX; x++) {
                    if (board.pieces[x][this.posY] != null) {
                        canCastle = false;
                        break;
                    }
                }

                if (canCastle) {
                    moves.push([this.posX - 2, this.posY]);
                }
            }

            // Kingside castling (right)
            const rightRook = board.pieces[board.sizeX - 1][this.posY];
            if (rightRook && rightRook.type === "Rook" && !rightRook.hasMoved) {
                let canCastle = true;

                // Check if squares between king and rook are empty
                for (let x = this.posX + 1; x < board.sizeX - 1; x++) {
                    if (board.pieces[x][this.posY] != null) {
                        canCastle = false;
                        break;
                    }
                }

                if (canCastle) {
                    moves.push([this.posX + 2, this.posY]);
                }
            }
        }

        return moves;
    }

    move(tX, tY, pieces, previousMove) {
        const oldX = this.posX;

        // Move the king
        super.move(tX, tY, pieces, previousMove);

        // Handle castling - move the rook
        if (Math.abs(tX - oldX) === 2) {
            if (tX > oldX) {
                // Kingside castle
                console.log(pieces)
                const rook = pieces[pieces.length - 1][tY];
                if (rook) {
                    rook.move(tX - 1, tY, pieces, previousMove);
                }
            } else {
                // Queenside castle
                const rook = pieces[0][tY];
                if (rook) {
                    rook.move(tX + 1, tY, pieces, previousMove);
                }
            }
        }

        this.hasMoved = true;
    }

    /**
     * Checks if this king is in check
     * @param {Board} board - The game board
     * @param {Array} previousMove - The previous move made
     * @param {number} newX - Optional: check this X position instead of current
     * @param {number} newY - Optional: check this Y position instead of current
     */
    isInCheck(board, previousMove, newX, newY) {
        // Use provided position or current position
        const kingX = newX != null ? newX : this.posX;
        const kingY = newY != null ? newY : this.posY;

        // Check all enemy pieces
        for (let y = 0; y < board.sizeY; y++) {
            for (let x = 0; x < board.sizeX; x++) {
                const piece = board.pieces[x][y];

                if (!piece || piece.color === this.color) {
                    continue;
                }

                const moves = piece.getMoves(board, previousMove);

                // Check if any move targets the king
                if (this.containsArray(moves, [kingX, kingY])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Helper function to check if an array contains a specific coordinate pair
     */
    containsArray(array, pair) {
        if (array.length === 0) return false;

        return array.some(sub =>
            sub.length === pair.length &&
            sub.every((val, i) => val === pair[i])
        );
    }

    getTypeChar() {
        return this.color === "white" ? 'k' : 'K';
    }
}