{
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', (line) => {
        const array = /x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/.exec(line);
        const xBox = { min: Math.min(+array[1], +array[2]), max: Math.max(+array[1], +array[2]) };
        const yBox = { min: Math.min(+array[3], +array[4]), max: Math.max(+array[3], +array[4]) };
        let startX = 0, maxRange;
        do {
            startX += 1;
            maxRange = Array.from({ length: startX }, (_, i) => i + 1).reduce((pv, cv) => (pv + cv), 0);
        } while (maxRange < xBox.min);
        console.log(`${startX}, ${xBox.min} ${xBox.max}, ${yBox.min} ${yBox.max}`);
        let points = new Map();
        let maxSteps = 0;
        for (let v = 0; v <= yBox.min * -1; v++) {
            let y = 0, step = 0, maxY = 0, velocity = v;
            do {
                if (y <= yBox.max) {
                    if (!points.has(step) || (points.get(step).maxY < maxY)) {
                        points.set(step, { yv: v, yval: y, xv: undefined, steps: step, maxY: maxY });
                        maxSteps = Math.max(step, maxSteps);
                    }
                }
                y += velocity;
                velocity--;
                step++;
                maxY = Math.max(maxY, y);
            } while (y >= yBox.min);
        }
        //console.log(JSON.stringify([...points.values()]));
        for (let v = startX; v <= xBox.max; v++) {
            let x = 0, step = 0, velocity = v;
            do {
                if (x >= xBox.min) {
                    if (points.has(step))
                        points.get(step).xv = v;
                }
                x += velocity;
                if (velocity > 0)
                    velocity--;
                step++;
            } while (step <= maxSteps && x <= xBox.max);
        }
        console.log(JSON.stringify([...points.values()].filter(p => p.xv !== undefined).reduce((pv, cv) => {
            if (cv.maxY > pv.maxY)
                return { xv: cv.xv, yv: cv.yv, maxY: cv.maxY };
            return pv;
        }, { xv: 0, yv: 0, maxY: 0 })));
    });
}
