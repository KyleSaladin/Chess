/**
 * Generic function for calculating sliding/jumping piece moves
 * 
 * @param {Piece} piece - The piece to calculate moves for
 * @param {Board} board - The game board
 * @param {Array} directions - Array of [dx, dy] direction vectors
 * @param {number} slideDistance - Max distance to slide (-1 for unlimited)
 * @param {boolean} canJump - Whether piece can jump over others
 * @param {number} distancePerJump - Distance between jumps (for Dragon-like pieces)
 * @returns {Array} Array of valid move coordinates [[x, y], ...]
 */
export function getSlideMoves(piece, board, directions, slideDistance, canJump, distancePerJump = 1) {
    const moves = [];

    for (const [dx, dy] of directions) {
        let x = piece.posX + dx;
        let y = piece.posY + dy;
        let distanceSlid = 1;

        // Continue sliding while within bounds and within max distance
        while (x >= 0 && x < board.sizeX &&
            y >= 0 && y < board.sizeY &&
            (slideDistance === -1 || distanceSlid <= slideDistance)) {

            const targetPiece = board.pieces[x][y];

            // For jumping pieces, check if we're at a valid landing spot
            if (canJump && distancePerJump > 1) {
                // Only allow landing on jump intervals
                if ((distanceSlid - 1) % distancePerJump !== 0) {
                    // Must be empty to continue
                    if (targetPiece != null) {
                        break;
                    }
                    x += dx;
                    y += dy;
                    distanceSlid++;
                    continue;
                }
            }

            // Handle blocked square
            if (targetPiece != null && !canJump) {
                // Can capture enemy piece
                if (targetPiece.color !== piece.color) {
                    moves.push([x, y]);
                }
                break;
            }

            // Add move if empty or enemy piece (for jumping pieces)
            if (targetPiece == null || targetPiece.color !== piece.color) {
                moves.push([x, y]);
            }

            // Stop if we hit a piece (for jumping pieces, they can capture)
            if (targetPiece != null && canJump) {
                break;
            }

            x += dx;
            y += dy;
            distanceSlid++;
        }
    }

    return moves;
}