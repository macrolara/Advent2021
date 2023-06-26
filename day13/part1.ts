{
    const readline = require('readline');
    let onFolds = false;
    let dots: Map<string, {x: number, y: number}> = new Map();
    let folds: {isX: boolean, position: number}[] = [];
    let expression = /(\w)=(\d+)/;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (onFolds) {
            let array = expression.exec(line)!;
            folds.push({isX: array[1] === "x", position: +array[2]});
        }
        else {
            if (line.length === 0) onFolds = true;
            else {
                let point: {x: number, y: number} = line.split(',').map(v => +v).reduce((pv, cv, i) => {
                    if (i === 0) pv.x = cv; else pv.y = cv; return pv;}, {x: 0, y: 0});
                dots.set("" + point.x + "," + point.y, point);
            }
        }
    });

    rl.on('close', () => {
        let fold = folds.shift()!;
        let newDots: Map<string, {x: number, y: number}> = new Map();
        [...dots.values()].forEach(d => {
            let newDot: {x: number, y: number};
            if ((fold.isX && d.x <= fold.position) || (!fold.isX && d.y <= fold.position)) newDot = d;
            else newDot = {x: fold.isX ? 2 * fold.position - d.x : d.x, y: fold.isX ? d.y : 2 * fold.position - d.y};
            let key = "" + newDot.x + "," + newDot.y;
            if (!newDots.has(key)) newDots.set(key, newDot);
        });
        console.log(newDots.size);
        //[...newDots.values()].sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y).forEach(v => console.log(JSON.stringify(v)));
    });
}