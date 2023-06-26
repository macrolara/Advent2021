{
    const readline = require('readline');
    let onFolds = false;
    let dots = new Map();
    let folds = [];
    let expression = /(\w)=(\d+)/;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', (line) => {
        if (onFolds) {
            let array = expression.exec(line);
            folds.push({ isX: array[1] === "x", position: +array[2] });
        }
        else {
            if (line.length === 0)
                onFolds = true;
            else {
                let point = line.split(',').map(v => +v).reduce((pv, cv, i) => {
                    if (i === 0)
                        pv.x = cv;
                    else
                        pv.y = cv;
                    return pv;
                }, { x: 0, y: 0 });
                dots.set("" + point.x + "," + point.y, point);
            }
        }
    });
    rl.on('close', () => {
        let fold = folds.shift();
        let newDots = new Map();
        [...dots.values()].forEach(d => {
            let newDot;
            if ((fold.isX && d.x <= fold.position) || (!fold.isX && d.y <= fold.position))
                newDot = d;
            else
                newDot = { x: fold.isX ? 2 * fold.position - d.x : d.x, y: fold.isX ? d.y : 2 * fold.position - d.y };
            let key = "" + newDot.x + "," + newDot.y;
            if (!newDots.has(key))
                newDots.set(key, newDot);
        });
        console.log(newDots.size);
        //[...newDots.values()].sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y).forEach(v => console.log(JSON.stringify(v)));
    });
}
