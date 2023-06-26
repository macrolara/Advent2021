{
    var readline = require('readline');
    var data_1;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        data_1 = line.split('').map(function (c) { return parseInt(c, 16).toString(2).padStart(4, '0'); }).join('');
    });
    var State2 = void 0;
    (function (State2) {
        State2[State2["Version"] = 0] = "Version";
        State2[State2["Type"] = 1] = "Type";
        State2[State2["PacketType"] = 2] = "PacketType";
        State2[State2["SizedPackets"] = 3] = "SizedPackets";
        State2[State2["NumberedPackets"] = 4] = "NumberedPackets";
        State2[State2["SeqPacket"] = 5] = "SeqPacket";
        State2[State2["Padding"] = 6] = "Padding";
        State2[State2["Exit"] = 7] = "Exit";
    })(State2 || (State2 = {}));
    rl.on('close', function () {
        console.log("".concat(data_1));
        var sum = parsePacket2({ pattern: data_1, pos: 0 }, 0);
        console.log(sum);
    });
    var PacketType = void 0;
    (function (PacketType) {
        PacketType[PacketType["Sum"] = 0] = "Sum";
        PacketType[PacketType["Product"] = 1] = "Product";
        PacketType[PacketType["Min"] = 2] = "Min";
        PacketType[PacketType["Max"] = 3] = "Max";
        PacketType[PacketType["Literal"] = 4] = "Literal";
        PacketType[PacketType["Gt"] = 5] = "Gt";
        PacketType[PacketType["Lt"] = 6] = "Lt";
        PacketType[PacketType["Eq"] = 7] = "Eq";
    })(PacketType || (PacketType = {}));
    function getValue(values, opType) {
        console.log("op ".concat(opType, ", ").concat(values.length, ", ").concat(values[0]));
        switch (opType) {
            case PacketType.Eq:
                return values[0] === values[1] ? 1 : 0;
            case PacketType.Gt:
                return values[0] > values[1] ? 1 : 0;
            case PacketType.Lt:
                return values[0] < values[1] ? 1 : 0;
            case PacketType.Max:
                return Math.max.apply(Math, values);
            case PacketType.Min:
                return Math.min.apply(Math, values);
            case PacketType.Product:
                return values.reduce(function (pv, cv) { return (pv * cv); }, 1);
            case PacketType.Sum:
                return values.reduce(function (pv, cv) { return (pv + cv); }, 0);
        }
        throw Error("Invalid operation");
    }
    function parsePacket2(p, depth) {
        var value = 0;
        var opType = PacketType.Eq;
        var state = State2.Version;
        if (depth > 50)
            throw Error("Too deep ".concat(depth));
        var values = [];
        while (state != State2.Exit) {
            switch (state) {
                case State2.Version:
                    var version = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    // console.log(`v: ${version} ${p.pos} ${depth}`);
                    p.pos += 3;
                    state = State2.Type;
                    break;
                case State2.Type:
                    opType = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    if (opType === PacketType.Literal)
                        state = State2.SeqPacket;
                    else
                        state = State2.PacketType;
                    // console.log(`t: ${opType} ${p.pos} ${depth} n = ${state}`);
                    p.pos += 3;
                    break;
                case State2.SeqPacket:
                    var str = "";
                    do {
                        str += parseInt(p.pattern.slice(p.pos + 1, p.pos + 5), 2).toString(16);
                        p.pos += 5;
                    } while (p.pattern[p.pos - 5] === '1');
                    value = parseInt(str, 16);
                    console.log("lit: ".concat(p.pos, " ").concat(depth, " ").concat(value));
                    state = State2.Padding;
                    break;
                case State2.PacketType:
                    if (p.pattern[p.pos] === '0')
                        state = State2.SizedPackets;
                    else
                        state = State2.NumberedPackets;
                    p.pos += 1;
                    break;
                case State2.NumberedPackets:
                    var count = parseInt(p.pattern.slice(p.pos, p.pos + 11), 2);
                    state = State2.Padding;
                    p.pos += 11;
                    // console.log(`c: ${count} ${p.pos} ${depth}`)
                    if (count > 60)
                        throw Error("Too many ".concat(count));
                    for (var i = 0; i < count; i++)
                        values.push(parsePacket2(p, depth + 1));
                    value = getValue(values, opType);
                    console.log("np: ".concat(p.pos, " ").concat(depth, " ").concat(state, " ").concat(value));
                    break;
                case State2.SizedPackets:
                    var size = parseInt(p.pattern.slice(p.pos, p.pos + 15), 2);
                    state = State2.Padding;
                    p.pos += 15;
                    var end = p.pos + size;
                    // console.log(`s: ${size} ${p.pos} ${depth} ${end}`);
                    if (size > 500)
                        throw Error("Too long ".concat(size));
                    while (p.pos < end)
                        values.push(parsePacket2(p, depth + 1));
                    console.log("sp: ".concat(p.pos, " ").concat(end, " ").concat(depth, " ").concat(state, " ").concat(value));
                    value = getValue(values, opType);
                    break;
                case State2.Padding:
                    if (depth === 0 && p.pos % 4 > 0)
                        p.pos += 4 - p.pos % 4;
                    state = State2.Exit;
                    break;
            }
            if (p.pos > p.pattern.length)
                throw Error("Past the end ".concat(p.pos));
        }
        console.log("vs: ".concat(value, " ").concat(p.pos, " ").concat(depth));
        return value;
    }
}
