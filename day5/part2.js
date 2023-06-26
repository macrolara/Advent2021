{
    var readline = require('readline');
    var visited_1 = new Set();
    var revisited_1 = new Set();
    var expression_1 = /(\d+),(\d+) -> (\d+),(\d+)/;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var array = expression_1.exec(line);
        var start = { x: +array[1], y: +array[2] };
        var end = { x: +array[3], y: +array[4] };
        var steps = start.x === end.x ? Math.abs(end.y - start.y) : Math.abs(end.x - start.x);
        var xincr = start.x === end.x ? 0 : end.x > start.x ? 1 : -1;
        var yincr = start.y === end.y ? 0 : end.y > start.y ? 1 : -1;
        for (var i = 0; i <= steps; i++) {
            var point = "" + (start.x + i * xincr) + ":" + (start.y + i * yincr);
            if (!revisited_1.has(point)) {
                if (visited_1.has(point))
                    revisited_1.add(point);
                else
                    visited_1.add(point);
            }
        }
    });
    rl.on('close', function () {
        console.log("".concat(revisited_1.size));
    });
}
