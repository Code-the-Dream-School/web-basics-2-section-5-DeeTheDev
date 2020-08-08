//------------------------ Game Project---------------------------
//Do you remember the game Battleship we created before? well .... it is time to make it with the DOM!!
//We are providing you with the design of a board (in the DOM) for a player1, you have to create the board for the player2 using the id property 'board_player2' -> it is the second list (ul) in your index.html file
//First ask the players for their names (use propmt)
//Now each time the turn player clicks on any cell of the opponent's board (you have to verify if the player is clicking the right board) the program needs to verify if there is an opponent's ship in that cell. If it is then the opponent has one less ship
//We want you to store the data of each player in two Player objects. Each object has to store: name, remaining boats, and their respective board.
//Each board needs to be initialized randomly with '0' and four '1' wich means the state of the cell. Numbers 1 are representing the 4 positions of the player's ships
//Also we want you to display the name of the turn player in the tag that has the id 'turn_player'. And if there is a winner  a text with: 'Congratulationes {name_player}!! you win'
//in the index.html file you are going to find 4 more ids: 'name_player1' , 'name_player2' , 'ships_player1' , 'ships_player2'. We want to see the information of each player in the respective elements
//As our previous Battleship, the winner is the player that hits the 4 opponent's ships first
//one more Thing create a 'reset' and a 'new game' buttons as childs of the element with the id 'buttons'. the reset button has to start the game again and the new game create a new game with new players and a new random board.
const displayName1 = document.getElementById("name_player1");
const displayName2 = document.getElementById("name_player2");
const displayLives1 = document.getElementById("ships_player1");
const displayLives2 = document.getElementById("ships_player2");
const board_Player1 = document.getElementById("board_player1");
const board_Player2 = document.getElementById("board_player2");
const displayTurn = document.getElementById("turn_player");
let allCells = document.getElementsByClassName("square");
// Initialize game / Setup
const game = {};
game.init = function () {
    let modal = $(".modal");
    modal.modal("show");
    gameSetup();
};
game.init();

// Function to generate new players
function gameSetup() {
    // Player class function
    class Player {
        constructor(name) {
            this.name = name;
            this.shipCount = shipCount;
            this.gameBoard = this.genBoard();
            this.shipCoords = [];
            this.guessedCoords = [];
            this.isPlaying = false;
        }
        //Helper function: Generates new gameBoard for each new Player
        genBoard() {
            return [...Array(4)].map((e) => Array(4).fill(0));
        }
        shipHit() {
            this.shipCount--;
        }
    }
    const [p1Name, p2Name] = getNames();
    let shipCount = 0;
    // create players
    let player1 = new Player(p1Name);
    let player2 = new Player(p2Name);
    player1.isPlaying = true; //first player to play
    // display stats
    displayTurn.textContent = player1.name + "'s Turn";
    displayName1.textContent = player1.name;
    displayName2.textContent = player2.name;

    //Also generate ships and gamePlayers
    generatePlayersShips(player1, player2);
    battleShip(1, player1, player2);
    battleShip(2, player2, player1);
}

//-------------------------------------------------------------------
//      HELPER FUNCTIONS
//-------------------------------------------------------------------
// Ask for new names function
function getNames() {
    let p1Name = document.getElementById("player1Name").value;
    let p2Name = document.getElementById("player2Name").value;
    return [p1Name, p2Name];
}

// Add new random ships to player function
function addNewShips(player) {
    let maxShips = 4;
    for (let i = 0; i < maxShips; i++) {
        let y = getRandomInt(3);
        let x = getRandomInt(3);
        let genCoords = player.gameBoard[y][x];
        if (genCoords === 0 && genCoords != 1) {
            // CONSOLE HELPER
            console.log(
                player.name + "'s ship " + (player.shipCount + 1) + ": " + x,
                y
            );
            // push coords to player shipCoords
            player.shipCoords.push([x, y]);
            // add ship to these coordinates
            player.gameBoard[y][x] = 1;

            // Increment shipCount on player
            player.shipCount++;
        } else {
            // allows for loop to continue, generating new coords due to Duplicate coords
            maxShips++;
        }
    }
}
// generate random number between 0 -3
function getRandomInt(max) {
    return Math.floor(Math.random() * (Math.floor(max) + 1)); // + 1 = max number INCLUSIVE
}
// Generates new random ship coordinates to players
function generatePlayersShips(player1, player2) {
    addNewShips(player1);
    addNewShips(player2);
    //display lives after created by addNewShips function
    displayLives1.textContent = player1.shipCount;
    displayLives2.textContent = player2.shipCount;
    // CONSOLE HELPER
    console.log(player1);
    console.log(player2);
}
//for loops
function battleShip(id, player, opponent) {
    const boardPlayer = document.getElementById(`board_player${id}`);
    for (var x = 0; x < 4; x++) {
        const li = document.createElement("li"); // creating childs for the list (board), in this case represent a row number 'x' of the board

        for (var y = 0; y < 4; y++) {
            const cell = document.createElement("div");
            cell.className = "square"; // adding css properties to make it looks like a square
            cell.textContent = `${x},${y}`; // saves the coordinates as a string value 'x,y'
            cell.value = 0; //state of the cell
            //this function adds the click event to each cell
            cell.addEventListener("click", (e) => {
                let cell = e.target; // get the element clicked
                hitOrMiss(cell, player, opponent);
                gameWon(player, opponent);
            });

            li.appendChild(cell); //adding each cell into the row number x
        }
        boardPlayer.appendChild(li); //adding each row into the board
    }
}
// game battlezone
function hitOrMiss(cell, player, opponent) {
    // get player names in variables
    let playerName = player.name;
    // remove all commas and split into array [1,0]
    let separateCoords = cell.textContent.replace(/,/g, "").split("");
    let xCoord = separateCoords[0];
    let yCoord = separateCoords[1];
    let target = player.gameBoard[yCoord][xCoord];

    while (!player.isPlaying && gameWon(player, opponent) === false) {
        console.log(playerName + " is Playing.");
        if (target === 1) {
            player.shipHit();
            console.log(playerName + "'s ship count is " + player.shipCount);
            console.log("It's a hit folks!");
            cell.style.backgroundColor = "#ff7272";
            takeTurn(player, opponent);
        } else {
            cell.style.backgroundColor = "white";
            takeTurn(player, opponent);
        }
        console.log(xCoord, yCoord);
        console.log(cell.value);
    }
}
// function for players to take turns
function takeTurn(player, opponent) {
    displayLives1.textContent = player.shipCount;
    // take turns with isPlaying boolean
    player.isPlaying = true;
    opponent.isPlaying = false;
    displayTurn.textContent = player.name + "'s turn";
}
function gameWon(p1, p2) {
    let winnerMsg = "";
    if (p1.shipCount === 0) {
        winnerMsg = "Game Over! " + p2.name + " has won the game!";
        displayTurn.textContent = winnerMsg;
        return true;
    } else if (p2.shipCount === 0) {
        winnerMsg = "Game Over! " + p1.name + " has won the game!";
        return true;
    }
    return false;
}
