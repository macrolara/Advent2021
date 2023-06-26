{
    var readline = require('readline');
    var risks_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        risks_1.push(line.split('').map(function (v) { return +v; }));
    });
    function getBFSMinCost(y, x) {
        var q = [];
        var lowScore = new Map();
        q.push({ y: 0, x: 0, score: 0 });
        var min = Math.min(risks_1.reduce(function (pv, cv) { return (pv += cv[0]); }, 0) + risks_1[risks_1.length - 1].reduce(function (pv, cv) { return pv += cv; }, 0), risks_1.reduce(function (pv, cv) { return (pv += cv[risks_1.length - 1]); }, 0) + risks_1[0].reduce(function (pv, cv) { return pv += cv; }, 0)) - risks_1[0][0];
        var logValue = 10;
        var _loop_1 = function () {
            var n = q.shift();
            [{ y: n.y - 1, x: n.x }, { y: n.y + 1, x: n.x }, { y: n.y, x: n.x - 1 }, { y: n.y, x: n.x + 1 }].
                filter(function (v) { return v.x > -1 && v.y > -1 && v.x < risks_1[0].length && v.y < risks_1.length; }).
                filter(function (v) { return risks_1[v.y][v.x] + n.score < min; }).forEach(function (v) {
                var score = n.score + risks_1[v.y][v.x];
                if (v.x === logValue) {
                    console.log("".concat(logValue, ": ").concat(v.y, ":").concat(v.x, " ").concat(score));
                    logValue = logValue < 90 ? logValue + 10 : logValue + 2;
                }
                if (v.y === risks_1.length - 1 && v.x === risks_1[0].length - 1) {
                    min = Math.min(score, min);
                    console.log("min ".concat(min));
                }
                else {
                    var key = "" + v.y + "," + v.x;
                    var low = lowScore.get(key);
                    if (low === undefined || low > score) {
                        lowScore.set(key, score);
                        q.push({ y: v.y, x: v.x, score: score });
                    }
                }
            });
        };
        while (q.length > 0) {
            _loop_1();
        }
        return min;
    }
    function getMinCost(y, x, score, lowScore) {
        if (y === risks_1.length - 1 && x === risks_1[0].length - 1)
            return risks_1[y][x];
        var key = "" + y + "," + x;
        score += risks_1[y][x];
        var low = lowScore.get(key);
        if (low === undefined || low > score)
            lowScore.set(key, score);
        else
            return Infinity;
        return [{ y: y - 1, x: x }, { y: y + 1, x: x }, { y: y, x: x - 1 }, { y: y, x: x + 1 }].
            filter(function (v) { return v.x > -1 && v.y > -1 && v.x < risks_1[0].length && v.y < risks_1.length; }).
            reduce(function (pv, v) { return pv = Math.min(pv, getMinCost(v.y, v.x, score, lowScore)); }, Infinity) + risks_1[y][x];
    }
    rl.on('close', function () {
        //console.log(getMinCost(0, 0, 0, new Map<string, number>()) - risks[0][0]);
        console.log(getBFSMinCost(0, 0));
    });
}
