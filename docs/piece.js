/**
 * Base Piece class - all chess pieces inherit from this
 */
export class Piece {
    constructor(type, color, posX, posY) {
        this.type = type;
        this.color = color;
        this.posX = posX;
        this.posY = posY;

        // Load sprite image
        this.image = new Image();
        if ("Sprites/" + type + ".png") {
            this.image.src = "Sprites/" + type + ".png";
        }
    }

    /**
     * Gets valid moves for this piece (implemented by subclasses)
     */
    getMoves(board, previousMove) {
        return [];
    }

    /**
     * Draws the piece on the canvas
     */
    draw(ctx, size, lightColor, darkColor, clientColor, boardSizeX, boardSizeY, boardOffsetX, boardOffsetY, tileSize) {
        if (!this.image.complete) return;

        // Choose tint color based on piece color
        const tintColor = this.setAlpha(
            this.color === "white" ? lightColor : darkColor,
            0.5
        );

        const dpr = window.devicePixelRatio || 1;

        // Get actual sprite dimensions
        const spriteW = this.image.naturalWidth;
        const spriteH = this.image.naturalHeight;

        // Offscreen canvas uses tileSize
        const offCanvas = document.createElement("canvas");
        offCanvas.width = tileSize * dpr;
        offCanvas.height = tileSize * dpr;
        const offCtx = offCanvas.getContext("2d");

        offCtx.scale(dpr, dpr);
        offCtx.imageSmoothingEnabled = false;

        // Draw sprite scaled to tileSize
        offCtx.drawImage(
            this.image,
            0, 0, spriteW, spriteH,   // source rect
            0, 0, tileSize, tileSize  // destination rect
        );

        // Apply tint
        offCtx.fillStyle = tintColor;
        offCtx.globalCompositeOperation = "source-atop";
        offCtx.fillRect(0, 0, tileSize, tileSize);
        offCtx.globalCompositeOperation = "source-over";

        ctx.imageSmoothingEnabled = false;

        // Calculate board position (flip for white's perspective)
        let drawX, drawY;
        if (clientColor === "black") {
            drawX = this.posX * tileSize;
            drawY = this.posY * tileSize;
        } else {
            drawX = (boardSizeX - 1 - this.posX) * tileSize;
            drawY = (boardSizeY - 1 - this.posY) * tileSize;
        }

        // Add board offset
        drawX += boardOffsetX;
        drawY += boardOffsetY;

        // Draw final piece
        ctx.drawImage(offCanvas, drawX, drawY, tileSize, tileSize);
    }

    /**
     * Moves this piece to a new position
     */
    move(tX, tY, pieces, previousMove) {
        pieces[tX][tY] = this;
        pieces[this.posX][this.posY] = null;
        this.posX = tX;
        this.posY = tY;
    }

    /**
     * Returns character representation of this piece for board syncing
     */
    getTypeChar() {
        return '-';
    }

    /**
     * Utility to set alpha channel of RGBA color
     */
    setAlpha(rgbaString, newAlpha) {
        return rgbaString.replace(
            /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
            `rgba($1, $2, $3, ${newAlpha})`
        );
    }
}