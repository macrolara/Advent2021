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
        directions_1.push({ on: arr[1] === 'on', d: [{ min: +arr[2], max: +arr[3] }, { min: +arr[4], max: +arr[5] }, { min: +arr[6], max: +arr[7] }] });
    });
    rl.on('close', function () {
        var cubes = [];
        directions_1.forEach(function (d) {
            var newCubes = [];
            var deleteBox = false;
            cubes.filter(function (c) { return c.d.every(function (cd, i) { return cd.min <= d.d[i].max && cd.max >= d.d[i].min; }); }).forEach(function (c) {
                if (c.d.every(function (cd, i) { return d.d[i].min <= cd.min && d.d[i].max >= cd.max; }))
                    c.delete = true;
                else if (d.on && c.d.every(function (cd, i) { return cd.min <= d.d[i].min && cd.max >= d.d[i].max; }))
                    deleteBox = true;
                else {
                    c.delete = true;
                    var _loop_1 = function (i) {
                        if (c.d[i].min < d.d[i].min) {
                            newCubes.push({ delete: false, d: c.d.map(function (x, j) { return ((i === j) ? { min: x.min, max: d.d[j].min - 1 } : { min: x.min, max: x.max }); }) });
                            c.d[i].min = d.d[i].min;
                        }
                        if (c.d[i].max > d.d[i].max) {
                            newCubes.push({ delete: false, d: c.d.map(function (x, j) { return ((i === j) ? { min: d.d[j].max + 1, max: x.max } : { min: x.min, max: x.max }); }) });
                            c.d[i].max = d.d[i].max;
                        }
                    };
                    for (var i = 0; i < 3; i++) {
                        _loop_1(i);
                    }
                }
            });
            if (!deleteBox && d.on)
                newCubes.push({ delete: false, d: d.d });
            // console.log(`${d.d[0].min}-${d.d[0].max}: ${cubes.length}, ${newCubes.length}, %s`, cubes.reduce((pv, cv) => pv + (cv.delete ? 0 : 1),0))
            cubes = newCubes.concat(cubes.filter(function (x) { return !x.delete; }));
        });
        console.log("".concat(cubes.length, " ").concat(cubes[0].d[0].max, " ").concat(cubes[0].d[0].min, " ").concat(cubes[0].d[1].max, " ").concat(cubes[0].d[1].min, " ").concat(cubes[0].d[2].max, " ").concat(cubes[0].d[2].min));
        console.log(cubes.reduce(function (pv, cv) { return pv + cv.d.reduce(function (px, cx) { return px * (cx.max + 1 - cx.min); }, 1); }, 0));
    });
}
