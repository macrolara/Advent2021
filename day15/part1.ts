{
    const readline = require('readline');
    let risks: number[][] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        risks.push(line.split('').map(v => +v));
    });

    function getBFSMinCost(y: number, x: number): number {
        let q: {y: number, x: number, score: number}[] = [];
        let lowScore: Map<string, number> = new Map();
        q.push({y: 0, x: 0, score: 0});
        let min = Math.min(
            risks.reduce((pv, cv) => (pv += cv[0]), 0) + risks[risks.length - 1].reduce((pv, cv) => pv += cv, 0),
            risks.reduce((pv, cv) => (pv += cv[risks.length - 1]), 0) + risks[0].reduce((pv, cv) => pv += cv, 0)
        ) - risks[0][0];
        let logValue = 10;
        while (q.length > 0) {
            const n = q.shift()!;
            [{y: n.y - 1, x: n.x}, {y: n.y + 1, x: n.x}, {y: n.y, x: n.x - 1}, {y: n.y, x: n.x + 1}].
                filter(v => v.x > -1 && v.y > -1 && v.x < risks[0].length && v.y < risks.length).
                filter(v => risks[v.y][v.x] + n.score < min).forEach(v => {
                    let score = n.score + risks[v.y][v.x];
                    if (v.x === logValue) {
                        console.log(`${logValue}: ${v.y}:${v.x} ${score}`);
                        logValue = logValue < 90 ? logValue + 10 : logValue + 2;
                    }
                    if (v.y === risks.length - 1 && v.x === risks[0].length - 1) {
                        min = Math.min(score, min);
                        console.log(`min ${min}`);
                    }
                    else {
                        let key = "" + v.y + "," + v.x;
                        let low = lowScore.get(key);
                        if (low === undefined || low > score) {
                            lowScore.set(key, score);
                            q.push({y: v.y, x: v.x, score: score});
                        }
                    }
            });
        }
        return min;
    }

    function getMinCost(y: number, x: number, score: number, lowScore: Map<string, number>): number {
        if (y === risks.length - 1 && x === risks[0].length - 1) return risks[y][x];
        let key = "" + y + "," + x;
        score += risks[y][x];
        let low = lowScore.get(key);
        if (low === undefined || low > score) lowScore.set(key, score);
        else return Infinity;
        return [{y: y - 1, x: x}, {y: y + 1, x: x}, {y: y, x: x - 1}, {y: y, x: x + 1}].
                filter(v => v.x > -1 && v.y > -1 && v.x < risks[0].length && v.y < risks.length).
                reduce((pv, v) => pv = Math.min(pv, getMinCost(v.y, v.x, score, lowScore)), Infinity) + risks[y][x];
    }

    rl.on('close', () => {
        //console.log(getMinCost(0, 0, 0, new Map<string, number>()) - risks[0][0]);
        console.log(getBFSMinCost(0, 0));
    });
}