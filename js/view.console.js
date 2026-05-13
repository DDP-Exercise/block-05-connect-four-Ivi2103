"use strict";

//TODO: Optional: Create a console-view to test your Game.


const consoleView = {

    init() {
        document.addEventListener("connectfour:stoneInserted", function(event) {
            consoleView.printField(event.detail.battlefield);
        });

        document.addEventListener("connectfour:playerChanged", function(event) {
            console.log(">>> " + event.detail.player.name + " ist dran");
        });

        document.addEventListener("connectfour:gameOver", function(event) {
            if (event.detail.winner) {
                console.log("=== " + event.detail.winner.name + " gewinnt! ===");
            } else {
                console.log("=== Unentschieden! ===");
            }
        });
    },

    printField(battlefield) {
        let output = "\n";
        for (let row = 0; row < 6; row++) {
            let line = "| ";
            for (let col = 0; col < 7; col++) {
                const player = battlefield[row][col];
                if (player === null) {
                    line += ". ";
                } else if (player.color === "pink") {
                    line += "P ";
                } else {
                    line += "G ";
                }
            }
            output += line + "|\n";
        }
        output += "+-+-+-+-+-+-+-+";
        console.log(output);
    }

};

