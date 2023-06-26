{
    const readline = require('readline');
    let aim: number = 0;
    let distance: number = 0;
    let depth: number = 0;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let tokens = line.split(' ');
        if (tokens[0] === "forward") {
            distance += +tokens[1];
            depth += +tokens[1] * aim;
        }
        else aim += (tokens[0] === "up" ? -1 : 1) * +tokens[1];
    });

    rl.on('close', () => {
        console.log(`${depth} * ${distance} = %d`, depth * distance);
    });
}