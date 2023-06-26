{
    var readline = require('readline');
    var grid_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        grid_1.push(line.split('').map(function (v) { return ({ risk: +v, score: Infinity }); }));
    });
    function getBFSMinCost2(y, x) {
        var q = [];
        q.push({ y: 0, x: 0, score: 0 });
        var min = Infinity;
        var corrected = 0;
        var _loop_1 = function () {
            var n = q.shift();
            if (n.score === 0 || n.score === grid_1[n.y][n.x].score) {
                [{ y: n.y + 1, x: n.x }, { y: n.y, x: n.x + 1 }, { y: n.y - 1, x: n.x }, { y: n.y, x: n.x - 1 }].
                    filter(function (v) { return v.x > -1 && v.y > -1 && v.x < grid_1[0].length && v.y < grid_1.length; }).
                    forEach(function (v) {
                    var score = n.score + grid_1[v.y][v.x].risk;
                    if (v.y === grid_1.length - 1 && v.x === grid_1[0].length - 1) {
                        min = Math.min(score, min);
                        //console.log(`min ${min}`);
                    }
                    else if (grid_1[v.y][v.x].score > score) {
                        if (grid_1[v.y][v.x].score < Infinity)
                            corrected++;
                        grid_1[v.y][v.x].score = score;
                        q.push({ y: v.y, x: v.x, score: score });
                    }
                });
            }
        };
        while (q.length > 0) {
            _loop_1();
        }
        console.log("".concat(corrected));
        return min;
    }
    rl.on('close', function () {
        var len = grid_1[0].length;
        for (var y = 0; y < grid_1.length; y++)
            for (var x = len; x < 5 * len; x++)
                grid_1[y].push({ risk: (grid_1[y][x - len].risk === 9 ? 1 : grid_1[y][x - len].risk + 1), score: Infinity });
        len = grid_1.length;
        for (var y = len; y < 5 * len; y++) {
            var row = new Array(grid_1[0].length);
            for (var x = 0; x < row.length; x++)
                row[x] = { risk: grid_1[y - len][x].risk === 9 ? 1 : grid_1[y - len][x].risk + 1, score: Infinity };
            grid_1.push(row);
        }
        // console.log(`${grid.length}:${grid[0].length}`);
        // console.log(grid[0].map(v => "" + v.risk).join(''));
        // console.log(grid.map(v => "" + v[0].risk).join(''));
        console.log(getBFSMinCost2(0, 0));
    });
}
