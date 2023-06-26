{
    var readline = require('readline');
    var fishCounts_1;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        fishCounts_1 = new Array(9).fill(0);
        line.split(',').forEach(function (n) { return fishCounts_1[n] += 1; });
    });
    rl.on('close', function () {
        for (var i = 0; i < 256; i++) {
            var toAdd = fishCounts_1[0];
            for (var j = 1; j <= 6; j++)
                fishCounts_1[j - 1] = fishCounts_1[j];
            fishCounts_1[6] = fishCounts_1[7] + toAdd;
            fishCounts_1[7] = fishCounts_1[8];
            fishCounts_1[8] = toAdd;
        }
        console.log(fishCounts_1.reduce(function (pv, cv) { return (pv += cv); }, 0));
    });
}
