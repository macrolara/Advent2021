{
    interface ValueIf {
        getValue(vars: number[]): number
    }

    class VarValue implements ValueIf {
        index: number
        constructor(idx: number) {
            this.index = idx
        }
        getValue(vars: number[]): number {
            return vars[this.index]
        }
    }
    class ScalarValue implements ValueIf {
        value: number
        constructor(value: number) {
            this.value = value
        }
        getValue(vars: number[]): number {
            return this.value
        }
    }
    type opFunction = ((a: number, b: number) => number)
    class DigitOps {
        vars: number[] = []
        ops: {fn: opFunction, a: ValueIf, b: ValueIf, idx: number}[] = []
        
        run(w: number, z: number): number {
            this.vars = [w, 0, 0, z]
            this.ops.forEach(o => {this.vars[o.idx] = o.fn(o.a.getValue(this.vars), o.b.getValue(this.vars))})
            return this.vars[this.vars.length - 1]
        }

        getContext(): number[] {
            return this.vars.slice(1)
        }
        getXVar() {
            return this.ops[4].b.getValue(this.vars)
        }
    }
    const readline = require('readline');
    let digits: DigitOps[] = []
    let vars: string[] = ['w', 'x', 'y', 'z']
    let ops: Map<string, opFunction> = new Map([
        ["add", ((a, b) => {return a + b})], 
        ["mul", ((a, b) => {return a * b})], 
        ["div", ((a, b) => {return Math.trunc(a / b)})], 
        ["mod", ((a, b) => {return a % b})], 
        ["eql", ((a, b) => {return (a === b ? 1 : 0)})]])

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (line === "inp w") digits.push(new DigitOps)
        else {
            let a = line.split(' ')
            let index = vars.findIndex((v) => v === a[1])
            digits[digits.length - 1].ops.push({fn: ops.get(a[0])!, a: new VarValue(index),
                b: (vars.includes(a[2]) ? new VarValue(vars.findIndex((v) => v === a[2])) : new ScalarValue(+a[2])), idx: index})
        }
    });

    function nextStep(current: Map<number, number[]>, idx) {
        let next: Map<number, number[]> = new Map();
        const xvar = digits[idx].getXVar();
        const series = Array.from({length: 9}, (_, x) => x + 1).reverse()
        current.forEach((values, key) => {
            series.forEach(w => {
                if (xvar >= 0 || w === (key % 26) + xvar) {
                    const result = digits[idx].run(w, key);
                    let nv = values.map((v) => v * 10 + w)
                    if (next.has(result)) next.get(result)!.concat(nv)
                    else next.set(result, nv)
                }
            })
        });
        return next;
    }

    rl.on('close', () => {
        let map: Map<number, number[]> = new Map()
        map.set(0, [0])
        digits.forEach((d, i) => {
            map = nextStep(map, i)
        })
        let l = [...map.get(0)!.values()]
        let rs: {max: number, min: number} = [...map.get(0)!.values()].reduce((pv, cv) => {return {max: Math.max(pv.max, cv), min: Math.max(pv.max, cv)}}, {max: 0, min: Infinity})
        console.log(`${rs.max}, ${rs.min}, ${l.length}`)
    });
}