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

    function getNeighbors2(point: {y: number, x: number}): {y: number, x: number}[] {
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

    function flash2(point: {y: number, x: number}, total: {count: number}): void {
        total.count++;
        grid[point.y][point.x] = 0;
        let next = getNeighbors2(point);
        next.forEach(n => {grid[n.y][n.x]++});
        next.forEach(n => {if (grid[n.y][n.x] > 9) flash2(n, total);});
    }

    rl.on('close', () => {
        let total: {count: number} = {count: 0};
        let count = 0, flashed;
        do {
            flashed = total.count;
            for (let y = 0; y < grid.length; y++)
                for (let x = 0; x < grid[0].length; x++)
                    grid[y][x]++;
            for (let y = 0; y < grid.length; y++)
                for (let x = 0; x < grid[0].length; x++) {
                    if (grid[y][x] > 9) {
                        flash2({y: y, x: x}, total);
                    }
                }
            count++;       
        } while (total.count - flashed < grid.length * grid[0].length);
        console.log(count);
    });
}