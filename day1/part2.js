{
    var readline = require('readline');
    var values_1 = [];
    var increaseCount_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var value = +line;
        if (values_1.length === 3) {
            var oldValue = values_1.shift();
            if (oldValue < value)
                increaseCount_1++;
        }
        values_1.push(value);
    });
    rl.on('close', function () {
        console.log("".concat(increaseCount_1));
    });
}
