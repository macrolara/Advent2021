{
    const readline = require('readline');
    const expression = /#(\w)#(\w)#(\w)#(\w)#/
    const startVals: number[][] = []
    const positions: number[] = [2, 4, 6, 8]

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
            this.hall = new Array<number>(11).fill(-1)
            this.cells = new Array<number[]>(4)
            for (let i = 0; i < 4; i++) {
                this.cells[i] = new Array<number>(2)
                this.cells[i][0] = startVals[0][i]
                this.cells[i][1] = startVals[1][i]
            }
        }

        private getOptions(position: number, value: number): number[] {
            let options: number[] = []
            for (let i = position - 1; i >= (value === 2 || value === 3 ? 2 : 0) && this.hall[i] === -1; i--)
                if (!positions.includes(i)) options.push(i)
            for (let i = position + 1; i < (value === 2 || value === 3 ? this.hall.length - 2 : this.hall.length) && this.hall[i] === -1; i++)
                if (!positions.includes(i)) options.push(i)
            return options;
        }

        private getCellIndex(cellValues: number[], cellIndex: number): number {
            if (cellValues[0] !== -1 && (cellValues[0] !== cellIndex || cellValues[1] !== cellIndex)) return 0
            if (cellValues[0] === -1 && cellValues[1] !== -1 && cellValues[1] !== cellIndex) return 1
            return -1
        }

        private getTarget(value: number, i: number): number {
            if (this.cells[value][0] === -1 && (this.cells[value][1] === -1 || this.cells[value][1] === value)) {
                let p = positions[value]
                if (this.hall.filter((x, ix) => (p > i ? ix > i && ix < p : ix > p && ix < i)).every(x => x === -1)) return p
            }
            return -1
        }

        getScenarios(): Scenario[] {
            let scenarios: Scenario[] = []
            this.cells.forEach((c, i) => {
                let ix = this.getCellIndex(c, i)
                if (ix !== -1) {
                    let p = positions[i];
                    let t = this.getTarget(c[ix], p)
                    if (t !== -1) {
                        let cn = this.copy()
                        let span = Math.abs(p - t) + 2 + ix
                        if (cn.cells[c[ix]][1] === -1) {
                            span += 1
                            cn.cells[c[ix]][1] = c[ix]
                        }
                        else cn.cells[c[ix]][0] = c[ix]
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
                    let p = this.getTarget(h, i)
                    if (p !== -1) {
                        let cn = this.copy()
                        let span = Math.abs(p - i) + 1
                        if (cn.cells[h][1] === -1) {
                            span += 1
                            cn.cells[h][1] = h
                        }
                        else cn.cells[h][0] = h
                        cn.hall[i] = -1
                        cn.score += span * Math.pow(10, h)
                        scenarios.push(cn)
                    }
                }
            })
            return scenarios
        }

        isDone(): boolean {
            return this.cells.every((c, i) => c[0] === i && c[1] === i)
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
            console.log(`working: ${list.length}, ${toAdd.length}, ${scenarios.length} ${lowScore}`)
            // if (scenarios.length > 190000) {
            //     for (let i = scenarios.length - 1; i > 180000; i -= 1000)
            //         console.log(`${scenarios[i].score}, %s`, JSON.stringify(scenarios[i]))
            //     break;
            // }
        }
        console.log(lowScore)
    });
}