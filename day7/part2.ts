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

    function fuelUsed(distance: number): number {
        let used = 0;
        for (let i = 1; i <= distance; i++) used += i;
        return used;
    }

    rl.on('close', () => {
        let left = {position: 0, value: Infinity};
        let right = {position: positions[positions.length - 1], value: Infinity};
        let count = 0;
        do {
            let next = Math.floor((right.position - left.position) / 2) + left.position;
            let value = positions.reduce((pv, cv) => pv += fuelUsed(Math.abs(cv - next)), 0);
            let nextValue = positions.reduce((pv, cv) => pv += fuelUsed(Math.abs(cv - (next + 1))), 0);
            if (nextValue > value) {
                right.position = next;
                right.value = value;
            }
            else {
                left.position = next;
                left.value = value;
            }
            count++;
        } while (right.position - left.position > 2);
        let otherValue = positions.reduce((pv, cv) => pv += fuelUsed(Math.abs(cv - (left.position + 1))), 0);
        let minValue = Math.min(left.value, otherValue, right.value);
        console.log(`${left.value}, ${otherValue}, ${right.value}`);
        console.log(`${minValue}`);
    });
}