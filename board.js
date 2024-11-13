const red = 'rgb(200, 0, 0)';
const green = 'rgb(0, 200, 0)';
const blue = 'rgb(0, 0, 200)';

class Board {
    constructor(context, rows = 8, cols = 8, cellSize = 50) {
        this.context = context;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.grid = [];
        for (let i = 0; i < rows * cols; i++) {
            this.grid.push(new Cell(
                this.cellSize,
                { x: (i % rows) * this.cellSize, y: Math.floor(i / cols) * this.cellSize },
                ((Math.floor(i / cols) + (i % rows)) % 2 === 0) ? red : 'black',
                i
            ));
        }
    }

    draw() {
        this.grid.forEach(cell => cell.draw(this.context));
    }
}

class Cell {
    constructor(size, pos, color, index) {
        this.piece = null;
        this.size = size;
        this.pos = pos;
        this.color = color;
        this.index = index;
        this.rect = {
            x: this.pos.x, 
            y: this.pos.y, 
            width: this.size, 
            height: this.size
        };
        if (this.color === 'black'){
            this.occupied = false;
        }
        else {
            this.occupied = true
        }
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height,);
    }

    highlight(context, {color = green} = {}) {
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.strokeRect(this.pos.x, this.pos.y, this.size, this.size);

    }

    removePiece() {
        const piece = this.piece;
        this.piece = null;
        this.occupied = false;
        return piece;
    }
}

 export {Board, Cell, red,green,blue};