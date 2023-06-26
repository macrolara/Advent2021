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
        if (start.x === end.x || start.y === end.y) {
            for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
                for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
                    let point = "" + x + ":" + y;
                    if (!revisited.has(point)) {
                        if (visited.has(point)) revisited.add(point)
                        else visited.add(point)
                    }
                }
            }
        }

    });

    rl.on('close', () => {
        console.log(`${revisited.size}`);
    });
}