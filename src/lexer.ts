
import { TokenType, Token } from "./interfaces/token";

const KEYWORDS: { [key: string]: TokenType } = {
	"f": TokenType.FUNCTION,
	"true": TokenType.TRUE,
	"false": TokenType.FALSE,
	"and": TokenType.AND,
	"or": TokenType.OR,
	"not": TokenType.NOT,
	"if": TokenType.IF,
	"else": TokenType.ELSE,
	"return": TokenType.RETURN
}

export class Lexer {
	#source: string;
	#character: string;
	#cursor: number;
	#next_cursor: number;

	constructor(source: string){
		this.#source = source;
		this.#cursor = 0;
		this.#next_cursor = 0;
		this.#character = "\0";
		this.read_char();
	}

	public isEOF(): boolean { return this.#cursor > this.#source.length; }

	public peek(): string {
		if(this.#next_cursor >= this.#source.length)
			return "\0";
		return this.#source[this.#next_cursor];
	}

	/**
	 * returns the next token
	 * @throws {Error} */
	public next(): Token{
		this.skip_whitespace();

		let token: Token;
		switch(this.#character){
			case "=":
				if(this.peek() == '=' || this.peek() == '>') 	{
					let char = this.#character;
					this.read_char();
					token = new Token(this.#character == '=' ? TokenType.EQUALS : TokenType.ARROW, char + this.#character); 
				} else  {
					token = new Token(TokenType.ASSIGN, this.#character); 	
				}
				break;
			case "+": 	token = new Token(TokenType.PLUS, this.#character);		break;
			case "{": 	token = new Token(TokenType.LBRACE, this.#character);		break;
			case "}": 	token = new Token(TokenType.RBRACE, this.#character);		break;
			case "(": 	token = new Token(TokenType.LPAREN, this.#character); 	break;
			case ")": 	token = new Token(TokenType.RPAREN, this.#character); 	break;
			case "[": 	token = new Token(TokenType.LBRACKET, this.#character); 	break;
			case "]": 	token = new Token(TokenType.RBRACKET, this.#character); 	break;
			case ",": 	token = new Token(TokenType.COMMA, this.#character);		break;
			case ":": 	token = new Token(TokenType.COLON, this.#character);		break;
			case ".": 	token = new Token(TokenType.DOT, this.#character);			break;
			case "+": 	token = new Token(TokenType.PLUS, this.#character);		break;
			case "-": 	token = new Token(TokenType.MINUS, this.#character);		break;
			case "*":
				if(this.peek() == '*') 	{
					let char = this.#character;
					this.read_char();
					token = new Token(TokenType.DOUBLE_ASTERISK, char + this.#character); 
				} else  {
					token = new Token(TokenType.ASTERISK, this.#character);	
				}	
				break;
			case "/":	token = new Token(TokenType.SLASH, this.#character);		break;
			case "%":	token = new Token(TokenType.PERCENT, this.#character);	break;
			case ">":	
				if(this.peek() == '=') 	{
					let char = this.#character;
					this.read_char();
					token = new Token(TokenType.GTE, char + this.#character); 
				} else  {
					token = new Token(TokenType.GT, this.#character);	
				}	
				break;
			case "<":	
				if(this.peek() == '=') 	{
					let char = this.#character;
					this.read_char();
					token = new Token(TokenType.LTE, char + this.#character); 
				} else  {
					token = new Token(TokenType.LT, this.#character);	
				}	
				break;
			case ";": 	token = new Token(TokenType.SEMICOLON, this.#character);	break;
			case "\0":	token = new Token(TokenType.EOF, this.#character);			break;
			case "\"":	token = new Token(TokenType.STRING, this.read_string());	break;
			case "!":	
				if(this.peek() == '=') 	{
					let char = this.#character;
					this.read_char();
					token = new Token(TokenType.NOT_EQUALS, "!="); 
				} else  
					token = new Token(TokenType.BANG, this.#character); 	
				break;
			default:
				token = new Token(TokenType.ILLEGAL, this.#character);
				if(this.isalpha()){
					token.literal = this.read_identifier();
					token.type = this.lookup_identifier(token.literal);
					return token;
				}
				else if(this.isdigit()){
					token.literal = this.read_number();
					token.type = TokenType.INT;
					return token;
				}
		}

		this.read_char();
		return token;
	}

	private read_char(): void {
		if(this.#next_cursor >= this.#source.length){
			this.#character = "\0";
		}
		else this.#character = this.#source[this.#next_cursor]
		this.#cursor = this.#next_cursor;
		this.#next_cursor += 1;
	}

	private read_identifier(): string{
		let pos = this.#cursor;
		while(this.isalpha() || this.isdigit()) 
			this.read_char();

		return this.#source.slice(pos, this.#cursor);
	}

	private read_number(): string{
		let pos = this.#cursor;
		while(this.isdigit()) 
			this.read_char();

		return this.#source.slice(pos, this.#cursor);
	}

	private read_string(): string {
		let result = ""; 
		let escaped = false; 
		
		while (!this.isEOF()) {
			this.read_char(); 

			if (escaped) {
				switch (this.#character) {
					case 'n': 	result += '\n';	break;
					case 't':	result += '\t';	break;
					case '\"':  result += '\"';	break;
					case '\\': 	result += '\\'; 	break;
					default:  	result += this.#character;
				}
				escaped = false; // Reset escape flag
			} else {
				if (this.#character === '\\')  escaped = true; // The next character is an escape sequence
				if (this.#character === '\"')  break;
				result += this.#character; // Normal character, add to result
			}
		}
  
		return result;
  	}
	
	private lookup_identifier(ident: string): TokenType {
		if(ident in KEYWORDS) return KEYWORDS[ident];
		return TokenType.IDENTIFIER;
	}
	
	private skip_whitespace(): void{
		const whitespace = new Set(['\n', '\t', '\r', ' '])
		while(whitespace.has(this.#character))
			this.read_char();
	}

	private isalpha(): boolean { return 'A' <= this.#character && this.#character <= 'Z' || 
													'a' <= this.#character && this.#character <= 'z' ||
													this.#character == '_';
	}

	private isdigit(): boolean { return "0" <= this.#character && this.#character <= '9'; }
}