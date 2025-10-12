export function getSlideMoves(piece, board, directions, slideDistance, canJump) {
    let moves = [];

    for (let [dx, dy] of directions) {
        let x = piece.posX + dx;
        let y = piece.posY + dy;
        let distanceSlid = 1;

        while (x >= 0 && x < board.sizeX && y >= 0 && y < board.sizeY && (distanceSlid <= slideDistance || slideDistance == -1)) {
            distanceSlid += 1;
            let thisPiece = board.pieces[x][y];
            if (thisPiece != null && !canJump) {
                if (thisPiece.color != piece.color) {
                    moves.push([x, y]);
                }
                break;
            }
            if (thisPiece == null || thisPiece.color != piece.color) {
                moves.push([x, y]);
                x += dx;
                y += dy;
            }
        }
    }

    return moves;
}