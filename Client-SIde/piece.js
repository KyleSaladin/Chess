
export class Piece {
    constructor(type, color, posX, posY) {
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.type = type;

        this.image = new Image();
        this.image.src = "Sprites/PiecesBasic.png";
        this.spritePosition = 0;
    }

    getMoves(board) {

    }

    draw(ctx, size, lightColor, darkColor, clientColor, boardSizeX, boardSizeY) {
        if (!this.image) return;

        let tintColor = (this.color === "white") ? lightColor : darkColor;

        tintColor = this.setAlpha(tintColor,  0.5);

        const dpr = window.devicePixelRatio || 1;

        // Create high-res offscreen canvas
        const offCanvas = document.createElement('canvas');
        offCanvas.width = size * dpr;
        offCanvas.height = size * dpr;
        const offCtx = offCanvas.getContext('2d');

        // Scale context to match device pixel ratio
        offCtx.scale(dpr, dpr);

        // Disable smoothing for crisp pixels
        offCtx.imageSmoothingEnabled = false;

        // Draw sprite onto offscreen canvas
        offCtx.drawImage(this.image, this.spritePosition, 0, 20, 20, 0, 0, size, size);

        // Apply tint only where sprite pixels exist
        offCtx.fillStyle = tintColor;
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.fillRect(0, 0, size, size);
        offCtx.globalCompositeOperation = 'source-over';

        // Disable smoothing on main canvas too
        ctx.imageSmoothingEnabled = false;

        // Draw tinted sprite onto main canvas
        if (clientColor == "black") {
            ctx.drawImage(offCanvas, this.posX * size, this.posY * size, size, size);
        }
        else {
            ctx.drawImage(offCanvas, (boardSizeX - 1 - this.posX) * size, (boardSizeY - 1 - this.posY) * size, size, size);
        }
    }

    move(tX, tY, board) {
        console.log(board[this.posX][this.posY]);
        board[this.posX][this.posY] = null;
        board[tX][tY] = this;
        this.posX = tX;
        this.posY = tY;
        if (this.type == "Pawn" || this.type == "King" || this.type == "Rook") {
            this.moved = true;
        }
    }

    setAlpha(rgbaString, newAlpha) {
        return rgbaString.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${newAlpha})`);
    }
}