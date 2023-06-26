{
    const readline = require('readline');
    let scanners: {scanner: number, beacons: {id: number, coords: number[]}[], pairs: Map<string, {id: number, coords: number[]}[]>}[] = [];
    let newScanner = true;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        if (newScanner) {
            scanners.push({scanner: +line.split(' ')[2], beacons: [], pairs: new Map()});
            newScanner = false;
        }
        else {
            if (line.length === 0) {
                newScanner = true;
            }
            else {
                let s = scanners[scanners.length - 1];
                let beacon = {id: s.beacons.length, coords: line.split(',').map(v => +v)}
                for (let i = 0; i < s.beacons.length; i++) {
                    s.pairs.set([Math.abs(beacon.coords[0] - s.beacons[i].coords[0]),
                    Math.abs(beacon.coords[1] - s.beacons[i].coords[1]),
                    Math.abs(beacon.coords[2] - s.beacons[i].coords[2])].sort((a, b) => a - b).join(','), [beacon, s.beacons[i]])
                }
                s.beacons.push(beacon);
            }
        }
    });

    rl.on('close', () => {
        let results = [{s: scanners[0].scanner, coords: [0, 0, 0], axisIndex: 0, ref: 0, pairs: scanners[0].pairs}];
        let list = scanners.slice(1);
        let deferred: number[] = [];
        let deferredCount = results.length;
        let axisOptions: {axis: number, isPositive: boolean}[][] = [];
        let options = [{axis: 0, isPositive: true}, {axis: 0, isPositive: false},
        {axis: 1, isPositive: true}, {axis: 1, isPositive: false},
        {axis: 2, isPositive: true}, {axis: 2, isPositive: false}];
        options.forEach(x => {
            let xoption = [x];
            options.forEach(y => {
                if (y.axis !== xoption[0].axis) {
                    let yoption = [...xoption, y]
                    options.forEach(z => {
                        if (z.axis !== yoption[0].axis && z.axis !== yoption[1].axis) {
                            let zoption = [...yoption, z];
                            axisOptions.push(zoption);
                        }
                    })
                }
            })
        })
        while (results.length < scanners.length) {
            let curr = list.shift()!;
            if (deferred.includes(curr.scanner)) {
                if (results.length === deferredCount) break;
                deferred = [];
                deferredCount = results.length;
            }
            let d: {s: number, dupes: {pair: {id: number, beacons: {id: number, coords: number[]}[]}[]}[]}[] = [];
            for (let i = 0; i < results.length; i++) {
                d.push({s: results[i].s, dupes: []});
                [...curr.pairs.keys()].forEach(p => {
                    if (results[i].pairs.has(p))
                        d[d.length - 1].dupes.push({pair: [{id: results[i].s, beacons: results[i].pairs.get(p)!}, {id: curr.scanner, beacons: curr.pairs.get(p)!}]})
                })
            }
            if (d.reduce((pv, cv) => pv + cv.dupes.length, 0) < 10) {
                deferred.push(curr.scanner);
                list.push(curr);
            }
            else {
                d.filter(r => r.dupes.length > 9).every(r => {
                    let s = scanners.find(sc => sc.scanner === r.s)!
                    let dlist: {b1: {id: number, coords: number[]}, b2: {id: number, coords: number[]}, s: {n: number, v: number[]}[]}[] = [];
                    for (let j = 0; j < s.beacons.length; j++) {
                        let sets = r.dupes.filter(v => v.pair[0].beacons.some(b => b.id === s.beacons[j].id)).map(p => p.pair[1])
                        if (sets.length > 1) {
                            dlist.push({b1: s.beacons[j], b2: sets[0].beacons[0] === sets[1].beacons[0] || sets[0].beacons[0] === sets[1].beacons[1]
                                ? sets[0].beacons[0] : sets[0].beacons[1], s: []});
                        }
                    }
                    dlist.forEach(d => {
                        axisOptions.forEach((o, i) => {
                            d.s.push({n: i, v: [d.b1.coords[0] - d.b2.coords[o[0].axis] * (o[0].isPositive ? 1 : -1),
                                d.b1.coords[1] - d.b2.coords[o[1].axis] * (o[1].isPositive ? 1 : -1),
                                d.b1.coords[2] - d.b2.coords[o[2].axis] * (o[2].isPositive ? 1 : -1)]})
                        })
                    })
                    let slist = dlist[0].s;
                    let counts = new Array<number>(slist.length).fill(0);
                    dlist.forEach(d => {
                        d.s.forEach((s, i) => {
                            if (s.v.every((v, j) => v === slist[i].v[j])) counts[i]++;
                        })
                    })
                    let max = counts.reduce((pv, cv, i) => {
                        if (cv > pv.max) return {max: cv, i: i}
                        return pv}, {max: 0, i: 0})
                    console.log(`${curr.scanner}-${s.scanner}: [${slist[max.i].v[0]},${slist[max.i].v[1]},${slist[max.i].v[2]}] max: ${max.max}/${dlist.length}`)
                    if (max.max === dlist.length) {
                        let r = results.find(r => r.s === s.scanner)!;
                        let c = [slist[max.i].v[0], slist[max.i].v[1], slist[max.i].v[2]]
                        while (r.s !== 0) {
                            let cr = [r.coords[0] + (axisOptions[r.axisIndex][0].isPositive ? 1 : -1) * c[axisOptions[r.axisIndex][0].axis]
                                , r.coords[1] + (axisOptions[r.axisIndex][1].isPositive ? 1 : -1) * c[axisOptions[r.axisIndex][1].axis]
                                , r.coords[2] + (axisOptions[r.axisIndex][2].isPositive ? 1 : -1) * c[axisOptions[r.axisIndex][2].axis]]
                            c = cr.slice();
                            console.log(`Scanner: ${r.s}:${r.ref}:${r.axisIndex} - [${r.coords[0]},${r.coords[1]},${r.coords[2]}] x: ${axisOptions[r.axisIndex][0].axis},${axisOptions[r.axisIndex][0].isPositive}:${axisOptions[r.axisIndex][1].axis},${axisOptions[r.axisIndex][1].isPositive}:${axisOptions[r.axisIndex][2].axis},${axisOptions[r.axisIndex][2].isPositive} to %s`, c.join(','))
                            r = results.find(x => x.s === r.ref)!
                        }
                        results.push({s: curr.scanner, coords: c, axisIndex: max.i, ref: s.scanner, pairs: curr.pairs})
                        console.log(`Recording ${curr.scanner}:${s.scanner} - [${results[results.length - 1].coords[0]},${results[results.length - 1].coords[1]},${results[results.length - 1].coords[2]}] ${max.i}, total results ${results.length}/${scanners.length}`)
                    }
                    return results.find(f => f.s === curr.scanner) === undefined;
                })
                if (results.find(f => f.s === curr.scanner) === undefined) {
                    console.log(`Did not find ${curr.scanner}`)
                    deferred.push(curr.scanner);
                    list.push(curr);
                }
            }
        }
        let max = 0;
        for (let i = 0; i < results.length; i++)
            for (let j = 0; j < results.length; j++)
                if (i !== j)
                    max = Math.max(max, Math.abs(results[i].coords[0] - results[j].coords[0]) +
                        Math.abs(results[i].coords[1] - results[j].coords[1]) +
                        Math.abs(results[i].coords[2] - results[j].coords[2]))
        results.forEach(r => console.log("[" + r.coords.join(',') +"]"))
        console.log(`${max}`);
    });
}