{
    const readline = require('readline');
    let value: number = Infinity;
    let increaseCount: number = 0;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (+line > value) increaseCount++;
        value = +line;
    });

    rl.on('close', () => {
        console.log(`${increaseCount}`);
    });
}