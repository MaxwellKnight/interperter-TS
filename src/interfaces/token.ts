export enum TokenType {
	INT = "integer",
	IDENTIFIER = "identifier",
	ARROW = "arrow",
	RPAREN = "lparen",
	LPAREN = "rparen",
	RBRACE = "lbrace",
	LBRACE = "rbrace",
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
	IF = "if",
	ELSE = "else",
	RETURN = "return",
	BANG = "bang" // ! symbol
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