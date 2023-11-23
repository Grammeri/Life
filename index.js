document.addEventListener('DOMContentLoaded', function() {
    let gridSize = document.getElementById('grid-size').value;
    let grid = document.getElementById('grid');
    let startButton = document.getElementById('start');
    let stopButton = document.getElementById('stop');
    let clearButton = document.getElementById('clear');
    let randomButton = document.getElementById('random');
    let generationTimeDisplay = document.getElementById('time');
    let intervalId = null;
    let cells = [];

    // Функция для создания игрового поля
    function createGrid(size) {
        grid.innerHTML = '';
        cells = [];
        for (let i = 0; i < size; i++) {
            let row = document.createElement('div');
            let cellsRow = [];
            for (let j = 0; j < size; j++) {
                let cell = document.createElement('span');
                cell.addEventListener('click', () => toggleCellState(i, j, cell));
                row.appendChild(cell);
                cellsRow.push({ alive: false, element: cell });
            }
            grid.appendChild(row);
            cells.push(cellsRow);
        }
    }

    // Функция для переключения состояния клетки
    function nextGeneration() {
        let startTime = performance.now();

        let changes = [];
        console.log("Calculating next generation...");

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let alive = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x === 0 && y === 0) continue;
                        let ni = (i + x + gridSize) % gridSize;
                        let nj = (j + y + gridSize) % gridSize;
                        if (cells[ni][nj].alive) alive++;
                    }
                }

                let cell = cells[i][j];
                if (cell.alive && (alive < 2 || alive > 3)) {
                    changes.push({ x: i, y: j, state: false });
                    console.log(`Cell at (${i}, ${j}) dies.`);
                } else if (!cell.alive && alive === 3) {
                    changes.push({ x: i, y: j, state: true });
                    console.log(`Cell at (${i}, ${j}) becomes alive.`);
                }
            }
        }

        console.log(`Applying ${changes.length} changes.`);
        changes.forEach(change => {
            cells[change.x][change.y].alive = change.state;
            cells[change.x][change.y].element.style.backgroundColor = change.state ? 'black' : 'white';
        });

        let endTime = performance.now();
        generationTimeDisplay.textContent = (endTime - startTime).toFixed(2);
    }



    // Функция для случайной генерации первого поколения
    function randomGeneration() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let isAlive = Math.random() > 0.5;
                cells[i][j].alive = isAlive;
                cells[i][j].element.style.backgroundColor = isAlive ? 'black' : 'white';
            }
        }
    }

    // Обработчики событий для управления игрой
    startButton.addEventListener('click', () => {
        if (!intervalId) {
            intervalId = setInterval(nextGeneration, 500);
        }
    });

    stopButton.addEventListener('click', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });

    clearButton.addEventListener('click', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        createGrid(gridSize);
    });

    // Обработчик события для случайной генерации первого поколения
    randomButton.addEventListener('click', randomGeneration);

    // Обработчик события для изменения размера поля
    document.getElementById('grid-size').addEventListener('change', (e) => {
        gridSize = e.target.value;
        createGrid(gridSize);
    });

    // Инициализация игрового поля
    createGrid(gridSize);
});
