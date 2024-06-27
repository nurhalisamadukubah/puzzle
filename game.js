var rows = 3;
var columns = 3;

var currTile;
var otherTile;

var gameActive = false; //check if the game is active

window.onload = function() {
    //initialize the 3x3 board
    initGame();
    //timer
    document.getElementById('startbutton').addEventListener('click', startTimer);

    var timer;
    var timeRemaining = 10; // 3 minutes in seconds

    function startTimer() {
        clearInterval(timer);
        timeRemaining = 10; // Reset the time
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

        if (timeRemaining <= 0) {
            clearInterval(timer);
            gameActive = false; // Set game as inactive
            alert('Time is up!');
            return;
        }

        timeRemaining--;
    }
};

function dragStart() {
    if (!gameActive) return; // menghentikan permainan
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
}

function initGame() {
    function setListener(elem){
        elem.addEventListener("dragstart", dragStart); //click on image to drag
        elem.addEventListener("dragover", dragOver);   //drag an image
        elem.addEventListener("dragenter", dragEnter); //dragging an image into another one
        elem.addEventListener("dragleave", dragLeave); //dragging an image away from another one
        elem.addEventListener("drop", dragDrop);       //drop an image onto another one
        elem.addEventListener("dragend", dragEnd);     //after you completed dragDrop
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.src = "./images/blank2.jpg";
            setListener(tile);
            document.getElementById("board").append(tile);
        }
    }

    var key = []; for (i = 0; i < 16; i++) key[i] = i+1;
    key = key; for (i = 16; i < 32; i++) key[i] = i-16+1;
    var nonce = []; for (i = 0; i < 8; i++) nonce[i] = i+1+100;
    var counter = []; for (i = 0; i < 8; i++) counter[i] = i+1+100+8;
    
    var sigma = [0x61707865, 0x3120646E, 0x79622D36, 0x6B206574];

    var salsa20 = new Salsa20(key, nonce, counter, sigma);
    var hexOutputArray = salsa20.getHexStringArray(64);
    // console.log("64 array keystream:", hexOutputArray);
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
    ]

    posDict = {};
    for (i = 0; i < hexOutputArray.length; i++){
        posDict[i] = imgArr[((parseInt(hexOutputArray[i], 16)) % 9)];
        // console.log("i : " + i +  " , element: " + hexOutputArray[i] + " ,  dec : " + (parseInt(hexOutputArray[i], 16)) + " ,  dec mod 9 : " + ((parseInt(hexOutputArray[i], 16)) % 9));
        
        var imgInd = ((parseInt(hexOutputArray[i], 16)) % 9)
        if(imgArr[imgInd] != false){
            var imgElement = document.createElement("img");
            imgElement.src = imgArr[imgInd];
            setListener(imgElement);

            document.getElementById("pieces").append(imgElement);
            imgArr[imgInd] = false;
        }
        if(i == 8) break;
    }

    imgArr.forEach(img => {
        if(img){
            var imgElement = document.createElement("img");
            imgElement.src = img;
            setListener(imgElement);
            
            document.getElementById("pieces").append(imgElement);
        }
    });
}



