// ==================== COMPLETE SHOGI PIECES ====================
import { Piece } from './piece.js';
import { PromotablePiece } from './promotablePiece.js';
import { getSlideMoves } from './pieceMovementFunctions.js';

// Gold General - moves one square in any direction except diagonally backward
export class GoldGeneral extends Piece {
    constructor(color, posX, posY, type) {
        super(type ? type : "GoldGeneral", color, posX, posY);
    }
    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;
        const directions = this.color === "white" ?
            [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, 1]] : // White moves
            [[1, 0], [0, -1], [-1, 0], [0, 1], [1, -1], [-1, -1]]; // Black moves
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < board.sizeX && newY >= 0 && newY < board.sizeY) {
                const targetPiece = board.pieces[newX][newY];
                if (targetPiece == null || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }
        return moves;
    }

    getTypeChar() {
        return this.color === white ? 'g' : 'G';
    }
}

// Silver General - moves one square diagonally or straight forward
export class SilverGeneral extends PromotablePiece {
    constructor(color, posX, posY) {
        super("SilverGeneral", color, posX, posY, [DragonHorse], 6);
    }
    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;
        const directions = this.color === "black" ?
            [[1, -1], [0, -1], [-1, -1], [1, 1], [-1, 1]] : // White moves
            [[1, 1], [0, 1], [-1, 1], [1, -1], [-1, -1]]; // Black moves
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < board.sizeX && newY >= 0 && newY < board.sizeY) {
                const targetPiece = board.pieces[newX][newY];
                if (targetPiece == null || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }
        return moves;
    }

    getTypeChar() {
        return this.color === white ? 's' : 'S';
    }
}

// King - moves one square in any direction
export class ShogiKing extends Piece {
    constructor(color, posX, posY) {
        super("ShogiKing", color, posX, posY);

        if (this.color == "white") {
            this.image.src = "Sprites/ShogiKingWhite.png";
        }
        else {
            this.image.src = "Sprites/ShogiKingBlack.png";
        }
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

        return moves;
    }

    move(tX, tY, pieces, previousMove) {
        const oldX = this.posX;

        // Move the king
        super.move(tX, tY, pieces, previousMove);
    }

    /**
     * Checks if this king is in check
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
                console.log(`Checking piece at ${x},${y}: ${piece.type}`);
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
        console.log(array);
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

// Lance - moves any number of squares straight forward
export class Lance extends PromotablePiece {
    constructor(color, posX, posY) {
        super("Lance", color, posX, posY, [PromotedLance], 6);
    }
    getMoves(board) {
        const forward = this.color === "black" ? -1 : 1;
        return getSlideMoves(this, board, [[0, forward]]);
    }

    getTypeChar() {
        return this.color === white ? 'l' : 'L';
    }
}

// Knight - moves in an "L" shape forward (two forward, one sideways)
export class ShogiKnight extends PromotablePiece {
    constructor(color, posX, posY) {
        super("ShogiKnight", color, posX, posY, [PromotedKnight], 6);
    }
    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;
        const forward = this.color === "black" ? -1 : 1;
        const knightMoves = [
            [1, 2 * forward],
            [-1, 2 * forward]
        ];
        for (const [dx, dy] of knightMoves) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < board.sizeX && newY >= 0 && newY < board.sizeY) {
                const targetPiece = board.pieces[newX][newY];
                if (targetPiece == null || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }
        return moves;
    }

    getTypeChar() {
        return this.color === white ? 'n' : 'N';
    }
}

// Pawn - moves one square straight forward
export class ShogiPawn extends PromotablePiece {
    constructor(color, posX, posY) {
        super("ShogiPawn", color, posX, posY, [Tokin], 6);
    }
    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;
        const forward = this.color === "black" ? -1 : 1;
        const newY = y + forward;
        if (newY >= 0 && newY < board.sizeY) {
            const targetPiece = board.pieces[x][newY];
            if (targetPiece == null || targetPiece.color !== this.color) {
                moves.push([x, newY]);
            }
        }
        return moves;
    }

    getTypeChar() {
        return this.color === white ? 'p' : 'P';
    }
}

// Bishop - moves diagonally any number of squares (can promote to Dragon Horse)
export class ShogiBishop extends PromotablePiece {
    constructor(color, posX, posY) {
        super("ShogiBishop", color, posX, posY, [DragonHorse], 6);
    }
    getMoves(board) {
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        return getSlideMoves(this, board, directions);
    }
}

// Dragon Horse - promoted bishop, moves like bishop plus one square orthogonally
export class DragonHorse extends Piece {
    constructor(color, posX, posY) {
        super("DragonHorse", color, posX, posY);
    }
    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;

        // Bishop moves (diagonals)
        const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        moves.push(...getSlideMoves(this, baord, diagonals));

        // King moves (orthogonal, one square)
        const orthogonals = [[1, 0], [0, -1], [-1, 0], [0, 1]];
        for (const [dx, dy] of orthogonals) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < board.sizeX && newY >= 0 && newY < board.sizeY) {
                const targetPiece = board.pieces[newX][newY];
                if (targetPiece == null || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }
        return moves;
    }
    getTypeChar() {
        return this.color === white ? 'h' : 'H';
    }
}

// Rook - moves orthogonally any number of squares (can promote to Dragon King)
export class ShogiRook extends PromotablePiece {
    constructor(color, posX, posY) {
        super("ShogiRook", color, posX, posY, [DragonKing], 6);
    }
    getMoves(board) {
        const directions = [[1, 0], [0, -1], [-1, 0], [0, 1]];
        return getSlideMoves(this, board, directions);
    }

    getTypeChar() {
        return this.color === white ? 'r' : 'R';
    }
}

// Dragon King - promoted rook, moves like rook plus one square diagonally
export class DragonKing extends Piece {
    constructor(color, posX, posY) {
        super("DragonKing", color, posX, posY);
    }
    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;

        // Rook moves (orthogonals)
        const orthogonals = [[1, 0], [0, -1], [-1, 0], [0, 1]];
        moves.push(...getSlideMoves(this, baord, orthogonals));

        // King moves (diagonal, one square)
        const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dx, dy] of diagonals) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < board.sizeX && newY >= 0 && newY < board.sizeY) {
                const targetPiece = board.pieces[newX][newY];
                if (targetPiece == null || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }
        return moves;
    }

    getTypeChar() {
        return this.color === white ? 'd' : 'D';
    }
} 

//Promoted Silver General - moves like Gold General
export class PromotedSilverGeneral extends GoldGeneral {
    constructor(color, posX, posY) {
        super(color, posX, posY, "PromotedSilverGeneral");
    }

    getTypeChar() {
        return this.color === white ? 'z' : 'Z';
    }
}

//Promoted Knight - moves like Gold General
export class PromotedKnight extends GoldGeneral {
    constructor(color, posX, posY) {
        super(color, posX, posY, "PromotedKnight");
    }

    getTypeChar() {
        return this.color === white ? 'm' : 'M';
    }
}

//Promoted Lance - moves like Gold General
export class PromotedLance extends GoldGeneral {
    constructor(color, posX, posY) {
        super(color, posX, posY, "PromotedLance");
    }
    getTypeChar() {
        return this.color === white ? 'v' : 'V';
    }
}

//Tokin - promoted pawn, moves like Gold General
export class Tokin extends GoldGeneral {
    constructor(color, posX, posY) {
        super(color, posX, posY, "Tokin");
    }
    getTypeChar() {
        return this.color === white ? 't' : 'T';
    }
}