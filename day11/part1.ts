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

    function getNeighbors(point: {y: number, x: number}): {y: number, x: number}[] {
        let points: {y: number, x: number}[] = [];
        if (point.y > 0) {
            if (point.x > 0 && grid[point.y - 1][point.x - 1] !== 0) points.push({y: point.y - 1, x: point.x - 1});
            if (grid[point.y - 1][point.x] !== 0) points.push({y: point.y - 1, x: point.x});
            if (point.x < grid[0].length - 1 && grid[point.y - 1][point.x + 1] !== 0) points.push({y: point.y - 1, x: point.x + 1});
        }
        if (point.y < grid.length - 1) {
            if (point.x > 0 && grid[point.y + 1][point.x - 1] !== 0) points.push({y: point.y + 1, x: point.x - 1});
            if (grid[point.y + 1][point.x] !== 0) points.push({y: point.y + 1, x: point.x});
            if (point.x < grid[0].length - 1 && grid[point.y + 1][point.x + 1] !== 0) points.push({y: point.y + 1, x: point.x + 1});
        }
        if (point.x > 0 && grid[point.y][point.x - 1] !== 0) points.push({y: point.y, x: point.x - 1});
        if (point.x < grid[0].length - 1 && grid[point.y][point.x + 1] !== 0) points.push({y: point.y, x: point.x + 1});
        return points;
    }

    function flash(point: {y: number, x: number}, total: {count: number}): void {
        total.count++;
        grid[point.y][point.x] = 0;
        let next = getNeighbors(point);
        next.forEach(n => {grid[n.y][n.x]++});
        next.forEach(n => {if (grid[n.y][n.x] > 9) flash(n, total);});
    }

    rl.on('close', () => {
        let total: {count: number} = {count: 0};
        for (let i = 0; i < 100; i++) {
            for (let y = 0; y < grid.length; y++)
                for (let x = 0; x < grid[0].length; x++)
                    grid[y][x]++;
            for (let y = 0; y < grid.length; y++)
                for (let x = 0; x < grid[0].length; x++) {
                    if (grid[y][x] > 9) {
                        flash({y: y, x: x}, total);
                    }
                }
                
        }
        console.log(total.count);
    });
}