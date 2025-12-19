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
        this.image.src = "Sprites/" + type + ".png";
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
    draw(ctx, size, lightColor, darkColor, clientColor, boardSizeX, boardSizeY, boardOffsetX, boardOffsetY) {
        if (!this.image.complete) return;

        // Choose tint color based on piece color
        const tintColor = this.setAlpha(
            this.color === "white" ? lightColor : darkColor,
            0.5
        );

        const dpr = window.devicePixelRatio || 1;

        // Create high-resolution offscreen canvas for crisp rendering
        const offCanvas = document.createElement('canvas');
        offCanvas.width = size * dpr;
        offCanvas.height = size * dpr;
        const offCtx = offCanvas.getContext('2d');

        offCtx.scale(dpr, dpr);
        offCtx.imageSmoothingEnabled = false;

        // Draw sprite (assuming 20x20 sprite size)
        offCtx.drawImage(this.image, 0, 0, 20, 20, 0, 0, size, size);

        // Apply tint where sprite pixels exist
        offCtx.fillStyle = tintColor;
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.fillRect(0, 0, size, size);
        offCtx.globalCompositeOperation = 'source-over';

        // Disable smoothing on main canvas
        ctx.imageSmoothingEnabled = false;

        // Calculate position (flip for white's perspective)
        let drawX, drawY;
        if (clientColor === "black") {
            drawX = this.posX * size;
            drawY = this.posY * size;
        } else {
            drawX = (boardSizeX - 1 - this.posX) * size;
            drawY = (boardSizeY - 1 - this.posY) * size;
        }

        // Add board offset
        drawX += boardOffsetX;
        drawY += boardOffsetY;

        ctx.drawImage(offCanvas, drawX, drawY, size, size);
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