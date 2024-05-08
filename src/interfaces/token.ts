export enum TokenType {
	START = "start",
	INT = "integer",
	STRING = "string",
	IDENTIFIER = "identifier",
	ARROW = "arrow",
	RPAREN = "rparen",
	LPAREN = "lparen",
	RBRACE = "rbrace",
	LBRACE = "lbrace",
	LBRACKET = "lbracket",
	RBRACKET = "rbracket",
	ASSIGN = "assign",
	COMMA = "comma",
	PLUS = "plus",
	MINUS = "minus",
	SLASH = "slash",
	ASTERISK = "asterisk",
	DOUBLE_ASTERISK = "double_asterisk",
	PERCENT = "percent",
	DEFINE = "define",
	FUNCTION = "function",
	EOF = "EOF",
	ILLEGAL = "illegal",
	SEMICOLON = "semicolon",
	EQUALS = "EQ",
	NOT_EQUALS = "NOT_EQUALS",
	GT = "GT",
	LT = "LT",
	GTE = "GTE",
	LTE = "LTE",
	TRUE = "true",
	FALSE = "false",
	AND = "and",
	OR = "or",
	NOT = "not",
	IF = "if",
	ELSE = "else",
	RETURN = "return",
	DOT = "dot",
	COLON = "colon",
	BANG = "bang" // `!` symbol
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
}