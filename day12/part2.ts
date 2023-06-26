{
    const readline = require('readline');
    let expression = /(\w+)-(\w+)/;
    let nodes: Map<string, {name: string, canRevisit: boolean, neighbours: string[]}> = new Map();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let array = expression.exec(line)!;
        [1, 2].forEach(v => {
            if (nodes.has(array[v])) nodes.get(array[v])?.neighbours.push(array[v === 1 ? 2 : 1]);
            else {
                let value: {name: string, canRevisit: boolean, neighbours: string[]} =
                    {name: array[v], canRevisit: array[v] == array[v].toLocaleUpperCase(), neighbours: []};
                value.neighbours.push(array[v === 1 ? 2 : 1]);
                nodes.set(array[v], value);
            }
        });
    });

    function getPaths2(nodeName: string, visited: string[], hasRevisited: boolean): number {
        let node = nodes.get(nodeName)!;
        let count = 0;
        if (visited.includes(node.name) && !node.canRevisit) {
            if (hasRevisited || node.name === "start") return count;
            hasRevisited = true;
        }
        visited.push(node.name);
        if (node.neighbours.includes("end")) count++;
        node.neighbours.filter(n => n !== "end").forEach(n => count += getPaths2(n, [...visited], hasRevisited));
        return count;
    }

    rl.on('close', () => {
        console.log(getPaths2("start", [], false));
    });
}