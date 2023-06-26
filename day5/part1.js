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
        if (start.x === end.x || start.y === end.y) {
            for (var x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
                for (var y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
                    var point = "" + x + ":" + y;
                    if (!revisited_1.has(point)) {
                        if (visited_1.has(point))
                            revisited_1.add(point);
                        else
                            visited_1.add(point);
                    }
                }
            }
        }
    });
    rl.on('close', function () {
        console.log("".concat(revisited_1.size));
    });
}
