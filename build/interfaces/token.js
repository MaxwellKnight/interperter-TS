"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["START"] = "start";
    TokenType["INT"] = "integer";
    TokenType["STRING"] = "string";
    TokenType["IDENTIFIER"] = "identifier";
    TokenType["ARROW"] = "arrow";
    TokenType["RPAREN"] = "rparen";
    TokenType["LPAREN"] = "lparen";
    TokenType["RBRACE"] = "rbrace";
    TokenType["LBRACE"] = "lbrace";
    TokenType["LBRACKET"] = "lbracket";
    TokenType["RBRACKET"] = "rbracket";
    TokenType["ASSIGN"] = "assign";
    TokenType["COMMA"] = "comma";
    TokenType["PLUS"] = "plus";
    TokenType["MINUS"] = "minus";
    TokenType["SLASH"] = "slash";
    TokenType["ASTERISK"] = "asterisk";
    TokenType["DOUBLE_ASTERISK"] = "double_asterisk";
    TokenType["PERCENT"] = "percent";
    TokenType["FUNCTION"] = "function";
    TokenType["EOF"] = "EOF";
    TokenType["ILLEGAL"] = "illegal";
    TokenType["SEMICOLON"] = "semicolon";
    TokenType["EQUALS"] = "EQ";
    TokenType["NOT_EQUALS"] = "NOT_EQUALS";
    TokenType["GT"] = "GT";
    TokenType["LT"] = "LT";
    TokenType["GTE"] = "GTE";
    TokenType["LTE"] = "LTE";
    TokenType["TRUE"] = "true";
    TokenType["FALSE"] = "false";
    TokenType["AND"] = "and";
    TokenType["OR"] = "or";
    TokenType["NOT"] = "not";
    TokenType["IF"] = "if";
    TokenType["ELSE"] = "else";
    TokenType["RETURN"] = "return";
    TokenType["WHILE"] = "while";
    TokenType["DOT"] = "dot";
    TokenType["COLON"] = "colon";
    TokenType["BANG"] = "bang"; // `!` symbol
})(TokenType || (exports.TokenType = TokenType = {}));
class Token {
    constructor(type, literal) {
        this.type = type;
        this.literal = literal;
    }
}
exports.Token = Token;
