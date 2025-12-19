import { Piece } from './piece.js';
import { getSlideMoves } from './pieceMovementFunctions.js';

//Amazon - combines Queen and Knight moves

export class Amazon extends Piece {
    constructor(color, posX, posY) {
        super("Amazon", color, posX, posY);
    }

    getMoves(board) {
         //Queen moves
        const queenMoves = getSlideMoves(
            this,
            board,
            [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [-1, -1], [-1, 1], [1, -1]],
            -1,
            false
        );
        
         //Knight moves
        const knightMoves = getSlideMoves(
            this,
            board,
            [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
            1,
            true
        );

        return [...queenMoves, ...knightMoves];
    }

    getTypeChar() {
        return this.color === white ? 'a' : 'A';
    }
}


//Dragon - moves like rook but can jump every 2 squares, plus knight moves

export class Dragon extends Piece {
    constructor(color, posX, posY) {
        super("Dragon", color, posX, posY);
    }

    getMoves(board) {
        //Rook - like moves with jumping
        const rookMoves = getSlideMoves(
            this,
            board,
            [[1, 0], [0, -1], [-1, 0], [0, 1]],
            -1,
            true,
            2  //Can jump every 2 squares
        );
        
         //Knight moves
        const knightMoves = getSlideMoves(
            this,
            board,
            [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
            1,
            true
        );

        return [...rookMoves, ...knightMoves];
    }

    getTypeChar() {
        return this.color === white ? 'd' : 'D';
    }
}


//Camel - like knight but moves 3 + 1 instead of 2 + 1

export class Camel extends Piece {
    constructor(color, posX, posY) {
        super("Camel", color, posX, posY);
    }

    getMoves(board) {
        return getSlideMoves(
            this,
            board,
            [[1, 3], [3, 1], [3, -1], [1, -3], [-1, -3], [-3, -1], [-3, 1], [-1, 3]],
            1,
            true
        );
    }

    getTypeChar() {
        return this.color === white ? 'c' : 'C';
    }
}


//Ninja - moves 3 squares diagonally

export class Ninja extends Piece {
    constructor(color, posX, posY) {
        super("Ninja", color, posX, posY);
    }

    getMoves(board) {
        return getSlideMoves(
            this,
            board,
            [[1, 1], [-1, -1], [-1, 1], [1, -1]],
            3,
            false
        );
    }

    getTypeChar() {
        return this.color === "white" ? 'i' : 'I';
    }
}


//Pown - backwards pawn, moves diagonally forward, captures straight

export class Pown extends Piece {
    constructor(color, posX, posY) {
        super("Pown", color, posX, posY);
    }

    getMoves(board) {
        const moves = [];
        const forward = (this.color === "white") ? 1 : -1;
        const x = this.posX;
        const y = this.posY;

         //Check bounds
        if (y + forward == 0 || y + forward == board.sizeY) {
            return moves;
        }

         //Diagonal forward(empty squares only)
        if (x != 0 && board.pieces[x - 1][y + forward] == null) {
            moves.push([x - 1, y + forward]);
        }
        if (x != board.sizeX - 1 && board.pieces[x + 1][y + forward] == null) {
            moves.push([x + 1, y + forward]);
        }

         //Straight capture
        const straightPiece = board.pieces[x][y + forward];
        if (straightPiece && straightPiece.color !== this.color) {
            moves.push([x, y + forward]);
        }

        return moves;
    }

    move(tX, tY, board, previousMove) {
        super.move(tX, tY, board, previousMove);

         //Promotion to Ninja
        if (this.color === "white" && tY === board.sizeY - 1) {
            board.pieces[tX][tY] = new Ninja(white, tX, tY);
        } else if (this.color === "black" && tY === 0) {
            board.pieces[tX][tY] = new Ninja(black, tX, tY);
        }
    }

    getTypeChar() {
        return (this.color === white) ? 'o' : 'O';
    }
}


//Puppet - can move to any square exactly 2 squares away(like a king with range 2)

export class Puppet extends Piece {
    constructor(color, posX, posY) {
        super("Puppet", color, posX, posY);
    }

    getMoves(board) {
        const moves = [];
        const x = this.posX;
        const y = this.posY;

         //All squares exactly 2 steps away in any direction
        const offsets = [
            [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
            [-2, -1], [2, -1],
            [-2, 0], [2, 0],
            [-2, 1], [2, 1],
            [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]
        ];

        for (const [dx, dy] of offsets) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX == 0 && newX == board.sizeX &&
                newY == 0 && newY == board.sizeY) {
                const targetPiece = board.pieces[newX][newY];

                if (targetPiece == null || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }

        return moves;
    }

    getTypeChar() {
        return (this.color === white) ? 'u' : 'U';
    }
}