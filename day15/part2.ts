{
    const readline = require('readline');
    let grid: {risk: number, score: number}[][] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        grid.push(line.split('').map(v => ({risk: +v, score: Infinity})));
    });

    function getBFSMinCost2(y: number, x: number): number {
        let q: {y: number, x: number, score: number}[] = [];
        q.push({y: 0, x: 0, score: 0});
        let min = Infinity;
        let corrected = 0;
        while (q.length > 0) {
            const n = q.shift()!;
            if (n.score === 0 || n.score === grid[n.y][n.x].score) {
                [{y: n.y + 1, x: n.x}, {y: n.y, x: n.x + 1}, {y: n.y - 1, x: n.x}, {y: n.y, x: n.x - 1}].
                    filter(v => v.x > -1 && v.y > -1 && v.x < grid[0].length && v.y < grid.length).
                    forEach(v => {
                        let score = n.score + grid[v.y][v.x].risk;
                        if (v.y === grid.length - 1 && v.x === grid[0].length - 1) {
                            min = Math.min(score, min);
                            //console.log(`min ${min}`);
                        }
                        else if (grid[v.y][v.x].score > score) {
                            if (grid[v.y][v.x].score < Infinity) corrected++;
                            grid[v.y][v.x].score = score;
                            q.push({y: v.y, x: v.x, score: score});
                        }
                });
            }
        }
        console.log(`${corrected}`);
        return min;
    }

    rl.on('close', () => {
        let len = grid[0].length;
        for (let y = 0; y < grid.length; y++)
            for (let x = len; x < 5 * len; x++) grid[y].push({risk: (grid[y][x - len].risk === 9 ? 1 : grid[y][x - len].risk + 1), score: Infinity})
        len = grid.length;
        for (let y = len; y < 5 * len; y++) {
            let row: {risk: number, score: number}[] = new Array(grid[0].length);
            for (let x = 0; x < row.length; x++) row[x] = {risk: grid[y - len][x].risk === 9 ? 1 : grid[y - len][x].risk + 1, score: Infinity};
            grid.push(row);
        }
        // console.log(`${grid.length}:${grid[0].length}`);
        // console.log(grid[0].map(v => "" + v.risk).join(''));
        // console.log(grid.map(v => "" + v[0].risk).join(''));
        console.log(getBFSMinCost2(0, 0));
    });
}