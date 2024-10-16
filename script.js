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

// Start of program after DOM load
document.addEventListener("DOMContentLoaded", () => {
    entryPoint();
});

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
    handleEventListeners(false);
    generateGameGrid();
    setFirstGameState();
}

let selectedStartingCell = null;

// Start a new game
function newLevel() {
    location.reload();
}

// Replays the game from the first state of board
function replayLevel() {
    remainingSteps = stepsLimit;
    totalFruits = 0;

    document.getElementById("diagonalExtraButton").disabled = false;

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

// Adding event listeners
function handleEventListeners(diagonalMove) {
    document.getElementById("buttonUp").addEventListener('click', movePlayerUp);
    document.getElementById("buttonDown").addEventListener('click', movePlayerDown);
    document.getElementById("buttonRight").addEventListener('click', movePlayerRight);
    document.getElementById("buttonLeft").addEventListener('click', movePlayerLeft);

    document.getElementById("diagonalExtraButton").addEventListener('click', diagonalExtra);
    // document.getElementById("plusAreaExtraButton").addEventListener('click', plusAreaExtra);

    if (diagonalMove) {
        document.getElementById("buttonUp2").addEventListener('click', movePlayerUp);
        document.getElementById("buttonDown2").addEventListener('click', movePlayerDown);
        document.getElementById("buttonRight2").addEventListener('click', movePlayerRight);
        document.getElementById("buttonLeft2").addEventListener('click', movePlayerLeft);
        
        document.getElementById("buttonUpLeft").addEventListener('click', movePlayerUpLeft);
        document.getElementById("buttonUpRight").addEventListener('click', movePlayerUpRight);
        document.getElementById("buttonDownLeft").addEventListener('click', movePlayerDownLeft);
        document.getElementById("buttonDownRight").addEventListener('click', movePlayerDownRight);
    }

    document.getElementById("resetButton").addEventListener('click', replayLevel);
    document.getElementById("newLevelButton").addEventListener('click', newLevel);
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

    fruitDisplay.style.display = 'flex';
    fruitDisplay.textContent = `Begyűjtött gyümölcsök: ${totalFruits}`;
    stepsDisplay.style.visibility = 'visible';
    stepsDisplay.textContent = `Hátralévő lépések: ${remainingSteps}`;

    document.getElementsByClassName("buttonContainer")[0].style.visibility = "visible";
    document.getElementsByClassName("extraContainer")[0].style.visibility = "visible";
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

// Extra for larger pick radius
function plusAreaExtra() {
    console.log("Not implemented");
}

// Extra for diagonal movement
function diagonalExtra() {
    document.getElementsByClassName("diagonalButtonContainer")[0].style.display = "flex";
    document.getElementsByClassName("buttonContainer")[0].style.display = "none";

    handleEventListeners(true);
}

function normalMovement() {
    document.getElementById("diagonalExtraButton").disabled = true;

    document.getElementsByClassName("diagonalButtonContainer")[0].style.display = "none";
    document.getElementsByClassName("buttonContainer")[0].style.display = "flex";
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

// Moving player up-left
function movePlayerUpLeft() {
    const currentCell = findPlayer();
    if (currentCell.row > 0 && currentCell.column > 0 && remainingSteps > 0) {
        const newCell = gameMatrix[currentCell.row - 1][currentCell.column - 1];
        remainingSteps--;
        updateCells(currentCell, newCell);

        normalMovement();
    }
    else {
        alert("Helytelen lépés!");
    }
}

// Moving player up-right
function movePlayerUpRight() {
    const currentCell = findPlayer();
    if (currentCell.row > 0 && currentCell.column < gameMatrix[0].length - 1 && remainingSteps > 0) {
        const newCell = gameMatrix[currentCell.row - 1][currentCell.column + 1];
        remainingSteps--;
        updateCells(currentCell, newCell);

        normalMovement();
    }
    else {
        alert("Helytelen lépés!");
    }
}

// Moving player down-left
function movePlayerDownLeft() {
    const currentCell = findPlayer();
    if (currentCell.row < gameMatrix.length - 1 && currentCell.column > 0 && remainingSteps > 0) {
        const newCell = gameMatrix[currentCell.row + 1][currentCell.column - 1];
        remainingSteps--;
        updateCells(currentCell, newCell);

        normalMovement();
    }
    else {
        alert("Helytelen lépés!");
    }
}

// Moving player down-right
function movePlayerDownRight() {
    const currentCell = findPlayer();
    if (currentCell.row < gameMatrix.length - 1 && currentCell.column < gameMatrix[0].length - 1 && remainingSteps > 0) {
        const newCell = gameMatrix[currentCell.row + 1][currentCell.column + 1];
        remainingSteps--;
        updateCells(currentCell, newCell);

        normalMovement();
    }
    else {
        alert("Helytelen lépés!");
    }
}
