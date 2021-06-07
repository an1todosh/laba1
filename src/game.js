var Map = require("./map")
var Player = require("./player")
var Config = require("../config")
var Game = class {
    Init(CallbackBox) {
        this.CallbackBox = CallbackBox;
        this.Map = new Map(15, 15);
        this.Ply1 = new Player(Config.Playername1, "X");
        this.Ply2 = new Player(Config.Playername2, "O");
        this.ActivePlayer = false;
        this.SwtichPlayer();
        this.Status = "alive";
    }
    HandleWin() {
        this.Status = "result";
        this.CallbackBox.setContent("{center}" + "Переміг " + this.ActivePlayer.Name + "{/center}");
        this.CallbackBox.screen.render();
    }
    SwtichPlayer() {
        this.ActivePlayer = this.ActivePlayer == this.Ply1 ? this.Ply2 : this.Ply1;

        this.CallbackBox.setContent("{center}" + this.ActivePlayer.Name + "{/center}");
        this.CallbackBox.screen.render();
    }
    CheckGomoku(x, y) {
        let LookingFor = this.Map.GetChar(x, y);
        var result;
        result = (() => {
            var count = 0;
            var found = [
                [x, y]
            ];
            for (let i = 1; i <= Config.WinStreak + 1; i++) {
                let char = this.Map.GetChar(x - i, y - i);

                if (char != LookingFor) {
                    break;
                } else {
                    count++;
                    found.push([x - i, y - i])
                }
            }
            if (count < Config.WinStreak) {
                // right-down
                for (let i = 1; i <= (Config.WinStreak - count) + 2; i++) {
                    let char = this.Map.GetChar(x + i, y + i);

                    if (char != LookingFor) {
                        break;
                    } else {
                        count++;
                        found.push([x + i, y + i])
                    }
                }
            }

            return count >= (Config.WinStreak - 1) ? found : false;

        })();
        if (result) {
            return result;
        }
        result = (() => {

            var count = 0;
            var found = [
                [x, y]
            ];
            for (let i = 1; i <= Config.WinStreak + 1; i++) {
                let char = this.Map.GetChar(x, y + i);

                if (char != LookingFor) {
                    break;
                } else {
                    count++;
                    found.push([x, y + i])
                }
            }
            if (count < Config.WinStreak) {
                // down
                for (let i = 1; i <= (Config.WinStreak - count) + 2; i++) {
                    let char = this.Map.GetChar(x, y - i);

                    if (char != LookingFor) {
                        break;
                    } else {
                        count++;
                        found.push([x, y - i])
                    }
                }
            }

            return count >= (Config.WinStreak - 1) ? found : false;

        })();
        if (result) {
            return result;
        }
        result = (() => {

            var count = 0;
            var found = [
                [x, y]
            ];
            for (let i = 1; i <= Config.WinStreak + 1; i++) {
                let char = this.Map.GetChar(x + i, y - i);

                if (char != LookingFor) {
                    break;
                } else {
                    count++;
                    found.push([x + i, y - i])
                }
            }
            if (count < Config.WinStreak) {
                // left-down
                for (let i = 1; i <= (Config.WinStreak - count) + 2; i++) {
                    let char = this.Map.GetChar(x - i, y + i);

                    if (char != LookingFor) {
                        break;
                    } else {
                        count++;
                        found.push([x - i, y + i])
                    }
                }
            }

            return count >= (Config.WinStreak - 1) ? found : false;

        })();
        if (result) {
            return result;
        }
        result = (() => {

            var count = 0;
            var found = [
                [x, y]
            ];
            for (let i = 1; i <= Config.WinStreak + 1; i++) {
                let char = this.Map.GetChar(x + i, y);

                if (char != LookingFor) {
                    break;
                } else {
                    count++;
                    found.push([x + i, y])
                }
            }
            if (count < Config.WinStreak) {
                for (let i = 1; i <= (Config.WinStreak - count) + 2; i++) {
                    let char = this.Map.GetChar(x - i, y);

                    if (char != LookingFor) {
                        break;
                    } else {
                        count++;
                        found.push([x - i, y])
                    }
                }
            }

            return count >= (Config.WinStreak - 1) ? found : false;

        })();
        if (result) {
            return result;
        }

        return false;
    }
};
module.exports = Game;