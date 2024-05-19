export enum TokenType {
	START = "start",
	INT = "integer",
	STRING = "string",
	IDENTIFIER = "identifier",
	ARROW = "=>",
	RPAREN = ")",
	LPAREN = "(",
	RBRACE = "}",
	LBRACE = "{",
	LBRACKET = "[",
	RBRACKET = "]",
	ASSIGN = "=",
	COMMA = ",",
	PLUS = "+",
	MINUS = "-",
	SLASH = "/",
	ASTERISK = "*",
	DOUBLE_ASTERISK = "**",
	PERCENT = "%",
	FUNCTION = "function",
	EOF = "EOF",
	ILLEGAL = "illegal",
	SEMICOLON = ";",
	EQUALS = "==",
	NOT_EQUALS = "!=",
	GT = ">",
	LT = "<",
	GTE = ">=",
	LTE = "<=",
	TRUE = "true",
	FALSE = "false",
	AND = "and",
	OR = "or",
	NOT = "not",
	IF = "if",
	ELSE = "else",
	RETURN = "return",
	WHILE = "while",
	DOT = "dot",
	COLON = "colon",
	BANG = "!" // `!` symbol
}

export interface Token {
	type: TokenType;
	literal: string;
}

export class Token implements Token {
	constructor(type: TokenType, literal: string){
		this.type = type;
		this.literal = literal;
	}

	static isInfix(token: Token){
		const { type } = token;
		return 	type === TokenType.PLUS ||
					type === TokenType.MINUS||
					type === TokenType.ASTERISK||
					type === TokenType.SLASH||
					type === TokenType.AND||
					type === TokenType.OR||
					type === TokenType.LT||
					type === TokenType.GT||
					type === TokenType.GTE||
					type === TokenType.LTE||
					type === TokenType.ASSIGN||
					type === TokenType.DOUBLE_ASTERISK;
	}
}