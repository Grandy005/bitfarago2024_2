//gridCell class
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

//create player
function createPlayer() {
    let player = document.createElement('img');
    player.src = 'https://koenig-media.raywenderlich.com/uploads/2012/06/PixelArtTutorial.png';
    player.style.width = '50px';
    return player;
}

//create tick
function createTick() {
    let tick = document.createElement('img');
    tick.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Green_tick.svg/600px-Green_tick.svg.png';
    tick.style.height = '50px';
    return tick;
}

//remaining steps counter
let remainingSteps = 10;

//remaining steps display
let stepsDisplay = document.getElementById('stepsDisplay');

//total fruits counter
let totalFruits = 0;

//fruit display
let fruitDisplay = document.getElementById('fruitDisplay');

//set players starting cell
let gameMatrix = [];
function setStartingCell(cell) {

    cell.isPlayerCell = true;
    console.log(cell);

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
    console.log(totalFruits);
}

//generating game matrix
function generateGameGrid() {
    const grid = document.querySelector('.parent');
    
    for (let i = 0; i < 8; i++) {
        gameMatrix.push(Array.from(i))
        for (let j = 0; j < 8; j++) {
            const numberOfFruits = Math.floor(Math.random() * (70 - 10 + 1) ) + 10;
            const currentCell = new gridCell(i, j, false, numberOfFruits);
            currentCell.createDivElement();
            
            grid.appendChild(currentCell.divElement);
            gameMatrix[i].push(currentCell);

            currentCell.functionWrapper = () => setStartingCell(currentCell);
            currentCell.divElement.addEventListener('click', currentCell.functionWrapper);
        }
    }
}

//finding the players current cell
function findPlayer() {
    return gameMatrix.flat().find(cell => cell.isPlayerCell == true);
}

//updating cell data
function updateCells(currentCell, newCell) {
    let player = createPlayer();
    let tick = createTick();
    currentCell.divElement.replaceChild(tick, currentCell.divElement.firstChild);
    currentCell.isPlayerCell = false;
    newCell.isPlayerCell = true;
    totalFruits += newCell.numberOfFruits;
    fruitDisplay.textContent = `Begyűjtött gyümölcsök: ${totalFruits}`; 
    stepsDisplay.textContent = `Hátralévő lépések: ${remainingSteps}`;
    newCell.numberOfFruits = 0;
    newCell.divElement.replaceChild(player, newCell.divElement.firstChild);
    console.log(totalFruits);
}

//moving player up
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

//moving player down
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

//moving player right
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

//moving player left
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

generateGameGrid();

//adding event listeners to buttons
document.querySelectorAll('button')[0].addEventListener('click', movePlayerUp);
document.querySelectorAll('button')[1].addEventListener('click', movePlayerDown);
document.querySelectorAll('button')[2].addEventListener('click', movePlayerRight);
document.querySelectorAll('button')[3].addEventListener('click', movePlayerLeft);