import { canvasOptions } from './canvas-options-contol.js';

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomRGBColor = () => {
    const r = getRandomInt(0, 255);
    const g = getRandomInt(0, 255);
    const b = getRandomInt(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}

const Snake = class {
    constructor(canvas, ctx, gridConfig, cellsList) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gridConfig = gridConfig;
        this.cellsList = cellsList;
        this.isAlive = true;
        this.segments = [];
        this.minSegmentsCount = 3;
        const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        const randomDirectionIndex = getRandomInt(0, directions.length - 1);
        this.direction = directions[randomDirectionIndex];
        this.color = getRandomRGBColor();
        this.create();
    }

    addSegment() {
        const randomCellIndex = getRandomInt(0, this.cellsList.length - 1);
        const randomCell = this.cellsList[randomCellIndex];
        this.segments.push({ x: randomCell.x, y: randomCell.y });
    }

    create() {
        for (let i = 0; i < this.minSegmentsCount; i++) {
            this.addSegment();
        }
    }

    get head() {
        return this.segments[0];
    }

    checkCollisionOfSelf() {
        for (let i = 1; i < this.segments.length; i++) {
            if (this.head.x === this.segments[i].x && this.head.y === this.segments[i].y) {
                return true;
            }
        }
        return false;
    }

    move() {
        if (!this.isAlive) return;

        // Calculate grid dimensions
        const cellSize = this.gridConfig.size + this.gridConfig.gap;
        const maxX = Math.floor(this.canvas.width / cellSize);
        const maxY = Math.floor(this.canvas.height / cellSize);

        // Checking for proximity to edges ...
        const edgeBuffer = 2; // How many cells away from edge to start avoiding
        const nextX = this.head.x + this.direction.x;
        const nextY = this.head.y + this.direction.y;

        // ... then, try to change direction
        // Try to move by vertical
        if (nextX <= edgeBuffer || nextX >= maxX - edgeBuffer - 1) {
            if (this.direction.x !== 0) {
                if (this.head.y > maxY / 2) {
                    this.direction = { x: 0, y: -1 };
                } else {
                    this.direction = { x: 0, y: 1 };
                }
            }
        }

        // Try to move by horizontal
        if (nextY <= edgeBuffer || nextY >= maxY - edgeBuffer - 1) {
            if (this.direction.y !== 0) {
                if (this.head.x > maxX / 2) {
                    this.direction = { x: -1, y: 0 };
                } else {
                    this.direction = { x: 1, y: 0 };
                }
            }
        }

        const closestFood = this.findClosestFood();
        if (closestFood) {
            this.gotoClosestFood(closestFood);
        }

        // Move snake
        const head = {
            x: this.head.x + this.direction.x,
            y: this.head.y + this.direction.y
        };

        // Keep snake in bounds
        head.x = Math.max(0, Math.min(head.x, maxX - 1));
        head.y = Math.max(0, Math.min(head.y, maxY - 1));
        if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
            this.isAlive = false;
            return;
        }

        this.segments.unshift(head);
        this.segments.pop();

        if (this.checkCollisionOfSelf()) {
            this.isAlive = false;
        }
    }

    draw() {
        if (!this.isAlive) return;

        this.ctx.fillStyle = this.color;
        this.segments.forEach(segment => {
            this.ctx.fillRect(
                segment.x * (this.gridConfig.size + this.gridConfig.gap),
                segment.y * (this.gridConfig.size + this.gridConfig.gap),
                this.gridConfig.size,
                this.gridConfig.size
            );
        });
    }

    findClosestFood() {
        let closestFood = null;
        let minDistance = Infinity;
        for (const food of window.game.foodList) {
            const dx = food.x - this.head.x;
            const dy = food.y - this.head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                closestFood = food;
            }
        }
        return closestFood;
    }

    gotoClosestFood(food) {
        const dx = food.x - this.head.x;
        const dy = food.y - this.head.y;

        // Find nearest snake
        let nearestSnake = null;
        let minSnakeDistance = Infinity;
        for (const otherSnake of window.game.snakeList) {
            if (otherSnake === this) continue;
            const snakeDx = otherSnake.head.x - this.head.x;
            const snakeDy = otherSnake.head.y - this.head.y;
            const snakeDistance = Math.sqrt(snakeDx * snakeDx + snakeDy * snakeDy);
            if (snakeDistance < minSnakeDistance) {
                minSnakeDistance = snakeDistance;
                nearestSnake = otherSnake;
            }
        }

        // To check if we need to avoid a collision
        const nextX = this.head.x + this.direction.x;
        const nextY = this.head.y + this.direction.y;
        const willCollide = this.segments.some(segment => segment.x === nextX && segment.y === nextY) || (nearestSnake && nearestSnake.segments.some(segment => segment.x === nextX && segment.y === nextY));
        if (willCollide) {
            if (this.direction.x !== 0) {
                // Move by horizontal, try vertical
                const newY = this.head.y + Math.sign(dy);
                if (!this.segments.some(segment => segment.x === this.head.x && segment.y === newY)) {
                    this.direction = { x: 0, y: Math.sign(dy) };
                }
            } else {
                // Move by vertical, try horizontal
                const newX = this.head.x + Math.sign(dx);
                if (!this.segments.some(segment => segment.x === newX && segment.y === this.head.y)) {
                    this.direction = { x: Math.sign(dx), y: 0 };
                }
            }
            return;
        }

        // Try to move towards food if no collision
        if (Math.abs(dx) > Math.abs(dy)) {
            // Try horizontal movement
            const newX = this.head.x + Math.sign(dx);
            if (!this.segments.some(segment => segment.x === newX && segment.y === this.head.y)) {
                this.direction = { x: Math.sign(dx), y: 0 };
            }
        } else {
            // Try vertical movement
            const newY = this.head.y + Math.sign(dy);
            if (!this.segments.some(segment => segment.x === this.head.x && segment.y === newY)) {
                this.direction = { x: 0, y: Math.sign(dy) };
            }
        }
    }
};

