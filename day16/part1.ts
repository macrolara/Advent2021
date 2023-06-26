{
    const readline = require('readline');
    let data: string;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    function toBin(hex: string): string {
        return (parseInt(hex, 16).toString(2).padStart(4, '0'));
    }

    rl.on('line', (line: string) => {
        data = line.split('').map(c => toBin(c)).join('');
    });

    enum State {
        Version,
        Type,
        PacketType,
        SizedPackets,
        NumberedPackets,
        SeqPacket,
        Padding,
        Exit
    }

    rl.on('close', () => {
        console.log(`${data}`);
        let sum = parsePacket({pattern: data, pos: 0}, 0);
        console.log(sum);
    });

    function parsePacket(p: {pattern: string, pos: number}, depth: number): number {
        let versionSum = 0;
        let state = State.Version;
        if (depth > 50) throw Error(`Too deep ${depth}`);
        while (state != State.Exit) {
            switch(state) {
                case State.Version:
                    let version = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    console.log(`v: ${version} ${p.pos} ${depth}`);
                    versionSum += version;
                    p.pos += 3;
                    state = State.Type;
                    break;
                case State.Type:
                    let type = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    if (type === 4) state = State.SeqPacket;
                    else state = State.PacketType;
                    console.log(`t: ${type} ${p.pos} ${depth} n = ${state}`);
                    p.pos += 3;
                    break;
                case State.SeqPacket:
                    if (p.pattern[p.pos] === '0') state = State.Padding;
                    p.pos += 5;
                    console.log(`sp: ${p.pos} ${depth} n = ${state}`)
                    break;
                case State.PacketType:
                    if (p.pattern[p.pos] === '0') state = State.SizedPackets;
                    else state = State.NumberedPackets;
                    p.pos += 1;
                    break;
                case State.NumberedPackets:
                    let count = parseInt(p.pattern.slice(p.pos, p.pos + 11), 2);
                    state = State.Padding;
                    p.pos += 11;
                    console.log(`c: ${count} ${p.pos} ${depth}`)
                    if (count > 60) throw Error(`Too many ${count}`)
                    for (let i = 0; i < count; i++) versionSum += parsePacket(p, depth + 1);
                    break;
                case State.SizedPackets:
                    let size = parseInt(p.pattern.slice(p.pos, p.pos + 15), 2);
                    state = State.Padding;
                    p.pos += 15;
                    let end = p.pos + size;
                    console.log(`s: ${size} ${p.pos} ${depth} ${end}`);
                    if (size > 500) throw Error(`Too long ${size}`);
                    let i = 0;
                    while (p.pos < end) versionSum += parsePacket(p, depth + 1);
                    console.log(`se: ${p.pos} ${end} ${depth} ${state}`)
                    break;
                case State.Padding:
                    if (depth === 0 && p.pos % 4 > 0) p.pos += 4 - p.pos % 4;
                    state = State.Exit;
                    break;
            }
            if (p.pos > p.pattern.length) throw Error(`Past the end ${p.pos}`);
        }
        console.log(`vs: ${versionSum} ${p.pos} ${depth}`);
        return versionSum;
    }
}