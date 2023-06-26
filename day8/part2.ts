{
    const readline = require('readline');
    let expression = /(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+\|\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)/;
    let count = 0;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        let array = expression.exec(line)!;
        let digits = array.slice(1, 11).map(v => v.split('').sort((a, b) => a.localeCompare(b)).join(''));
        let data = array.slice(11).map(v => v.split('').sort((a, b) => a.localeCompare(b)).join(''));
        let numbers = new Array<string>(10);
        numbers[1] = digits.reduce((pv, cv) => (pv += cv.length === 2 ? cv : ""), "");
        numbers[4] = digits.reduce((pv, cv) => (pv += cv.length === 4 ? cv : ""), "");
        numbers[7] = digits.reduce((pv, cv) => (pv += cv.length === 3 ? cv : ""), "");
        numbers[8] = digits.reduce((pv, cv) => (pv += cv.length === 7 ? cv : ""), "");
        numbers[6] = digits.filter(d => d.length === 6).reduce((pv, cv) => (pv += !numbers[1].split('').every(v => cv.includes(v)) ? cv : ""), "");
        numbers[9] = digits.filter(d => d.length === 6 && d !== numbers[6]).reduce((pv, cv) => (pv += numbers[4].split('').every(v => cv.includes(v)) ? cv : ""), "");
        numbers[0] = digits.filter(d => d.length === 6 && d !== numbers[6]).reduce((pv, cv) => (pv += cv !== numbers[9] ? cv : ""), "");
        numbers[3] = digits.filter(d => d.length === 5).reduce((pv, cv) => (pv += numbers[1].split('').every(v => cv.includes(v)) ? cv : ""), "");
        let topRightBar = numbers[6].includes(numbers[1].charAt(0)) ? numbers[1].charAt(1) : numbers[1].charAt(0);
        numbers[2] = digits.filter(d => d.length === 5 && d !== numbers[3]).reduce((pv, cv) => (pv += cv.includes(topRightBar) ? cv : ""), "");
        numbers[5]  = digits.filter(d => d.length === 5 && d !== numbers[3]).reduce((pv, cv) => (pv += cv != numbers[2] ? cv : ""), "");
        let value = data.reduce((pv, cv) => (pv += numbers.findIndex(v => v === cv)), "");
        //console.log(value);
        count += +value;
    });

    rl.on('close', () => {
        console.log (`${count}`);
    });
}