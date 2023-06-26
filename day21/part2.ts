{
    const readline = require('readline');
    let players: number[] = []
    let expression = /Player \d+ starting position: (\d+)/
    let die = 1
    let rolls = 0

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let arr = expression.exec(line)!;
        players.push(+arr[1])
    });

    rl.on('close', () => {
        let wins = [0,0]
        let p: ({score: number, count: number} | undefined)[]= new Array<{score: number, count: number}>(9)
        let remaining = [{next: 0, count: 1, sc: [{p: players[0], s: 0}, {p: players[1], s: 0}]}];
        [1,2,3].forEach(e1 => [1,2,3].forEach(e2 => [1,2,3].forEach(e3 => {
            let key = e1 + e2 + e3
            if (p[key] === undefined) p[key] = {score: key, count: 1}
            else p[key]!.count += 1
        })))
        let path: {score: number, count: number}[] = []
        p.filter(v => v !== undefined).forEach(v => path.push(v!))
        while (remaining.length > 0) {
            let next: {next: number, count: number, sc: {p: number, s: number}[]}[] = []
            remaining.forEach(r => {
                let p = r.sc[r.next];
                path.forEach((v, i) => {
                    let nv = {p: p.p + v.score, s: p.s}
                    if (nv.p > 10) nv.p -= 10
                    nv.s += nv.p
                    if (nv.s >= 21) wins[r.next] += v.count * r.count
                    else next.push({next: r.next === 0 ? 1 : 0, count: r.count * v.count,
                        sc: [r.next === 0 ? nv : r.sc[0], r.next === 0 ? r.sc[1] : nv]})
                })
            })
            remaining = next
        }
        console.log(`${wins[0]} ${wins[1]}`)
    });
}