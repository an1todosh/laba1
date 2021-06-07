var blessed = require('blessed');

var Config = require("./config")

var program = blessed.program();

var GameClass = require("./src/game");
var Game = new GameClass();
var screen = blessed.screen({
    smartCSR: true
});
var GameBox = blessed.box({
    top: 0,
    left: 0,
    width: Config.Wide + 2,
    height: Config.Tall + 2,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: '',
        border: {
            fg: 'yellow'
        },
    }
});
function ClearScreeen() {
    GameBox.setContent("");
    screen.render();
    GameBox.setContent(("*".repeat(Config.Wide) + "\n").repeat(Config.Tall));
    screen.render();
}

var StatusText = blessed.box({
    parent: screen,
    tags: true,
    left: 0,
    width: Config.Wide + 2,
    top: Config.Tall + 2,
    height: 1,
    style: {
        fg: "white",
    }
});
screen.append(GameBox);

// Listen for 'control' keys
function FindFree(x, y, dirX, dirY) {
    for (let i = 1; i <= Math.max(Config.Wide, Config.Tall); i++) {
        let resultX = x + dirX * i;
        let resultY = y + dirY * i;
        if (resultX < 0 | resultX > Config.Wide - 1) {
            continue;
        }
        if (resultY < 0 | resultY > Config.Tall - 1) {
            continue;
        }
        let resultChar = Game.Map.GetChar(resultX, resultY);
        if (!resultChar) {
            return [resultX, resultY];
        }
    }
    return false
}
screen.key(["left", "right", "up", "down"], function (_, data) {
    if (Game.Status != "alive") { return; }

    let result;
    switch (data.name) {
        case "left":
            result = FindFree(Game.ActivePlayer.x, Game.ActivePlayer.y, -1, 0);
            if (!result) {
                return;
            }
            Game.ActivePlayer.x = result[0];
            break;

        case "right":
            result = FindFree(Game.ActivePlayer.x, Game.ActivePlayer.y, 1, 0);
            if (!result) {
                return;
            }
            Game.ActivePlayer.x = result[0];
            break;

        case "up":
            result = FindFree(Game.ActivePlayer.x, Game.ActivePlayer.y, 0, -1);
            if (!result) {
                return;
            }
            Game.ActivePlayer.y = result[1];
            break;

        case "down":
            result = FindFree(Game.ActivePlayer.x, Game.ActivePlayer.y, 0, 1);
            if (!result) {
                return;
            }
            Game.ActivePlayer.y = result[1];
            break;

        default:
            return;
    }
    Game.ActivePlayer.focus();
})
screen.on('keypress', function (key, data) {
    if (key) {
        if (Game.Map.GetChar(Game.ActivePlayer.x, Game.ActivePlayer.y) != false) {
            return;
        }

        program.write(Game.ActivePlayer.Char);
        program.left()

        Game.Map.SetChar(Game.ActivePlayer.x, Game.ActivePlayer.y, Game.ActivePlayer.Char);

        let result = Game.CheckGomoku(Game.ActivePlayer.x, Game.ActivePlayer.y)
        if (result) {
            result.forEach(pos => {
                program.move(pos[0] + Config.BoxOffset.x, pos[1] + Config.BoxOffset.y);
                program.write("✓");
                program.left()
            });
            Game.HandleWin();
            return;
        }

        Game.SwtichPlayer();
    }
})
screen.key('escape', function () {
    return process.exit(0);
});
var FirstInitialized = false;
GameBox.on("render", function () {
    if (FirstInitialized) {
        setTimeout(() => { // next tick
            Game.ActivePlayer.focus();
        }, 1)
        return;
    }
    setTimeout(() => {
        FirstInitialized = true;
        Game.Init(StatusText);
        ClearScreeen();
    }, 200);
})
GameBox.focus();

screen.render();