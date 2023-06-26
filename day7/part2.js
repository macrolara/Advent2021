{
    var readline = require('readline');
    var positions_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        positions_1 = line.split(',').map(function (v) { return +v; }).sort(function (a, b) { return (a - b); });
    });
    function fuelUsed(distance) {
        var used = 0;
        for (var i = 1; i <= distance; i++)
            used += i;
        return used;
    }
    rl.on('close', function () {
        var left = { position: 0, value: Infinity };
        var right = { position: positions_1[positions_1.length - 1], value: Infinity };
        var count = 0;
        var _loop_1 = function () {
            var next = Math.floor((right.position - left.position) / 2) + left.position;
            var value = positions_1.reduce(function (pv, cv) { return pv += fuelUsed(Math.abs(cv - next)); }, 0);
            var nextValue = positions_1.reduce(function (pv, cv) { return pv += fuelUsed(Math.abs(cv - (next + 1))); }, 0);
            if (nextValue > value) {
                right.position = next;
                right.value = value;
            }
            else {
                left.position = next;
                left.value = value;
            }
            count++;
        };
        do {
            _loop_1();
        } while (right.position - left.position > 2);
        var otherValue = positions_1.reduce(function (pv, cv) { return pv += fuelUsed(Math.abs(cv - (left.position + 1))); }, 0);
        var minValue = Math.min(left.value, otherValue, right.value);
        console.log("".concat(left.value, ", ").concat(otherValue, ", ").concat(right.value));
        console.log("".concat(minValue));
    });
}
