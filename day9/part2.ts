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

    function getSides(point: {y: number, x: number}): {y: number, x: number}[] {
        let sides: {y: number, x: number}[] = [];
        if (point.y > 0) sides.push({y: point.y - 1, x: point.x});
        if (point.x > 0) sides.push({y: point.y, x: point.x - 1});
        if (point.y < grid.length - 1) sides.push({y: point.y + 1, x: point.x});
        if (point.x < grid[0].length - 1) sides.push({y: point.y, x: point.x + 1});
        return sides;
    }

    function isLowPoint2(point: {y: number, x: number}): boolean {
        return getSides(point).every(p => grid[p.y][p.x] > grid[point.y][point.x]);
    }

    function getBasinSize(point: {y: number, x: number}, visited: Set<string>): number {
        visited.add(JSON.stringify(point));
        let size = 1;
        getSides(point).filter(v => (grid[v.y][v.x] < 9)).forEach(p => {
            if (!visited.has(JSON.stringify(p))) {
                //console.log(` y,x: ${p.y}, ${p.x}, ${visited.size}`);
                size += getBasinSize(p, visited);
            }
        });
        return size;
    }

    rl.on('close', () => {
        let basins: number[] = [];
        for (let y = 0; y < grid.length; y++)
            for (let x = 0; x < grid[0].length; x++) {
                let point = {y: y, x: x};
                if (isLowPoint2(point)) {
                    //console.log(JSON.stringify(point));
                    basins.push(getBasinSize(point, new Set<string>()));
                }
            }
        basins.sort((a, b) => b - a);
        //console.log(JSON.stringify(basins));
        console.log(basins[0] * basins[1] * basins[2]);
    });
}