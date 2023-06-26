{
    var readline = require('readline');
    var players_1 = [];
    var expression_1 = /Player \d+ starting position: (\d+)/;
    var die_1 = 1;
    var rolls_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var arr = expression_1.exec(line);
        players_1.push(+arr[1]);
    });
    function rollDie() {
        var score = 0;
        for (var i = 0; i < 3; i++) {
            score += die_1;
            die_1++;
            if (die_1 === 101)
                die_1 = 1;
        }
        rolls_1 += 3;
        return score;
    }
    rl.on('close', function () {
        console.log("".concat(players_1[0], ", ").concat(players_1[1]));
        var scores = [0, 0];
        var next = 0, die = 1;
        while (scores.every(function (s) { return s < 1000; })) {
            players_1[next] = (players_1[next] + rollDie()) % 10;
            if (players_1[next] === 0)
                players_1[next] = 10;
            scores[next] += players_1[next];
            next = next === 0 ? 1 : 0;
        }
        var index = scores[0] >= 1000 ? 1 : 0;
        console.log("".concat(scores[index], " * ").concat(rolls_1, " = %d"), scores[index] * rolls_1);
    });
}
