"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectLiteral = exports.IndexExpression = exports.ArrayLiteral = exports.MemberExpression = exports.CallExpression = exports.ArrowFunctionLiteral = exports.FunctionLiteral = exports.IfExpression = exports.InfixExpression = exports.PrefixExpression = exports.BooleanExpression = exports.StringLiteral = exports.IntegerLiteral = exports.AssignExpression = exports.Identifier = exports.WhileStatement = exports.ReturnStatement = exports.BlockStatement = exports.Program = exports.ExpressionStatement = exports.Expression = exports.Statement = exports.Node = void 0;
const token_1 = require("./token");
/**
 * Base class for all nodes in the AST (Abstract Syntax Tree).
 * Each node has an associated token.
 */
class Node {
    constructor(token) {
        this.token = token; // The token that represents this node
    }
}
exports.Node = Node;
/**
 * Base class for all statement nodes in the AST.
 */
class Statement extends Node {
    constructor(token) {
        super(token);
    }
}
exports.Statement = Statement;
/**
 * Base class for all expression nodes in the AST.
 */
class Expression extends Node {
    constructor(token) {
        super(token);
    }
}
exports.Expression = Expression;
/**
 * A statement that contains a single expression.
 */
class ExpressionStatement extends Statement {
    constructor(token) {
        super(token);
        this.expression = null;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return this.expression ? `${level_str + this.expression.stringify(level)}` : "";
    }
}
exports.ExpressionStatement = ExpressionStatement;
/**
 * The root of the AST, contains a list of statements.
 */
class Program extends Statement {
    constructor() {
        super(new token_1.Token(token_1.TokenType.START, token_1.TokenType.START));
        this.statements = [];
    }
    type() {
        return this.statements.length > 0 ? this.statements[0].token.type : "";
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return this.statements.map((stmnt) => `${level_str + stmnt.stringify(level)}`).join('\n');
    }
}
exports.Program = Program;
/**
 * Represents a block of statements. Often used in control structures like "if" or "while".
 */
class BlockStatement extends Statement {
    constructor(token) {
        super(token);
        this.statements = [];
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return this.statements.map((stmnt) => `${level_str}${stmnt.stringify(level)}`).join('\n');
    }
}
exports.BlockStatement = BlockStatement;
class ReturnStatement extends Statement {
    constructor(token) {
        super(token);
        this.value = null;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level + 1; i++)
            level_str += ' ';
        return this.value ? `${level_str}${this.token.literal} ${this.value.stringify(level)}` : level_str;
    }
}
exports.ReturnStatement = ReturnStatement;
class WhileStatement extends Statement {
    constructor(token) {
        super(token);
        this.condition = null;
        this.body = null;
    }
    stringify(level = 0) {
        var _a, _b;
        let level_str = '';
        for (let i = 0; i < level + 1; i++)
            level_str += ' ';
        return `${level_str}${(_a = this.condition) === null || _a === void 0 ? void 0 : _a.stringify()} {\n ${(_b = this.body) === null || _b === void 0 ? void 0 : _b.stringify(level + 1)}\n}`;
    }
}
exports.WhileStatement = WhileStatement;
/**
 * Represents an identifier (variable name, etc.) in the AST.
 */
class Identifier extends Expression {
    constructor(token) {
        super(token);
        this.value = token.literal;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return `${level_str + this.value}`;
    }
}
exports.Identifier = Identifier;
/**
 * Represents a 'def' statement, variable | functions declarations.
 */
class AssignExpression extends Expression {
    constructor(token, left) {
        super(token);
        this.left = left;
        this.value = null;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        let template = `${this.left.stringify(level)}`;
        return this.value ? `${level_str + template} = ${this.value.stringify()}` : template;
    }
}
exports.AssignExpression = AssignExpression;
class IntegerLiteral extends Expression {
    constructor(token) {
        super(token);
        this.value = Number(token.literal);
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return `${level_str + this.token.literal}`;
    }
}
exports.IntegerLiteral = IntegerLiteral;
class StringLiteral extends Expression {
    constructor(token) {
        super(token);
        this.value = token.literal;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return `${level_str + `'${this.token.literal}'`}`;
    }
}
exports.StringLiteral = StringLiteral;
class BooleanExpression extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return `${level_str + this.token.literal}`;
    }
}
exports.BooleanExpression = BooleanExpression;
/**
 * Represents an expression with a prefix operator (e.g., -x).
 */
class PrefixExpression extends Expression {
    constructor(token, operator) {
        super(token);
        this.operator = operator;
        this.right = null;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return this.right ? `(${level_str + this.operator}${this.operator === 'not' ? ' ' : ''}${level_str + this.right.stringify()})` : "";
    }
}
exports.PrefixExpression = PrefixExpression;
/**
 * Represents an expression with an infix operator (e.g., x + y).
 */
