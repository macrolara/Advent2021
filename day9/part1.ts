{
    const readline = require('readline');
    let grid: number[][] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        grid.push(line.split('').map(v => +v));
    });

    function isLowPoint(y: number, x: number): boolean {
        let sides: {y: number, x: number}[] = [];
        if (y > 0) sides.push({y: y - 1, x: x});
        if (x > 0) sides.push({y: y, x: x - 1});
        if (y < grid.length - 1) sides.push({y: y + 1, x: x});
        if (x < grid[0].length - 1) sides.push({y: y, x: x + 1});
        return sides.every(s => grid[s.y][s.x] > grid[y][x]);
    }

    rl.on('close', () => {
        let riskLevel = 0;
        for (let y = 0; y < grid.length; y++)
            for (let x = 0; x < grid[0].length; x++)
                if (isLowPoint(y, x)) {
                    //console.log(`y,x: ${y},${x}, ${grid[y][x]}`);
                    riskLevel += grid[y][x] + 1;
                }
        console.log(riskLevel);
    });
}