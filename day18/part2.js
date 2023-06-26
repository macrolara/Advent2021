var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
{
    var Expression = /** @class */ (function () {
        function Expression() {
        }
        return Expression;
    }());
    var LiteralExpression_1 = /** @class */ (function (_super) {
        __extends(LiteralExpression, _super);
        function LiteralExpression(value) {
            var _this = _super.call(this) || this;
            _this.value = value;
            return _this;
        }
        LiteralExpression.prototype.getMagnitude = function () { return this.value; };
        LiteralExpression.prototype.toString = function () { return this.value.toString(); };
        LiteralExpression.prototype.isValue = function () { return true; };
        LiteralExpression.prototype.update = function (value, fromLeft) { this.value += value; return true; };
        LiteralExpression.prototype.explode = function (st, depth) { return false; };
        LiteralExpression.prototype.split = function () { return false; };
        return LiteralExpression;
    }(Expression));
    var PairExpression_1 = /** @class */ (function (_super) {
        __extends(PairExpression, _super);
        function PairExpression(st, expressions) {
            var _this = _super.call(this) || this;
            if (expressions.length > 0) {
                _this.left = expressions[0];
                _this.right = expressions[1];
            }
            else {
                st.offset++;
                _this.left = _this.getExpression(st, true);
                if (st.line.charAt(st.offset) !== ',')
                    throw Error("expected , at ".concat(st.offset));
                st.offset++;
                _this.right = _this.getExpression(st, false);
                if (st.line.charAt(st.offset) !== ']')
                    throw Error("expected ] at ".concat(st.offset));
                st.offset++;
            }
            return _this;
        }
        PairExpression.prototype.getExpression = function (st, isLeft) {
            if (st.line.charAt(st.offset) === '[')
                return new PairExpression(st, []);
            else {
                var boundary = st.line.indexOf(isLeft ? ',' : ']', st.offset);
                var ex = new LiteralExpression_1(+st.line.slice(st.offset, boundary));
                st.offset = boundary;
                return ex;
            }
        };
        PairExpression.prototype.getMagnitude = function () {
            return 3 * this.left.getMagnitude() + 2 * this.right.getMagnitude();
        };
        PairExpression.prototype.toString = function () { return "[" + this.left.toString() + "," + this.right.toString() + "]"; };
        PairExpression.prototype.isValue = function () { return false; };
        PairExpression.prototype.update = function (value, fromLeft) {
            var rv = fromLeft ? this.left.update(value, fromLeft) : this.right.update(value, fromLeft);
            if (!rv)
                rv = fromLeft ? this.right.update(value, fromLeft) : this.left.update(value, fromLeft);
            return rv;
        };
        PairExpression.prototype.explode = function (st, depth) {
            if (depth > 4 && this.left.isValue() && this.right.isValue()) {
                st.left = this.left.getMagnitude();
                st.right = this.right.getMagnitude();
                st.remove = true;
                return true;
            }
            var rv = this.left.explode(st, depth + 1);
            if (rv) {
                if (st.remove) {
                    this.left = new LiteralExpression_1(0);
                    st.remove = false;
                }
                if (st.right !== undefined)
                    if (this.right.update(st.right, true))
                        st.right = undefined;
                return rv;
            }
            rv = this.right.explode(st, depth + 1);
            if (rv) {
                if (st.remove) {
                    this.right = new LiteralExpression_1(0);
                    st.remove = false;
                }
                if (st.left !== undefined)
                    if (this.left.update(st.left, false))
                        st.left = undefined;
                return rv;
            }
            return false;
        };
        PairExpression.prototype.split = function () {
            if (this.left.isValue() && this.left.getMagnitude() >= 10) {
                var value = this.left.getMagnitude();
                this.left = new PairExpression({ line: "", offset: 0 }, [new LiteralExpression_1(Math.floor(value / 2)), new LiteralExpression_1(Math.ceil(value / 2))]);
                return true;
            }
            if (this.left.split())
                return true;
            if (this.right.isValue() && this.right.getMagnitude() >= 10) {
                var value = this.right.getMagnitude();
                this.right = new PairExpression({ line: "", offset: 0 }, [new LiteralExpression_1(Math.floor(value / 2)), new LiteralExpression_1(Math.ceil(value / 2))]);
                return true;
            }
            return this.right.split();
        };
        return PairExpression;
    }(Expression));
    var readline = require('readline');
    var expressions_1 = [];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        expressions_1.push(new PairExpression_1({ line: line, offset: 0 }, []));
    });
    function sumExpressions(one, two) {
        var ex = new PairExpression_1({ line: "", offset: 0 }, [new PairExpression_1({ line: one.toString(), offset: 0 }, []), new PairExpression_1({ line: two.toString(), offset: 0 }, [])]);
        do {
            while (ex.explode({ left: undefined, right: undefined, remove: false }, 1))
                ;
        } while (ex.split());
        return ex.getMagnitude();
    }
    rl.on('close', function () {
        var max = { max: 0, one: new LiteralExpression_1(0), two: new LiteralExpression_1(0) };
        do {
            var ex = expressions_1.pop();
            for (var i = 0; i < expressions_1.length; i++) {
                var sum = sumExpressions(ex, expressions_1[i]);
                if (sum > max.max)
                    max = { max: sum, one: ex, two: expressions_1[i] };
                sum = sumExpressions(expressions_1[i], ex);
                if (sum > max.max)
                    max = { max: sum, one: expressions_1[i], two: ex };
            }
        } while (expressions_1.length > 0);
        console.log("".concat(max.max, ": %s + %s"), max.one, max.two);
    });
}
