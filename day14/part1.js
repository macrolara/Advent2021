{
    const readline = require('readline');
    let template = [];
    let pairs = new Map();
    let expression = /(\w+)\s+->\s+(\w+)/;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', (line) => {
        if (template.length === 0)
            template = line.split('');
        else if (line.length !== 0) {
            let array = expression.exec(line);
            pairs.set(array[1], array[2]);
        }
    });
    rl.on('close', () => {
        let pattern = [...template];
        for (let i = 0; i < 10; i++) {
            let next = [];
            let key = "";
            for (let j = 1; j < pattern.length; j++) {
                key = pattern.slice(j - 1, j + 1).join('');
                let value = pairs.get(key);
                next = next.concat([key.charAt(0), value]);
            }
            next.push(key.charAt(1));
            pattern = next;
        }
        let values = new Map();
        pattern.forEach(v => {
            if (values.has(v))
                values.set(v, values.get(v) + 1);
            else
                values.set(v, 1);
        });
        let r = [...values.keys()].reduce((pv, cv) => {
            let v = values.get(cv);
            if (v < pv.min)
                pv.min = v;
            if (v > pv.max)
                pv.max = v;
            return pv;
        }, { max: 0, min: Infinity });
        console.log(r.max - r.min);
    });
}
