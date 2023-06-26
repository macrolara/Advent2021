{
    const readline = require('readline');
    const expression = /#(\w)#(\w)#(\w)#(\w)#/
    const startVals: number[][] = []
    const positions: number[] = [2, 4, 6, 8]
    const hallLength = 11

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let matches = expression.exec(line);
        let toVal = ((str) => (str === 'A' ? 0 : str === 'B' ? 1 : str === 'C' ? 2 : 3))
        if (matches !== null) startVals.push([toVal(matches[1]!), toVal(matches[2]!), toVal(matches[3]!), toVal(matches[4]!)])
    });

    class Scenario {
        hall: number[] = []
        cells: number[][] = []
        score: number = 0

        setup(startVals: number[][]): void {
            this.hall = new Array<number>(hallLength).fill(-1)
            this.cells = new Array<number[]>(4)
            for (let i = 0; i < 4; i++) {
                this.cells[i] = new Array<number>(startVals.length)
                for (let j = 0; j < startVals.length; j++)
                    this.cells[i][j] = startVals[j][i]
            }
        }

        private isOption(i: number, value: number): boolean {
            if (positions.includes(i)) return false
            if ((value === 3 || value === 2) && (i === 0 || i === 1)) return false
            if (value === 3) return false
            if (value === 2 && (i === 9 || i === 10)) return false
            return true
        }

        private getOptions(position: number, value: number): number[] {
            let options: number[] = []
            for (let i = position - 1; i >= 0 && this.hall[i] === -1; i--)
                if (this.isOption(i, value)) options.push(i)
            for (let i = position + 1; i < this.hall.length && this.hall[i] === -1; i++)
                if (this.isOption(i, value)) options.push(i)
            return options;
        }

        private getCellIndex(cellValues: number[], cellIndex: number): number {
            if (cellValues.every(v => v === -1 || v === cellIndex)) return -1
            return cellValues.findIndex(v => v !== -1)
        }

        private getTarget(value: number, i: number): {p: number, d: number} {
            if (this.cells[value].some(v => v !== -1 && v !== value)) return {p: -1, d: -1}
            let p = positions[value]
            if (this.hall.filter((x, ix) => (p > i ? ix > i && ix < p : ix > p && ix < i)).some(x => x !== -1)) return {p: -1, d: -1}
            let r = {p: p, d: -1}
            r.d = this.cells[value].findIndex(v => v === value) - 1
            if (r.d < 0) r.d = this.cells[value].length - 1
            return r
        }

        getScenarios(): Scenario[] {
            let scenarios: Scenario[] = []
            this.cells.forEach((c, i) => {
                let ix = this.getCellIndex(c, i)
                if (ix !== -1) {
                    let p = positions[i];
                    let t = this.getTarget(c[ix], p)
                    if (t.p !== -1) {
                        let cn = this.copy()
                        let span = Math.abs(p - t.p) + 2 + ix + t.d
                        cn.cells[c[ix]][t.d] = c[ix]
                        cn.cells[i][ix] = -1
                        cn.score += span * Math.pow(10, c[ix])
                        scenarios.push(cn)
                    }
                    else {
                        let options = this.getOptions(p, c[ix])
                        options.forEach(o => {
                            let cn = this.copy()
                            cn.cells[i][ix] = -1
                            cn.hall[o] = c[ix]
                            cn.score += (1 + ix + Math.abs(p - o)) * Math.pow(10, c[ix])
                            scenarios.push(cn)
                        })
                    }
                }
            })
            this.hall.forEach((h, i) => {
                if (h !== -1) {
                    let t = this.getTarget(h, i)
                    if (t.p !== -1) {
                        let cn = this.copy()
                        let span = Math.abs(t.p - i) + 1 + t.d
                        cn.cells[h][t.d] = h
                        cn.hall[i] = -1
                        cn.score += span * Math.pow(10, h)
                        scenarios.push(cn)
                    }
                }
            })
            return scenarios
        }

        isDone(): boolean {
            return this.cells.every((c, i) => c.every(x => x === i))
        }

        private copy(): Scenario {
            let copy = new Scenario();
            copy.hall = [...this.hall];
            this.cells.forEach(c => copy.cells.push([...c]))
            copy.score = this.score
            return copy
        }
    }

    rl.on('close', () => {
        let lowScore = Infinity
        let scenarios: Scenario[] = []
        scenarios.push(new Scenario)
        scenarios[0].setup(startVals)
        while (scenarios.length > 0) {
            let sc = scenarios.shift()!
            let list = sc.getScenarios()
            let toAdd: Scenario[] = []
            list.forEach(s => {
                if(s.isDone()) lowScore = Math.min(lowScore, s.score)
                else if (s.score < lowScore) toAdd.push(s)
            })
            scenarios.push(...toAdd)
            // console.log(`working: ${list.length}, ${toAdd.length}, ${scenarios.length} ${lowScore}`)
            // if (scenarios.length > 300000) {
            //     for (let i = scenarios.length - 1; i > 280000; i -= 1000)
            //         console.log(`${scenarios[i].score}, %s`, JSON.stringify(scenarios[i]))
            //     break;
            // }
        }
        console.log(lowScore)
    });
}