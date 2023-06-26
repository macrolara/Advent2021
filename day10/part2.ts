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
    let compscores = new Map<string, number>();
    compscores.set(")", 1);
    compscores.set("]", 2);
    compscores.set("}", 3);
    compscores.set(">", 4);
    let closer = new Map<string, string>();
    closer.set("(", ")");
    closer.set("[", "]");
    closer.set("{", "}");
    closer.set("<", ">");
    let totals: number[] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let stack: string[] = [];
        if (line.split('').every(c => {
            if (opener.has(c)) {
                if (stack.pop() !== opener.get(c)) {
                    return false;
                }
            }
            else stack.push(c);
            return true;
        })) {
            let score = 0;
            while (stack.length > 0) {
                score *= 5;
                score += compscores.get(closer.get(stack.pop()!)!)!;
            }
            totals.push(score);
        }
    });

    rl.on('close', () => {
        totals.sort((a, b) => a - b);
        console.log(totals[Math.floor(totals.length / 2)]);
    });
}