"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../../interfaces/token");
const lexer_1 = require("../../lexer");
describe('Lexer', () => {
    it('should tokenize basic symbols and operators', () => {
        const lexer = new lexer_1.Lexer("=+(){**},-/*%.:");
        const expectedTokens = [
            new token_1.Token(token_1.TokenType.ASSIGN, "="),
            new token_1.Token(token_1.TokenType.PLUS, "+"),
            new token_1.Token(token_1.TokenType.LPAREN, "("),
            new token_1.Token(token_1.TokenType.RPAREN, ")"),
            new token_1.Token(token_1.TokenType.LBRACE, "{"),
            new token_1.Token(token_1.TokenType.DOUBLE_ASTERISK, "**"),
            new token_1.Token(token_1.TokenType.RBRACE, "}"),
            new token_1.Token(token_1.TokenType.COMMA, ","),
            new token_1.Token(token_1.TokenType.MINUS, "-"),
            new token_1.Token(token_1.TokenType.SLASH, "/"),
            new token_1.Token(token_1.TokenType.ASTERISK, "*"),
            new token_1.Token(token_1.TokenType.PERCENT, "%"),
            new token_1.Token(token_1.TokenType.DOT, "."),
            new token_1.Token(token_1.TokenType.COLON, ":"),
            new token_1.Token(token_1.TokenType.EOF, "\0"),
        ];
        expectedTokens.forEach((expected) => {
            const token = lexer.next();
            expect(token).toEqual(expected);
        });
    });
    it('should tokenize numbers and identifiers', () => {
        const lexer = new lexer_1.Lexer("123 abc123 _var");
        const expectedTokens = [
            new token_1.Token(token_1.TokenType.INT, "123"),
            new token_1.Token(token_1.TokenType.IDENTIFIER, "abc123"),
            new token_1.Token(token_1.TokenType.IDENTIFIER, "_var"),
            new token_1.Token(token_1.TokenType.EOF, "\0"),
        ];
        expectedTokens.forEach((expected) => {
            const token = lexer.next();
            expect(token).toEqual(expected);
        });
    });
    it('should tokenize keywords', () => {
        const lexer = new lexer_1.Lexer("true false if else return while");
        const expectedTokens = [
            new token_1.Token(token_1.TokenType.TRUE, "true"),
            new token_1.Token(token_1.TokenType.FALSE, "false"),
            new token_1.Token(token_1.TokenType.IF, "if"),
            new token_1.Token(token_1.TokenType.ELSE, "else"),
            new token_1.Token(token_1.TokenType.RETURN, "return"),
            new token_1.Token(token_1.TokenType.WHILE, "while"),
            new token_1.Token(token_1.TokenType.EOF, "\0"),
        ];
        expectedTokens.forEach((expected) => {
            const token = lexer.next();
            expect(token).toEqual(expected);
        });
    });
    it('should handle whitespace and newlines', () => {
        const lexer = new lexer_1.Lexer("   \n\t\r  yeah  \n");
        const expectedTokens = [
            new token_1.Token(token_1.TokenType.IDENTIFIER, "yeah"),
            new token_1.Token(token_1.TokenType.EOF, "\0")
        ];
        expectedTokens.forEach((expected) => {
            const token = lexer.next();
            expect(token).toEqual(expected);
        });
    });
    it('should handle illegal tokens', () => {
        const lexer = new lexer_1.Lexer("@#%");
        const expectedTokens = [
            new token_1.Token(token_1.TokenType.ILLEGAL, "@"),
            new token_1.Token(token_1.TokenType.ILLEGAL, "#"),
            new token_1.Token(token_1.TokenType.PERCENT, "%"),
            new token_1.Token(token_1.TokenType.EOF, "\0")
        ];
        expectedTokens.forEach((expected) => {
            const token = lexer.next();
            expect(token).toEqual(expected);
        });
    });
    it('should tokenize entire test file', () => {
        const lexer = new lexer_1.Lexer(`five = 5;
		ten = 10;
		add => f(x, y) {
			x + y;
		};
		result = add(five, ten);
		!-/*5
		5 < 10 > 5
		if (5 < 10) {
			return true;
		} else {
			return false;
		}
		10 == 10
		10 != 9
		"shamen"
		"uglyfaceman"
		"		\n		"
		"		\t\r\n		"
		[foo, 6]
		and
		or
		not
		`);
        const expectedTokens = [
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'five'),
            new token_1.Token(token_1.TokenType.ASSIGN, '='),
            new token_1.Token(token_1.TokenType.INT, '5'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'ten'),
            new token_1.Token(token_1.TokenType.ASSIGN, '='),
            new token_1.Token(token_1.TokenType.INT, '10'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'add'),
            new token_1.Token(token_1.TokenType.ARROW, '=>'),
            new token_1.Token(token_1.TokenType.FUNCTION, 'f'),
            new token_1.Token(token_1.TokenType.LPAREN, '('),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'x'),
            new token_1.Token(token_1.TokenType.COMMA, ','),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'y'),
            new token_1.Token(token_1.TokenType.RPAREN, ')'),
            new token_1.Token(token_1.TokenType.LBRACE, '{'),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'x'),
            new token_1.Token(token_1.TokenType.PLUS, '+'),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'y'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.RBRACE, '}'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'result'),
            new token_1.Token(token_1.TokenType.ASSIGN, '='),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'add'),
            new token_1.Token(token_1.TokenType.LPAREN, '('),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'five'),
            new token_1.Token(token_1.TokenType.COMMA, ','),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'ten'),
            new token_1.Token(token_1.TokenType.RPAREN, ')'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.BANG, '!'),
            new token_1.Token(token_1.TokenType.MINUS, '-'),
            new token_1.Token(token_1.TokenType.SLASH, '/'),
            new token_1.Token(token_1.TokenType.ASTERISK, '*'),
            new token_1.Token(token_1.TokenType.INT, '5'),
            new token_1.Token(token_1.TokenType.INT, '5'),
            new token_1.Token(token_1.TokenType.LT, '<'),
            new token_1.Token(token_1.TokenType.INT, '10'),
            new token_1.Token(token_1.TokenType.GT, '>'),
            new token_1.Token(token_1.TokenType.INT, '5'),
            new token_1.Token(token_1.TokenType.IF, 'if'),
            new token_1.Token(token_1.TokenType.LPAREN, '('),
            new token_1.Token(token_1.TokenType.INT, '5'),
            new token_1.Token(token_1.TokenType.LT, '<'),
            new token_1.Token(token_1.TokenType.INT, '10'),
            new token_1.Token(token_1.TokenType.RPAREN, ')'),
            new token_1.Token(token_1.TokenType.LBRACE, '{'),
            new token_1.Token(token_1.TokenType.RETURN, 'return'),
            new token_1.Token(token_1.TokenType.TRUE, 'true'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.RBRACE, '}'),
            new token_1.Token(token_1.TokenType.ELSE, 'else'),
            new token_1.Token(token_1.TokenType.LBRACE, '{'),
            new token_1.Token(token_1.TokenType.RETURN, 'return'),
            new token_1.Token(token_1.TokenType.FALSE, 'false'),
            new token_1.Token(token_1.TokenType.SEMICOLON, ';'),
            new token_1.Token(token_1.TokenType.RBRACE, '}'),
            new token_1.Token(token_1.TokenType.INT, '10'),
            new token_1.Token(token_1.TokenType.EQUALS, '=='),
            new token_1.Token(token_1.TokenType.INT, '10'),
            new token_1.Token(token_1.TokenType.INT, '10'),
            new token_1.Token(token_1.TokenType.NOT_EQUALS, '!='),
            new token_1.Token(token_1.TokenType.INT, '9'),
            new token_1.Token(token_1.TokenType.STRING, 'shamen'),
            new token_1.Token(token_1.TokenType.STRING, 'uglyfaceman'),
            new token_1.Token(token_1.TokenType.STRING, '		\n		'),
            new token_1.Token(token_1.TokenType.STRING, '		\t\r\n		'),
            new token_1.Token(token_1.TokenType.LBRACKET, '['),
            new token_1.Token(token_1.TokenType.IDENTIFIER, 'foo'),
            new token_1.Token(token_1.TokenType.COMMA, ','),
            new token_1.Token(token_1.TokenType.INT, '6'),
            new token_1.Token(token_1.TokenType.RBRACKET, ']'),
            new token_1.Token(token_1.TokenType.AND, 'and'),
            new token_1.Token(token_1.TokenType.OR, 'or'),
            new token_1.Token(token_1.TokenType.NOT, 'not'),
            new token_1.Token(token_1.TokenType.EOF, '\0'), // End of file
        ];
        expectedTokens.forEach((expected) => {
            const token = lexer.next();
            expect(token).toEqual(expected);
        });
    });
});
