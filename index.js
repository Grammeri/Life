document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const generationTimeDisplay = document.getElementById('generation-time');
    let gridSize = parseInt(document.getElementById('grid-size').value, 10);
    const size = 20;
    let isRunning = false;
    let intervalId;
    let grid = initArray(gridSize, gridSize);

    canvas.width = gridSize * size;
    canvas.height = gridSize * size;

    function initArray(w, h) {
        const arr = [];
        for (let x = 0; x < w; x++) {
            arr[x] = [];
            for (let y = 0; y < h; y++) {
                arr[x][y] = 0;
            }
        }
        return arr;
    }

    function draw(x, y, alive) {
        context.fillStyle = alive ? 'black' : 'white';
        context.fillRect(x * size, y * size, size, size);
    }

    function drawGrid() {
        for (let x = 0; x <= gridSize; x++) {
            context.beginPath();
            context.moveTo(x * size, 0);
            context.lineTo(x * size, gridSize * size);
            context.strokeStyle = 'grey';
            context.stroke();
        }

        for (let y = 0; y <= gridSize; y++) {
            context.beginPath();
            context.moveTo(0, y * size);
            context.lineTo(gridSize * size, y * size);
            context.strokeStyle = 'grey';
            context.stroke();
        }
    }

    function updateGrid() {
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                draw(x, y, grid[x][y]);
            }
        }
        drawGrid();
    }

    function cellValue(x, y) {
        x = (x + gridSize) % gridSize;
        y = (y + gridSize) % gridSize;
        return grid[x][y];
    }

    function countNeighbours(x, y) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                if (cellValue(x + dx, y + dy)) count++;
            }
        }
        return count;
    }

    function updateCell(x, y) {
        const neighbours = countNeighbours(x, y);
        return grid[x][y] ? (neighbours === 2 || neighbours === 3) : (neighbours === 3);
    }

    function update() {
        if (!isRunning) return;

        const startTime = performance.now();
        const newGrid = initArray(gridSize, gridSize);
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                newGrid[x][y] = updateCell(x, y);
            }
        }
        grid = newGrid;
        updateGrid();
        const endTime = performance.now();
        generationTimeDisplay.textContent = `Время генерации: ${(endTime - startTime).toFixed(2)} мс`;
    }

    document.getElementById('random').addEventListener('click', () => {
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                grid[x][y] = Math.random() > 0.5;
            }
        }
        updateGrid();
    });

    document.getElementById('change-size').addEventListener('click', () => {
        gridSize = parseInt(document.getElementById('grid-size').value, 10);
        canvas.width = gridSize * size;
        canvas.height = gridSize * size;
        grid = initArray(gridSize, gridSize);
        updateGrid();
    });

    document.getElementById('start').addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            intervalId = setInterval(update, 500);
        }
    });

    document.getElementById('stop').addEventListener('click', () => {
        if (isRunning) {
            clearInterval(intervalId);
            isRunning = false;
            generationTimeDisplay.textContent = `Время генерации: 0.00 мс`;
        }
    });

    canvas.addEventListener('click', (event) => {
        if (isRunning) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / size);
        const y = Math.floor((event.clientY - rect.top) / size);
        grid[x][y] = !grid[x][y];
        updateGrid();
    });

    updateGrid();
});
