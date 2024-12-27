var rows = 4;
var columns = 4;
var currTile;
var otherTile;
var gameActive = false; // check if the game is active
var timer;
var timeRemaining; // 3 minutes in seconds
var correctOrder = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", 
                    "5.jpg", "6.jpg", "7.jpg", "8.jpg",
                    "9.jpg","10.jpg","11.jpg","12.jpg",
                    "13.jpg","14.jpg","15.jpg","16.jpg"];

initGame();

// timer
document.getElementById('startbutton').addEventListener('click', startTimer);
function startTimer() {
    clearInterval(timer);
    resetBoard(); // Reset the board to initial state
    timeRemaining = 25; // Reset the time to 3 minutes
    gameActive = true; // Set game as active
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    document.getElementById('time').textContent = `${minutes}:${seconds}`;

    if (timeRemaining == 0) {
        clearInterval(timer);
        gameActive = false; // Set game as inactive
        alert('WAKTU HABIS');
        return;
    }

    timeRemaining--;
}

function dragStart() {
    if (!gameActive) return; // Stop if the game is not active
    currTile = this; // this refers to the image that was clicked on for dragging
}

function dragOver(e) {
    if (!gameActive) return;
    e.preventDefault();
}

function dragEnter(e) {
    if (!gameActive) return;
    e.preventDefault();
}

function dragLeave() {
    if (!gameActive) return;
}

function dragDrop() {
    if (!gameActive) return;
    otherTile = this; // this refers to the image that is being dropped on
}

function dragEnd() {
    if (!gameActive) return;
    if (currTile.src.includes("blank2")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    checkBoard(); // Check the board after each swap
}

function initGame() {
    createBoard();
    createPieces();
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear the board

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.src = "./images/blank2.jpg";
            setListener(tile);
            board.append(tile);
        }
    }
}

function createPieces() {
    const pieces = document.getElementById("pieces");
    pieces.innerHTML = ""; // Clear the pieces
    var key = []; for (i = 0; i < 16; i++) key[i] = i + 1;
    key = key; for (i = 16; i < 32; i++) key[i] = i - 16 + 1;
    var nonce = []; for (i = 0; i < 8; i++) nonce[i] = i + 1 + 100;
    var counter = []; for (i = 0; i < 8; i++) counter[i] = i + 1 + 100 + 8;

    var sigma = [0x61707865, 0x3120646E, 0x79622D36, 0x6B206574];

    var salsa20 = new Salsa20(key, nonce, counter, sigma); //test comment
    var hexOutputArray = salsa20.getHexStringArray(64);
    var imgArr = [
        "./images/1.jpg",
        "./images/2.jpg",
        "./images/3.jpg",
        "./images/4.jpg",
        "./images/5.jpg",
        "./images/6.jpg",
        "./images/7.jpg",
        "./images/8.jpg",
        "./images/9.jpg",
        "./images/10.jpg",
        "./images/11.jpg",
        "./images/12.jpg",
        "./images/13.jpg",
        "./images/14.jpg",
        "./images/15.jpg",
        "./images/16.jpg",
    ]

    posDict = {};
    for (i = 0; i < hexOutputArray.length; i++) {
        posDict[i] = imgArr[((parseInt(hexOutputArray[i], 16)) % 16)];
        console.log("i : " + i +  " , element: " + hexOutputArray[i] + " ,  dec : " + (parseInt(hexOutputArray[i], 16)) + " ,  dec mod 16 : " + ((parseInt(hexOutputArray[i], 16)) % 16));
        var imgInd = ((parseInt(hexOutputArray[i], 16)) % 16)
        if (imgArr[imgInd] != false) {
            var imgElement = document.createElement("img");
            imgElement.src = imgArr[imgInd];
            setListener(imgElement);

            document.getElementById("pieces").append(imgElement);
            imgArr[imgInd] = false;
        }
        if (i == 15) break;
    }

    imgArr.forEach(img => {
        if (img) {
            var imgElement = document.createElement("img");
            imgElement.src = img;
            setListener(imgElement);
            pieces.append(imgElement);
        }
    });
}

function setListener(elem) {
    elem.addEventListener("dragstart", dragStart); // click on image to drag
    elem.addEventListener("dragover", dragOver);   // drag an image
    elem.addEventListener("dragenter", dragEnter); // dragging an image into another one
    elem.addEventListener("dragleave", dragLeave); // dragging an image away from another one
    elem.addEventListener("drop", dragDrop);       // drop an image onto another one
    elem.addEventListener("dragend", dragEnd);     // after you completed dragDrop
}

function resetBoard() {
    createBoard(); // Clear and reinitialize the board
    createPieces(); // Clear and reinitialize the pieces
}

function checkBoard() {
    const board = document.getElementById("board").getElementsByTagName("img");
    for (let i = 0; i < board.length; i++) {
        // Extract the filename from the src attribute and compare with the correct order
        const currentImg = board[i].src.split('/').pop();
        console.log(`Checking tile ${i}: ${currentImg} against ${correctOrder[i]}`); // Debugging statement
        if (currentImg !== correctOrder[i]) {
            return false; // If any tile is not in the correct position, return false
        }
    }
    alert('BERHASIL!');
    clearInterval(timer); // Stop the timer when the game is completed
    gameActive = false; // Set game as inactive
    return true; // All tiles are in the correct position
}
