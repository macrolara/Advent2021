{
    abstract class Expression {
        abstract getMagnitude(): number;
        abstract toString(): string;
        abstract isValue(): boolean;
        abstract update(value: number, fromLeft: boolean): boolean;
        abstract explode(st: {left: number | undefined, right: number | undefined, remove: boolean}, depth: number): boolean;
        abstract split(): boolean;
    }

    class LiteralExpression extends Expression {
        value: number;

        constructor(value: number) {
            super();
            this.value = value;
        }

        getMagnitude(): number {return this.value;}
        toString(): string {return this.value.toString();}
        isValue(): boolean {return true;}
        update(value: number, fromLeft: boolean): boolean {this.value += value; return true;}
        explode(st: { left: number | undefined, right: number | undefined, remove: boolean}, depth: number): boolean {return false;}
        split(): boolean {return false;}
    }

    class PairExpression extends Expression {
        left: Expression;
        right: Expression;

        private getExpression(st: {line: string, offset: number}, isLeft: boolean): Expression {
            if (st.line.charAt(st.offset) === '[') return new PairExpression(st, []);
            else {
                let boundary = st.line.indexOf(isLeft ? ',' : ']', st.offset);
                let ex = new LiteralExpression(+st.line.slice(st.offset, boundary));
                st.offset = boundary;
                return ex;
            }
        }

        constructor(st: {line: string, offset: number}, expressions: Expression[]) {
            super();
            if (expressions.length > 0) {
                this.left = expressions[0];
                this.right = expressions[1];
            }
            else {
                st.offset++;
                this.left = this.getExpression(st, true);
                if (st.line.charAt(st.offset) !== ',') throw Error(`expected , at ${st.offset}`);
                st.offset++;
                this.right = this.getExpression(st, false);
                if (st.line.charAt(st.offset) !== ']') throw Error(`expected ] at ${st.offset}`);
                st.offset++;
            }
        }

        getMagnitude(): number {
            return 3 * this.left.getMagnitude() + 2 * this.right.getMagnitude()
        }

        toString(): string {return "[" + this.left.toString() + "," + this.right.toString() + "]";}
        isValue(): boolean {return false;}
        update(value: number, fromLeft: boolean): boolean {
            let rv = fromLeft ? this.left.update(value, fromLeft) : this.right.update(value, fromLeft);
            if (!rv) rv = fromLeft ? this.right.update(value, fromLeft) : this.left.update(value, fromLeft);
            return rv;
        }
        explode(st: { left: number | undefined, right: number | undefined, remove: boolean}, depth: number): boolean {
            if (depth > 4 && this.left.isValue() && this.right.isValue()) {
                st.left = this.left.getMagnitude();
                st.right = this.right.getMagnitude();
                st.remove = true;
                return true;
            }
            let rv = this.left.explode(st, depth + 1);
            if (rv) {
                if (st.remove) {
                    this.left = new LiteralExpression(0);
                    st.remove = false;
                }
                if (st.right !== undefined)
                    if (this.right.update(st.right, true)) st.right = undefined;
                return rv;
            }
            rv = this.right.explode(st, depth + 1);
            if (rv) {
                if (st.remove) {
                    this.right = new LiteralExpression(0);
                    st.remove = false;
                }
                if (st.left !== undefined)
                    if (this.left.update(st.left, false)) st.left = undefined;
                return rv;
            }
            return false;
        }
        split(): boolean {
            if (this.left.isValue() && this.left.getMagnitude() >= 10) {
                let value = this.left.getMagnitude();
                this.left = new PairExpression({line: "", offset: 0},
                    [new LiteralExpression(Math.floor(value / 2)), new LiteralExpression(Math.ceil(value / 2))]);
                return true;
            }            
            if (this.left.split()) return true;
            if (this.right.isValue() && this.right.getMagnitude() >= 10) {
                let value = this.right.getMagnitude();
                this.right = new PairExpression({line: "", offset: 0},
                    [new LiteralExpression(Math.floor(value / 2)), new LiteralExpression(Math.ceil(value / 2))]);
                return true;
            }  
            return this.right.split();          
        }
    }

    const readline = require('readline');
    let expressions: PairExpression[] = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line: string) => {
        expressions.push(new PairExpression({line: line, offset: 0}, []));
    });

    function sumExpressions(one: Expression, two: Expression): number {
        let ex = new PairExpression({line: "", offset: 0}, [new PairExpression({line: one.toString(), offset: 0}, []), new PairExpression({line: two.toString(), offset: 0}, [])]);
        do {
            while (ex.explode({left: undefined, right: undefined, remove: false}, 1));
        } while (ex.split());
        return ex.getMagnitude();
    }

    rl.on('close', () => {
        let max: {max: number, one: Expression, two: Expression} = {max: 0, one: new LiteralExpression(0), two: new LiteralExpression(0)};
        do {
            let ex = expressions.pop()!;
            for (let i = 0; i < expressions.length; i++) {
                let sum = sumExpressions(ex, expressions[i]);
                if (sum > max.max) max = {max: sum, one: ex, two: expressions[i]};
                sum = sumExpressions(expressions[i], ex);
                if (sum > max.max) max = {max: sum, one: expressions[i], two: ex};
            }
        } while (expressions.length > 0);
        console.log(`${max!.max}: %s + %s`, max!.one, max!.two)
    });
}