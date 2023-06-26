{
    const readline = require('readline');
    let values: number[] = [];
    let increaseCount: number = 0;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let value = +line;
        if (values.length === 3) {
            let oldValue = values.shift()!;
            if (oldValue < value) increaseCount++;
        }
        values.push(value);
    });

    rl.on('close', () => {
        console.log(`${increaseCount}`);
    });
}