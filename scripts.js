let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let empty = "#454545";
let grad = ctx.createLinearGradient(0,0,500,500);
grad.addColorStop("0", "black");
grad.addColorStop(".5", "lightgreen");
grad.addColorStop("1", "green");

ctx.strokeStyle = "#f0f0f0";
ctx.fillStyle = empty;
ctx.lineWidth = 1;

let cellSize = 20;
let rows = 25;
let cols = 25;

// Создаем поле
for (let i = 0; i < rows; i++) { 
    for (let j = 0; j < cols; j++) {
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
}

// Массив с состояниями клеток
let grid = new Array(rows);
for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols).fill(false);
}

// Очистка поля
function clearField () {
    grad.addColorStop("0", "black");
    grad.addColorStop(".5", "lightgreen");
    grad.addColorStop("1", "green");
    ctx.strokeStyle = "#f0f0f0";
    ctx.fillStyle = empty;
    for (let i = 0; i < rows; i++) { 
        for (let j = 0; j < cols; j++) {
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            
        }
    }
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(false);
    }
}

// Остановка игры
function gameStop() {
    gameStarted = false;
    clearInterval(gameInt);
    startButton.innerHTML = "Начать";
    clearButton.style.display="inline-block";
    randomButton.style.display="inline-block";
    clearButton.addEventListener('click', () => {
        clearField();
    });
}

// Кнопки управления
let ctrls = document.querySelector('.controls');
let startButton = document.querySelector('button');
let clearButton = document.getElementById('clear-button');
let randomButton = document.getElementById('random-button');
let timing = document.querySelector('.timing');
let gameStarted = false;
let gameInt;

// Старт
startButton.addEventListener('click', function() {
    if(!gameStarted) {
        gameStarted = true;
        gameInt = setInterval(checkNeighbors, 100);
        startButton.innerHTML = "Остановить";
        clearButton.style.display="none";
        randomButton.style.display="none";
    } else {
        gameStop();
    }
});

// Случайное первое поколение
let randomArray = [];

function objectConstructor(cols, rows) {
    randomArray = [];
    let randMin = Math.floor((cols * rows) / 3);
    let randMax = Math.floor((cols * rows) / 2);

    for (let i = 0; i < Math.floor(Math.random() * randMax) + randMin; i++) {
        let x = Math.floor(Math.random() * cols) + 1;
        let y = Math.floor(Math.random() * rows) + 1;

        let newObj = {
            x: x,
            y: y
        };
        randomArray.push(newObj);
    }
}
let timingTimer;
function timingTimerStart() {
    timingTimer = setTimeout(() => {
        timing.classList.remove('active');
    }, 4000);
}
  
randomButton.addEventListener('click', function() {
    const start = new Date();
    clearField();
    objectConstructor(cols, rows);
    for (let r = 0; r <= randomArray.length-1; r++) {

        let randObj = randomArray[r];
        let randX = randObj.x -1 ;
        let randY = randObj.y -1 ;
        
        grid[randY][randX] = true;
        ctx.fillStyle = grad;
        ctx.fillRect(randX * cellSize, randY * cellSize, cellSize, cellSize);
        ctx.strokeRect(randX * cellSize, randY * cellSize, cellSize, cellSize);   
    }
    const end = new Date();
    const executionTime = end - start;
    let timingAnswer;
    if (/.*1$/.test(executionTime) && !/.*11$/.test(executionTime)) {
        timingAnswer = "у";
    } else if (/.*([5-9]|1[1-4])$/.test(executionTime)) {
        timingAnswer = " ";
    } else {
        timingAnswer = "ы";
    }
    timing.innerHTML = "Сгенерировано "+ +randomArray.length +" клеток за " + executionTime + " миллисекунд" + timingAnswer;
    timing.classList.add('active');
    clearTimeout(timingTimer)
    timingTimerStart();
});

// изменение размеров
let inputWidth = document.getElementById('width');
let inputHeight = document.getElementById('height');
let applyButton = document.getElementById('apply');

