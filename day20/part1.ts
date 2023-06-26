{
    const readline = require('readline');
    let transform: string[] = []
    let input: string[][] = []

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (transform.length === 0) transform = line.split('').map(x => x === '#' ? '1' : '0')
        else if (line.length > 0) {
            if (input.length === 0) {
                input.push(new Array<string>(line.length + 4).fill('0'))
                input.push(new Array<string>(line.length + 4).fill('0'))
            }
            input.push(['0', '0', ...line.split('').map(x => x === '#' ? '1' : '0'), '0', '0'])
        }
    });

    rl.on('close', () => {
        input.push(new Array<string>(input[0].length).fill('0'))
        input.push(new Array<string>(input[0].length).fill('0'))
        let fill = transform[0];
        for (let i = 0; i < 2; i++) {
            let output: string[][] = []
            for (let y = 1; y < input.length - 1; y++) {
                let row: string[] = [];
                for (let x = 1; x < input[0].length - 1; x++) {
                    row.push(transform[parseInt([input[y-1][x-1], input[y-1][x], input[y-1][x+1]
                        , input[y][x-1], input[y][x], input[y][x+1]
                        , input[y+1][x-1], input[y+1][x], input[y+1][x+1]].join(''), 2)])
                }
                if (y === 1) {
                    output.push(new Array<string>(row.length + 4).fill(fill))
                    output.push(new Array<string>(row.length + 4).fill(fill))
                }
                output.push([fill, fill, ...row, fill, fill])
            }
            output.push(new Array<string>(output[0].length).fill(fill))
            output.push(new Array<string>(output[0].length).fill(fill))
            console.log('')
            output.forEach(r => console.log(r.map(v => v === '1' ? '#' : ' ').join('')))
            input = output; fill = '0'
        }
        console.log(input.reduce((pv, cv) => (pv + cv.reduce((p, c) => (p + +c), 0)), 0))
    });
}