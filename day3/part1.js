{
    var readline = require('readline');
    var rows_1 = 0;
    var ones_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        if (rows_1 === 0)
            ones_1 = new Array(line.length).fill(0);
        rows_1++;
        line.split('').forEach(function (v, i) { if (v === '1')
            ones_1[i] += 1; });
    });
    rl.on('close', function () {
        var gama = ones_1.map(function (v) { return v >= (rows_1 / 2) ? '1' : 0; }).join('');
        var epsilon = gama.split('').map(function (v) { return v === '1' ? '0' : '1'; }).join('');
        console.log(parseInt(gama, 2) * parseInt(epsilon, 2));
    });
}
