{
    var readline = require('readline');
    var scores_1 = new Map();
    scores_1.set(")", 3);
    scores_1.set("]", 57);
    scores_1.set("}", 1197);
    scores_1.set(">", 25137);
    var opener_1 = new Map();
    opener_1.set(")", "(");
    opener_1.set("]", "[");
    opener_1.set("}", "{");
    opener_1.set(">", "<");
    var total_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var stack = [];
        line.split('').every(function (c) {
            if (opener_1.has(c)) {
                if (stack.pop() !== opener_1.get(c)) {
                    total_1 += scores_1.get(c);
                    return false;
                }
            }
            else
                stack.push(c);
            return true;
        });
    });
    rl.on('close', function () {
        console.log(total_1);
    });
}
