{
    var readline = require('readline');
    var value_1 = Infinity;
    var increaseCount_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        if (+line > value_1)
            increaseCount_1++;
        value_1 = +line;
    });
    rl.on('close', function () {
        console.log("".concat(increaseCount_1));
    });
}
