{
    var readline = require('readline');
    var grid_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        grid_1.push(line.split('').map(function (v) { return +v; }));
    });
    function isLowPoint(y, x) {
        var sides = [];
        if (y > 0)
            sides.push({ y: y - 1, x: x });
        if (x > 0)
            sides.push({ y: y, x: x - 1 });
        if (y < grid_1.length - 1)
            sides.push({ y: y + 1, x: x });
        if (x < grid_1[0].length - 1)
            sides.push({ y: y, x: x + 1 });
        return sides.every(function (s) { return grid_1[s.y][s.x] > grid_1[y][x]; });
    }
    rl.on('close', function () {
        var riskLevel = 0;
        for (var y = 0; y < grid_1.length; y++)
            for (var x = 0; x < grid_1[0].length; x++)
                if (isLowPoint(y, x)) {
                    //console.log(`y,x: ${y},${x}, ${grid[y][x]}`);
                    riskLevel += grid_1[y][x] + 1;
                }
        console.log(riskLevel);
    });
}
