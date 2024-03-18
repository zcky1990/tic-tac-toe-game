// import { gameChannelSubscription } from "channels/game_channel"
import consumer from "channels/consumer";

document.addEventListener("DOMContentLoaded", function(event) { 
    const game = {
        isGameOngoing: false,
        activePlayer: "playerOne",
        status: 'Waiting For Player To Get Ready',
        winner: 'none',
        isDraw: false,
        playerOne: {
            id: 'player_1',
            type: 'player_1',
            name:'player 1',
            isReady: false,
            isPlayerOne: true,
            value: 'X'
        },
        playerTwo: {
            id: 'player_2',
            type: 'player_2',
            name:'player 2',
            isReady: false,
            isPlayerOne: false,
            value: 'O'
        },
        board:[['', '', ''], ['', '', ''], ['', '', '']]
    }

    function updateState(data){
        game.isGameOngoing = data.isGameOngoing
        game.activePlayer = data.activePlayer
        game.status= data.status
        game.playerOne = data.playerOne
        game.playerTwo = data.playerTwo
        game.board = data.board
        game.winner = data.winner
        game.isDraw = data.isDraw
        refreshBoard()
        updateUserState();
        checkGameStatus();
        if (game.winner != 'none') {
            let currentPlayer = (game.activePlayer == "playerOne") ? game.playerOne : game.playerTwo ;
            alert(`${currentPlayer.name} wins!!`); 
        }
        if (game.isDraw == true){
            alert(`Nobody wins!!`); 
        }
        setPlayerState();
    }

    function setPlayerState(){
        const searchParams = new URLSearchParams(window.location.search);
        let player = searchParams.get('player');
        if (player == 'playerOne'){
            playerTwoNameInput.disabled = true;
            readyPlayerTwoBtn.classList.add('disabled');
            readyPlayerTwoBtn.classList.add('opacity-25');
        }else if (player == 'playerTwo') {
            playerOneNameInput.disabled = true;
            readyPlayerOneBtn.classList.add('disabled');
            readyPlayerOneBtn.classList.add('opacity-25');
        }
    }

    const elements = document.querySelectorAll(".tile"); 
    for(let i= 0 ; i < elements.length; i++){
        elements[i].addEventListener('click', function(){
            move(this)
        });
    }

    function resetBoard() {
        game.board[0] = ['', '', '']
        game.board[1] = ['', '', '']
        game.board[2] = ['', '', '']
        initBoard();
    }


    function initBoard(){
        setmessage("Waiting for Player");
        for(let row = 0; row< game.board.length; row++){
            for(let col = 0 ; col < 3 ; col++){
                document.getElementById("row-"+(row+1)+"-col-"+(col+1)+"").innerText = game.board[row][col];
            }
        }
    }

    function refreshBoard(){
        for(let row = 0; row< game.board.length; row++){
            for(let col = 0 ; col < 3 ; col++){
                document.getElementById("row-"+(row+1)+"-col-"+(col+1)+"").innerText = game.board[row][col];
            }
        }
    }

    function move(element){
        const searchParams = new URLSearchParams(window.location.search);
        let player = searchParams.get('player');
        if (player !== game.activePlayer ) {
            alert('another player turn');
            return false
        }
        if (!game.isGameOngoing) return false
        if (element.innerText !== '') return false;
        let pos = element.getAttribute('name');
        let row = pos.substr(0, 1);
        let col = pos.substr(2, 2);
        let currentPlayer = (game.activePlayer == "playerOne") ? game.playerOne : game.playerTwo ;
        let isPlayerOne = currentPlayer.isPlayerOne
        
        game.board[row][col] = currentPlayer.value;
        refreshBoard();

        if(checkWinner()){
            game.winner = game.activePlayer
        }

        if (checkDraw()){
            game.isDraw = true
        }
        
        if(isPlayerOne){
            game.activePlayer = "playerTwo";
        }else{
            game.activePlayer = "playerOne";
        }
        sendState();
    }

    function checkDraw() {
        return [...elements].every(element => element.innerText !== '');
    }

    function checkWinner() {
        const winningConditions = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows combination
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns combination
          [0, 4, 8], [2, 4, 6]             // Diagonals combination
        ];
        let currentPlayer = (game.activePlayer == "playerOne") ? game.playerOne : game.playerTwo ;
        return winningConditions.some(combination =>
            combination.every(index => elements[index].innerText === currentPlayer.value)
        );
    }

    function resetUserState(){
        game.playerOne.name = 'player 1'
        game.playerOne.isReady = false
        game.playerTwo.name = 'player 2'
        game.playerTwo.isReady = false
    }

    function resetUIState(){
        playerOneNameInput.disabled = false;
        playerOneNameInput.value='';
        readyPlayerOneBtn.classList.remove('disabled');
        readyPlayerOneBtn.classList.remove('opacity-25');
        playerTwoNameInput.disabled = false
        playerTwoNameInput.value='';
        readyPlayerTwoBtn.classList.remove('disabled');
        readyPlayerTwoBtn.classList.remove('opacity-25');
    }

    const gameMessageStatus = document.querySelector("#gameMessageStatus");
    function setmessage(message){
        gameMessageStatus.innerText = message;
    }

    function checkGameStatus(){
        if (game.playerOne.isReady === true && game.playerTwo.isReady === false){
            setmessage('Player 1 Ready, Waiting for oponent');
        }else if(game.playerOne.isReady === false && game.playerTwo.isReady === true){
            setmessage('Player 2 Ready, Waiting for oponent');
        }else if(game.playerOne.isReady === true && game.playerTwo.isReady === true){
            setmessage('Game Start');
            game.isGameOngoing = true;
        }else {
            setmessage('Waiting For Player To Get Ready');
        }
    }

    const playerOneName= document.querySelector("#player-1-name"); 
    const readyPlayerOneBtn = document.querySelector('#changeNamePlayerOne');
    const playerOneNameInput= document.querySelector("#player-1-name-input"); 
    readyPlayerOneBtn.addEventListener('click', function(){
        playerOneName.innerText = playerOneNameInput.value;
        game.playerOne.name = playerOneNameInput.value;
        game.playerOne.isReady = true;
        playerOneNameInput.disabled = true;
        readyPlayerOneBtn.classList.add('opacity-25');
        readyPlayerOneBtn.classList.add('disabled');
        checkGameStatus();
        sendState();
    });

    function updateUserState(){
        playerOneName.innerText = game.playerOne.name;
        playerTwoName.innerText = game.playerTwo.name;
    }

    const playerTwoName= document.querySelector("#player-2-name"); 
    const readyPlayerTwoBtn = document.querySelector('#changeNamePlayerTwo');
    const playerTwoNameInput= document.querySelector("#player-2-name-input"); 
    readyPlayerTwoBtn.addEventListener('click', function(){
        playerTwoName.innerText = playerTwoNameInput.value;
        game.playerTwo.name = playerTwoNameInput.value;
        game.playerTwo.isReady = true;
        playerTwoNameInput.disabled = true;
        readyPlayerTwoBtn.classList.add('disabled');
        readyPlayerTwoBtn.classList.add('opacity-25');
        checkGameStatus();
        sendState();
    });

    const resetBtn = document.getElementById("resetButton");
    resetBtn.addEventListener('click', function(){
        resetUserState();
        resetUIState();
        resetBoard();
        resetGameData();
        sendState();
        
    })

    const endBtn = document.getElementById('endTurn');
    endBtn.addEventListener('click', function(){
        console.log('skip turn')
        let currentPlayer = (game.activePlayer == "playerOne") ? game.playerOne : game.playerTwo ;
        let isPlayerOne = currentPlayer.isPlayerOne
        if(isPlayerOne){
            game.activePlayer = "playerTwo";
        }else{
            game.activePlayer = "playerOne";
        }
        sendState();
    })

    function resetGameData(){
        game.isGameOngoing= false,
        game.activePlayer= "playerOne",
        game.status= 'Waiting For Player To Get Ready',
        game.winner = 'none'
        game.isDraw = false
        game.playerOne= {
            id: 'player_1',
            type: 'player_1',
            name:'player 1',
            isReady: false,
            isPlayerOne: true,
            value: 'X'
        },
        game.playerTwo= {
            id: 'player_2',
            type: 'player_2',
            name:'player 2',
            isReady: false,
            isPlayerOne: false,
            value: 'O'
        },
        game.board=[['', '', ''], ['', '', ''], ['', '', '']]
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function sendState(){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) { 
                if (xhr.status == 200) {
                    console.log('send data to broadcaster')
                }
                else if (xhr.status == 400) {
                    console.log('Error send data to broadcaste');
                }
                else {
                    console.log('Error send data to broadcaste');
                }
            }
        };
        const room_id = getCookie("room_id");
        const postData = {
            channel_id: `room_${room_id}`,
            data: game
        }
        xhr.open("POST", "/move", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(postData));
    }

    initBoard();
    setPlayerState();

    //set action cable to subscribe
    const room_id = getCookie("room_id");
    consumer.subscriptions.create({ channel: 'GameChannel', id: room_id }, {
        connected() {
            console.log("Connected to GameChannel with room id :"+ room_id);
        },
        received(data) {
            console.log("Received data:", data);
            updateState(data);
        }
    });
});