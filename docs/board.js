
export class Board {
    constructor(posX, posY, sizeX, sizeY, tileSize) {
        this.posX = posX;
        this.posY = posY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.tileSize = tileSize

        this.turn = 1;

        this.pieces = [];

        this.previousX = -1;
        this.previousY = -1;

        this.moves = [];

        this.previousMove = [];

        this.clientColor = "spectator";
    }

    draw(ctx, lightColor, darkColor, highlightColor) {
        this.drawBoard(ctx, lightColor, darkColor);
        this.drawBoardHighlights(ctx, highlightColor);
        this.drawPieces(ctx, lightColor, darkColor);
    }

    drawBoard(ctx, lightColor, darkColor) {
        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                let odd = (x + y) % 2;
                if (odd) {
                    ctx.fillStyle = darkColor;
                }
                else {
                    ctx.fillStyle = lightColor;
                }

                ctx.fillRect(this.posX + (x * this.tileSize), this.posY + (y * this.tileSize), this.tileSize, this.tileSize);
            }
        }
    }

    drawBoardHighlights(ctx, highlightColor) {
        if (this.previousMove != []) {
            ctx.fillStyle = highlightColor;

            let flippedStartX = this.sizeX - 1 - this.previousMove[0];
            let flippedStartY = this.sizeY - 1 - this.previousMove[1];
            let previousFlippedStartX = this.sizeX - 1 - this.previousMove[2];
            let previousFlippedStartY = this.sizeY - 1 - this.previousMove[3];

            if (this.clientColor == "black") {
                ctx.fillRect(this.previousMove[0] * this.tileSize, this.previousMove[1] * this.tileSize, this.tileSize, this.tileSize);
                ctx.fillRect(this.previousMove[2] * this.tileSize, this.previousMove[3] * this.tileSize, this.tileSize, this.tileSize);
            }
            else {
                ctx.fillRect(flippedStartX * this.tileSize, flippedStartY * this.tileSize, this.tileSize, this.tileSize);
                ctx.fillRect(previousFlippedStartX * this.tileSize, previousFlippedStartY * this.tileSize, this.tileSize, this.tileSize);
            }
        }
        for (let move of this.moves) {
            if (!move) {
                continue;
            }
            ctx.fillStyle = highlightColor;


            if (this.clientColor == "black") {
                ctx.fillRect(move[0] * this.tileSize, move[1] * this.tileSize, this.tileSize, this.tileSize);
            }
            else {
                let flippedStartX = this.sizeX - 1 - move[0];
                let flippedStartY = this.sizeY - 1 - move[1];
                ctx.fillRect(flippedStartX * this.tileSize, flippedStartY * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    drawPieces(ctx, lightColor, darkColor) {
        for (let row of this.pieces) {
            for (let piece of row) {
                if (piece != null) {
                    piece.draw(ctx, this.tileSize, lightColor, darkColor, this.clientColor, this.sizeX, this.sizeY);
                }
            }
        }
    }

    assignKings(piece) {
        if (piece.color == "white") {
            this.whiteKing = piece;
        }
        if (piece.color == "black") {
            this.blackKing = piece;
        }
    }

    getPieceMoves(x, y) {
        if (x < 0 || x > this.sizeX - 1 || y < 0 || y > this.sizeY - 1) {
            return [];
        }
        if (this.pieces[x][y] != null) {
            if ((this.turn == 1 && this.pieces[x][y].color == "white" && (this.clientColor == "white" || this.clientColor == "both")) || (this.turn == -1 && this.pieces[x][y].color == "black" && (this.clientColor == "black" || this.clientColor == "both"))) {
                return this.pieces[x][y].getMoves(this, this.previousMove);
            }
        }
        return [];
    }

    movePiece(fX, fY, tX, tY, previousMove) {
        if (this.containsArray(this.moves, [tX, tY])) {


            const piece = this.pieces[fX][fY];
            piece.move(tX, tY, this.pieces, previousMove);
            this.turn *= -1;
            this.previousMove = [fX, fY, tX, tY, piece.type];
            return true;
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

    onClick(event) {
        let potentialMoves = [];

        let data = null;
        const lastPreviousMove = this.previousMove;

        // Get the position of the click in terms of board coordinates
        let x = Math.ceil(event.clientX / this.tileSize) - 1;
        let y = Math.ceil(event.clientY / this.tileSize) - 1;

        // Adjust for board orientation
        if (this.clientColor != "black") {
            x = this.sizeX - x-1;
            y = this.sizeY - y-1;
        }

        //If left click
        if (event.button == 0) {
            // If no piece is selected, select the piece and show its moves
            if (this.moves.length == 0) {
                potentialMoves = this.getPieceMoves(x, y);
            }
            // If a piece is already selected, try to move it to the clicked position
            else {
                //Attempt to move the piece
                let move = this.movePiece(this.previousX, this.previousY, x, y, this.previousMove);
                if (move == false) { //If the move was invalid, select the new piece and show its moves
                    potentialMoves = this.getPieceMoves(x, y);
                }
                else { //If the move was valid clear the moves
                    this.moves = [];
                    //If the move was valid, return the move data
                    data = [this.previousMove, lastPreviousMove];
                }
            }
        }
        //Store previous selected piece
        this.moves = this.validateMoves(potentialMoves, x, y);
        this.previousX = x;
        this.previousY = y;
        return data;
    }

    movePieceWithoutValidation(move) {
        if (move == null) {
            return;
        }
        const piece = this.pieces[move[0][0]][move[0][1]];
        if (piece == null) {
            return;
        }
        piece.move(move[0][2], move[0][3], this.pieces, move[1]);
        this.turn *= -1;
        this.previousMove = [move[0][0], move[0][1], move[0][2], move[0][3], piece.type];
    }

    validateMoves(potentialMoves, x, y) {
        let validMoves = [];
        for (let move of potentialMoves) {
            if (!this.willBeInCheck(move, x, y)) {
                validMoves.push(move);
            }
        }
        return validMoves;
    }

    willBeInCheck(move, x, y) {
        const capturedPiece = this.pieces[move[0]][move[1]];
        const piece = this.pieces[x][y];
        //console.log("Check for check:\n---------------------");
        //console.table(this.pieces);
        this.tempMovePiece(x, y, move[0], move[1]);
        let inCheck = this.checkForCheck(piece, move);
        this.tempMovePiece(move[0], move[1], x, y);
        //console.log("---------------------------------------");
        this.pieces[move[0]][move[1]] = capturedPiece;
        return inCheck;
    }

    validateMoves(potentialMoves, x, y) {
        let validMoves = [];
        for (let move of potentialMoves) {
            if (!this.willBeInCheck(move, x, y)) {
                validMoves.push(move);
            }
        }
        return validMoves;
    }

    willBeInCheck(move, x, y) {
        const capturedPiece = this.pieces[move[0]][move[1]];
        const piece = this.pieces[x][y];
        //console.log("Check for check:\n---------------------");
        //console.table(this.pieces);
        this.tempMovePiece(x, y, move[0], move[1]);
        let inCheck = this.checkForCheck(piece, move);
        this.tempMovePiece(move[0], move[1], x, y);
        //console.log("---------------------------------------");
        this.pieces[move[0]][move[1]] = capturedPiece;
        return inCheck;
    }


    tempMovePiece(fX, fY, tX, tY) {
        const piece = this.pieces[fX][fY];

        this.pieces[tX][tY] = piece;
        this.pieces[fX][fY] = null;
    }

    checkForCheck(piece, move) {
        if (this.turn == 1) {
            if (piece.type == "King") {
                return this.whiteKing.isInCheck(this, this.previousMove, move[0], move[1]);
            }
            return this.whiteKing.isInCheck(this, this.previousMove);
        }
        else {
            if (piece.type == "King") {
                return this.blackKing.isInCheck(this, this.previousMove, move[0], move[1]);
            }
            return this.blackKing.isInCheck(this, this.previousMove);
        }
    }
}
