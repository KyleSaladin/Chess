
export class Board {
    constructor(posX, posY, sizeX, sizeY, tileSize) {
        this.posX = posX;
        this.posY = posY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.tileSize = tileSize

        this.pieces = [];

        this.previousX = -1;
        this.previousY = -1;

        this.moves = [];
    }

    draw(ctx, lightColor, darkColor, highlightColor) {
        this.drawBoard(ctx, lightColor, darkColor);
        for (let move of this.moves) {
            if (!move) {
                continue;
            }
            ctx.fillStyle = highlightColor;

            ctx.fillRect(move[0] * this.tileSize, move[1] * this.tileSize, this.tileSize, this.tileSize);
        }

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

    generatePieces() {
    }

    getPieces() {

    }

    drawPieces(ctx, lightColor, darkColor) {
        for (let row of this.pieces) {
            for (let piece of row) {
                if (piece != null) {
                    piece.draw(ctx, this.tileSize, lightColor, darkColor);
                }
            }
        }
    }

    getPieceMoves(x, y) {
        if (x < 0 || x > this.sizeX - 1 || y < 0 || y > this.sizeY - 1) {
            return [];
        }
        if (this.pieces[x][y] != null) {
            return this.pieces[x][y].getMoves(this);
        }
        return [];
    }

    movePiece(fX, fY, tX, tY) {
        if (this.containsArray(this.moves, [tX, tY])) {
            const piece = this.pieces[fX][fY];
            piece.move(tX, tY, this.pieces);
            return true;
        }
        return false;
    }

    containsArray(array, pair) {
        return array.some(sub =>
            sub.length === pair.length && sub.every((val, i) => val === pair[i])
        );
    }

    onClick(event) {

        const x = Math.ceil(event.clientX / this.tileSize) - 1;
        const y = Math.ceil(event.clientY / this.tileSize) - 1;
        console.log(x + ", " + y);
        if (event.button == 0) {
            if (this.moves.length == 0) {
                this.moves = this.getPieceMoves(x, y);
            }
            else {
                let move = this.movePiece(this.previousX, this.previousY, x, y, this.moves);
                if (move == false) {
                    this.moves = this.getPieceMoves(x, y);
                }
                this.moves = [];
            }
            this.previousX = Math.ceil(event.clientX / this.tileSize) - 1;
            this.previousY = Math.ceil(event.clientY / this.tileSize) - 1;
        }
    }
}