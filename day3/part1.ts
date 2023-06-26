{
    const readline = require('readline');
    let rows: number = 0;
    let ones: number[] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (rows === 0) ones = new Array<number>(line.length).fill(0);
        rows++;
        line.split('').forEach((v, i) => {if (v === '1') ones[i] += 1;});
    });

    rl.on('close', () => {
        let gama = ones.map(v => v >= (rows / 2) ? '1' : 0).join('');
        let epsilon = gama.split('').map(v => v === '1' ? '0' : '1').join('');
        console.log(parseInt(gama, 2) * parseInt(epsilon, 2));
    });
}