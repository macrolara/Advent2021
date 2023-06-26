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
            this.hall = new Array(11).fill(-1);
            this.cells = new Array(4);
            for (var i = 0; i < 4; i++) {
                this.cells[i] = new Array(2);
                this.cells[i][0] = startVals[0][i];
                this.cells[i][1] = startVals[1][i];
            }
        };
        Scenario.prototype.getOptions = function (position, value) {
            var options = [];
            for (var i = position - 1; i >= (value === 2 || value === 3 ? 2 : 0) && this.hall[i] === -1; i--)
                if (!positions_1.includes(i))
                    options.push(i);
            for (var i = position + 1; i < (value === 2 || value === 3 ? this.hall.length - 2 : this.hall.length) && this.hall[i] === -1; i++)
                if (!positions_1.includes(i))
                    options.push(i);
            return options;
        };
        Scenario.prototype.getCellIndex = function (cellValues, cellIndex) {
            if (cellValues[0] !== -1 && (cellValues[0] !== cellIndex || cellValues[1] !== cellIndex))
                return 0;
            if (cellValues[0] === -1 && cellValues[1] !== -1 && cellValues[1] !== cellIndex)
                return 1;
            return -1;
        };
        Scenario.prototype.getTarget = function (value, i) {
            if (this.cells[value][0] === -1 && (this.cells[value][1] === -1 || this.cells[value][1] === value)) {
                var p_1 = positions_1[value];
                if (this.hall.filter(function (x, ix) { return (p_1 > i ? ix > i && ix < p_1 : ix > p_1 && ix < i); }).every(function (x) { return x === -1; }))
                    return p_1;
            }
            return -1;
        };
        Scenario.prototype.getScenarios = function () {
            var _this = this;
            var scenarios = [];
            this.cells.forEach(function (c, i) {
                var ix = _this.getCellIndex(c, i);
                if (ix !== -1) {
                    var p_2 = positions_1[i];
                    var t = _this.getTarget(c[ix], p_2);
                    if (t !== -1) {
                        var cn = _this.copy();
                        var span = Math.abs(p_2 - t) + 2 + ix;
                        if (cn.cells[c[ix]][1] === -1) {
                            span += 1;
                            cn.cells[c[ix]][1] = c[ix];
                        }
                        else
                            cn.cells[c[ix]][0] = c[ix];
                        cn.cells[i][ix] = -1;
                        cn.score += span * Math.pow(10, c[ix]);
                        scenarios.push(cn);
                    }
                    else {
                        var options = _this.getOptions(p_2, c[ix]);
                        options.forEach(function (o) {
                            var cn = _this.copy();
                            cn.cells[i][ix] = -1;
                            cn.hall[o] = c[ix];
                            cn.score += (1 + ix + Math.abs(p_2 - o)) * Math.pow(10, c[ix]);
                            scenarios.push(cn);
                        });
                    }
                }
            });
            this.hall.forEach(function (h, i) {
                if (h !== -1) {
                    var p = _this.getTarget(h, i);
                    if (p !== -1) {
                        var cn = _this.copy();
                        var span = Math.abs(p - i) + 1;
                        if (cn.cells[h][1] === -1) {
                            span += 1;
                            cn.cells[h][1] = h;
                        }
                        else
                            cn.cells[h][0] = h;
                        cn.hall[i] = -1;
                        cn.score += span * Math.pow(10, h);
                        scenarios.push(cn);
                    }
                }
            });
            return scenarios;
        };
        Scenario.prototype.isDone = function () {
            return this.cells.every(function (c, i) { return c[0] === i && c[1] === i; });
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
            console.log("working: ".concat(list.length, ", ").concat(toAdd.length, ", ").concat(scenarios.length, " ").concat(lowScore));
        };
        while (scenarios.length > 0) {
            _loop_1();
        }
        console.log(lowScore);
    });
}
