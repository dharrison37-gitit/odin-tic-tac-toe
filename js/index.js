"use strict";

const gameBoard = (() => {
    let winState = false;
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const getBoard = () => {
        return board;
    };

    const reset = () => {
        getBoard();
    };

    const placeMarker = (player, row, col) => {
        if (winState) return;

        if (board[row][col] === "X" || board[row][col] === "O") {
            console.log("Space not available");
            return;
        }

        board[row][col] = player;
    };

    const checkWin = (gameBoard) => {
        const winEvent = new CustomEvent("win-event", {
            detail: {
                message: `has won the game!`,
                winState: true,
            },
        });

        const tieEvent = new CustomEvent("tie-event", {
            detail: {
                message: "It's a tie",
            },
        });

        const spacesAvailable = gameBoard.flat().reduce((count, space) => {
            return space === "" ? count + 1 : count;
        }, 0);

        if (!spacesAvailable && !winState) {
            dispatchEvent(tieEvent);
            return;
        }

        if (
            // Horizontal Test
            (gameBoard[0][0] !== "" &&
                gameBoard[0][0] === gameBoard[0][1] &&
                gameBoard[0][0] === gameBoard[0][2]) ||
            (gameBoard[1][0] !== "" &&
                gameBoard[1][0] === gameBoard[1][1] &&
                gameBoard[1][0] === gameBoard[1][2]) ||
            (gameBoard[2][0] !== "" &&
                gameBoard[2][0] === gameBoard[2][1] &&
                gameBoard[2][0] === gameBoard[2][2]) ||
            // Vertical Test
            (gameBoard[0][0] !== "" &&
                gameBoard[0][0] === gameBoard[1][0] &&
                gameBoard[0][0] === gameBoard[2][0]) ||
            (gameBoard[0][1] !== "" &&
                gameBoard[0][1] === gameBoard[1][1] &&
                gameBoard[0][1] === gameBoard[2][1]) ||
            (gameBoard[0][2] !== "" &&
                gameBoard[0][2] === gameBoard[1][2] &&
                gameBoard[0][2] === gameBoard[2][2]) ||
            // Diaganol Test
            (gameBoard[0][0] !== "" &&
                gameBoard[0][0] === gameBoard[1][1] &&
                gameBoard[0][0] === gameBoard[2][2]) ||
            (gameBoard[0][2] !== "" &&
                gameBoard[0][2] === gameBoard[1][1] &&
                gameBoard[0][2] === gameBoard[2][0])
        ) {
            // winState = true;
            dispatchEvent(winEvent);
        }
    };

    return { getBoard, reset, placeMarker, checkWin };
})();

const displayController = (() => {
    let board = gameBoard.getBoard();
    let message = "";
    let keepPlaying = true;

    const updateDisplay = () => {
        if (!keepPlaying) return;
        gameBoard.checkWin(board);
        console.clear();
        console.log(`
            ${board[0][0]} | ${board[0][1]} | ${board[0][2]}\n
            ---------\n
            ${board[1][0]} | ${board[1][1]} | ${board[1][2]}\n
            ---------\n
            ${board[2][0]} | ${board[2][1]} | ${board[2][2]}\n\n
            ${message}`);
    };

    window.addEventListener("win-event", (e) => {
        message = `${gameController.getActivePlayer().name} ${e.detail.message}`;
        console.log(message);
        keepPlaying = !e.detail.winState;
    });

    window.addEventListener("tie-event", (e) => {
        message = e.detail.message;
        console.log(message);
    });

    return { updateDisplay };
})();

function createPlayer(playerName, playerMarker) {
    return {
        name: playerName,
        marker: playerMarker,
    };
}

const gameController = (() => {
    let player1 = createPlayer("Jack", "x");
    let player2 = createPlayer("John", "o");

    let currentPlayer = player1.marker === "x" ? player1 : player2;

    const switchPlayer = () =>
        (currentPlayer = currentPlayer === player1 ? player2 : player1);

    const getActivePlayer = () => currentPlayer;

    const play = (row, col) => {
        gameBoard.placeMarker(getActivePlayer().marker, row, col);

        displayController.updateDisplay();

        switchPlayer();
    };

    return { play, getActivePlayer };
})();

// Tie Test
// gameController.play(0, 0);
// gameController.play(0, 1);
// gameController.play(1, 0);
// gameController.play(2, 0);
// gameController.play(0, 2);
// gameController.play(1, 1);
// gameController.play(2, 1);
// gameController.play(2, 2);
// gameController.play(1, 2);

gameController.play(0, 0);
gameController.play(1, 2);
gameController.play(0, 1);
gameController.play(1, 1);
gameController.play(0, 2);
gameController.play(1, 0); // should not respond as game is won!
