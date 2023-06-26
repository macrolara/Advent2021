"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BingoBoard = /** @class */ (function () {
    function BingoBoard() {
        this.rows = [];
        this.columns = [];
        this.unmarkedSum = 0;
    }
    BingoBoard.prototype.addRow = function (values) {
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
    BingoBoard.prototype.match = function (value, collection) {
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
    BingoBoard.prototype.checkNumber = function (value, bingoSum) {
        var r = this.match(value, this.rows);
        var c = this.match(value, this.columns);
        this.unmarkedSum -= (r.matched || c.matched ? value : 0);
        var bingo = r.bingo || c.bingo;
        if (bingo) {
            bingoSum.value = this.unmarkedSum * value;
            console.log("".concat(value, ", ").concat(this.unmarkedSum));
        }
        return bingo;
    };
    return BingoBoard;
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
            currentBoard_1 = new BingoBoard();
            boards_1.push(currentBoard_1);
        }
        else
            currentBoard_1.addRow(line.trim().split(/\s+/).map(function (v) { return +v; }));
    });
    rl.on('close', function () {
        var bingoSum = { value: 0 };
        values_1.some(function (v) {
            if (boards_1.some(function (b) { return b.checkNumber(v, bingoSum); }))
                return true;
            return false;
        });
        console.log("".concat(bingoSum.value));
    });
}
