{
    var readline = require('readline');
    var rows_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        rows_1.push(line.split(''));
    });
    rl.on('close', function () {
        var ox = getValue(function (count, length) { return (count >= (length / 2) ? '1' : '0'); });
        var co = getValue(function (count, length) { return (count < (length / 2) ? '1' : '0'); });
        console.log("".concat(ox, ", ").concat(co, ", %d"), parseInt(ox, 2) * parseInt(co, 2));
    });
    function getValue(compare) {
        var remaining = rows_1;
        var _loop_1 = function (i) {
            var oneCount = remaining.reduce(function (pv, cv) { return (cv[i] === '1' ? pv += 1 : pv); }, 0);
            var rest = [];
            var matchBit = compare(oneCount, remaining.length);
            remaining.forEach(function (r) { if (r[i] === matchBit)
                rest.push(r); });
            if (rest.length === 1) {
                return { value: rest[0].join('') };
            }
            remaining = rest;
        };
        for (var i = 0; i < rows_1[0].length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        throw Error("Not possible");
    }
}
