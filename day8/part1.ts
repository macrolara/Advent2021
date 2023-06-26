{
    const readline = require('readline');
    let expression = /\s+\|\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)/;
    let count = 0;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let array = expression.exec(line)!;
        for (let i = 1; i <= 4; i++) count += [2, 3, 4, 7].includes(array[i].length) ? 1 : 0;
    });

    rl.on('close', () => {
        console.log (`${count}`);
    });
}