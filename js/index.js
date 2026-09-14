const boardController = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    // win conditions
    const winPatterns = () => {
        return [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    };

    const getBoard = () => board;

    const createBoard = () => {
        const gameBoard = document.querySelector("#gameboard");

        board.forEach((_item, idx) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            cell.setAttribute("data-id", idx);
            cell.textContent = "";

            gameBoard.append(cell);
        });
    };

    const checkWinner = (cells) => {
        for (let pattern of winPatterns()) {
            const [a, b, c] = pattern;

            if (
                cells[a].textContent &&
                cells[a].textContent === cells[b].textContent &&
                cells[a].textContent === cells[c].textContent
            ) {
                return true;
            }
        }
    };

    return { createBoard, getBoard, checkWinner };
})();

const playerController = (() => {
    const createPlayer = (playerName = "player1", playerMarker) => {
        return {
            name: playerName,
            marker: playerMarker,
        };
    };

    return { createPlayer };
})();

const uiController = (() => {
    const info = document.querySelector("#info");

    boardController.createBoard();

    const winMessage = (e) => {
        info.textContent = `${e.detail.player.name} has won`;
    };

    const updateDisplay = (message) => {
        info.textContent = message;
    };

    window.addEventListener("update-info", winMessage);

    return { updateDisplay };
})();

const gameController = (() => {
    const p1Name = document.querySelector("#player1");
    const p2Name = document.querySelector("#player2");

    let player1;
    let player2;
    let keepPlaying = true;
    let message = "Click Play Game to Start!";
    let currentPlayer = player1;

    uiController.updateDisplay(message);

    const swapPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        message = `${currentPlayer.name}'s turn`;
    };

    const placeMarker = (e) => {
        if (!keepPlaying) return;

        const cells = document.querySelectorAll(".cell");
        const updateInfoEvent = new CustomEvent("update-info", {
            detail: {
                player: currentPlayer,
            },
        });

        if (e.target.textContent !== "") return;

        const spaceCount = [...cells].reduce(
            (count, item) => (item.textContent === "" ? count + 1 : count),
            0,
        );

        if (currentPlayer === player1) {
            e.target.classList.remove("o");
            e.target.classList.add("x");
        } else {
            e.target.classList.remove("x");
            e.target.classList.add("o");
        }

        e.target.textContent = currentPlayer.marker;

        if (boardController.checkWinner(cells)) {
            dispatchEvent(updateInfoEvent);
            keepPlaying = !keepPlaying;
        } else if (spaceCount === 1) {
            console.log("should log tie");
            uiController.updateDisplay("It's a tie");
        } else {
            swapPlayer();
            if (keepPlaying) uiController.updateDisplay(message);
        }
    };

    const reset = () => {
        keepPlaying = true;
        currentPlayer = player1;
        info.textContent = "";
        const cells = document.querySelectorAll(".cell");

        cells.forEach((e) => (e.textContent = ""));

        document
            .querySelector("#gameboard")
            .addEventListener("click", placeMarker);

        message = `${currentPlayer.name}'s turn`;
        uiController.updateDisplay(message);
    };

    const startButton = document.querySelector("#start-button");
    startButton.addEventListener("click", (e) => {
        player1 = playerController.createPlayer(
            p1Name.value.toUpperCase() || "Player 1",
            "x",
        );
        player2 = playerController.createPlayer(
            p2Name.value.toUpperCase() || "Player 2",
            "o",
        );
        reset();
    });
})();
