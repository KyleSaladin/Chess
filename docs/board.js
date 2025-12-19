/**
 * Base Board class for rendering chess-like games
 * Handles drawing the board, highlights, and pieces
 */
export class Board {
    constructor(posX, posY, sizeX, sizeY, tileSize) {
        this.posX = posX; // X position offset on canvas
        this.posY = posY; // Y position offset on canvas
        this.sizeX = sizeX; // Board width in squares
        this.sizeY = sizeY; // Board height in squares
        this.tileSize = tileSize; // Size of each square in pixels

        // Initialize 2D array for pieces
        this.pieces = [];
        for (let x = 0; x < sizeX; x++) {
            this.pieces[x] = [];
            for (let y = 0; y < sizeY; y++) {
                this.pieces[x][y] = null;
            }
        }

        this.moves = []; // Currently highlighted valid moves
        this.previousMove = []; // Last move made [fromX, fromY, toX, toY, pieceType]
        this.clientColor = "spectator"; // "white", "black", "both", or "spectator"
    }

    /**
     * Main draw function - renders board, highlights, and pieces
     * Called every frame in the animation loop
     */
    draw(ctx, lightColor, darkColor, highlightColor) {
        this.drawBoard(ctx, lightColor, darkColor);
        this.drawBoardHighlights(ctx, highlightColor);
        this.drawPieces(ctx, lightColor, darkColor);
    }

    /**
     * Draws the checkerboard pattern
     */
    drawBoard(ctx, lightColor, darkColor) {
        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                // Alternate colors in checkerboard pattern
                const isOdd = (x + y) % 2;
                ctx.fillStyle = isOdd ? darkColor : lightColor;

                ctx.fillRect(
                    this.posX + (x * this.tileSize),
                    this.posY + (y * this.tileSize),
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }

    /**
     * Draws highlights for previous move and available moves
     */
    drawBoardHighlights(ctx, highlightColor) {
        ctx.fillStyle = highlightColor;

        // Highlight previous move (both from and to squares)
        if (this.previousMove && this.previousMove.length >= 4) {
            this.drawHighlight(ctx, this.previousMove[0], this.previousMove[1]);
            this.drawHighlight(ctx, this.previousMove[2], this.previousMove[3]);
        }

        // Highlight available moves for selected piece
        for (const move of this.moves) {
            if (move) {
                this.drawHighlight(ctx, move[0], move[1]);
            }
        }
    }

    /**
     * Draws a single highlight square
     * Flips coordinates based on perspective (white/black view)
     */
    drawHighlight(ctx, x, y) {
        // Flip coordinates if viewing from white's perspective
        if (this.clientColor !== "black") {
            x = this.sizeX - 1 - x;
            y = this.sizeY - 1 - y;
        }

        ctx.fillRect(
            this.posX + (x * this.tileSize),
            this.posY + (y * this.tileSize),
            this.tileSize,
            this.tileSize
        );
    }

    /**
     * Draws all pieces on the board
     */
    drawPieces(ctx, lightColor, darkColor) {
        for (const row of this.pieces) {
            for (const piece of row) {
                if (piece != null) {
                    piece.draw(
                        ctx,
                        this.tileSize,
                        lightColor,
                        darkColor,
                        this.clientColor,
                        this.sizeX,
                        this.sizeY,
                        this.posX,
                        this.posY
                    );
                }
            }
        }
    }
}