function changeSize() {
    let inputCols = inputWidth.value;
    let inputRows = inputHeight.value;
    let newWidth = inputCols * cellSize;
    let newHeight = inputRows * cellSize;
    canvas.width = newWidth;
    canvas.height = newHeight;
    rows = +inputRows;
    cols = +inputCols;
    grad = ctx.createLinearGradient(0,0,newWidth, newHeight);
    ctx.lineWidth = 1;
    clearField();
}
applyButton.addEventListener('click', function(){
    inputCols = inputWidth.value;
    inputRows = inputHeight.value;
    clearButton.style.display="none";
    gameStop();

    if (inputCols >= 30 && inputRows >= 30) {
        cellSize = 10;
        changeSize();
    } else if (inputCols >= 10 && inputRows >= 10 && inputCols < 30 && inputRows < 30) {
        cellSize = 20;
        changeSize();
    } else {
        alert('Значения ширины и высоты не должны быть ниже 10');
        canvas.width = "500";
        canvas.height = "500";
        rows = 25;
        cols = 25;
        cellSize = 20;
        ctx.lineWidth = 1;
        grad = ctx.createLinearGradient(0,0,500,500);
        clearField();
    }
})

// Рисование мышью
function painting () {
    let x = event.offsetX;
    let y = event.offsetY;
    let cellX = Math.floor(x / cellSize);
    let cellY = Math.floor(y / cellSize);
    let coordinates = {x: cellX, y: cellY};
    let exists = coloredArray.some(item => item.x === cellX && item.y === cellY);

    if (!exists) {
        if (grid[cellY][cellX]) {
            ctx.fillStyle = empty;
            grid[cellY][cellX] = false;
            ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
            ctx.strokeRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
        } else {
            ctx.fillStyle = grad;
            grid[cellY][cellX] = true;
            ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
            ctx.strokeRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
        }
        coloredArray.push(coordinates);
    }
}

let isMouseDown = false;
let coloredArray = [];
canvas.addEventListener('mousedown', function() {
    painting();
    isMouseDown = true;
});

canvas.addEventListener('mouseup', function() {
    isMouseDown = false;
    coloredArray = [];
});

canvas.addEventListener('mousemove', function(event) {
    if (isMouseDown) {
        painting();
    }
});


// События касания
let isTouching = false;
canvas.addEventListener('touchstart', function() {
    painting();
    isTouching = true;
});

canvas.addEventListener('touchend', function() {
    isTouching = false;
    coloredArray = [];
});

canvas.addEventListener('touchmove', function(e) {
    
    if (isTouching) {
        e.preventDefault();
        painting();
    }
}, { passive: false });

// Координаты тора
function getToroidalCoordinates(i, j) {
    return {
        row: (i + rows) % rows,
        col: (j + cols) % cols
    };
}

// Проверка наличия живых клеток
let countTrueProperties;
function gridTrueCheck() {
    grid.reduce((count, obj) => {
        let trueCount = 0;
        for (let prop in obj) {
            if (obj[prop] === true) {
                trueCount++;
            }
        }
        return countTrueProperties = count + trueCount;
    }, 0);
}

// Проверка соседних клеток
function checkNeighbors() {
    let newGrid = new Array(rows); 
    for (let i = 0; i < rows; i++) {
        newGrid[i] = new Array(cols);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let blackNeighbors = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;

                    let ni = getToroidalCoordinates(i + dx, j + dy).row;
                    let nj = getToroidalCoordinates(i + dx, j + dy).col;

                    if (grid[ni][nj]) {
                        blackNeighbors++;
                    }
                }
            }

            if (grid[i][j] && (blackNeighbors < 2 || blackNeighbors > 3)) {
                newGrid[i][j] = false;
            } else if (!grid[i][j] && blackNeighbors === 3) {
                newGrid[i][j] = true;
            } else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }

    grid = newGrid;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.fillStyle = grid[i][j] ? grad : empty;
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }

    // Если живых нет - останавливаем игру
    gridTrueCheck();
    if (countTrueProperties == 0){
        gameStop();
    };
}