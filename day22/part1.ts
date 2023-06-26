{
    const readline = require('readline');
    let expression = /(\w+) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    let directions: {on: boolean, d: {min: number, max: number}[]}[] = []

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let arr = expression.exec(line)!
        let d = {on: arr[1] === 'on', d: [{min: +arr[2], max: +arr[3]}, {min: +arr[4], max: +arr[5]}, {min: +arr[6], max: +arr[7]}]}
        if (d.d.every(v => (v.min <= 50 && v.max >= -50))) {
            d.d.forEach(v => {v.max = Math.min(50, v.max); v.min = Math.max(-50, v.min)})
            directions.push(d);
        }
    });

    rl.on('close', () => {
        let grid: boolean[][][] = []
        for (let x = 0; x <= 100; x++) {
            let b: boolean[][] = []
            for (let y = 0; y <= 100; y++) {
                b.push(new Array<boolean>(101).fill(false))
            }
            grid.push(b)
        }
        directions.forEach(v => {
            if (v.d[0].min === -41) console.log(v.d.reduce((pv, cv) => (pv * (cv.max - cv.min)), 1))
            for (let x = v.d[0].min; x <= v.d[0].max; x++)
                for (let y = v.d[1].min; y <= v.d[1].max; y++)
                    for (let z = v.d[2].min; z <= v.d[2].max; z++) grid[x + 50][y + 50][z + 50] = v.on;
        })
        let sum = 0;
        for (let x = 0; x < grid.length; x++)
            for (let y = 0; y < grid[0].length; y++) sum += grid[x][y].reduce((pv, cv) => pv + (cv ? 1 : 0), 0)
        console.log(`${sum}`)
    });
}