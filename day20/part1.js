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
    var transform_1 = [];
    var input_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        if (transform_1.length === 0)
            transform_1 = line.split('').map(function (x) { return x === '#' ? '1' : '0'; });
        else if (line.length > 0) {
            if (input_1.length === 0) {
                input_1.push(new Array(line.length + 4).fill('0'));
                input_1.push(new Array(line.length + 4).fill('0'));
            }
            input_1.push(__spreadArray(__spreadArray(['0', '0'], line.split('').map(function (x) { return x === '#' ? '1' : '0'; }), true), ['0', '0'], false));
        }
    });
    rl.on('close', function () {
        input_1.push(new Array(input_1[0].length).fill('0'));
        input_1.push(new Array(input_1[0].length).fill('0'));
        var fill = transform_1[0];
        for (var i = 0; i < 2; i++) {
            var output = [];
            for (var y = 1; y < input_1.length - 1; y++) {
                var row = [];
                for (var x = 1; x < input_1[0].length - 1; x++) {
                    row.push(transform_1[parseInt([input_1[y - 1][x - 1], input_1[y - 1][x], input_1[y - 1][x + 1],
                        input_1[y][x - 1], input_1[y][x], input_1[y][x + 1],
                        input_1[y + 1][x - 1], input_1[y + 1][x], input_1[y + 1][x + 1]].join(''), 2)]);
                }
                if (y === 1) {
                    output.push(new Array(row.length + 4).fill(fill));
                    output.push(new Array(row.length + 4).fill(fill));
                }
                output.push(__spreadArray(__spreadArray([fill, fill], row, true), [fill, fill], false));
            }
            output.push(new Array(output[0].length).fill(fill));
            output.push(new Array(output[0].length).fill(fill));
            console.log('');
            output.forEach(function (r) { return console.log(r.map(function (v) { return v === '1' ? '#' : ' '; }).join('')); });
            input_1 = output;
            fill = '0';
        }
        console.log(input_1.reduce(function (pv, cv) { return (pv + cv.reduce(function (p, c) { return (p + +c); }, 0)); }, 0));
    });
}
