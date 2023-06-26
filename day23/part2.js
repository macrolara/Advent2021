var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
{
    var readline = require('readline');
    var expression_1 = /#(\w)#(\w)#(\w)#(\w)#/;
    var startVals_1 = [];
    var positions_1 = [2, 4, 6, 8];
    var hallLength_1 = 11;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var matches = expression_1.exec(line);
        var toVal = (function (str) { return (str === 'A' ? 0 : str === 'B' ? 1 : str === 'C' ? 2 : 3); });
        if (matches !== null)
            startVals_1.push([toVal(matches[1]), toVal(matches[2]), toVal(matches[3]), toVal(matches[4])]);
    });
    var Scenario_1 = /** @class */ (function () {
        function Scenario() {
            this.hall = [];
            this.cells = [];
            this.score = 0;
        }
        Scenario.prototype.setup = function (startVals) {
            this.hall = new Array(hallLength_1).fill(-1);
            this.cells = new Array(4);
            for (var i = 0; i < 4; i++) {
                this.cells[i] = new Array(startVals.length);
                for (var j = 0; j < startVals.length; j++)
                    this.cells[i][j] = startVals[j][i];
            }
        };
        Scenario.prototype.isOption = function (i, value) {
            if (positions_1.includes(i))
                return false;
            if ((value === 3 || value === 2) && (i === 0 || i === 1))
                return false;
            if (value === 3)
                return false;
            if (value === 2 && (i === 9 || i === 10))
                return false;
            return true;
        };
        Scenario.prototype.getOptions = function (position, value) {
            var options = [];
            for (var i = position - 1; i >= 0 && this.hall[i] === -1; i--)
                if (this.isOption(i, value))
                    options.push(i);
            for (var i = position + 1; i < this.hall.length && this.hall[i] === -1; i++)
                if (this.isOption(i, value))
                    options.push(i);
            return options;
        };
        Scenario.prototype.getCellIndex = function (cellValues, cellIndex) {
            if (cellValues.every(function (v) { return v === -1 || v === cellIndex; }))
                return -1;
            return cellValues.findIndex(function (v) { return v !== -1; });
        };
        Scenario.prototype.getTarget = function (value, i) {
            if (this.cells[value].some(function (v) { return v !== -1 && v !== value; }))
                return { p: -1, d: -1 };
            var p = positions_1[value];
            if (this.hall.filter(function (x, ix) { return (p > i ? ix > i && ix < p : ix > p && ix < i); }).some(function (x) { return x !== -1; }))
                return { p: -1, d: -1 };
            var r = { p: p, d: -1 };
            r.d = this.cells[value].findIndex(function (v) { return v === value; }) - 1;
            if (r.d < 0)
                r.d = this.cells[value].length - 1;
            return r;
        };
        Scenario.prototype.getScenarios = function () {
            var _this = this;
            var scenarios = [];
            this.cells.forEach(function (c, i) {
                var ix = _this.getCellIndex(c, i);
                if (ix !== -1) {
                    var p_1 = positions_1[i];
                    var t = _this.getTarget(c[ix], p_1);
                    if (t.p !== -1) {
                        var cn = _this.copy();
                        var span = Math.abs(p_1 - t.p) + 2 + ix + t.d;
                        cn.cells[c[ix]][t.d] = c[ix];
                        cn.cells[i][ix] = -1;
                        cn.score += span * Math.pow(10, c[ix]);
                        scenarios.push(cn);
                    }
                    else {
                        var options = _this.getOptions(p_1, c[ix]);
                        options.forEach(function (o) {
                            var cn = _this.copy();
                            cn.cells[i][ix] = -1;
                            cn.hall[o] = c[ix];
                            cn.score += (1 + ix + Math.abs(p_1 - o)) * Math.pow(10, c[ix]);
                            scenarios.push(cn);
                        });
                    }
                }
            });
            this.hall.forEach(function (h, i) {
                if (h !== -1) {
                    var t = _this.getTarget(h, i);
                    if (t.p !== -1) {
                        var cn = _this.copy();
                        var span = Math.abs(t.p - i) + 1 + t.d;
                        cn.cells[h][t.d] = h;
                        cn.hall[i] = -1;
                        cn.score += span * Math.pow(10, h);
                        scenarios.push(cn);
                    }
                }
            });
            return scenarios;
        };
        Scenario.prototype.isDone = function () {
            return this.cells.every(function (c, i) { return c.every(function (x) { return x === i; }); });
        };
        Scenario.prototype.copy = function () {
            var copy = new Scenario();
            copy.hall = __spreadArray([], this.hall, true);
            this.cells.forEach(function (c) { return copy.cells.push(__spreadArray([], c, true)); });
            copy.score = this.score;
            return copy;
        };
        return Scenario;
    }());
    rl.on('close', function () {
        var lowScore = Infinity;
        var scenarios = [];
        scenarios.push(new Scenario_1);
        scenarios[0].setup(startVals_1);
        var _loop_1 = function () {
            var sc = scenarios.shift();
            var list = sc.getScenarios();
            var toAdd = [];
            list.forEach(function (s) {
                if (s.isDone())
                    lowScore = Math.min(lowScore, s.score);
                else if (s.score < lowScore)
                    toAdd.push(s);
            });
            scenarios.push.apply(scenarios, toAdd);
        };
        while (scenarios.length > 0) {
            _loop_1();
        }
        console.log(lowScore);
    });
}
