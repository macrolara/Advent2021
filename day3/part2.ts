{
    const readline = require('readline');
    let rows: string[][] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        rows.push(line.split(''));
    });

    rl.on('close', () => {
        let ox = getValue((count, length) => (count >= (length / 2) ? '1' : '0'));
        let co = getValue((count, length) => (count < (length / 2) ? '1' : '0'));
        console.log(`${ox}, ${co}, %d`, parseInt(ox, 2) * parseInt(co, 2));
    });

    function getValue(compare: (oneCount: number, arrayLength: number) => string): string {
        let remaining = rows;
        for (let i = 0; i < rows[0].length; i++) {
            let oneCount = remaining.reduce((pv, cv) => (cv[i] === '1' ? pv += 1 : pv), 0);
            let rest: string[][] = [];
            let matchBit = compare(oneCount, remaining.length);
            remaining.forEach(r => {if (r[i] === matchBit) rest.push(r);});
            if (rest.length === 1) {
                return rest[0].join('');
            }
            remaining = rest;
        }
        throw Error(`Not possible`);
    }
}