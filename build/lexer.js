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
var _Lexer_source, _Lexer_character, _Lexer_cursor, _Lexer_next_cursor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const token_1 = require("./interfaces/token");
const KEYWORDS = {
    "f": token_1.TokenType.FUNCTION,
    "true": token_1.TokenType.TRUE,
    "false": token_1.TokenType.FALSE,
    "and": token_1.TokenType.AND,
    "or": token_1.TokenType.OR,
    "not": token_1.TokenType.NOT,
    "if": token_1.TokenType.IF,
    "else": token_1.TokenType.ELSE,
    "while": token_1.TokenType.WHILE,
    "return": token_1.TokenType.RETURN
};
class Lexer {
    constructor(source) {
        _Lexer_source.set(this, void 0);
        _Lexer_character.set(this, void 0);
        _Lexer_cursor.set(this, void 0);
        _Lexer_next_cursor.set(this, void 0);
        __classPrivateFieldSet(this, _Lexer_source, source, "f");
        __classPrivateFieldSet(this, _Lexer_cursor, 0, "f");
        __classPrivateFieldSet(this, _Lexer_next_cursor, 0, "f");
        __classPrivateFieldSet(this, _Lexer_character, "\0", "f");
        this.read_char();
    }
    isEOF() { return __classPrivateFieldGet(this, _Lexer_cursor, "f") > __classPrivateFieldGet(this, _Lexer_source, "f").length; }
    peek() {
        if (__classPrivateFieldGet(this, _Lexer_next_cursor, "f") >= __classPrivateFieldGet(this, _Lexer_source, "f").length)
            return "\0";
        return __classPrivateFieldGet(this, _Lexer_source, "f")[__classPrivateFieldGet(this, _Lexer_next_cursor, "f")];
    }
    /**
     * returns the next token
     * @throws {Error} */
    next() {
        this.skip_whitespace();
        let token;
        switch (__classPrivateFieldGet(this, _Lexer_character, "f")) {
            case "=":
                if (this.peek() == '=' || this.peek() == '>') {
                    let char = __classPrivateFieldGet(this, _Lexer_character, "f");
                    this.read_char();
                    token = new token_1.Token(__classPrivateFieldGet(this, _Lexer_character, "f") == '=' ? token_1.TokenType.EQUALS : token_1.TokenType.ARROW, char + __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                else {
                    token = new token_1.Token(token_1.TokenType.ASSIGN, __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                break;
            case "+":
                token = new token_1.Token(token_1.TokenType.PLUS, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "{":
                token = new token_1.Token(token_1.TokenType.LBRACE, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "}":
                token = new token_1.Token(token_1.TokenType.RBRACE, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "(":
                token = new token_1.Token(token_1.TokenType.LPAREN, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case ")":
                token = new token_1.Token(token_1.TokenType.RPAREN, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "[":
                token = new token_1.Token(token_1.TokenType.LBRACKET, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "]":
                token = new token_1.Token(token_1.TokenType.RBRACKET, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case ",":
                token = new token_1.Token(token_1.TokenType.COMMA, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case ":":
                token = new token_1.Token(token_1.TokenType.COLON, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case ".":
                token = new token_1.Token(token_1.TokenType.DOT, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "+":
                token = new token_1.Token(token_1.TokenType.PLUS, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "-":
                token = new token_1.Token(token_1.TokenType.MINUS, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "*":
                if (this.peek() == '*') {
                    let char = __classPrivateFieldGet(this, _Lexer_character, "f");
                    this.read_char();
                    token = new token_1.Token(token_1.TokenType.DOUBLE_ASTERISK, char + __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                else {
                    token = new token_1.Token(token_1.TokenType.ASTERISK, __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                break;
            case "/":
                token = new token_1.Token(token_1.TokenType.SLASH, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "%":
                token = new token_1.Token(token_1.TokenType.PERCENT, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case ">":
                if (this.peek() == '=') {
                    let char = __classPrivateFieldGet(this, _Lexer_character, "f");
                    this.read_char();
                    token = new token_1.Token(token_1.TokenType.GTE, char + __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                else {
                    token = new token_1.Token(token_1.TokenType.GT, __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                break;
            case "<":
                if (this.peek() == '=') {
                    let char = __classPrivateFieldGet(this, _Lexer_character, "f");
                    this.read_char();
                    token = new token_1.Token(token_1.TokenType.LTE, char + __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                else {
                    token = new token_1.Token(token_1.TokenType.LT, __classPrivateFieldGet(this, _Lexer_character, "f"));
                }
                break;
            case ";":
                token = new token_1.Token(token_1.TokenType.SEMICOLON, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "\0":
                token = new token_1.Token(token_1.TokenType.EOF, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            case "\"":
                token = new token_1.Token(token_1.TokenType.STRING, this.read_string());
                break;
            case "!":
                if (this.peek() == '=') {
                    let char = __classPrivateFieldGet(this, _Lexer_character, "f");
                    this.read_char();
                    token = new token_1.Token(token_1.TokenType.NOT_EQUALS, "!=");
                }
                else
                    token = new token_1.Token(token_1.TokenType.BANG, __classPrivateFieldGet(this, _Lexer_character, "f"));
                break;
            default:
                token = new token_1.Token(token_1.TokenType.ILLEGAL, __classPrivateFieldGet(this, _Lexer_character, "f"));
                if (this.isalpha()) {
                    token.literal = this.read_identifier();
                    token.type = this.lookup_identifier(token.literal);
                    return token;
                }
                else if (this.isdigit()) {
                    token.literal = this.read_number();
                    token.type = token_1.TokenType.INT;
                    return token;
                }
        }
        this.read_char();
        return token;
    }
    read_char() {
        if (__classPrivateFieldGet(this, _Lexer_next_cursor, "f") >= __classPrivateFieldGet(this, _Lexer_source, "f").length) {
            __classPrivateFieldSet(this, _Lexer_character, "\0", "f");
        }
        else
            __classPrivateFieldSet(this, _Lexer_character, __classPrivateFieldGet(this, _Lexer_source, "f")[__classPrivateFieldGet(this, _Lexer_next_cursor, "f")], "f");
        __classPrivateFieldSet(this, _Lexer_cursor, __classPrivateFieldGet(this, _Lexer_next_cursor, "f"), "f");
        __classPrivateFieldSet(this, _Lexer_next_cursor, __classPrivateFieldGet(this, _Lexer_next_cursor, "f") + 1, "f");
    }
    read_identifier() {
        let pos = __classPrivateFieldGet(this, _Lexer_cursor, "f");
        while (this.isalpha() || this.isdigit())
            this.read_char();
        return __classPrivateFieldGet(this, _Lexer_source, "f").slice(pos, __classPrivateFieldGet(this, _Lexer_cursor, "f"));
    }
    read_number() {
        let pos = __classPrivateFieldGet(this, _Lexer_cursor, "f");
        while (this.isdigit())
            this.read_char();
        return __classPrivateFieldGet(this, _Lexer_source, "f").slice(pos, __classPrivateFieldGet(this, _Lexer_cursor, "f"));
    }
    read_string() {
        let result = "";
        let escaped = false;
        while (!this.isEOF()) {
            this.read_char();
            if (escaped) {
                switch (__classPrivateFieldGet(this, _Lexer_character, "f")) {
                    case 'n':
                        result += '\n';
                        break;
                    case 't':
                        result += '\t';
                        break;
                    case '\"':
                        result += '\"';
                        break;
                    case '\\':
                        result += '\\';
                        break;
                    default: result += __classPrivateFieldGet(this, _Lexer_character, "f");
                }
                escaped = false; // Reset escape flag
            }
            else {
                if (__classPrivateFieldGet(this, _Lexer_character, "f") === '\\')
                    escaped = true; // The next character is an escape sequence
                if (__classPrivateFieldGet(this, _Lexer_character, "f") === '\"')
                    break;
                result += __classPrivateFieldGet(this, _Lexer_character, "f"); // Normal character, add to result
            }
        }
        return result;
    }
    lookup_identifier(ident) {
        if (ident in KEYWORDS)
            return KEYWORDS[ident];
        return token_1.TokenType.IDENTIFIER;
    }
    skip_whitespace() {
        const whitespace = new Set(['\n', '\t', '\r', ' ']);
        while (whitespace.has(__classPrivateFieldGet(this, _Lexer_character, "f")))
            this.read_char();
    }
    isalpha() {
        return 'A' <= __classPrivateFieldGet(this, _Lexer_character, "f") && __classPrivateFieldGet(this, _Lexer_character, "f") <= 'Z' ||
            'a' <= __classPrivateFieldGet(this, _Lexer_character, "f") && __classPrivateFieldGet(this, _Lexer_character, "f") <= 'z' ||
            __classPrivateFieldGet(this, _Lexer_character, "f") == '_';
    }
    isdigit() { return "0" <= __classPrivateFieldGet(this, _Lexer_character, "f") && __classPrivateFieldGet(this, _Lexer_character, "f") <= '9'; }
}
exports.Lexer = Lexer;
_Lexer_source = new WeakMap(), _Lexer_character = new WeakMap(), _Lexer_cursor = new WeakMap(), _Lexer_next_cursor = new WeakMap();
