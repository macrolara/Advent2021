{
    const readline = require('readline');
    let scanners = [];
    let newScanner = true;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', (line) => {
        if (newScanner) {
            scanners.push({ scanner: +line.split(' ')[2], beacons: [], pairs: new Map() });
            newScanner = false;
        }
        else {
            if (line.length === 0) {
                newScanner = true;
            }
            else {
                let s = scanners[scanners.length - 1];
                let beacon = { id: s.beacons.length, coords: line.split(',').map(v => +v) };
                for (let i = 0; i < s.beacons.length; i++) {
                    s.pairs.set([Math.abs(beacon.coords[0] - s.beacons[i].coords[0]),
                        Math.abs(beacon.coords[1] - s.beacons[i].coords[1]),
                        Math.abs(beacon.coords[2] - s.beacons[i].coords[2])].sort((a, b) => a - b).join(','), [beacon.id, s.beacons[i].id]);
                }
                s.beacons.push(beacon);
            }
        }
    });
    rl.on('close', () => {
        let s = [...scanners];
        let counted = [s.pop()];
        let count = counted[0].beacons.length;
        while (s.length > 0) {
            let scanner = s.pop();
            // console.log(`${scanner.scanner}: ${scanner.beacons.length} - ${combo.scanner}`)
            let seen = new Set();
            [...scanner.pairs.keys()].forEach((p, i) => {
                for (let i = 0; i < counted.length; i++) {
                    if (counted[i].pairs.has(p)) {
                        let pair = scanner.pairs.get(p);
                        seen.add(pair[0]);
                        seen.add(pair[1]);
                        break;
                    }
                }
            });
            count += scanner.beacons.length - seen.size;
            counted.push(scanner);
            console.log(`${count}: ${scanner.scanner} has ${scanner.beacons.length} - ${seen.size}`);
        }
    });
}
