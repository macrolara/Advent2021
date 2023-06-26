{
    var readline = require('readline');
    var grid_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        grid_1.push(line.split('').map(function (x) { return x === '.' ? 0 : x === '>' ? 1 : 2; }));
    });
    rl.on('close', function () {
        var dims = [{ dir: 1, yF: (function (y) { return y; }), xF: (function (x) { return (x === grid_1[0].length - 1 ? 0 : x + 1); }) },
            { dir: 2, yF: (function (y) { return (y === grid_1.length - 1 ? 0 : y + 1); }), xF: (function (x) { return x; }) }];
        var steps = 0, moves = 0;
        do {
            moves = 0;
            dims.forEach(function (a) {
                var toMove = [];
                grid_1.forEach(function (r, y) { return r.forEach(function (c, x) { if (c === a.dir && grid_1[a.yF(y)][a.xF(x)] === 0)
                    toMove.push({ y: y, x: x }); }); });
                toMove.forEach(function (c) {
                    grid_1[c.y][c.x] = 0;
                    grid_1[a.yF(c.y)][a.xF(c.x)] = a.dir;
                });
                moves += toMove.length;
            });
            steps++;
        } while (moves > 0);
        console.log(steps);
    });
}
