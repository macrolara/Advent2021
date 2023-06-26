{
    const readline = require('readline');
    let players: number[] = []
    let expression = /Player \d+ starting position: (\d+)/
    let die = 1
    let rolls = 0

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let arr = expression.exec(line)!;
        players.push(+arr[1])
    });

    function rollDie() {
        let score = 0
        for (let i = 0; i < 3; i++) {
            score += die;
            die++;
            if (die === 101) die = 1
        }
        rolls += 3
        return score
    }

    rl.on('close', () => {
        console.log(`${players[0]}, ${players[1]}`)
        let scores = [0, 0]
        let next = 0, die = 1
        while (scores.every(s => s < 1000)) {
            players[next] = (players[next] + rollDie()) % 10
            if (players[next] === 0) players[next] = 10
            scores[next] += players[next];
            next = next === 0 ? 1 : 0
        }
        let index = scores[0] >= 1000 ? 1 : 0
        console.log(`${scores[index]} * ${rolls} = %d`, scores[index] * rolls)
    });
}