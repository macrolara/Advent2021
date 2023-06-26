{
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        const array = /x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/.exec(line)!;
        const xBox: {min: number, max: number} = {min: Math.min(+array[1], +array[2]), max: Math.max(+array[1], +array[2])};
        const yBox: {min: number, max: number} = {min: Math.min(+array[3], +array[4]), max: Math.max(+array[3], +array[4])};
        
        let startX = 0, maxRange;
        do {
            startX += 1;
            maxRange = Array.from({length: startX}, (_, i) => i + 1).reduce((pv, cv) => (pv + cv), 0);
        } while (maxRange < xBox.min);
        console.log(`${startX}, ${xBox.min} ${xBox.max}, ${yBox.min} ${yBox.max}`);
        let points: {yv: number, yval: number, xv: number[], steps: number}[] = [];
        let maxSteps = 0;
        for (let v = yBox.min; v <= yBox.min * -1; v++) {
            let y = 0, step = 0, velocity = v;
            do {
                if (y <= yBox.max) {
                    // if (!points.has(step)) {
                        points.push({yv: v, yval: y, xv: [], steps: step})
                        maxSteps = Math.max(step, maxSteps)
                    // }
                }
                y += velocity; velocity--; step++;
            } while (y >= yBox.min);
        }
        // console.log(JSON.stringify([...points.values()]));
        for (let v = startX; v <= xBox.max; v++) {
            let x = 0, step = 0, velocity = v;
            do {
                if (x >= xBox.min) {
                    points.filter(p => p.steps === step).forEach(p => p.xv.push(v));
                }
                x += velocity;
                if (velocity > 0) velocity--;
                step++;
            } while (step <= maxSteps && x <= xBox.max);
        }
        let set: Set<string> = new Set();
        [...points.values()].forEach(p => {p.xv.forEach(px => set.add("" + px + "," + p.yv))});
        // console.log([...points.values()].reduce((pv, cv) => (pv + "" + cv.yv + "(" + cv.xv.join(',') + ")\n"), ""))
        console.log(set.size);
    });
}