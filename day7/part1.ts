{
    const readline = require('readline');
    let positions: number[] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        positions = line.split(',').map(v => +v).sort((a, b) => (a - b));
    });

    rl.on('close', () => {
        let left = {position: 0, value: Infinity};
        let right = {position: positions.length - 1, value: Infinity};
        let count = 0;
        do {
            let nextPosition = Math.floor((right.position - left.position) / 2) + left.position;
            let next = positions[nextPosition];
            let value = positions.reduce((pv, cv) => pv += Math.abs(cv - next), 0);
            let nextValue = positions.reduce((pv, cv) => pv += Math.abs(cv - (next + 1)), 0);
            if (nextValue > value) {
                right.position = nextPosition;
                right.value = value;
            }
            else {
                left.position = nextPosition;
                left.value = value;
            }
            count++;
        } while (right.position - left.position > 2 && count < 20);
        let otherValue = positions.reduce((pv, cv) => pv += Math.abs(cv - (positions[left.position] + 1)), 0);
        let minValue = Math.min(left.value, otherValue, right.value)        
        console.log(`${minValue}`);
    });
}