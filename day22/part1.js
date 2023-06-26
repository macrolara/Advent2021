{
    var readline = require('readline');
    var expression_1 = /(\w+) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/;
    var directions_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var arr = expression_1.exec(line);
        var d = { on: arr[1] === 'on', d: [{ min: +arr[2], max: +arr[3] }, { min: +arr[4], max: +arr[5] }, { min: +arr[6], max: +arr[7] }] };
        if (d.d.every(function (v) { return (v.min <= 50 && v.max >= -50); })) {
            d.d.forEach(function (v) { v.max = Math.min(50, v.max); v.min = Math.max(-50, v.min); });
            directions_1.push(d);
        }
    });
    rl.on('close', function () {
        var grid = [];
        for (var x = 0; x <= 100; x++) {
            var b = [];
            for (var y = 0; y <= 100; y++) {
                b.push(new Array(101).fill(false));
            }
            grid.push(b);
        }
        directions_1.forEach(function (v) {
            if (v.d[0].min === -41)
                console.log(v.d.reduce(function (pv, cv) { return (pv * (cv.max - cv.min)); }, 1));
            for (var x = v.d[0].min; x <= v.d[0].max; x++)
                for (var y = v.d[1].min; y <= v.d[1].max; y++)
                    for (var z = v.d[2].min; z <= v.d[2].max; z++)
                        grid[x + 50][y + 50][z + 50] = v.on;
        });
        var sum = 0;
        for (var x = 0; x < grid.length; x++)
            for (var y = 0; y < grid[0].length; y++)
                sum += grid[x][y].reduce(function (pv, cv) { return pv + (cv ? 1 : 0); }, 0);
        console.log("".concat(sum));
    });
}
