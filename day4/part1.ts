class BingoBoard {
    rows: {set: Set<number>, matched: number}[] = [];
    columns: {set: Set<number>, matched: number}[] = [];
    unmarkedSum: number = 0;

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

    checkNumber(value: number, bingoSum: {value: number}): boolean {
        let r = this.match(value, this.rows);
        let c = this.match(value, this.columns);
        this.unmarkedSum -= (r.matched || c.matched ? value : 0);
        let bingo = r.bingo || c.bingo;
        if (bingo) {
            bingoSum.value = this.unmarkedSum * value;
            console.log(`${value}, ${this.unmarkedSum}`)
        }
        return bingo;
    }
}

{
    const readline = require('readline');
    let values: number[] = [];
    let currentBoard: BingoBoard;
    let boards: BingoBoard[] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (values.length === 0) values = line.split(',').map(v => +v);
        else if (line.length === 0) {
            currentBoard = new BingoBoard();
            boards.push(currentBoard);
        }
        else currentBoard.addRow(line.trim().split(/\s+/).map(v => +v));
    });

    rl.on('close', () => {
        let bingoSum = {value: 0};
        values.some(v => {
            if (boards.some(b => b.checkNumber(v, bingoSum))) return true;
            return false;
        });
        console.log(`${bingoSum.value}`);
    });
}