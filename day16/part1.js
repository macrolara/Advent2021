{
    var readline = require('readline');
    var data_1;
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    function toBin(hex) {
        return (parseInt(hex, 16).toString(2).padStart(4, '0'));
    }
    rl.on('line', function (line) {
        data_1 = line.split('').map(function (c) { return toBin(c); }).join('');
    });
    var State = void 0;
    (function (State) {
        State[State["Version"] = 0] = "Version";
        State[State["Type"] = 1] = "Type";
        State[State["PacketType"] = 2] = "PacketType";
        State[State["SizedPackets"] = 3] = "SizedPackets";
        State[State["NumberedPackets"] = 4] = "NumberedPackets";
        State[State["SeqPacket"] = 5] = "SeqPacket";
        State[State["Padding"] = 6] = "Padding";
        State[State["Exit"] = 7] = "Exit";
    })(State || (State = {}));
    rl.on('close', function () {
        console.log("".concat(data_1));
        var sum = parsePacket({ pattern: data_1, pos: 0 }, 0);
        console.log(sum);
    });
    function parsePacket(p, depth) {
        var versionSum = 0;
        var state = State.Version;
        if (depth > 50)
            throw Error("Too deep ".concat(depth));
        while (state != State.Exit) {
            switch (state) {
                case State.Version:
                    var version = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    console.log("v: ".concat(version, " ").concat(p.pos, " ").concat(depth));
                    versionSum += version;
                    p.pos += 3;
                    state = State.Type;
                    break;
                case State.Type:
                    var type = parseInt(p.pattern.slice(p.pos, p.pos + 3), 2);
                    if (type === 4)
                        state = State.SeqPacket;
                    else
                        state = State.PacketType;
                    console.log("t: ".concat(type, " ").concat(p.pos, " ").concat(depth, " n = ").concat(state));
                    p.pos += 3;
                    break;
                case State.SeqPacket:
                    if (p.pattern[p.pos] === '0')
                        state = State.Padding;
                    p.pos += 5;
                    console.log("sp: ".concat(p.pos, " ").concat(depth, " n = ").concat(state));
                    break;
                case State.PacketType:
                    if (p.pattern[p.pos] === '0')
                        state = State.SizedPackets;
                    else
                        state = State.NumberedPackets;
                    p.pos += 1;
                    break;
                case State.NumberedPackets:
                    var count = parseInt(p.pattern.slice(p.pos, p.pos + 11), 2);
                    state = State.Padding;
                    p.pos += 11;
                    console.log("c: ".concat(count, " ").concat(p.pos, " ").concat(depth));
                    if (count > 60)
                        throw Error("Too many ".concat(count));
                    for (var i_1 = 0; i_1 < count; i_1++)
                        versionSum += parsePacket(p, depth + 1);
                    break;
                case State.SizedPackets:
                    var size = parseInt(p.pattern.slice(p.pos, p.pos + 15), 2);
                    state = State.Padding;
                    p.pos += 15;
                    var end = p.pos + size;
                    console.log("s: ".concat(size, " ").concat(p.pos, " ").concat(depth, " ").concat(end));
                    if (size > 500)
                        throw Error("Too long ".concat(size));
                    var i = 0;
                    while (p.pos < end)
                        versionSum += parsePacket(p, depth + 1);
                    console.log("se: ".concat(p.pos, " ").concat(end, " ").concat(depth, " ").concat(state));
                    break;
                case State.Padding:
                    if (depth === 0 && p.pos % 4 > 0)
                        p.pos += 4 - p.pos % 4;
                    state = State.Exit;
                    break;
            }
            if (p.pos > p.pattern.length)
                throw Error("Past the end ".concat(p.pos));
        }
        console.log("vs: ".concat(versionSum, " ").concat(p.pos, " ").concat(depth));
        return versionSum;
    }
}
