{
    const readline = require('readline');
    let data: string;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        data = line.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    });

    enum State2 {
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
        let sum = parsePacket2({pattern: data, pos: 0}, 0);
        console.log(sum);
    });

    enum PacketType {
        Sum = 0,
        Product,
        Min,
        Max,
        Literal,
        Gt,
        Lt,
        Eq
    }

    function getValue(values: number[], opType: PacketType): number {
        console.log(`op ${opType}, ${values.length}, ${values[0]}`);
        switch (opType) {
            case PacketType.Eq:
                return values[0] === values[1] ? 1 : 0;
            case PacketType.Gt:
                return values[0] > values[1] ? 1 : 0;
            case PacketType.Lt:
                return values[0] < values[1] ? 1 : 0;
            case PacketType.Max:
                return Math.max(...values);
            case PacketType.Min:
                return Math.min(...values);
            case PacketType.Product:
                return values.reduce((pv, cv) => (pv * cv), 1);
            case PacketType.Sum:
                return values.reduce((pv, cv) => (pv + cv), 0);
        }
        throw Error("Invalid operation");
    }

    function parsePacket2(p: {pattern: string, pos: number}, depth: number): number {
        let value = 0;
        let opType: PacketType = PacketType.Eq;
        let state = State2.Version;
        if (depth > 50) throw Error(`Too deep ${depth}`);
        let values: number[] = [];
        while (state != State2.Exit) {
            switch(state) {
                case State2.Version:
                    let version = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    // console.log(`v: ${version} ${p.pos} ${depth}`);
                    p.pos += 3;
                    state = State2.Type;
                    break;
                case State2.Type:
                    opType = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    if (opType === PacketType.Literal) state = State2.SeqPacket;
                    else state = State2.PacketType;
                    // console.log(`t: ${opType} ${p.pos} ${depth} n = ${state}`);
                    p.pos += 3;
                    break;
                case State2.SeqPacket:
                    let str = "";
                    do {
                        str += parseInt(p.pattern.slice(p.pos + 1, p.pos + 5), 2).toString(16);
                        p.pos += 5;
                    } while (p.pattern[p.pos - 5] === '1');
                    value = parseInt(str, 16);
                    console.log(`lit: ${p.pos} ${depth} ${value}`);
                    state = State2.Padding;
                    break;
                case State2.PacketType:
                    if (p.pattern[p.pos] === '0') state = State2.SizedPackets;
                    else state = State2.NumberedPackets;
                    p.pos += 1;
                    break;
                case State2.NumberedPackets:
                    let count = parseInt(p.pattern.slice(p.pos, p.pos + 11), 2);
                    state = State2.Padding;
                    p.pos += 11;
                    // console.log(`c: ${count} ${p.pos} ${depth}`)
                    if (count > 60) throw Error(`Too many ${count}`)
                    for (let i = 0; i < count; i++) values.push(parsePacket2(p, depth + 1));
                    value = getValue(values, opType);
                    console.log(`np: ${p.pos} ${depth} ${state} ${value}`)
                    break;
                case State2.SizedPackets:
                    let size = parseInt(p.pattern.slice(p.pos, p.pos + 15), 2);
                    state = State2.Padding;
                    p.pos += 15;
                    let end = p.pos + size;
                    // console.log(`s: ${size} ${p.pos} ${depth} ${end}`);
                    if (size > 500) throw Error(`Too long ${size}`);
                    while (p.pos < end) values.push(parsePacket2(p, depth + 1));
                    console.log(`sp: ${p.pos} ${end} ${depth} ${state} ${value}`)
                    value = getValue(values, opType);
                    break;
                case State2.Padding:
                    if (depth === 0 && p.pos % 4 > 0) p.pos += 4 - p.pos % 4;
                    state = State2.Exit;
                    break;
            }
            if (p.pos > p.pattern.length) throw Error(`Past the end ${p.pos}`);
        }
        console.log(`vs: ${value} ${p.pos} ${depth}`);
        return value;
    }
}