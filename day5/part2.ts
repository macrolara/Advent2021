{
    const readline = require('readline');
    let visited = new Set<string>();
    let revisited = new Set<string>();
    let expression = /(\d+),(\d+) -> (\d+),(\d+)/;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let array = expression.exec(line)!;
        let start = {x: +array[1], y: +array[2]};
        let end = {x: +array[3], y: +array[4]};
        let steps = start.x === end.x ? Math.abs(end.y - start.y) : Math.abs(end.x - start.x);
        let xincr = start.x === end.x ? 0 : end.x > start.x ? 1 : -1;
        let yincr = start.y === end.y ? 0 : end.y > start.y ? 1 : -1;
        for (let i = 0; i <= steps; i++) {
            let point = "" + (start.x + i * xincr) + ":" + (start.y + i * yincr);
            if (!revisited.has(point)) {
                if (visited.has(point)) revisited.add(point)
                else visited.add(point)
            }
        }
    });

    rl.on('close', () => {
        console.log(`${revisited.size}`);
    });
}