const Food = class {
    constructor(canvas, ctx, gridConfig, cellsList) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gridConfig = gridConfig;
        this.cellsList = cellsList;
        const randomIndex = getRandomInt(0, this.cellsList.length - 1);
        const randomCell = this.cellsList[randomIndex];
        this.x = randomCell.x;
        this.y = randomCell.y;
        this.color = 'rgb(255, 255, 255)';
    }

    draw() {
        const size = this.gridConfig['size'];
        const gap = this.gridConfig['gap'];
        const x = this.x * (size + gap);
        const y = this.y * (size + gap);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(x, y, size, size);
    }
}

export const Game = class {
    constructor(canvas, canvasOptions) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) alert('Canvas not supported in your browser :(');
        this.config = canvasOptions.get();
        this.cellsList = [];
        this.snakeList = [];
        this.foodList = [];
        this.createGrid();
        this.loadCanvasData();
        window.game = this; // available global

        this.saveCanvasDataInterval = 10000;
        setInterval(() => {
            this.saveCanvasData();
        }, this.saveCanvasDataInterval);
    }

    createGrid() {
        this.cellsList = [];
        const rows = Math.floor(this.canvas.width / (this.config['grid']['size'] + this.config['grid']['gap']));
        const cols = Math.floor(this.canvas.height / (this.config['grid']['size'] + this.config['grid']['gap']));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.cellsList.push({
                    x: i,
                    y: j
                });
            }
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createGrid();
    }

    loadCanvasData()  {
        try {
            const savedData = JSON.parse(localStorage.getItem('CanvasData'));

            savedData.snakeList.forEach(savedSnake => {  
                const newSnake = new Snake(this.canvas, this.ctx, this.config['grid'], this.cellsList);
                newSnake.segments = savedSnake.segments;
                newSnake.direction = savedSnake.direction;
                newSnake.color = savedSnake.color;
                newSnake.isAlive = savedSnake.isAlive;
                this.snakeList.push(newSnake);
            });

            savedData.foodList.forEach(savedFood => {    
                const newFood = new Food(this.canvas, this.ctx, this.config['grid'], this.cellsList);
                newFood.x = savedFood.x;
                newFood.y = savedFood.y;
                newFood.color = savedFood.color;
                this.foodList.push(newFood);
            });
        } catch (error) {
            this.snakeList = [];
            this.foodList = [];
        }
    }

    saveCanvasData() {
        const snakeData = this.snakeList.map(snake => ({
            segments: snake.segments,
            direction: snake.direction,
            color: snake.color,
            isAlive: snake.isAlive
        }));

        const foodData = this.foodList.map(food => ({
            x: food.x,
            y: food.y,
            color: food.color
        }));

        localStorage.setItem('CanvasData', JSON.stringify({}));
        localStorage.setItem('CanvasData', JSON.stringify({
            'snakeList': snakeData,
            'foodList': foodData
        }));
    }


    checkCollisionSomeSnakeAndFood() {
        for (let i = this.foodList.length - 1; i >= 0; i--) {
            const food = this.foodList[i];
            for (let snake of this.snakeList) {
                if (snake.head.x === food.x && snake.head.y === food.y) {
                    this.foodList.splice(i, 1);
                    const newSegment = {
                        x: snake.head.x,
                        y: snake.head.y
                    };
                    snake.segments.push(newSegment);
                    break;
                }
            }
        }
    }

    checkSomeSnakeCollision() {
        for (let snake1 of this.snakeList) {
            for (let snake2 of this.snakeList) {
                if (snake1 === snake2) continue; // Skip self-comparison

                if (snake1.head.x === snake2.head.x && snake1.head.y === snake2.head.y) {
                    for (let segment of snake1.segments) {
                        const newFood = new Food(this.canvas, this.ctx, this.config['grid'], this.cellsList);
                        newFood.x = segment.x;
                        newFood.y = segment.y;
                        this.foodList.push(newFood);
                    }
                    for (let segment of snake2.segments) {
                        const newFood = new Food(this.canvas, this.ctx, this.config['grid'], this.cellsList);
                        newFood.x = segment.x;
                        newFood.y = segment.y;
                        this.foodList.push(newFood);
                    }

                    const indexOfSnake1 = this.snakeList.indexOf(snake1);
                    const indexOfSnake2 = this.snakeList.indexOf(snake2);
                    if (indexOfSnake1 < indexOfSnake2) {
                        this.snakeList.splice(indexOfSnake2, 1);
                        this.snakeList.splice(indexOfSnake1, 1);
                    } else {
                        this.snakeList.splice(indexOfSnake1, 1);
                        this.snakeList.splice(indexOfSnake2, 1);
                    }
                    return;
                }

                // Check snake 1's head and snake 2's body colliding
                if (snake2.segments.slice(1).some(segment => segment.x === snake1.head.x && segment.y === snake1.head.y)) {
                    for (let segment of snake1.segments) {
                        const newFood = new Food(this.canvas, this.ctx, this.config['grid'], this.cellsList);
                        newFood.x = segment.x;
                        newFood.y = segment.y;
                        this.foodList.push(newFood);
                    }

                    const indexOfSnake1 = this.snakeList.indexOf(snake1);
                    this.snakeList.splice(indexOfSnake1, 1);
                    return;
                }

                // Check snake 2's head and snake 1's body colliding
                if (snake1.segments.slice(1).some(segment => segment.x === snake2.head.x && segment.y === snake2.head.y)) {
                    for (let segment of snake2.segments) {
                        const newFood = new Food(this.canvas, this.ctx, this.config['grid'], this.cellsList);
                        newFood.x = segment.x;
                        newFood.y = segment.y;
                        this.foodList.push(newFood);
                    }
                    const indexOfSnake2 = this.snakeList.indexOf(snake2);
                    this.snakeList.splice(indexOfSnake2, 1);
                    return;
                }
            }
        }
    }

    listenFPSChange() {
        const listenFPSChangeInterval = setInterval(() => {
            this.config = canvasOptions.get();

            if (this.config['fps'] >  0) {
                this.animate();
                clearInterval(listenFPSChangeInterval);
            }
        }, 100);
    }

    showDebug() {
        const margin = 20;
        const panelWidth = 320;
        const panelHeight = this.canvas.height - (margin * 2);
        const panelX = margin;
        const panelY = margin;
        const headerHeight = 35;

        this.ctx.font = "13px 'Consolas', monospace";
        let yOffset = panelY + headerHeight + 15;
        const lineHeight = 18;
        const sectionSpacing = 5;
        const indent = 25;

        // Draw panel background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // Draw header background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(panelX, panelY, panelWidth, headerHeight);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.beginPath();
        this.ctx.moveTo(panelX, panelY + headerHeight);
        this.ctx.lineTo(panelX + panelWidth, panelY + headerHeight);
        this.ctx.stroke();

        // Draw title
        this.ctx.font = "bold 16px 'Consolas', monospace";
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('DEBUG CONSOLE', panelX + panelWidth / 2, panelY + headerHeight / 2);
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        const drawSectionHeader = (text) => {
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.font = "bold 14px 'Consolas', monospace";
            this.ctx.fillText(text, panelX + 15, yOffset);
            this.ctx.font = "13px 'Consolas', monospace";
            yOffset += 25;
        }

        const drawText = (text, color = '#fff', indented = false) => {
            if (yOffset > panelY + panelHeight - lineHeight) return false;
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, panelX + (indented ? indent : 15), yOffset);
            yOffset += lineHeight;
            return true;
        }

        // Game Performance
        drawSectionHeader('Performance');
        const fps = this.config.fps;
        const fpsColor = fps >= 30 ? '#4CAF50' : fps >= 15 ? '#FFC107' : '#F44336';
        drawText(`FPS: ${fps}`, fpsColor);
        drawText(`Frame time: ${(1000 / fps).toFixed(1)}ms`);
        if (performance.memory) {
            const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            const memoryColor = memoryMB > 100 ? '#F44336' : memoryMB > 50 ? '#FFC107' : '#4CAF50';
            drawText(`Memory: ${memoryMB}MB`, memoryColor);
        }
        yOffset += sectionSpacing;

        // Game State
        drawSectionHeader('Game State');
        const aliveSnakes = this.snakeList.filter(s => s.isAlive);
        const deadSnakes = this.snakeList.filter(s => !s.isAlive);
        drawText(`Snakes: ${aliveSnakes.length} alive, ${deadSnakes.length} dead`);
        drawText(`Food: ${this.foodList.length} total`);
        drawText(`Grid cells: ${this.cellsList.length}`);
        yOffset += sectionSpacing;

        // Canvas Info
        drawSectionHeader('Canvas Info');
        const gridSize = this.config.grid.size;
        const gridGap = this.config.grid.gap;
        const cellSize = gridSize + gridGap;
        const gridWidth = Math.floor(this.canvas.width / cellSize);
        const gridHeight = Math.floor(this.canvas.height / cellSize);
        drawText(`Size: ${this.canvas.width}x${this.canvas.height}`);
        drawText(`Grid: ${gridSize}px + ${gridGap}px gap`);
        drawText(`Cells: ${gridWidth}x${gridHeight}`);
        yOffset += sectionSpacing;

        // All Snakes Status
        drawSectionHeader('Snakes Status');
        if (aliveSnakes.length > 0) {
            drawText('ALIVE:', '#4CAF50');
            for (let i = 0; i < aliveSnakes.length; i++) {
                const snake = aliveSnakes[i];
                const head = snake.segments[0];
                const length = snake.segments.length;
                const direction = `${snake.direction.x > 0 ? '→' : snake.direction.x < 0 ? '←' : ''}${snake.direction.y > 0 ? '↓' : snake.direction.y < 0 ? '↑' : ''}`;

                const snakeInfo = `#${i + 1}: pos(${head.x},${head.y}) len=${length} dir=${direction}`;
                if (!drawText(snakeInfo, snake.color, true)) {
                    if (i < aliveSnakes.length - 1) {
                        drawText(`... and ${aliveSnakes.length - i} more alive snakes`, '#FFC107', true);
                    }
                    break;
                }
            }
            yOffset += sectionSpacing;
        }

        if (deadSnakes.length > 0) {
            drawText('DEAD:', '#F44336');
            for (let i = 0; i < deadSnakes.length; i++) {
                const snake = deadSnakes[i];
                const head = snake.segments[0];
                const length = snake.segments.length;

                const snakeInfo = `#${i + 1}: pos(${head.x},${head.y}) len=${length}`;
                if (!drawText(snakeInfo, snake.color, true)) {
                    if (i < deadSnakes.length - 1) {
                        drawText(`... and ${deadSnakes.length - i} more dead snakes`, '#FFC107', true);
                    }
                    break;
                }
            }
            yOffset += sectionSpacing;
        }

        // Food Status
        if (this.foodList.length > 0) {
            drawSectionHeader('Food Status');
            drawText(`Total food: ${this.foodList.length} items`);

            const foodByColor = {};
            this.foodList.forEach(food => {
                foodByColor[food.color] = (foodByColor[food.color] || 0) + 1;
            });
            yOffset += sectionSpacing;

            if (this.foodList.length <= 20) {
                drawText('Positions:', '#FFC107');
                for (let i = 0; i < this.foodList.length; i++) {
                    const food = this.foodList[i];
                    const foodInfo = `#${i + 1}: (${food.x},${food.y})`;
                    if (!drawText(foodInfo, food.color, true)) {
                        if (i < this.foodList.length - 1) {
                            drawText(`... and ${this.foodList.length - i} more food items`, '#FFC107', true);
                        }
                        break;
                    }
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.config = canvasOptions.get();

        this.snakeList = this.snakeList.filter(snake => snake.isAlive);

        while (this.snakeList.length < this.config['snakeCount']) {
            const newSnake = new Snake(this.canvas, this.ctx, this.config['grid'], this.cellsList);
            this.snakeList.push(newSnake);
        }

        while (this.foodList.length < this.config['snakeCount']) {
            const newFood = new Food(this.canvas, this.ctx, this.config['grid'], this.cellsList);
            this.foodList.push(newFood);
        }

        for (let snake of this.snakeList) {
            snake.move();
        }

        this.checkCollisionSomeSnakeAndFood();
        this.checkSomeSnakeCollision();

        for (let food of this.foodList) {
            food.draw();
        }
        for (let snake of this.snakeList) {
            snake.draw();
        }

        const frameTimeout = setTimeout(() => {
            requestAnimationFrame(() => this.animate());
        }, 1e3 / this.config['fps']);

        if (this.config['fps'] === 0) {
            clearTimeout(frameTimeout);
            this.stop()
        }

        if (this.config['isDebugMode']) this.showDebug();
    }

    start() {
        this.resize();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    stop() {
        this.listenFPSChange();
    }

    // ?
    // reset() {
    //     localStorage.removeItem('SavedCanvasData');
    //
    //     this.snakeList = [];
    //     this.foodList = [];
    //
    //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //
    //     this.createGrid();
    //
    //     this.animate();
    // }
};



