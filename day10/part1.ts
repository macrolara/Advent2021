{
    const readline = require('readline');
    let scores = new Map<string, number>();
    scores.set(")", 3);
    scores.set("]", 57);
    scores.set("}", 1197);
    scores.set(">", 25137);
    let opener = new Map<string, string>();
    opener.set(")", "(");
    opener.set("]", "[");
    opener.set("}", "{");
    opener.set(">", "<");
    let total = 0;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let stack: string[] = [];
        line.split('').every(c => {
            if (opener.has(c)) {
                if (stack.pop() !== opener.get(c)) {
                    total += scores.get(c)!;
                    return false;
                }
            }
            else stack.push(c);
            return true;
        });
    });

    rl.on('close', () => {
        console.log(total);
    });
}