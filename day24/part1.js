{
    class VarValue {
        constructor(idx) {
            this.index = idx;
        }
        getValue(vars) {
            return vars[this.index];
        }
    }
    class ScalarValue {
        constructor(value) {
            this.value = value;
        }
        getValue(vars) {
            return this.value;
        }
    }
    class DigitOps {
        constructor() {
            this.vars = [];
            this.ops = [];
        }
        run(w, z) {
            this.vars = [w, 0, 0, z];
            this.ops.forEach(o => { this.vars[o.idx] = o.fn(o.a.getValue(this.vars), o.b.getValue(this.vars)); });
            return this.vars[this.vars.length - 1];
        }
        getContext() {
            return this.vars.slice(1);
        }
        getXVar() {
            return this.ops[4].b.getValue(this.vars);
        }
    }
    const readline = require('readline');
    let digits = [];
    let vars = ['w', 'x', 'y', 'z'];
    let ops = new Map([
        ["add", ((a, b) => { return a + b; })],
        ["mul", ((a, b) => { return a * b; })],
        ["div", ((a, b) => { return Math.trunc(a / b); })],
        ["mod", ((a, b) => { return a % b; })],
        ["eql", ((a, b) => { return (a === b ? 1 : 0); })]
    ]);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', (line) => {
        if (line === "inp w")
            digits.push(new DigitOps);
        else {
            let a = line.split(' ');
            let index = vars.findIndex((v) => v === a[1]);
            digits[digits.length - 1].ops.push({ fn: ops.get(a[0]), a: new VarValue(index),
                b: (vars.includes(a[2]) ? new VarValue(vars.findIndex((v) => v === a[2])) : new ScalarValue(+a[2])), idx: index });
        }
    });
    function nextStep(current, idx) {
        let next = new Map();
        const xvar = digits[idx].getXVar();
        const series = Array.from({ length: 9 }, (_, x) => x + 1).reverse();
        current.forEach((values, key) => {
            series.forEach(w => {
                if (xvar >= 0 || w === (key % 26) + xvar) {
                    const result = digits[idx].run(w, key);
                    let nv = values.map((v) => v * 10 + w);
                    if (next.has(result))
                        next.get(result).concat(nv);
                    else
                        next.set(result, nv);
                }
            });
        });
        return next;
    }
    rl.on('close', () => {
        let map = new Map();
        map.set(0, [0]);
        digits.forEach((d, i) => {
            map = nextStep(map, i);
        });
        let l = [...map.get(0).values()];
        let rs = [...map.get(0).values()].reduce((pv, cv) => { return { max: Math.max(pv.max, cv), min: Math.max(pv.max, cv) }; }, { max: 0, min: Infinity });
        console.log(`${rs.max}, ${rs.min}, ${l.length}`);
    });
}
