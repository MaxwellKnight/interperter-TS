import { Token, TokenType } from "../../src//interfaces/token";
import { Lexer } from "../../src/lexer";

describe('Lexer', () => {
	it('should tokenize basic symbols and operators', () => {
		const lexer = new Lexer("=+(){**},-/*%.");
		const expectedTokens = [
			new Token(TokenType.ASSIGN, "="),  
			new Token(TokenType.PLUS, "+"),    
			new Token(TokenType.LPAREN, "("),  
			new Token(TokenType.RPAREN, ")"),  
			new Token(TokenType.LBRACE, "{"),  
			new Token(TokenType.DOUBLE_ASTERISK, "**"),  
			new Token(TokenType.RBRACE, "}"),  
			new Token(TokenType.COMMA, ","),   
			new Token(TokenType.MINUS, "-"),   
			new Token(TokenType.SLASH, "/"),     
			new Token(TokenType.ASTERISK, "*"),     
			new Token(TokenType.PERCENT, "%"),     
			new Token(TokenType.DOT, "."),     
			new Token(TokenType.EOF, "\0"),    
	  ];

		expectedTokens.forEach((expected) => {
		const token = lexer.next();
		expect(token).toEqual(expected);
		});
	});

	it('should tokenize numbers and identifiers', () => {
		const lexer = new Lexer("123 abc123 _var");
		const expectedTokens = [
			new Token(TokenType.INT, "123"),
			new Token(TokenType.IDENTIFIER, "abc123"),
			new Token(TokenType.IDENTIFIER, "_var"),
			new Token(TokenType.EOF, "\0"),
		];

		expectedTokens.forEach((expected) => {
		const token = lexer.next();
		expect(token).toEqual(expected);
		});
	});

	it('should tokenize keywords', () => {
		const lexer = new Lexer("def true false if else return");
		const expectedTokens = [
			new Token(TokenType.DEFINE, "def"),
			new Token(TokenType.TRUE, "true"),
			new Token(TokenType.FALSE, "false"),
			new Token(TokenType.IF, "if"),
			new Token(TokenType.ELSE, "else"),
			new Token(TokenType.RETURN, "return"),
			new Token(TokenType.EOF, "\0"),
		];

    expectedTokens.forEach((expected) => {
      const token = lexer.next();
      expect(token).toEqual(expected);
    });
  });

	it('should handle whitespace and newlines', () => {
		const lexer = new Lexer("   \n\t\r  def  \n");
		const expectedTokens = [
			new Token(TokenType.DEFINE, "def"),
			new Token(TokenType.EOF, "\0")
		];

	expectedTokens.forEach((expected) => {
		const token = lexer.next();
		expect(token).toEqual(expected);
		});
	});

	it('should handle illegal tokens', () => {
		const lexer = new Lexer("@#%");
		const expectedTokens = [
			new Token(TokenType.ILLEGAL, "@"),
			new Token(TokenType.ILLEGAL, "#"),
			new Token(TokenType.PERCENT, "%"),
			new Token(TokenType.EOF, "\0")
		];

		expectedTokens.forEach((expected) => {
			const token = lexer.next();
			expect(token).toEqual(expected);
		});
	});

	it('should tokenize entire test file', () => {
		const lexer = new Lexer(`def five = 5;
		def ten = 10;
		def add => f(x, y) {
			x + y;
		};
		def result = add(five, ten);
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
		[foo, 6]
		`)

		const expectedTokens = [
			new Token(TokenType.DEFINE, 'def'),
			new Token(TokenType.IDENTIFIER, 'five'),
			new Token(TokenType.ASSIGN, '='),
			new Token(TokenType.INT, '5'),
			new Token(TokenType.SEMICOLON, ';'),
	  
			new Token(TokenType.DEFINE, 'def'),
			new Token(TokenType.IDENTIFIER, 'ten'),
			new Token(TokenType.ASSIGN, '='),
			new Token(TokenType.INT, '10'),
			new Token(TokenType.SEMICOLON, ';'),
	  
			new Token(TokenType.DEFINE, 'def'),
			new Token(TokenType.IDENTIFIER, 'add'),
			new Token(TokenType.ARROW, '=>'),
			new Token(TokenType.FUNCTION, 'f'),
			new Token(TokenType.LPAREN, '('),
			new Token(TokenType.IDENTIFIER, 'x'),
			new Token(TokenType.COMMA, ','),
			new Token(TokenType.IDENTIFIER, 'y'),
			new Token(TokenType.RPAREN, ')'),
			new Token(TokenType.LBRACE, '{'),
			new Token(TokenType.IDENTIFIER, 'x'),
			new Token(TokenType.PLUS, '+'),
			new Token(TokenType.IDENTIFIER, 'y'),
			new Token(TokenType.SEMICOLON, ';'),
	  
			new Token(TokenType.RBRACE, '}'),
			new Token(TokenType.SEMICOLON, ';'),
	  
			new Token(TokenType.DEFINE, 'def'),
			new Token(TokenType.IDENTIFIER, 'result'),
			new Token(TokenType.ASSIGN, '='),
			new Token(TokenType.IDENTIFIER, 'add'),
			new Token(TokenType.LPAREN, '('),
			new Token(TokenType.IDENTIFIER, 'five'),
			new Token(TokenType.COMMA, ','),
			new Token(TokenType.IDENTIFIER, 'ten'),
			new Token(TokenType.RPAREN, ')'),
			new Token(TokenType.SEMICOLON, ';'),
	  
			new Token(TokenType.BANG, '!'),
			new Token(TokenType.MINUS, '-'),
			new Token(TokenType.SLASH, '/'),
			new Token(TokenType.ASTERISK, '*'),
			new Token(TokenType.INT, '5'),
	  
			new Token(TokenType.INT, '5'),
			new Token(TokenType.LT, '<'),
			new Token(TokenType.INT, '10'),
			new Token(TokenType.GT, '>'),
			new Token(TokenType.INT, '5'),
	  
			new Token(TokenType.IF, 'if'),
			new Token(TokenType.LPAREN, '('),
			new Token(TokenType.INT, '5'),
			new Token(TokenType.LT, '<'),
			new Token(TokenType.INT, '10'),
			new Token(TokenType.RPAREN, ')'),
			new Token(TokenType.LBRACE, '{'),
	  
			new Token(TokenType.RETURN, 'return'),
			new Token(TokenType.TRUE, 'true'),
			new Token(TokenType.SEMICOLON, ';'),
	  
			new Token(TokenType.RBRACE, '}'),
			new Token(TokenType.ELSE, 'else'),
			new Token(TokenType.LBRACE, '{'),
	  
			new Token(TokenType.RETURN, 'return'),
			new Token(TokenType.FALSE, 'false'),
			new Token(TokenType.SEMICOLON, ';'),
			new Token(TokenType.RBRACE, '}'),
			
			new Token(TokenType.INT, '10'),
			new Token(TokenType.EQUALS, '=='),
			new Token(TokenType.INT, '10'),
	  
			new Token(TokenType.INT, '10'),
			new Token(TokenType.NOT_EQUALS, '!='),
			new Token(TokenType.INT, '9'),

			new Token(TokenType.STRING, 'shamen'),
			new Token(TokenType.STRING, 'uglyfaceman'),
			new Token(TokenType.STRING, '		\n		'),
			new Token(TokenType.LBRACKET, '['),
			new Token(TokenType.IDENTIFIER, 'foo'),
			new Token(TokenType.COMMA, ','),
			new Token(TokenType.INT, '6'),
			new Token(TokenType.RBRACKET, ']'),
	  
			new Token(TokenType.EOF, '\0'), // End of file
	  ];

	  	expectedTokens.forEach((expected) => {
			const token = lexer.next();
			expect(token).toEqual(expected);
		});
	});
});
