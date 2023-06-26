{
    const readline = require('readline');
    let fishCounts: number[];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        fishCounts = new Array(9).fill(0)
        line.split(',').forEach(n => fishCounts[n] += 1);
    });

    rl.on('close', () => {
        for (let i = 0; i < 256; i++) {
            let toAdd = fishCounts[0];
            for (let j = 1; j <= 6; j++) fishCounts[j - 1] = fishCounts[j];
            fishCounts[6] = fishCounts[7] + toAdd;
            fishCounts[7] = fishCounts[8];
            fishCounts[8] = toAdd;
        }
        console.log(fishCounts.reduce((pv, cv) => (pv += cv), 0));
    });
}