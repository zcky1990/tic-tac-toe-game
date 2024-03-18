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

    const elements = document.querySelectorAll(".tile"); 
    for(let i= 0 ; i < elements.length; i++){
        elements[i].addEventListener('click', function(){
            if (game.winner == 'none' && game.isDraw == false){
                move(this)
            }
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
        if (!game.isGameOngoing) return false
        if (element.innerText !== '') return false;
        let pos = element.getAttribute('name');
        let row = pos.substr(0, 1);
        let col = pos.substr(2, 2);
        let currentPlayer = (game.activePlayer == "playerOne") ? game.playerOne : game.playerTwo ;
        let isPlayerOne = currentPlayer.isPlayerOne
        
        game.board[row][col] = currentPlayer.value;
        
        if(isPlayerOne){
            game.activePlayer = "playerTwo";
        }else{
            game.activePlayer = "playerOne";
        }
        checkGameStatus();
        refreshBoard();
        
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        

        let playerWins = winningConditions.some(combination =>
            combination.every(index => elements[index].innerText === currentPlayer.value)
        )
        if(playerWins == true){
            game.winner = game.activePlayer
        }

        if (game.winner != 'none') {
            setmessage('Congratulation '+currentPlayer.name +' Wins the Game');
        }

        let isDraw = [...elements].every(element => element.innerText !== '');
        if (isDraw == true){
            game.isDraw = true
        }

        if (game.isDraw == true){
            setmessage("Nobody wins!! Please reset your game to start a new game")
        }
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
        if(game.winner == 'none' && game.isDraw == false) {
            if (game.playerOne.isReady === true && game.playerTwo.isReady === false){
                setmessage('Player 1 Ready, Waiting for oponent');
            }else if(game.playerOne.isReady === false && game.playerTwo.isReady === true){
                setmessage('Player 2 Ready, Waiting for oponent');
            }else if(game.playerOne.isReady === true && game.playerTwo.isReady === true){
                let currentPlayer = (game.activePlayer == "playerOne") ? game.playerOne : game.playerTwo ;
                setmessage(currentPlayer.name +' turn');
                game.isGameOngoing = true;
            }else {
                setmessage('Waiting For Player To Get Ready');
            }
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
    });

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
    });

    const resetBtn = document.getElementById("resetButton");
    resetBtn.addEventListener('click', function(){
        resetUserState();
        resetUIState();
        resetBoard();
        resetGameData();
        
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
    
    initBoard();
});