var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BingoBoard2 = /** @class */ (function () {
    function BingoBoard2(id) {
        this.rows = [];
        this.columns = [];
        this.unmarkedSum = 0;
        this.score = 0;
        this.id = id;
    }
    BingoBoard2.prototype.addRow = function (values) {
        var _this = this;
        if (this.columns.length === 0) {
            values.forEach(function (v) { return _this.columns.push({ set: new Set(), matched: 0 }); });
        }
        var row = { set: new Set(), matched: 0 };
        values.forEach(function (v, i) {
            row.set.add(v);
            _this.columns[i].set.add(v);
        });
        this.rows.push(row);
        this.unmarkedSum += values.reduce(function (pv, cv) { return (pv + cv); }, 0);
    };
    BingoBoard2.prototype.match = function (value, collection) {
        var matched = false, bingo = false;
        collection.forEach(function (c) {
            if (c.set.has(value)) {
                matched = true;
                c.matched++;
                if (c.matched === collection.length)
                    bingo = true;
            }
        });
        return { matched: matched, bingo: bingo };
    };
    BingoBoard2.prototype.checkNumber = function (value) {
        var r = this.match(value, this.rows);
        var c = this.match(value, this.columns);
        this.unmarkedSum -= (r.matched || c.matched ? value : 0);
        var bingo = r.bingo || c.bingo;
        if (bingo) {
            console.log("".concat(value, ", ").concat(this.unmarkedSum));
            this.score = value * this.unmarkedSum;
        }
        return bingo;
    };
    return BingoBoard2;
}());
{
    var readline = require('readline');
    var values_1 = [];
    var currentBoard_1;
    var boards_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        if (values_1.length === 0)
            values_1 = line.split(',').map(function (v) { return +v; });
        else if (line.length === 0) {
            currentBoard_1 = new BingoBoard2(boards_1.length + 1);
            boards_1.push(currentBoard_1);
        }
        else
            currentBoard_1.addRow(line.trim().split(/\s+/).map(function (v) { return +v; }));
    });
    rl.on('close', function () {
        var toWin = __spreadArray([], boards_1, true);
        var lastBoard = undefined;
        values_1.some(function (v) {
            var won = [];
            toWin.forEach(function (b) {
                if (b.checkNumber(v)) {
                    won.push(b.id);
                    lastBoard = b;
                }
            });
            if (won.length > 0)
                toWin = toWin.filter(function (b) { return !won.includes(b.id); });
            return toWin.length === 0;
        });
        console.log("".concat(lastBoard.id, ", ").concat(lastBoard.score, ", ").concat(lastBoard.unmarkedSum));
    });
}
