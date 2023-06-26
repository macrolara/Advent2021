{
    const readline = require('readline');
    let grid: number[][] = []

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        grid.push(line.split('').map(x => x === '.' ? 0 : x === '>' ? 1 : 2))
    });

    rl.on('close', () => {
        const dims = [{dir: 1, yF: ((y: number) => y), xF: ((x: number) => (x === grid[0].length - 1 ? 0 : x + 1))},
            {dir: 2, yF: ((y: number) => (y === grid.length - 1 ? 0 : y + 1)), xF: ((x: number) => x)}]
        let steps = 0, moves = 0
        do {
            moves = 0
            dims.forEach(a => {
                let toMove: {y: number, x: number}[] = []
                grid.forEach((r, y) => r.forEach((c, x) => {if (c === a.dir && grid[a.yF(y)][a.xF(x)] === 0) toMove.push({y: y, x: x})}))
                toMove.forEach(c => {
                    grid[c.y][c.x] = 0
                    grid[a.yF(c.y)][a.xF(c.x)] = a.dir
                })
                moves += toMove.length
            })
            steps++
        } while (moves > 0)
        console.log(steps)
    });
}