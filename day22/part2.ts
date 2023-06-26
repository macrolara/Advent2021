{
    const readline = require('readline');
    let expression = /(\w+) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    let directions: {on: boolean, d: {min: number, max: number}[]}[] = []

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let arr = expression.exec(line)!
        directions.push({on: arr[1] === 'on', d: [{min: +arr[2], max: +arr[3]}, {min: +arr[4], max: +arr[5]}, {min: +arr[6], max: +arr[7]}]})
    });

    rl.on('close', () => {
        let cubes: {delete: boolean, d: {min: number, max: number}[]}[] = []
        directions.forEach(d => {
            let newCubes: {delete: boolean, d: {min: number, max: number}[]}[] = []
            let deleteBox = false
            cubes.filter(c => c.d.every((cd, i) => cd.min <= d.d[i].max && cd.max >= d.d[i].min)).forEach(c => {
                if (c.d.every((cd, i) => d.d[i].min <= cd.min && d.d[i].max >= cd.max)) c.delete = true
                else if (d.on && c.d.every((cd, i) => cd.min <= d.d[i].min && cd.max >= d.d[i].max)) deleteBox = true
                else {
                    c.delete = true
                    for (let i = 0; i < 3; i++) {
                        if (c.d[i].min < d.d[i].min) {
                            newCubes.push({delete: false, d: c.d.map((x, j) => ((i === j) ? {min: x.min, max: d.d[j].min - 1} : {min: x.min, max: x.max}))})
                            c.d[i].min = d.d[i].min
                        }
                        if (c.d[i].max > d.d[i].max) {
                            newCubes.push({delete: false, d: c.d.map((x, j) => ((i === j) ? {min: d.d[j].max + 1, max: x.max} : {min: x.min, max: x.max}))})
                            c.d[i].max = d.d[i].max
                        }
                    }
                }
            })
            if (!deleteBox && d.on) newCubes.push({delete: false, d: d.d})
            // console.log(`${d.d[0].min}-${d.d[0].max}: ${cubes.length}, ${newCubes.length}, %s`, cubes.reduce((pv, cv) => pv + (cv.delete ? 0 : 1),0))
            cubes = newCubes.concat(cubes.filter(x => !x.delete))
        })
        console.log(`${cubes.length} ${cubes[0].d[0].max} ${cubes[0].d[0].min} ${cubes[0].d[1].max} ${cubes[0].d[1].min} ${cubes[0].d[2].max} ${cubes[0].d[2].min}`)
        console.log(cubes.reduce((pv, cv) => pv + cv.d.reduce((px, cx) => px * (cx.max + 1 - cx.min), 1), 0))
    });
}