class InfixExpression extends Expression {
    constructor(token, operator, left) {
        super(token);
        this.operator = operator;
        this.left = left;
        this.right = null;
    }
    stringify(level = 0) {
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return `(${this.left ? level_str + this.left.stringify() : level_str} ${this.operator} ${this.right ? this.right.stringify() : ""})`;
    }
}
exports.InfixExpression = InfixExpression;
/**
 * Represents an "if" expression with optional "else" clause.
 */
class IfExpression extends Expression {
    constructor(token) {
        super(token);
        this.condition = null;
        this.if_case = null;
        this.else_case = null;
    }
    stringify(level = 0) {
        var _a, _b;
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        return `${level_str}if (${(_a = this.condition) === null || _a === void 0 ? void 0 : _a.stringify()}) { ${(_b = this.if_case) === null || _b === void 0 ? void 0 : _b.stringify(level + 1)} } ${this.else_case ? `else { ${this.else_case.stringify(level + 1)} }` : ""}`;
    }
}
exports.IfExpression = IfExpression;
/**
 * Represents an "function" expression
 */
class FunctionLiteral extends Expression {
    constructor(token) {
        super(token);
        this.parameters = [];
        this.body = null;
    }
    stringify(level = 0) {
        var _a;
        let level_str = '';
        for (let i = 0; i < level; i++)
            level_str += ' ';
        const params_str = (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.map((ident) => ident.stringify()).join(",");
        const body_str = this.body ? this.body.stringify(level + 1) : ''; // Indent the body
        return `${level_str + this.token.literal}(${params_str}) {\n${body_str}\n${level_str}}`;
    }
}
exports.FunctionLiteral = FunctionLiteral;
/**
 * Represents an "arrow function" expression e.g def add = f(x, y) => x + y;
 */
class ArrowFunctionLiteral extends Expression {
    constructor(token) {
        super(token);
        this.parameters = [];
        this.body = null;
    }
    stringify(level = 0) {
        var _a, _b;
        const params_str = (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.map((ident) => ident.stringify(level)).join(",");
        return `${this.token.literal}(${params_str}) => ${(_b = this.body) === null || _b === void 0 ? void 0 : _b.stringify()};`;
    }
}
exports.ArrowFunctionLiteral = ArrowFunctionLiteral;
/**
 * Represents a call expression" expression e.g add(1,2,3)
 */
class CallExpression extends Expression {
    constructor(token) {
        super(token);
        this.caller = null;
        this.arguments = null;
    }
    stringify(level = 0) {
        var _a;
        const args = [];
        if (this.arguments) {
            for (const arg of this.arguments) {
                args.push(arg.stringify(level));
            }
        }
        return `${(_a = this.caller) === null || _a === void 0 ? void 0 : _a.stringify(level)}(${args.join(', ')})`;
    }
}
exports.CallExpression = CallExpression;
class MemberExpression extends Expression {
    constructor(token, object) {
        super(token);
        this.object = object;
        this.property = null;
    }
    stringify(level = 0) { var _a, _b; return `(${(_a = this.object) === null || _a === void 0 ? void 0 : _a.stringify(level)}.${(_b = this.property) === null || _b === void 0 ? void 0 : _b.stringify(level)})`; }
}
exports.MemberExpression = MemberExpression;
class ArrayLiteral extends Expression {
    constructor(token) {
        super(token);
        this.elements = [];
    }
    stringify(level = 0) {
        const elems = this.elements.map((elem) => elem.stringify(level));
        return `([${elems.join(", ")}])`;
    }
}
exports.ArrayLiteral = ArrayLiteral;
class IndexExpression extends Expression {
    constructor(token, left) {
        super(token);
        this.left = left;
        this.index = null;
    }
    stringify(level = 0) { var _a; return `(${this.left.stringify(level)}[${(_a = this.index) === null || _a === void 0 ? void 0 : _a.stringify(level)}])`; }
}
exports.IndexExpression = IndexExpression;
class ObjectLiteral extends Expression {
    constructor(token) {
        super(token);
        this.properties = new Map;
    }
    stringify(level = 0) {
        const properties = [];
        this.properties.forEach((value, key) => {
            if (typeof value === 'function')
                properties.push([`<function ${key.stringify()}>`, key.stringify()]);
            properties.push([value ? value.stringify() : "", key.stringify()]);
        });
        return `{ ${properties.map(elem => `${elem[1]}${': ' + (elem[0] ? elem[0] : 'null')}`).join(", ")} }`;
    }
}
exports.ObjectLiteral = ObjectLiteral;
