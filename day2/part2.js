{
    var readline = require('readline');
    var aim_1 = 0;
    var distance_1 = 0;
    var depth_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var tokens = line.split(' ');
        if (tokens[0] === "forward") {
            distance_1 += +tokens[1];
            depth_1 += +tokens[1] * aim_1;
        }
        else
            aim_1 += (tokens[0] === "up" ? -1 : 1) * +tokens[1];
    });
    rl.on('close', function () {
        console.log("".concat(depth_1, " * ").concat(distance_1, " = %d"), depth_1 * distance_1);
    });
}
