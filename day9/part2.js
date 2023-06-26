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
    function getSides(point) {
        var sides = [];
        if (point.y > 0)
            sides.push({ y: point.y - 1, x: point.x });
        if (point.x > 0)
            sides.push({ y: point.y, x: point.x - 1 });
        if (point.y < grid_1.length - 1)
            sides.push({ y: point.y + 1, x: point.x });
        if (point.x < grid_1[0].length - 1)
            sides.push({ y: point.y, x: point.x + 1 });
        return sides;
    }
    function isLowPoint2(point) {
        return getSides(point).every(function (p) { return grid_1[p.y][p.x] > grid_1[point.y][point.x]; });
    }
    function getBasinSize(point, visited) {
        visited.add(JSON.stringify(point));
        var size = 1;
        getSides(point).filter(function (v) { return (grid_1[v.y][v.x] < 9); }).forEach(function (p) {
            if (!visited.has(JSON.stringify(p))) {
                //console.log(` y,x: ${p.y}, ${p.x}, ${visited.size}`);
                size += getBasinSize(p, visited);
            }
        });
        return size;
    }
    rl.on('close', function () {
        var basins = [];
        for (var y = 0; y < grid_1.length; y++)
            for (var x = 0; x < grid_1[0].length; x++) {
                var point = { y: y, x: x };
                if (isLowPoint2(point)) {
                    //console.log(JSON.stringify(point));
                    basins.push(getBasinSize(point, new Set()));
                }
            }
        basins.sort(function (a, b) { return b - a; });
        //console.log(JSON.stringify(basins));
        console.log(basins[0] * basins[1] * basins[2]);
    });
}
