//Load boards from files.
const random1 = [
  "54----6-----4--6----1--4-----1----32",
  "543126612345425613361254234561156432",
];

const random2 = [
  "1--2-4--4--63-5--2----434----1--14--",
  "136254524316345162612543453621261435",
];

//create variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {
  //Run startGame.function when button is clicked.
  id("start-btn").addEventListener("click", startGame);
  //Add eventListner to each number in number container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      //If selecting is not disabled
      if (!disableSelect) {
        //If number is already selected
        if (this.classList.contains("selected")) {
          //Then remove selection
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          //Deselect all other numbers
          for (let i = 0; i < 6; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          //select it and update selectedNum variable
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
};

function startGame() {
  //Choose board level
  let board;
  if (id("diff-1").checked) {
    board = random1[0];
  } else {
    board = random2[0];
  }
  //set lives to 5 and enable selecting numbers and tiles.
  lives = 5;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: 5";
  //Create board base on difficulty.
  generateBoard(board);
  //start the timer
  startTimer();
  //show number container
  id("number-container").classList.remove("hidden");
}

function startTimer() {
  //sets time remaining based on input
  if (id("time-1").checked) timeRemaining = 300;
  else timeRemaining = 600;
  //sets timer for first second
  id("timer").textContent = timeConversion(timeRemaining);
  //sets timer to update every second
  timer = setInterval(function () {
    timeRemaining--;
    //If no time remaining then end game
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}

//Convert second into min:sec
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function generateBoard(board) {
  //Clear any previous board
  clearPrevious();
  //Let used to increment tile ids
  let idCount = 0;
  //Create 36 tiles
  for (let i = 0; i < 36; i++) {
    //Create a new paragraph element
    let tile = document.createElement("p");
    if (board.charAt(i) != "-") {
      tile.textContent = board.charAt(i);
    } else {
      //Add clickeventlistner to tile
      tile.addEventListener("click", function () {
        //If selcting is not disabled
        if (!disableSelect) {
          //If the tile is already selected
          if (tile.classList.contains("selected")) {
            //Then remove selction
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //Deslect all other tiles
            for (let i = 0; i < 36; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //Add selection and update variable
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //Assign tile id
    tile.id = idCount;
    // Increment for next id
    tile.classList.add("tile");
    if (tile.id < 6) {
      tile.classList.add("topBorder");
    }
    if (tile.id % 6 == 0) {
      tile.classList.add("leftBorder");
    }
    if ((tile.id > 5 && tile.id < 12) || (tile.id > 17 && tile.id < 24) || (tile.id > 29 && tile.id < 36)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 6 == 3) {
      tile.classList.add("rigthBorder");
    }
    //Add tile to board
    id("board").appendChild(tile);
    idCount++;
  }
}

function updateMove() {
  //If a tile and a number is selected
  if (selectedTile && selectedNum) {
    // Set the tile to correct number
    selectedTile.textContent = selectedNum.textContent;
    //Checking for match
    if (checkCorrect(selectedTile)) {
      //Deselects the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      //Clear the selected variables
      selectedNum = null;
      selectedTile = null;
      //Check if board is completed
      if (checkDone()) {
        endGame();
      }
      //If the number does not match the solution
    } else {
      //Disable selcting new numbers for one second
      disableSelect = true;
      //Make tile red
      selectedTile.classList.add("incorrect");
      //Rum in one second
      setTimeout(function() {
        //Subtract lives by one
        lives--;
        //If no lives left end the game
        if (lives === 0) {
          endGame();
        } else {
          //Update lives text
          id("lives").textContent = "Lives Remaining: " + lives;
          //Renable selecting numbers and tiles
          disableSelect = false;
        }
        //Restore tile color and remove selected from both
        selectedTile.classList.remove("incorrected");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        //Clear the tiles text and clear selected variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 500);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  //Disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  //Diplay win or loss message
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "Loser!";
  } else {
    id("lives").textContent = "Lucky!";
  }
} 


function checkCorrect(tile) {
  //Set solution based on level
  let solution;
  if (id("diff-1").checked) {
    solution = random1[1];
  } else {
    solution = random2[1];
  }
  //If tile's number is equal to solution's number
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  //ACcess all the tiles
  let tiles = qsa(".tile");
  //Remove each tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  //If time is up
  if (timer) clearTimeout(timer);
  //Deselect any numbers
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }
  //Clear selected variables
  selectedNum = null;
  selectedTile = null;
}

//Helper Function
function id(id) {
  return document.getElementById(id);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
