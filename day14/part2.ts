{
    const readline = require('readline');
    let template: string[] = [];
    let pairs: Map<string, string> = new Map();
    let expression = /(\w+)\s+->\s+(\w+)/;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (template.length === 0) template = line.split('');
        else if (line.length !== 0) {
            let array = expression.exec(line)!;
            pairs.set(array[1], array[2]);
        }
    });

    rl.on('close', () => {
        let counters: Map<string, number> = new Map();
        let keys = [...pairs.keys()];
        keys.forEach(k => counters.set(k, template.join('').includes(k) ? 1 : 0));
        let sums: Map<string, number> = new Map();
        keys.forEach(k => k.split('').forEach(c => sums.set(c, 0)));
        template.forEach(c => sums.set(c, sums.get(c)! + 1));
        for (let i = 0; i < 40; i++) {
            let list = keys.filter(k => counters.get(k)! > 0).map(k => ({key: k, count: counters.get(k)!}));
            list.forEach(r => {
                let key1 = r.key.charAt(0) + pairs.get(r.key)!, key2 = pairs.get(r.key)! + r.key.charAt(1);
                counters.set(key1, counters.get(key1)! + r.count);
                counters.set(key2, counters.get(key2)! + r.count);
                counters.set(r.key, counters.get(r.key)! - r.count);
                sums.set(pairs.get(r.key)!, sums.get(pairs.get(r.key)!)! + r.count);
            });
            //keys.filter(k => counters.get(k)! > 0).forEach(k => console.log(`${i}: ${k} - %d`, counters.get(k)))
        }
        let limits = [...sums.keys()].reduce((pv, v) => {
            if (sums.get(v)! < pv.min) {pv.min = sums.get(v)!; pv.minKey = v}
            if (sums.get(v)! > pv.max) {pv.max = sums.get(v)!; pv.maxKey = v}
            return pv;
        }, {max: 0, maxKey: "", min: Infinity, minKey: ""});
        console.log(`${limits.maxKey} - ${limits.max}, ${limits.minKey} - ${limits.min} %d`, limits.max - limits.min);
    });
}