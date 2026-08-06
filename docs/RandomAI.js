
export class RandomAI {
    constructor(board, color) {
        this.board = board;
        this.color = color;
    }

    move(){
        let moves = this.board.getAllMoves(this.color);

        if(moves.length == 0){
            this.board.detectCheckmate
            return
        }

        let [fX, fY, tX, tY, previous] = moves[Math.floor(Math.random() * (moves.length))];

        console.log(this.board.movePiece(fX, fY, tX, tY, previous))
    }
}