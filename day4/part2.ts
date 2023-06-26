class BingoBoard2 {
    id: number;
    rows: {set: Set<number>, matched: number}[] = [];
    columns: {set: Set<number>, matched: number}[] = [];
    unmarkedSum: number = 0;
    score: number = 0;

    constructor(id: number) {
        this.id = id;
    }

    addRow(values: number[]): void {
        if (this.columns.length === 0) {
            values.forEach(v => this.columns.push({set: new Set<number>(), matched: 0}));
        }
        let row = {set: new Set<number>(), matched: 0};
        values.forEach((v, i) => {
            row.set.add(v);
            this.columns[i].set.add(v);
        });
        this.rows.push(row);
        this.unmarkedSum += values.reduce((pv, cv) => (pv + cv), 0);
    }

    private match(value: number, collection: {set: Set<number>, matched: number}[]): {matched: boolean, bingo: boolean} {
        let matched = false, bingo = false;
        collection.forEach(c => {
            if (c.set.has(value)) {
                matched = true;
                c.matched++;
                if (c.matched === collection.length) bingo = true;
            }
        });
        return {matched: matched, bingo: bingo};        
    }

    checkNumber(value: number): boolean {
        let r = this.match(value, this.rows);
        let c = this.match(value, this.columns);
        this.unmarkedSum -= (r.matched || c.matched ? value : 0);
        let bingo = r.bingo || c.bingo;
        if (bingo) {
            console.log(`${value}, ${this.unmarkedSum}`)
            this.score = value * this.unmarkedSum;
        }
        return bingo;
    }
}

{
    const readline = require('readline');
    let values: number[] = [];
    let currentBoard: BingoBoard2;
    let boards: BingoBoard2[] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (values.length === 0) values = line.split(',').map(v => +v);
        else if (line.length === 0) {
            currentBoard = new BingoBoard2(boards.length + 1);
            boards.push(currentBoard);
        }
        else currentBoard.addRow(line.trim().split(/\s+/).map(v => +v));
    });

    rl.on('close', () => {
        let toWin = [...boards];
        let lastBoard: BingoBoard2 | undefined = undefined;
        values.some(v => {
            let won: number[] = [];
            toWin.forEach(b => {
                if (b.checkNumber(v)) {
                    won.push(b.id);
                    lastBoard = b;
                }
            });
            if (won.length > 0) toWin = toWin.filter(b => !won.includes(b.id));
            return toWin.length === 0;
        });
        console.log(`${lastBoard!.id}, ${lastBoard!.score}, ${lastBoard!.unmarkedSum}`);
    });
}