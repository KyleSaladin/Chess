import { Piece } from "./piece.js";
import { showPromotionPopup } from "./main.js";

export class PromotablePiece extends Piece {
    constructor(type, color, posX, posY, promotionPieces, promotionRank) {
        super(type, color, posX, posY);
        this.promotionPieces = promotionPieces; // Array of piece type classes
        this.promotionRank = promotionRank || 0;
    }

    async move(tX, tY, pieces, previousMove) {
        // Move the piece
        super.move(tX, tY, pieces, previousMove);
        this.hasMoved = true;

        // Check if promotion is needed
        await this.tryPromote(tX, tY, pieces);

        return true;
    }

    async tryPromote(tX, tY, pieces) {
        const shouldPromote = (this.color === "white" && tY === this.promotionRank) ||
            (this.color === "black" && tY === pieces[0].length - this.promotionRank - 1);

        if (shouldPromote) {
            // Show promotion popup and wait for selection
            const SelectedPieceClass = await showPromotionPopup(this.color, this.promotionPieces);

            // Create the promoted piece
            pieces[tX][tY] = new SelectedPieceClass(this.color, tX, tY);
        }
    }
}