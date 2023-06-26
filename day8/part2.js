{
    var readline = require('readline');
    var expression_1 = /(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+\|\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)/;
    var count_1 = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var array = expression_1.exec(line);
        var digits = array.slice(1, 11).map(function (v) { return v.split('').sort(function (a, b) { return a.localeCompare(b); }).join(''); });
        var data = array.slice(11).map(function (v) { return v.split('').sort(function (a, b) { return a.localeCompare(b); }).join(''); });
        var numbers = new Array(10);
        numbers[1] = digits.reduce(function (pv, cv) { return (pv += cv.length === 2 ? cv : ""); }, "");
        numbers[4] = digits.reduce(function (pv, cv) { return (pv += cv.length === 4 ? cv : ""); }, "");
        numbers[7] = digits.reduce(function (pv, cv) { return (pv += cv.length === 3 ? cv : ""); }, "");
        numbers[8] = digits.reduce(function (pv, cv) { return (pv += cv.length === 7 ? cv : ""); }, "");
        numbers[6] = digits.filter(function (d) { return d.length === 6; }).reduce(function (pv, cv) { return (pv += !numbers[1].split('').every(function (v) { return cv.includes(v); }) ? cv : ""); }, "");
        numbers[9] = digits.filter(function (d) { return d.length === 6 && d !== numbers[6]; }).reduce(function (pv, cv) { return (pv += numbers[4].split('').every(function (v) { return cv.includes(v); }) ? cv : ""); }, "");
        numbers[0] = digits.filter(function (d) { return d.length === 6 && d !== numbers[6]; }).reduce(function (pv, cv) { return (pv += cv !== numbers[9] ? cv : ""); }, "");
        numbers[3] = digits.filter(function (d) { return d.length === 5; }).reduce(function (pv, cv) { return (pv += numbers[1].split('').every(function (v) { return cv.includes(v); }) ? cv : ""); }, "");
        var topRightBar = numbers[6].includes(numbers[1].charAt(0)) ? numbers[1].charAt(1) : numbers[1].charAt(0);
        numbers[2] = digits.filter(function (d) { return d.length === 5 && d !== numbers[3]; }).reduce(function (pv, cv) { return (pv += cv.includes(topRightBar) ? cv : ""); }, "");
        numbers[5] = digits.filter(function (d) { return d.length === 5 && d !== numbers[3]; }).reduce(function (pv, cv) { return (pv += cv != numbers[2] ? cv : ""); }, "");
        var value = data.reduce(function (pv, cv) { return (pv += numbers.findIndex(function (v) { return v === cv; })); }, "");
        //console.log(value);
        count_1 += +value;
    });
    rl.on('close', function () {
        console.log("".concat(count_1));
    });
}
