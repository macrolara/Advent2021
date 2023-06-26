var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
{
    var readline = require('readline');
    var expression_1 = /(\w+)-(\w+)/;
    var nodes_1 = new Map();
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var array = expression_1.exec(line);
        [1, 2].forEach(function (v) {
            var _a;
            if (nodes_1.has(array[v]))
                (_a = nodes_1.get(array[v])) === null || _a === void 0 ? void 0 : _a.neighbours.push(array[v === 1 ? 2 : 1]);
            else {
                var value = { name: array[v], canRevisit: array[v] == array[v].toLocaleUpperCase(), neighbours: [] };
                value.neighbours.push(array[v === 1 ? 2 : 1]);
                nodes_1.set(array[v], value);
            }
        });
    });
    function getPaths(nodeName, visited) {
        var node = nodes_1.get(nodeName);
        var count = 0;
        if (visited.includes(node.name) && !node.canRevisit)
            return count;
        if (!visited.includes(node.name))
            visited.push(node.name);
        if (node.neighbours.includes("end"))
            count++;
        node.neighbours.filter(function (n) { return n !== "end"; }).forEach(function (n) { return count += getPaths(n, __spreadArray([], visited, true)); });
        return count;
    }
    rl.on('close', function () {
        console.log(getPaths("start", []));
    });
}
