"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.



const view = {

    init() {
        this.renderBoard();
        this.addModelListeners();
        this.addColumnClickListeners();

    },

    renderBoard() {
        const board = document.getElementById("board");
        board.innerHTML = "";

        for (let col = 0; col < 7; col++) {
            const column = document.createElement("div");
            column.classList.add("column");
            column.dataset.col = col;

            for (let row = 0; row < 6; row++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                column.appendChild(cell);
            }

            board.appendChild(column);
        }

    },

    addColumnClickListeners() {
        const board = document.getElementById("board");
        board.addEventListener("click", function(event) {
            const column = event.target.closest(".column");
            if (!column) return;

            const col = parseInt(column.dataset.col);
            const clickEvent = new CustomEvent("connectfour:columnClicked", {
                detail: { col: col }
            });
            document.dispatchEvent(clickEvent);

        });
    },

    addModelListeners() {
        //TODO: Update the field. Show the whole battlefield with all the stones
        //      that are already played.
        document.addEventListener("connectfour:stoneInserted", function(event) {
            view.updateField(event.detail.battlefield);
        });

        //TODO: Show the current player
        document.addEventListener("connectfour:playerChanged", function(event) {
            view.showCurrentPlayer(event.detail.player);
        });

        //TODO: Notify the player when the game is over. Make it clear how the
        //      Game ended. If it's a win, show the winning stones.
        document.addEventListener("connectfour:gameOver", function(event) {
            view.updateField(model.battlefield);
            view.showGameOver(event.detail.winner, event.detail.winningStones);
        });
    },

    updateField(battlefield) {
        document.querySelectorAll(".cell").forEach(cell => {
            const player = battlefield[cell.dataset.row][cell.dataset.col];
            cell.classList.remove("pink", "green", "winner");
            if (player) cell.classList.add(player.color);
        });
    },

    showCurrentPlayer(player) {
        const info = document.getElementById("current-player");
        info.textContent = player.name + " ist dran";
        info.style.color = player.color === "pink" ? "#f660f6" : "#00810c";

        // Alten Highlight entfernen
        document.querySelectorAll(".player-card").forEach(card => {
            card.classList.remove("active");
        });

        // Aktiven Spieler highlighten
        const activeCard = document.querySelector(`.player-card[data-player="${player.color}"]`);
        if (activeCard) activeCard.classList.add("active");
    },

    showGameOver(winner, winningStones) {
        const info = document.getElementById("current-player");

        if (winner) {
            info.textContent = winner.name + " gewinnt!";
            info.style.color = winner.color === "pink" ? "#f660f6" : "#00810c";

            // Gewinnsteine markieren
            document.querySelectorAll(".cell").forEach(cell => {
                if (winningStones.some(([r, c]) => r == cell.dataset.row && c == cell.dataset.col))
                    cell.classList.add("winner");
            });
        } else {
            info.textContent = "Unentschieden!";
            info.style.color = "#aaa";
        }

    },


};
//wollte Button machen, fkt aber nicht :(
let divButton= document.getElementById("buttons");
let button= document.createElement("buttons");
divButton.appendChild(button);
