{
    var readline = require('readline');
    var scores = new Map();
    scores.set(")", 3);
    scores.set("]", 57);
    scores.set("}", 1197);
    scores.set(">", 25137);
    var opener_1 = new Map();
    opener_1.set(")", "(");
    opener_1.set("]", "[");
    opener_1.set("}", "{");
    opener_1.set(">", "<");
    var compscores_1 = new Map();
    compscores_1.set(")", 1);
    compscores_1.set("]", 2);
    compscores_1.set("}", 3);
    compscores_1.set(">", 4);
    var closer_1 = new Map();
    closer_1.set("(", ")");
    closer_1.set("[", "]");
    closer_1.set("{", "}");
    closer_1.set("<", ">");
    var totals_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var stack = [];
        if (line.split('').every(function (c) {
            if (opener_1.has(c)) {
                if (stack.pop() !== opener_1.get(c)) {
                    return false;
                }
            }
            else
                stack.push(c);
            return true;
        })) {
            var score = 0;
            while (stack.length > 0) {
                score *= 5;
                score += compscores_1.get(closer_1.get(stack.pop()));
            }
            totals_1.push(score);
        }
    });
    rl.on('close', function () {
        totals_1.sort(function (a, b) { return a - b; });
        console.log(totals_1[Math.floor(totals_1.length / 2)]);
    });
}
