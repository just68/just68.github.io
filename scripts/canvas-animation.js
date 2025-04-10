const canvasElem = document.querySelector('.canvas');
const ctx = canvasElem.getContext('2d');

const gameProps = {
    targetFPS: 20,
    gridProps: { size: 8, gap: 4 },
    cellsList: [],
    maxSnakesCount: 30,
    snakesList: []
};

const resizeCanvas = () => {
    canvasElem.width = window.innerWidth;
    canvasElem.height = window.innerHeight;
    console.log("Canvas width:", canvasElem.width, "Canvas height:", canvasElem.height); // Добавлено
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomRGBColor = () => {
    const r = getRandomInt(0, 255);
    const g = getRandomInt(0, 255);
    const b = getRandomInt(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
};

const Snake = class {
    constructor(canvas, ctx, gameProps) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameProps = gameProps;

        if (this.gameProps.cellsList.length === 0) {
            console.error("cellsList is empty!");
            return;
        }

        const randomCell = this.gameProps.cellsList[getRandomInt(0, this.gameProps.cellsList.length - 1)];
        this.segments = [{
            x: randomCell.x,
            y: randomCell.y
        }];

        this.direction = this.getRandomDirection();
        this.color = getRandomRGBColor();
        this.stepCounter = 0;
        this.speed = getRandomInt(1, 1);
        this.length = getRandomInt(3, 30);

        for (let i = 1; i < this.length; i++) {
            this.segments.push({ x: randomCell.x, y: randomCell.y });
        }

        console.log("Snake color:", this.color, "Speed:", this.speed, "Length:", this.length);
    }

    get head() {
        return this.segments[0];
    }

    getRandomDirection() {
        const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        return directions[getRandomInt(0, directions.length - 1)];
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.segments.forEach(segment => {
            const drawX = segment.x * (this.gameProps.gridProps.size + this.gameProps.gridProps.gap);
            const drawY = segment.y * (this.gameProps.gridProps.size + this.gameProps.gridProps.gap);

            if (
                drawX >= 0 && drawX < this.canvas.width &&
                drawY >= 0 && drawY < this.canvas.height
            ) {
                this.ctx.fillRect(
                    drawX,
                    drawY,
                    this.gameProps.gridProps.size,
                    this.gameProps.gridProps.size
                );
            } else {
                console.warn("Segment out of bounds:", drawX, drawY);
            }
        });
    }

    update() {
        for (let i = 0; i < this.speed; i++) {
            const head = {
                x: this.head.x + this.direction.x,
                y: this.head.y + this.direction.y
            };

            head.x = Math.max(0, Math.min(head.x, this.gameProps.cellsList.length - 1));
            head.y = Math.max(0, Math.min(head.y, this.gameProps.cellsList.length - 1));

            this.segments.unshift(head);
            this.segments.pop();

            if (this.stepCounter % 10 === 0) {
                this.changeDirection();
            }

            this.checkCollision();
            this.stepCounter++;
        }
        this.draw();
    }

    changeDirection() {
        const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        let newDirection;
        do {
            newDirection = directions[getRandomInt(0, directions.length - 1)];
        } while (newDirection.x === -this.direction.x && newDirection.y === -this.direction.y);
        this.direction = newDirection;
    }

    checkCollision() {
        if (
            this.head.x < 0 ||
            this.head.x >= this.gameProps.cellsList.length ||
            this.head.y < 0 ||
            this.head.y >= this.gameProps.cellsList.length
        ) {
            this.addNewSnake();
            return;
        }

        if (this.segments.slice(1).some(segment => segment.x === this.head.x && segment.y === this.head.y)) {
            this.addNewSnake();
            return;
        }
    }

    addNewSnake() {
        console.log("Adding new snake. Current snakes:", this.gameProps.snakesList.length);
        if (this.gameProps.snakesList.length < this.gameProps.maxSnakesCount) {
            const newSnake = new Snake(this.canvas, this.ctx, this.gameProps);
            this.gameProps.snakesList.push(newSnake);
        }
        this.gameProps.snakesList.splice(this.gameProps.snakesList.indexOf(this), 1);
    }
};

const generateGrid = (canvas, props, cellsList) => {
    const rows = Math.floor(canvas.width / (props.size + props.gap));
    const cols = Math.floor(canvas.height / (props.size + props.gap));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cellsList.push({ x: i, y: j });
        }
    }
};

const generateSnakes = (gameProps, snakesList, maxCount) => {
    for (let i = 0; i < maxCount; i++) {
        snakesList.push(new Snake(canvasElem, ctx, gameProps));
    }
};

const update = () => {
    ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
    console.log("Canvas cleared");

    gameProps.snakesList.forEach(snake => {
        snake.update();
    });
};

const animate = () => {
    update();
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1e3 / gameProps.targetFPS);
};

if (!ctx) {
    alert('Canvas not supported in your browser :(');
} else {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    generateGrid(canvasElem, gameProps.gridProps, gameProps.cellsList);
    console.log("Generated cells:", gameProps.cellsList);
    generateSnakes(gameProps, gameProps.snakesList, gameProps.maxSnakesCount);
    console.log("Generated snakes:", gameProps.snakesList);
    animate();
}