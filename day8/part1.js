{
    var readline = require('readline');
    var expression_1 = /\s+\|\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)/;
    var count_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var array = expression_1.exec(line);
        for (var i = 1; i <= 4; i++)
            count_1 += [2, 3, 4, 7].includes(array[i].length) ? 1 : 0;
    });
    rl.on('close', function () {
        console.log("".concat(count_1));
    });
}
