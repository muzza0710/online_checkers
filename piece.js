class Piece {
    constructor(context, size, pos, imgSrc, kingImgSrc, cell, board, player) {
        this.context = context;
        this.cell = cell;
        this.loaded = false;
        this.index = this.cell.index;
        this.pos = pos;
        this.size = size;
        this.board = board;
        this.player = player;
        this.dragPos = null;
        this.directions = { 'up': -8, 'down': 8, 'left': -1, 'right': 1 };
        this.isKing = false;
        this.kingImgSrc = kingImgSrc;
        this.image = new Image();
        this.image.src = imgSrc;
        this.moves = [];
        this.takeMoves = [];
        this.takePieces = [];

        this.rect = {
            x: this.pos.x, 
            y: this.pos.y, 
            width: this.size, 
            height: this.size
        };

        if (this.player === 1) {
            this.getMoves(this.directions.down, this.cell.index);
        } else if (this.player === 2) {
            this.getMoves(this.directions.up, this.cell.index);
        }
    }

    draw() {
        if (!this.loaded){
        this.image.onload = () => {
            this.resizedImg = this.image;
            this.context.drawImage(this.resizedImg, this.pos.x, this.pos.y, this.size, this.size);
            this.loaded = true
        };
    }
    else {
        if (this.dragPos) {
            this.context.drawImage(this.resizedImg, this.dragPos.x, this.dragPos.y, this.size, this.size);
        }
        else {
        this.context.drawImage(this.resizedImg, this.pos.x, this.pos.y, this.size, this.size);
        }
    }
    }

    highlight(context, {color = 'green'} = {}) {
        const center = {
            x: this.rect.x + this.rect.width / 2,
            y: this.rect.y + this.rect.height / 2,
        }

        context.strokeStyle = color;
        context.lineWidth = 4;
        context.beginPath();
        context.arc(center.x, center.y, this.rect.height / 2, 0, 2 * Math.PI);
        context.stroke();
    }

    getMoves(dir, index) {
        this.takeMoves = [];
        this.takePieces = [];
        let i = index + dir;
        if (i > 0 && i < this.board.grid.length - 1) {
            // Left move
            if (i % this.board.cols > 0) {
                if (this.board.grid[i - 1].occupied !== this.player && this.board.grid[i - 1].occupied) {
                    try {
                        let j = this.board.grid[i - 1].index;
                        if (j + dir > 0 && j + dir < this.board.grid.length - 1 && j % this.board.cols > 0) {
                            let move = {
                                move: !this.board.grid[j - 1 + dir].occupied ? this.board.grid[j - 1 + dir] : null,
                                piece: null
                            };
                            if (move.move) {
                                this.takeMoves.push(move);
                                if (this.board.grid[j].piece) {
                                    move.piece = this.board.grid[j].piece;
                                    this.takePieces.push(move);
                                }
                            }
                        }
                    } catch (e) {
                        console.error(e, '1');
                    }
                }

                if (!this.board.grid[i - 1].occupied && this.takeMoves.length === 0) {
                    let move = {
                        move: this.board.grid[i - 1]
                    };
                    this.moves.push(move);
                }
            }

            // Right move
            if (i % this.board.cols < this.board.cols - 1) {
                if (this.board.grid[i + 1].occupied !== this.player && this.board.grid[i + 1].occupied) {
                    try {
                        let j = this.board.grid[i + 1].index;
                        if (j + dir > 0 && j + dir < this.board.grid.length - 1 && j % this.board.cols < this.board.cols - 1) {
                            let move = {
                                move: !this.board.grid[j + 1 + dir].occupied ? this.board.grid[j + 1 + dir] : null,
                                piece: null
                            };
                            if (move.move) {
                                this.takeMoves.push(move);
                                if (this.board.grid[j].piece) {
                                    move.piece = this.board.grid[j].piece;
                                    this.takePieces.push(move);
                                }
                            }
                        }
                    } catch (e) {
                        console.error(e, '2');
                    }
                }

                if (!this.board.grid[i + 1].occupied && this.takeMoves.length === 0) {
                    this.moves.push({
                        move: this.board.grid[i + 1]
                    });
                }
            }
        }

        // Take moves
        if (this.takeMoves.length > 0) {
            this.moves = [...this.takeMoves];
        }
    }

    update() {
        this.moves = [];
        this.checkKing()
        if (this.isKing){
            if (this.image.src != this.kingImgSrc){
                this.image.src = this.kingImgSrc;
            }
            this.getMoves(this.directions.down, this.cell.index)
            this.getMoves(this.directions.up, this.cell.index)
        }
        else if (this.player === 1) {
            this.getMoves(this.directions.down, this.cell.index);
        } 
        else if (this.player === 2) {
            this.getMoves(this.directions.up, this.cell.index);
        }    
        this.draw()
    }

    checkKing() {
        let targetRow = null
        if (this.player === 1){
            targetRow = 7;
        }
        else if (this.player === 2){
            targetRow = 0;
        }
        const currentRow = Math.floor(this.cell.index / 8);
        if (currentRow === targetRow){
            this.isKing = true;
        }
    }
}

export { Piece };
