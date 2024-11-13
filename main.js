import { Board, red } from './board.js';
import { Piece } from './piece.js';

const numPieces = 12

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

const msgBox = document.getElementById('player-turn');
let winnerText;

const board = new Board(context);

let tempCell;
let player1 = createPieces(1, 'assets/checker_red_blank.png', 'assets/checker_red.webp');
let player2 = createPieces(2, 'assets/checker_white_blank.png', 'assets/checker_white.webp', {reverse: true});
let playerTurn = player2
msgBox.innerText = 'White moves first!';
let players = [...player1, ...player2];
let movingPiece = null;
let playerMoves = [];

// Loop through each cell in the board's array and create the pieces
function createPieces(player, img, kingImg, {reverse= false} = {}) {
    let grid = board.grid;
    let pieces = [];
    if (reverse) {
        grid = [...board.grid].reverse();
    }
    
    grid.forEach((cell, _index) => {
        if (!cell.occupied) {
            if (pieces.length === numPieces) {
                return; // Exit the function if we've reached the required number of pieces
            } else {
                const piece = new Piece(context, board.cellSize, { ...cell.pos }, img, kingImg, cell, board, player); // Spread operator for pos
                pieces.push(piece);
                cell.occupied = player;
                cell.piece = piece;
            }
        }
    });
    return pieces;
}

// Function to check if mouse is over an objects rect
function checkMouseCollision(group, canvas) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (const obj of group) {
        if (mouseX >= obj.rect.x && mouseX <= obj.rect.x + obj.rect.width &&
            mouseY >= obj.rect.y && mouseY <= obj.rect.y + obj.rect.height) {
                return obj;
        }
    }
    return false;
}

// Function to get mouse position relative to canvas
function getMousePos(event) { 
    const rect = canvas.getBoundingClientRect(); 
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Function to clear and redraw the canvas
function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.draw();
    players.forEach((obj) => {
        obj.draw();
    });
    if (movingPiece) {
        movingPiece.draw();
    }
}

// Function to update all pieces on the board
function updatePieces(){
    for (const piece of players) {
        piece.update()
    }
}

// Funtion to confirm only valid moves are taken
function movePiece(){
    if (tempCell && !tempCell.occupied) {
        let takeing = false;
        for (const d of movingPiece.moves) {
             if (d.move === tempCell && playerMoves.some(moveDict => moveDict.move === tempCell)) {
                if (d.piece){
                    takeing = true
                    if (player1.includes(d['piece'])){
                        player1.splice(player1.indexOf(d['piece']), 1);
                    }
                    if (player2.includes(d['piece'])){
                        player2.splice(player2.indexOf(d['piece']), 1);
                    }
                    if (players.includes(d['piece'])){
                        players.splice(players.indexOf(d['piece']), 1);
                    }
                    d['piece'].cell.piece = null
                    d['piece'].cell.occupied = false
                }

                
                // Update piece position and cell reference
                movingPiece.pos = { ...tempCell.pos }; // Spread operator for pos
                movingPiece.rect = { ...tempCell.rect }; // Spread operator for rect
                movingPiece.cell.occupied = false;
                movingPiece.cell.piece = null;
                tempCell.piece = movingPiece;
                tempCell.occupied = movingPiece.player;
                movingPiece.cell = tempCell;
                movingPiece.update()
                if (!takeing || !movingPiece.takeMoves || movingPiece.takeMoves.length == 0){
                    playerTurn = (playerTurn === player1) ? player2 : player1;
                } 

                if (player1.length === 0){
                    winnerText = 'White Wins!';
                }
                else if (player2.length === 0){
                    winnerText = 'Red Wins!';
                }
                if (!winnerText){
                    msgBox.innerText = (playerTurn === player1) ? 'Red move' : 'White move';
                }
                else {
                    msgBox.innerText = winnerText;
                }
            }
        }
    }

    if (movingPiece){
        movingPiece.dragPos = null;
        movingPiece = null;
    }

    tempCell = null;

    updatePieces();
    redraw();
}

// Function to get all available moves for a single piece
function getPlayerMoves(){
    playerMoves = [];
    let moves = [];
    for (const piece of playerTurn){
        if (piece.takeMoves.length > 0){
            playerMoves = playerMoves.concat(piece.takeMoves);
        }
        if (piece.moves){
            moves = moves.concat(piece.moves);
        }
    }
    if (playerMoves.length === 0){
        playerMoves = [...moves];
    }
}

// Check for mouse collision on mousedown
canvas.addEventListener('mousedown', (event) => {
    const collidedObject = checkMouseCollision(players, canvas);
    if (collidedObject && playerTurn.includes(collidedObject)) {
        console.log('Collision detected with:', collidedObject, 'At index ', collidedObject.index);
        if (collidedObject.moves){
            for (const move of collidedObject.moves){
                move.move.highlight(context)
            }
        }
        movingPiece = collidedObject;
    }
});

// Check for mouse moving
canvas.addEventListener('mousemove', (event) => {
    redraw()
    let cell = checkMouseCollision(board.grid, canvas);
    let piece = checkMouseCollision(players, canvas);
    if (piece && playerTurn.includes(piece)){
        piece.highlight(context)
        
    }
    if (cell && !cell.occupied){
        cell.highlight(context)
    }
    if (movingPiece) {
        const mousePos = getMousePos(event);
        movingPiece.dragPos = {
            x: mousePos.x -  movingPiece.size / 2,
            y: mousePos.y -  movingPiece.size / 2
        }
       
        // movingPiece.rect.x = movingPiece.pos.x;
        // movingPiece.rect.y = movingPiece.pos.y;
        movingPiece.highlight(context)
        redraw();
        tempCell = checkMouseCollision(board.grid, canvas);
    }
});

// check for mouse button up
canvas.addEventListener('mouseup', (event) => {
    movePiece()
    getPlayerMoves()

});

// Initial draw
redraw();
updatePieces();
getPlayerMoves();

