{
    var readline = require('readline');
    var players_1 = [];
    var expression_1 = /Player \d+ starting position: (\d+)/;
    var die = 1;
    var rolls = 0;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var arr = expression_1.exec(line);
        players_1.push(+arr[1]);
    });
    rl.on('close', function () {
        var wins = [0, 0];
        var p = new Array(9);
        var remaining = [{ next: 0, count: 1, sc: [{ p: players_1[0], s: 0 }, { p: players_1[1], s: 0 }] }];
        [1, 2, 3].forEach(function (e1) { return [1, 2, 3].forEach(function (e2) { return [1, 2, 3].forEach(function (e3) {
            var key = e1 + e2 + e3;
            if (p[key] === undefined)
                p[key] = { score: key, count: 1 };
            else
                p[key].count += 1;
        }); }); });
        var path = [];
        p.filter(function (v) { return v !== undefined; }).forEach(function (v) { return path.push(v); });
        var _loop_1 = function () {
            var next = [];
            remaining.forEach(function (r) {
                var p = r.sc[r.next];
                path.forEach(function (v, i) {
                    var nv = { p: p.p + v.score, s: p.s };
                    if (nv.p > 10)
                        nv.p -= 10;
                    nv.s += nv.p;
                    if (nv.s >= 21)
                        wins[r.next] += v.count * r.count;
                    else
                        next.push({ next: r.next === 0 ? 1 : 0, count: r.count * v.count,
                            sc: [r.next === 0 ? nv : r.sc[0], r.next === 0 ? r.sc[1] : nv] });
                });
            });
            remaining = next;
        };
        while (remaining.length > 0) {
            _loop_1();
        }
        console.log("".concat(wins[0], " ").concat(wins[1]));
    });
}
