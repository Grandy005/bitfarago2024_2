// GridCell class
class gridCell {
    constructor(row, column, isPlayerCell, numberOfFruits) {
        this.row = row;
        this.column = column;
        this.isPlayerCell = isPlayerCell;
        this.numberOfFruits = numberOfFruits;
        this.functionWrapper = null;
    }

    createDivElement() {
        const divElement = document.createElement('div');
        divElement.textContent = this.numberOfFruits;
        divElement.classList.add('gridCell');
        this.divElement = divElement;
    }
}

// Remaining steps display
let stepsDisplay = document.getElementById('stepsDisplay');

// Total fruits counter
let totalFruits = 0;

// Fruit display
let fruitDisplay = document.getElementById('fruitDisplay');

// Sets the number of steps
const stepsLimit = 10;

// Remaining steps counter
let remainingSteps = stepsLimit;

// Main entry point of the program
function entryPoint() {
    handleEventListeners();
    generateGameGrid();
    setFirstGameState();
}

let selectedStartingCell = null;

// Replays the game from the first state of board
function replayLevel() {
    remainingSteps = stepsLimit;
    totalFruits = 0;

    gameMatrix = firstGameMatrix.map(row =>
        row.map(cell =>
            new gridCell(cell.row, cell.column, cell.isPlayerCell, cell.numberOfFruits)
        )
    );

    gameMatrix.forEach(x => {
        x.forEach(currentCell => {
            if (currentCell.row == selectedStartingCell.row && currentCell.column == selectedStartingCell.column) {
                currentCell.isPlayerCell = true;
            } else {
                currentCell.isPlayerCell = false;
            }
        });
    });

    fruitDisplay.textContent = `Begyűjtött gyümölcsök: ${totalFruits}`;
    stepsDisplay.textContent = `Hátralévő lépések: ${remainingSteps}`;

    renderGameGrid(gameMatrix);
}

// Saves the first state of the board
let firstGameMatrix = [];
function setFirstGameState() {
    firstGameMatrix = gameMatrix.map(row =>
        row.map(cell =>
            new gridCell(cell.row, cell.column, cell.isPlayerCell, cell.numberOfFruits)
        )
    );
}

// Return the deep copied array
function getFirstGameState() {
    return firstGameMatrix;
}

// Adding event listeners to buttons
function handleEventListeners() {
    document.getElementById("buttonUp").addEventListener('click', movePlayerUp);
    document.getElementById("buttonDown").addEventListener('click', movePlayerDown);
    document.getElementById("buttonRight").addEventListener('click', movePlayerRight);
    document.getElementById("buttonLeft").addEventListener('click', movePlayerLeft);
    document.getElementById("resetButton").addEventListener('click', replayLevel);
}

// Create player
function createPlayer() {
    let player = document.createElement('img');
    player.src = '/player.png';
    player.style.width = '50px';
    return player;
}

// Create check mark
function createCheckMark() {
    let checkmark = document.createElement('img');
    checkmark.src = '/checkmark.png';
    checkmark.style.height = '50px';
    return checkmark;
}

// Set players starting cell
let gameMatrix = [];
function setStartingCell(cell) {
    selectedStartingCell = cell;

    cell.isPlayerCell = true;

    gameMatrix.flat().forEach(cell => {
        if (cell.functionWrapper) {
            cell.divElement.style.cursor = 'unset';
            cell.divElement.removeEventListener('click', cell.functionWrapper);
        };
    });

    document.querySelector('h4').style.display = 'none';
    let player = createPlayer();
    cell.divElement.replaceChild(player, cell.divElement.firstChild);

    totalFruits += cell.numberOfFruits;
    cell.numberOfFruits = 0;

    fruitDisplay.style.display = 'unset';
    fruitDisplay.textContent = `Begyűjtött gyümölcsök: ${totalFruits}`;
    stepsDisplay.style.display = 'unset';
    stepsDisplay.textContent = `Hátralévő lépések: ${remainingSteps}`;

    const buttonContainer = document.querySelector('.buttonContainer');
    buttonContainer.style.display = 'grid';
}

// Generating game matrix
function generateGameGrid() {
    const grid = document.querySelector('.parent');

    for (let i = 0; i < 8; i++) {
        gameMatrix.push(Array.from(i))
        for (let j = 0; j < 8; j++) {
            const numberOfFruits = Math.floor(Math.random() * (70 - 10 + 1)) + 10;
            const currentCell = new gridCell(i, j, false, numberOfFruits);
            currentCell.createDivElement();

            grid.appendChild(currentCell.divElement);
            gameMatrix[i].push(currentCell);

            currentCell.functionWrapper = () => setStartingCell(currentCell);
            currentCell.divElement.addEventListener('click', currentCell.functionWrapper);
        }
    }
}

// Renders the matrix
function renderGameGrid(matrix) {
    const grid = document.querySelector('.parent');
    grid.innerHTML = "";

    matrix.forEach(x => {
        x.forEach(currentCell => {
            currentCell.createDivElement();

            if (currentCell.isPlayerCell) {
                let player = createPlayer();
                currentCell.divElement.replaceChild(player, currentCell.divElement.firstChild);
            }

            grid.appendChild(currentCell.divElement);
        });
    })
}

// Finding the players current cell
function findPlayer() {
    return gameMatrix.flat().find(cell => cell.isPlayerCell == true);
}

// Updating cell data
function updateCells(currentCell, newCell) {
    let player = createPlayer();
    let checkmark = createCheckMark();

    currentCell.divElement.replaceChild(checkmark, currentCell.divElement.firstChild);
    currentCell.isPlayerCell = false;
    newCell.isPlayerCell = true;

    totalFruits += newCell.numberOfFruits;

    fruitDisplay.textContent = `Begyűjtött gyümölcsök: ${totalFruits}`;
    stepsDisplay.textContent = `Hátralévő lépések: ${remainingSteps}`;

    newCell.numberOfFruits = 0;
    newCell.divElement.replaceChild(player, newCell.divElement.firstChild);
}

// Moving player up
function movePlayerUp() {
    const currentCell = findPlayer();
    gameMatrix.forEach(row => {
        row.forEach(newCell => {
            if (newCell.column == currentCell.column && newCell.row == currentCell.row - 1 && remainingSteps > 0) {
                remainingSteps--;
                updateCells(currentCell, newCell);
            }
        })
    })
}

// Noving player down
function movePlayerDown() {
    const currentCell = findPlayer();
    gameMatrix.forEach(row => {
        row.forEach(newCell => {
            if (newCell.column == currentCell.column && newCell.row == currentCell.row + 1 && remainingSteps > 0) {
                remainingSteps--;
                updateCells(currentCell, newCell);
            }
        })
    })
}

// Moving player right
function movePlayerRight() {
    const currentCell = findPlayer();
    gameMatrix.forEach(row => {
        row.forEach(newCell => {
            if (newCell.row == currentCell.row && newCell.column == currentCell.column + 1 && remainingSteps > 0) {
                remainingSteps--;
                updateCells(currentCell, newCell);
            }
        })
    })
}

// Moving player left
function movePlayerLeft() {
    const currentCell = findPlayer();
    gameMatrix.forEach(row => {
        row.forEach(newCell => {
            if (newCell.row == currentCell.row && newCell.column == currentCell.column - 1 && remainingSteps > 0) {
                remainingSteps--;
                updateCells(currentCell, newCell);
            }
        })
    })
}

// Start of program
entryPoint();