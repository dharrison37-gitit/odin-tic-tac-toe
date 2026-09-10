"use strict";

const gameBoard = (() => {
    let winState = false;
    let board = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
    ];

    const boardEvent = new CustomEvent("boardReady", {
        detail: true,
    });

    const getBoard = () => {
        return board;
    };

    const reset = () => {
        getBoard();
    };

    const placeMarker = (player, row, col) => {
        console.log(board[0][1]);
        if (winState) return;

        if (board[row][col] === "X" || board[row][col] === "O") {
            console.log("Space not available");
            return;
        }

        board[row][col] = player;
    };

    const checkWin = (gameBoard) => {
        console.log(gameBoard);
        if (
            // Horizontal Test
            (gameBoard[0][0] === gameBoard[0][1] &&
                gameBoard[0][1] === gameBoard[0][2]) ||
            (gameBoard[1][0] === gameBoard[1][1] &&
                gameBoard[1][1] === gameBoard[1][2]) ||
            (gameBoard[2][0] === gameBoard[2][1] &&
                gameBoard[2][1] === gameBoard[2][2]) ||
            // Vertical Test
            (gameBoard[0][0] === gameBoard[1][0] &&
                gameBoard[1][0] === gameBoard[2][0]) ||
            (gameBoard[0][1] === gameBoard[1][1] &&
                gameBoard[1][1] === gameBoard[2][1]) ||
            (gameBoard[0][2] === gameBoard[1][2] &&
                gameBoard[1][2] === gameBoard[2][2]) ||
            // Diaganol Test
            (gameBoard[0][0] === gameBoard[1][1] &&
                gameBoard[1][1] === gameBoard[2][2]) ||
            (gameBoard[0][2] === gameBoard[1][1] &&
                gameBoard[1][1] === gameBoard[2][0])
        ) {
            winState = true;
            console.log("Won!", winState);
        }
    };

    const getWinState = () => winState;

    return { getBoard, reset, placeMarker, checkWin, getWinState };
})();

const displayController = (() => {
    const updateDisplay = () => {
        let board = gameBoard.getBoard();
        gameBoard.checkWin(board);
    };

    return { updateDisplay };
})();

const gameController = (() => {
    let playerOne = "P1";
    let playerTwo = "P2";

    const player1 = {
        name: playerOne,
        marker: "X",
    };

    const player2 = {
        name: playerTwo,
        marker: "O",
    };

    let currentPlayer = player1;

    const switchPlayer = () =>
        (currentPlayer = currentPlayer === player1 ? player2 : player1);

    const getActivePlayer = () => currentPlayer;

    const play = (row, col) => {
        gameBoard.placeMarker(getActivePlayer().marker, row, col);

        displayController.updateDisplay();

        if (gameBoard.getWinState()) {
            console.log(`Winner is ${currentPlayer.name}`);
            console.log("Game Over");
            return;
        }

        switchPlayer();
    };

    return { play };
})();

gameController.play(0, 0);
gameController.play(1, 2);
gameController.play(0, 1);
gameController.play(1, 0);
gameController.play(0, 2);
