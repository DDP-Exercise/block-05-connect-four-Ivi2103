"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

const model = {
    players: [
        { name: "Glinda", color: "pink" },
        { name: "Elphaba", color: "green" }
    ],
    currentPlayerIndex: 0,
    currentPlayer: null,
    gameOver: false,
    winner: null,
    winningStones: [],
    battlefield: [],

    ROWS: 6,
    COLS: 7,

    //TODO: Prepare some customEvents. The model should dispatch events when
    //      - The Player Changes
    //      - A stone was inserted
    //      - The Game is over (Draw or Winner)
    //      Don't forget to give your events a namespace.
    //      For each customEvent, just make a >method< for your model-object,
    //      that, when called, dispatches the event. Nothing else should
    //      happen in those methods.

    dispatchPlayerChanged() {
        const event = new CustomEvent("connectfour:playerChanged", {
            detail: { player: this.currentPlayer }
        });
        document.dispatchEvent(event);
    },

    dispatchStoneInserted() {
        const event = new CustomEvent("connectfour:stoneInserted", {
            detail: { battlefield: this.battlefield }
        });
        document.dispatchEvent(event);
    },

    dispatchGameOver() {
        const event = new CustomEvent("connectfour:gameOver", {
            detail: {
                winner: this.winner,
                winningStones: this.winningStones
            }
        });
        document.dispatchEvent(event);
    },

    //TODO: Initiate the battlefield. Your model needs a representation of the
    //      battlefield as data (two-dimensional array). Obviously, there are
    //      no stones yet in the field.

    initBattlefield() {
        this.battlefield = [];
        for (let row = 0; row < this.ROWS; row++) {
            this.battlefield[row] = [];
            for (let col = 0; col < this.COLS; col++) {
                this.battlefield[row][col] = null; // null = kein Stein
            }
        }
    },

    init() {
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winner = null;
        this.winningStones = [];
        this.initBattlefield();
        this.dispatchPlayerChanged();
    },

    //TODO: The model should offer a method to insert a stone at a given column.
    //      If the stone can be inserted, the model should insert the stone,
    //      dispatch an event to let the world know that the battlefield has changed
    //      and check if the game is over now.
    //      Hint: This method will be called later by your controller, when the
    //      user makes an according input.

    insertStone(col) {
        if (this.gameOver) return false;

        // Von unten nach oben schauen, wo der Stein landen kann
        let targetRow = -1;
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.battlefield[row][col] === null) {
                targetRow = row;
                break;
            }
        }

        // Spalte voll
        if (targetRow === -1) return false;

        this.battlefield[targetRow][col] = this.currentPlayer;
        this.dispatchStoneInserted();

        // Prüfen ob Spiel vorbei
        this.checkGameOver(targetRow, col);

        return true;
    },

    //TODO: Methods to check if the game is over, either by draw or a win.
    //      Let the world know in both cases what happend. If it's a win,
    //      Don't forget to store the winning stones and add this >detail<
    //      to your custom event.

    checkGameOver(row, col) {
        // Gewinner prüfen
        const hasWinner = this.checkWin(row, col);
        if (hasWinner) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.dispatchGameOver();
            return;
        }

        // Unentschieden prüfen
        let draw = true;
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                if (this.battlefield[r][c] === null) {
                    draw = false;
                    break;
                }
            }
        }

        if (draw) {
            this.gameOver = true;
            this.winner = null;
            this.dispatchGameOver();
            return;
        }
        this.changePlayer();
    },

    checkWin(row, col) {
        const player = this.battlefield[row][col];

        // Alle vier Richtungen prüfen
        const directions = [
            [[0, 1], [0, -1]],   // horizontal
            [[1, 0], [-1, 0]],   // vertikal
            [[1, 1], [-1, -1]],  // diagonal links nach unten
            [[1, -1], [-1, 1]]   // diagonal rechts nach unten
        ];

        for (const [dir1, dir2] of directions) {
            const stones = [[row, col]];

            for (const [dr, dc] of [dir1, dir2]) {
                let r = row + dr;
                let c = col + dc;
                while (
                    r >= 0 && r < this.ROWS &&
                    c >= 0 && c < this.COLS &&
                    this.battlefield[r][c] === player
                    ) {
                    stones.push([r, c]);
                    r += dr;
                    c += dc;
                }
            }

            if (stones.length >= 4) {
                this.winningStones = stones;
                return true;
            }
        }

        return false;
    },

    //TODO: Method to change the current player (and dispatch the according event).

    changePlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.dispatchPlayerChanged();
    }
};
