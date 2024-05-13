"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Parser_lexer, _Parser_errors, _Parser_current, _Parser_peek, _Parser_prefix_fns, _Parser_infix_fns;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const nodes_1 = require("./interfaces/nodes");
const token_1 = require("./interfaces/token");
const lexer_1 = require("./lexer");
var Precedence;
(function (Precedence) {
    Precedence[Precedence["LOWEST"] = 0] = "LOWEST";
    Precedence[Precedence["LOGICAL"] = 1] = "LOGICAL";
    Precedence[Precedence["EQAULS"] = 2] = "EQAULS";
    Precedence[Precedence["LESSGREATER"] = 3] = "LESSGREATER";
    Precedence[Precedence["SUM"] = 4] = "SUM";
    Precedence[Precedence["PRODUCT"] = 5] = "PRODUCT";
    Precedence[Precedence["PREFIX"] = 6] = "PREFIX";
    Precedence[Precedence["POWER"] = 7] = "POWER";
    Precedence[Precedence["INDEX"] = 8] = "INDEX";
    Precedence[Precedence["MEMBER"] = 9] = "MEMBER";
    Precedence[Precedence["CALL"] = 10] = "CALL";
})(Precedence || (Precedence = {}));
;
// { key, } | { key } | { key1: value1, key2: value2, ...}
const PRECEDENCES = new Map();
PRECEDENCES.set(token_1.TokenType.AND, Precedence.LOGICAL);
PRECEDENCES.set(token_1.TokenType.OR, Precedence.LOGICAL);
PRECEDENCES.set(token_1.TokenType.EQUALS, Precedence.EQAULS);
PRECEDENCES.set(token_1.TokenType.NOT_EQUALS, Precedence.EQAULS);
PRECEDENCES.set(token_1.TokenType.LT, Precedence.LESSGREATER);
PRECEDENCES.set(token_1.TokenType.GT, Precedence.LESSGREATER);
PRECEDENCES.set(token_1.TokenType.LTE, Precedence.LESSGREATER);
PRECEDENCES.set(token_1.TokenType.GTE, Precedence.LESSGREATER);
PRECEDENCES.set(token_1.TokenType.PLUS, Precedence.SUM);
PRECEDENCES.set(token_1.TokenType.MINUS, Precedence.SUM);
PRECEDENCES.set(token_1.TokenType.SLASH, Precedence.PRODUCT);
PRECEDENCES.set(token_1.TokenType.ASTERISK, Precedence.PRODUCT);
PRECEDENCES.set(token_1.TokenType.PERCENT, Precedence.PRODUCT);
PRECEDENCES.set(token_1.TokenType.DOUBLE_ASTERISK, Precedence.POWER);
PRECEDENCES.set(token_1.TokenType.LPAREN, Precedence.CALL);
PRECEDENCES.set(token_1.TokenType.LBRACKET, Precedence.INDEX);
PRECEDENCES.set(token_1.TokenType.DOT, Precedence.MEMBER);
PRECEDENCES.set(token_1.TokenType.ASSIGN, Precedence.MEMBER);
class Parser {
    constructor(source) {
        _Parser_lexer.set(this, void 0);
        _Parser_errors.set(this, void 0);
        _Parser_current.set(this, void 0);
        _Parser_peek.set(this, void 0);
        _Parser_prefix_fns.set(this, void 0);
        _Parser_infix_fns.set(this, void 0);
        __classPrivateFieldSet(this, _Parser_lexer, new lexer_1.Lexer(source), "f");
        __classPrivateFieldSet(this, _Parser_current, new token_1.Token(token_1.TokenType.EOF, token_1.TokenType.EOF), "f");
        __classPrivateFieldSet(this, _Parser_peek, new token_1.Token(token_1.TokenType.EOF, token_1.TokenType.EOF), "f");
        __classPrivateFieldSet(this, _Parser_errors, [], "f");
        this.advance();
        this.advance();
        __classPrivateFieldSet(this, _Parser_prefix_fns, new Map(), "f");
        __classPrivateFieldSet(this, _Parser_infix_fns, new Map(), "f");
        this.register_prefix(token_1.TokenType.IDENTIFIER, this.parse_identifier);
        this.register_prefix(token_1.TokenType.INT, this.parse_integer);
        this.register_prefix(token_1.TokenType.STRING, this.parse_string);
        this.register_prefix(token_1.TokenType.LBRACKET, this.parse_array_literal);
        this.register_prefix(token_1.TokenType.BANG, this.parse_prefix_expr);
        this.register_prefix(token_1.TokenType.NOT, this.parse_prefix_expr);
        this.register_prefix(token_1.TokenType.MINUS, this.parse_prefix_expr);
        this.register_prefix(token_1.TokenType.FUNCTION, this.parse_function_literal);
        this.register_prefix(token_1.TokenType.IF, this.parse_if_expr);
        this.register_prefix(token_1.TokenType.LPAREN, this.parse_grouped_expr);
        this.register_prefix(token_1.TokenType.TRUE, this.parse_boolean);
        this.register_prefix(token_1.TokenType.FALSE, this.parse_boolean);
        this.register_prefix(token_1.TokenType.LBRACE, this.parse_object_literal_expr);
        this.register_infix(token_1.TokenType.LBRACKET, this.parse_index_expr);
        this.register_infix(token_1.TokenType.LPAREN, this.parse_call_expr);
        this.register_infix(token_1.TokenType.DOT, this.parse_member_expr);
        this.register_infix(token_1.TokenType.PLUS, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.AND, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.OR, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.MINUS, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.SLASH, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.ASTERISK, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.PERCENT, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.EQUALS, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.NOT_EQUALS, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.LT, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.GT, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.GTE, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.LTE, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.DOUBLE_ASTERISK, this.parse_infix_expr);
        this.register_infix(token_1.TokenType.ASSIGN, this.parse_assignment_expr);
    }
    advance() {
        if (__classPrivateFieldGet(this, _Parser_peek, "f"))
            __classPrivateFieldSet(this, _Parser_current, __classPrivateFieldGet(this, _Parser_peek, "f"), "f");
        __classPrivateFieldSet(this, _Parser_peek, __classPrivateFieldGet(this, _Parser_lexer, "f").next(), "f");
    }
    expect(type) {
        if (this.compare_peek(type)) {
            this.advance();
            return true;
        }
        this.peekError(type);
        return false;
    }
    errors() {
        return __classPrivateFieldGet(this, _Parser_errors, "f");
    }
    peekError(type) {
        __classPrivateFieldGet(this, _Parser_errors, "f").push(`expected ${type} but instead got ${__classPrivateFieldGet(this, _Parser_peek, "f").literal}`);
    }
    compare_current(type) {
        return __classPrivateFieldGet(this, _Parser_current, "f").type == type;
    }
    compare_peek(type) {
        return __classPrivateFieldGet(this, _Parser_peek, "f").type == type;
    }
    register_prefix(type, fn) {
        __classPrivateFieldGet(this, _Parser_prefix_fns, "f").set(type, fn);
    }
    register_infix(type, fn) {
        __classPrivateFieldGet(this, _Parser_infix_fns, "f").set(type, fn);
    }
    precedence_current() {
        return PRECEDENCES.get(__classPrivateFieldGet(this, _Parser_current, "f").type) || Precedence.LOWEST;
    }
    precedence_peek() {
        return PRECEDENCES.get(__classPrivateFieldGet(this, _Parser_peek, "f").type) || Precedence.LOWEST;
    }
    no_prefix_error(token) {
        __classPrivateFieldGet(this, _Parser_errors, "f").push(`Could not find prefix function for ${token.type}`);
    }
    parse_program() {
        const program = new nodes_1.Program();
        while (!__classPrivateFieldGet(this, _Parser_lexer, "f").isEOF()) {
            const stmnt = this.parse_statement();
            if (stmnt !== null)
                program.statements.push(stmnt);
            this.advance();
        }
        return program;
    }
    parse_statement() {
        switch (__classPrivateFieldGet(this, _Parser_current, "f").type) {
            case token_1.TokenType.RETURN:
                return this.parse_return_statement();
            case token_1.TokenType.WHILE:
                return this.parse_while_loop();
            default:
                return this.parse_expr_statement();
        }
    }
    parse_assignment_expr(left) {
        const stmnt = new nodes_1.AssignExpression(__classPrivateFieldGet(this, _Parser_current, "f"), left);
        this.advance();
        stmnt.value = this.parse_expr(Precedence.LOWEST);
        if (this.compare_peek(token_1.TokenType.SEMICOLON))
            this.advance();
        return stmnt;
    }
    parse_return_statement() {
        const stmnt = new nodes_1.ReturnStatement(__classPrivateFieldGet(this, _Parser_current, "f"));
        this.advance();
        stmnt.value = this.parse_expr(Precedence.LOWEST);
        if (this.compare_peek(token_1.TokenType.SEMICOLON))
            this.advance();
        return stmnt;
    }
    parse_while_loop() {
        const loop = new nodes_1.WhileStatement(__classPrivateFieldGet(this, _Parser_current, "f"));
        if (!this.expect(token_1.TokenType.LPAREN))
            return null;
        this.advance();
        const condition = this.parse_expr(Precedence.LOWEST);
        if (!condition)
            return null;
        loop.condition = condition;
        if (!this.expect(token_1.TokenType.RPAREN))
            return null;
        this.advance();
        if (this.compare_current(token_1.TokenType.LBRACE)) {
            loop.body = this.parse_block_statement();
            if (!this.compare_current(token_1.TokenType.RBRACE)) {
                this.peekError(token_1.TokenType.RBRACE);
                return null;
            }
        }
        else
            loop.body = this.parse_expr_statement();
        if (this.compare_peek(token_1.TokenType.SEMICOLON))
            this.advance();
        return loop;
    }
    parse_expr_statement() {
        const stmnt = new nodes_1.ExpressionStatement(__classPrivateFieldGet(this, _Parser_current, "f"));
        stmnt.expression = this.parse_expr(Precedence.LOWEST);
        if (this.compare_peek(token_1.TokenType.SEMICOLON))
            this.advance();
        return stmnt;
    }
    parse_expr(precedence) {
        var _a, _b;
        const prefix = (_a = __classPrivateFieldGet(this, _Parser_prefix_fns, "f").get(__classPrivateFieldGet(this, _Parser_current, "f").type)) === null || _a === void 0 ? void 0 : _a.bind(this);
        if (!prefix)
            return null;
        let left = prefix();
        while (!this.compare_current(token_1.TokenType.SEMICOLON) && precedence < this.precedence_peek()) {
            const infix = (_b = __classPrivateFieldGet(this, _Parser_infix_fns, "f").get(__classPrivateFieldGet(this, _Parser_peek, "f").type)) === null || _b === void 0 ? void 0 : _b.bind(this);
            if (!infix)
                return left;
            this.advance();
            left = infix(left);
        }
        return left;
    }
    parse_identifier() { return new nodes_1.Identifier(__classPrivateFieldGet(this, _Parser_current, "f")); }
    parse_boolean() { return new nodes_1.BooleanExpression(__classPrivateFieldGet(this, _Parser_current, "f"), this.compare_current(token_1.TokenType.TRUE)); }
    parse_string() {
        const str = new nodes_1.StringLiteral(__classPrivateFieldGet(this, _Parser_current, "f"));
        str.value = __classPrivateFieldGet(this, _Parser_current, "f").literal;
        return str;
    }
    parse_integer() {
        const integer = new nodes_1.IntegerLiteral(__classPrivateFieldGet(this, _Parser_current, "f"));
        if (Number.isNaN(__classPrivateFieldGet(this, _Parser_current, "f").literal)) {
            this.no_prefix_error(__classPrivateFieldGet(this, _Parser_current, "f"));
            return null;
        }
        integer.value = Number(__classPrivateFieldGet(this, _Parser_current, "f").literal);
        return integer;
    }
    parse_prefix_expr() {
        const expr = new nodes_1.PrefixExpression(__classPrivateFieldGet(this, _Parser_current, "f"), __classPrivateFieldGet(this, _Parser_current, "f").literal);
        this.advance();
        expr.right = this.parse_expr(Precedence.PREFIX);
        return expr;
    }
    parse_infix_expr(left) {
        const precedence = this.precedence_current();
        const expr = new nodes_1.InfixExpression(__classPrivateFieldGet(this, _Parser_current, "f"), __classPrivateFieldGet(this, _Parser_current, "f").literal, left);
        this.advance();
        expr.right = this.parse_expr(precedence);
        return expr;
    }
    parse_grouped_expr() {
        this.advance();
        const expr = this.parse_expr(Precedence.LOWEST);
        if (!this.expect(token_1.TokenType.RPAREN))
            return null;
        return expr;
    }
    parse_if_expr() {
        const expr = new nodes_1.IfExpression(__classPrivateFieldGet(this, _Parser_current, "f"));
        if (!this.expect(token_1.TokenType.LPAREN))
            return null;
        this.advance();
        expr.condition = this.parse_expr(Precedence.LOWEST);
        if (!this.expect(token_1.TokenType.RPAREN))
            return null;
        if (this.compare_peek(token_1.TokenType.LBRACE)) {
            this.advance();
            expr.if_case = this.parse_block_statement();
        }
        else {
            this.advance();
            expr.if_case = this.parse_statement();
        }
        if (this.compare_peek(token_1.TokenType.ELSE)) {
            this.advance();
            if (this.compare_peek(token_1.TokenType.LBRACE)) {
                this.advance();
                expr.else_case = this.parse_block_statement();
            }
            else {
                this.advance();
                expr.else_case = this.parse_statement();
            }
        }
        return expr;
    }
    parse_block_statement() {
        const block = new nodes_1.BlockStatement(__classPrivateFieldGet(this, _Parser_current, "f"));
        this.advance();
        while (!this.compare_current(token_1.TokenType.RBRACE) && !this.compare_current(token_1.TokenType.EOF)) {
            const statement = this.parse_statement();
            if (statement)
                block.statements.push(statement);
            this.advance();
        }
        return block;
    }
    parse_function_literal() {
        let fn = new nodes_1.FunctionLiteral(__classPrivateFieldGet(this, _Parser_current, "f"));
        if (!this.expect(token_1.TokenType.LPAREN))
            return null;
        const parameters = this.parse_function_parameters();
        if (this.compare_peek(token_1.TokenType.ARROW)) {
            this.advance();
            this.advance();
            fn = new nodes_1.ArrowFunctionLiteral(fn.token);
            fn.parameters = parameters;
            fn.body = this.parse_expr(Precedence.LOWEST);
            return fn;
        }
        if (!this.expect(token_1.TokenType.LBRACE))
            return null;
        fn.parameters = parameters;
        fn.body = this.parse_block_statement();
        return fn;
    }
    parse_function_parameters() {
        const identifiers = [];
        if (this.compare_peek(token_1.TokenType.RPAREN)) {
            this.advance();
            return identifiers;
        }
        this.advance();
        let identifier = new nodes_1.Identifier(__classPrivateFieldGet(this, _Parser_current, "f"));
        identifiers.push(identifier);
        while (this.compare_peek(token_1.TokenType.COMMA)) {
            this.advance();
            this.advance();
            let identifier = new nodes_1.Identifier(__classPrivateFieldGet(this, _Parser_current, "f"));
            identifiers.push(identifier);
        }
        if (!this.expect(token_1.TokenType.RPAREN))
            return null;
        return identifiers;
    }
    parse_call_expr(caller) {
        const expr = new nodes_1.CallExpression(__classPrivateFieldGet(this, _Parser_current, "f"));
        expr.caller = caller;
        expr.arguments = this.parse_exp_list(token_1.TokenType.RPAREN);
        return expr;
    }
    parse_array_literal() {
        const array = new nodes_1.ArrayLiteral(__classPrivateFieldGet(this, _Parser_current, "f"));
        const elems = this.parse_exp_list(token_1.TokenType.RBRACKET);
        if (!elems)
            return null;
        array.elements = elems;
        return array;
    }
    parse_exp_list(end) {
        const list = [];
        if (this.compare_peek(end)) {
            this.advance();
            return list;
        }
        this.advance();
        let elem = this.parse_expr(Precedence.LOWEST);
        if (elem)
            list.push(elem);
        while (this.compare_peek(token_1.TokenType.COMMA)) {
            this.advance();
            this.advance();
            elem = this.parse_expr(Precedence.LOWEST);
            if (elem)
                list.push(elem);
        }
        if (!this.expect(end))
            return null;
        return list;
    }
    parse_index_expr(left) {
        const index = new nodes_1.IndexExpression(__classPrivateFieldGet(this, _Parser_current, "f"), left);
        this.advance();
        const expr = this.parse_expr(Precedence.LOWEST);
        if (!expr)
            return null;
        index.index = expr;
        if (!this.expect(token_1.TokenType.RBRACKET))
            return null;
        return index;
    }
    parse_member_expr(left) {
        const memeber = new nodes_1.MemberExpression(__classPrivateFieldGet(this, _Parser_current, "f"), left);
        if (!this.expect(token_1.TokenType.IDENTIFIER))
            return null;
        memeber.property = this.parse_expr(Precedence.MEMBER);
        return memeber;
    }
    parse_object_literal_expr() {
        const obj = new nodes_1.ObjectLiteral(__classPrivateFieldGet(this, _Parser_current, "f"));
        this.advance();
        if (this.compare_current(token_1.TokenType.RBRACE))
            return obj;
        while (!this.compare_current(token_1.TokenType.EOF) && !this.compare_current(token_1.TokenType.RBRACE)) {
            const key = this.parse_expr(Precedence.LOWEST);
            if (!key)
                return null;
            this.advance();
            if (this.compare_current(token_1.TokenType.COMMA)) {
                this.advance();
                obj.properties.set(key, null);
                continue;
            }
            else if (this.compare_current(token_1.TokenType.COLON)) {
                this.advance();
                const value = this.parse_expr(Precedence.LOWEST);
                if (!value)
                    return null;
                obj.properties.set(key, value);
                this.advance();
                if (this.compare_current(token_1.TokenType.COMMA)) {
                    this.advance();
                }
            }
        }
        if (!this.compare_current(token_1.TokenType.RBRACE)) {
            this.peekError(token_1.TokenType.RBRACE);
            return null;
        }
        return obj;
    }
}
exports.Parser = Parser;
_Parser_lexer = new WeakMap(), _Parser_errors = new WeakMap(), _Parser_current = new WeakMap(), _Parser_peek = new WeakMap(), _Parser_prefix_fns = new WeakMap(), _Parser_infix_fns = new WeakMap();
