import { 
	ArrayLiteral,
	ArrowFunctionLiteral,
	BlockStatement, 
	BooleanExpression, 
	CallExpression, 
	DefineStatement,
	Expression, 
	ExpressionStatement, 
	FunctionLiteral, 
	Identifier, 
	IfExpression, 
	IndexExpression, 
	InfixExpression, 
	IntegerLiteral, 
	MemberExpression, 
	PrefixExpression, 
	Program, 
	ReturnStatement, 
	Statement, 
	StringLiteral
} from "./interfaces/nodes";
import { Token, TokenType } from "./interfaces/token";
import { Lexer } from "./lexer";

enum Precedence {
	LOWEST,
	EQAULS,
	LESSGREATER,
	SUM,
	PRODUCT,
	PREFIX,
	POWER,
	INDEX,
	MEMBER,
	CALL,
};


const PRECEDENCES = new Map<TokenType, Precedence>();
PRECEDENCES.set(TokenType.EQUALS, Precedence.EQAULS);
PRECEDENCES.set(TokenType.NOT_EQUALS, Precedence.EQAULS);
PRECEDENCES.set(TokenType.LT, Precedence.LESSGREATER);
PRECEDENCES.set(TokenType.GT, Precedence.LESSGREATER);
PRECEDENCES.set(TokenType.LTE, Precedence.LESSGREATER);
PRECEDENCES.set(TokenType.GTE, Precedence.LESSGREATER);
PRECEDENCES.set(TokenType.PLUS, Precedence.SUM);
PRECEDENCES.set(TokenType.MINUS, Precedence.SUM);
PRECEDENCES.set(TokenType.SLASH, Precedence.PRODUCT);
PRECEDENCES.set(TokenType.ASTERISK, Precedence.PRODUCT);
PRECEDENCES.set(TokenType.PERCENT, Precedence.PRODUCT);
PRECEDENCES.set(TokenType.DOUBLE_ASTERISK, Precedence.POWER);
PRECEDENCES.set(TokenType.LPAREN, Precedence.CALL);
PRECEDENCES.set(TokenType.LBRACKET, Precedence.INDEX);
PRECEDENCES.set(TokenType.DOT, Precedence.MEMBER);

type PrefixFunction = () => Expression | null;
type InfixFunction = (left: Expression) => Expression | null;

export class Parser {
	#lexer: Lexer;
	#errors: string[];
	#current: Token;
	#peek: Token;
	#prefix_fns: Map<TokenType, PrefixFunction>
	#infix_fns: Map<TokenType, InfixFunction>

	constructor(source: string){
		this.#lexer = new Lexer(source);
		this.#current = new Token(TokenType.EOF, TokenType.EOF);
		this.#peek = new Token(TokenType.EOF, TokenType.EOF);
		this.#errors =[];
		this.advance();
		this.advance();

		this.#prefix_fns = new Map<TokenType, PrefixFunction>();
		this.#infix_fns = new Map<TokenType, InfixFunction>();
		this.register_prefix(TokenType.IDENTIFIER, this.parse_identifier);
		this.register_prefix(TokenType.INT, this.parse_integer);
		this.register_prefix(TokenType.STRING, this.parse_string);
		this.register_prefix(TokenType.LBRACKET, this.parse_array_literal);
		this.register_prefix(TokenType.BANG, this.parse_prefix_expression);
		this.register_prefix(TokenType.MINUS, this.parse_prefix_expression);

		this.register_prefix(TokenType.FUNCTION, this.parse_function_literal);

		this.register_prefix(TokenType.IF, this.parse_if_expression);

		this.register_prefix(TokenType.LPAREN, this.parse_grouped_expression);

		this.register_prefix(TokenType.TRUE, this.parse_boolean);
		this.register_prefix(TokenType.FALSE, this.parse_boolean);

		this.register_infix(TokenType.LBRACKET, this.parse_index_expression);
		this.register_infix(TokenType.LPAREN, this.parse_call_expression);
		this.register_infix(TokenType.DOT, this.parse_member_expression);

		this.register_infix(TokenType.PLUS, this.parse_infix_expression);
		this.register_infix(TokenType.MINUS, this.parse_infix_expression);
		this.register_infix(TokenType.SLASH, this.parse_infix_expression);
		this.register_infix(TokenType.ASTERISK, this.parse_infix_expression);
		this.register_infix(TokenType.PERCENT, this.parse_infix_expression);
		this.register_infix(TokenType.EQUALS, this.parse_infix_expression);
		this.register_infix(TokenType.NOT_EQUALS, this.parse_infix_expression);
		this.register_infix(TokenType.LT, this.parse_infix_expression);
		this.register_infix(TokenType.GT, this.parse_infix_expression);
		this.register_infix(TokenType.GTE, this.parse_infix_expression);
		this.register_infix(TokenType.LTE, this.parse_infix_expression);
		this.register_infix(TokenType.DOUBLE_ASTERISK, this.parse_infix_expression);
	}

	private advance(): void{
		if(this.#peek)
			this.#current = this.#peek;
		this.#peek = this.#lexer.next();
	}

	private expect(type: TokenType): boolean{
		if(this.compare_peek(type)){
			this.advance();
			return true;
		}

		this.peekError(type);
		return false;
	}

	public errors(): string[] {
		return this.#errors;
	}

	private peekError(type: TokenType){
		this.#errors.push(`expected ${type} but instead got ${this.#peek.literal}`)
	}

	private compare_current(type: TokenType): boolean{ 
		return this.#current.type == type; 
	}

	private compare_peek(type: TokenType): boolean { 
		return this.#peek.type == type; 
	}

	private register_prefix(type: TokenType, fn: PrefixFunction): void { 
		this.#prefix_fns.set(type, fn); 
	}

	private register_infix(type: TokenType, fn: InfixFunction){ 
		this.#infix_fns.set(type, fn); 
	}

	private precedence_current(): Precedence { 
		return PRECEDENCES.get(this.#current.type) || Precedence.LOWEST; 
	}

	private precedence_peek(): Precedence { 
		return PRECEDENCES.get(this.#peek.type) || Precedence.LOWEST; 
	}
	
	private no_prefix_error(token: Token): void { 
		this.#errors.push(`Could not find prefix function for ${token.type}`); 
	}

	public parse_program(): Program {
		const program = new Program();

		while(!this.#lexer.isEOF()){
			const stmnt = this.parse_statement();
			if(stmnt !== null) program.statements.push(stmnt);
			this.advance();
		}

		return program;
	}

	private parse_statement(): Statement | null{
		if(this.#peek.type === TokenType.ASSIGN) 
			return this.parse_assignment_statement();
		
		switch(this.#current.type){
			case TokenType.DEFINE:
				return this.parse_assignment_statement();
			case TokenType.RETURN:
				return this.parse_return_statement();
			default:
				return this.parse_expression_statement();
		}
	}

	private parse_assignment_statement(): Statement | null{
		const stmnt = new DefineStatement(this.#current);

		if(this.#current.type !== TokenType.IDENTIFIER && !this.expect(TokenType.IDENTIFIER))
			return null;

		stmnt.name = new Identifier(this.#current);

		if(!this.expect(TokenType.ASSIGN))
			return null;

		this.advance();
		stmnt.value = this.parse_expression(Precedence.LOWEST);

		if(this.compare_peek(TokenType.SEMICOLON))
			this.advance();

		return stmnt;
	}

	private parse_return_statement(): Statement{
		const stmnt = new ReturnStatement(this.#current);
		this.advance();

		stmnt.value = this.parse_expression(Precedence.LOWEST);

		if(this.compare_peek(TokenType.SEMICOLON))
			this.advance();

		return stmnt;
	}

	private parse_expression_statement(): ExpressionStatement | null {
		const stmnt = new ExpressionStatement(this.#current);
		stmnt.expression = this.parse_expression(Precedence.LOWEST);

		if(this.compare_peek(TokenType.SEMICOLON))
			this.advance();

		return stmnt;
	}

	private parse_expression(precedence: Precedence): Expression | null {
		const prefix = this.#prefix_fns.get(this.#current.type)?.bind(this);
		if(!prefix) return null;

		let left = prefix() as Expression;
		while(!this.compare_current(TokenType.SEMICOLON) && precedence < this.precedence_peek()){
			const infix = this.#infix_fns.get(this.#peek.type)?.bind(this);
			if(!infix) return left;
			
			this.advance();
			left = infix(left) as Expression;
		}

		return left;
	}

	private parse_identifier(): Expression | null { return new Identifier(this.#current); }
	private parse_boolean(): Expression | null { return new BooleanExpression(this.#current, this.compare_current(TokenType.TRUE)); }
	private parse_string(): Expression | null { 
		const str = new  StringLiteral(this.#current);
		str.value = this.#current.literal;
		return str; 
	}

	private parse_integer(): Expression | null {
		const integer = new IntegerLiteral(this.#current);
		if(Number.isNaN(this.#current.literal)){
			this.no_prefix_error(this.#current);
			return null;
		}
		integer.value = Number(this.#current.literal);
		return integer;
	}

	private parse_prefix_expression(): Expression | null {
		const expr = new PrefixExpression(this.#current, this.#current.literal);
		this.advance();
		expr.right = this.parse_expression(Precedence.PREFIX);
		return expr;
	}

	private parse_infix_expression(left: Expression): Expression | null {
		const precedence = this.precedence_current();
		const expr = new InfixExpression(this.#current, this.#current.literal, left);
		this.advance();
		expr.right = this.parse_expression(precedence);
		return expr;
	}

	private parse_grouped_expression(): Expression | null {
		this.advance();

		const expr = this.parse_expression(Precedence.LOWEST);

		if(!this.expect(TokenType.RPAREN))
			return null;

		return expr;
	}

	private parse_if_expression(): Expression | null {
		const expr = new IfExpression(this.#current);

		if(!this.expect(TokenType.LPAREN)) return null;

		this.advance();
		expr.condition = this.parse_expression(Precedence.LOWEST);

		if(!this.expect(TokenType.RPAREN)) return null;

		if(this.compare_peek(TokenType.LBRACE)){
			this.advance();
			expr.if_case = this.parse_block_statement();
		}else {
			this.advance();
			expr.if_case = this.parse_statement();
		}

		if(this.compare_peek(TokenType.ELSE)){
			this.advance();

			if(this.compare_peek(TokenType.LBRACE)){
				this.advance();
				expr.else_case = this.parse_block_statement();
			}else {
				this.advance();
				expr.else_case = this.parse_statement();
			}
		}

		return expr;
	}

	private parse_block_statement(): BlockStatement | null {
		const block = new BlockStatement(this.#current);

		this.advance();
		while(!this.compare_current(TokenType.RBRACE) && !this.compare_current(TokenType.EOF)){
			const statement = this.parse_statement();
			if(statement) block.statements.push(statement);
			this.advance();
		}
		return block;
	}

	private parse_function_literal(): Expression | null {
		let fn: ArrowFunctionLiteral | FunctionLiteral = new FunctionLiteral(this.#current);

		if(!this.expect(TokenType.LPAREN)) return null;

		const parameters = this.parse_function_parameters();

		if(this.compare_peek(TokenType.ARROW)){
			this.advance();
			this.advance();

			fn = new ArrowFunctionLiteral(fn.token);
			fn.parameters = parameters;
			fn.body = this.parse_expression(Precedence.LOWEST);
			return fn;
		}

		if(!this.expect(TokenType.LBRACE)) return null;

		fn.parameters = parameters;
		fn.body = this.parse_block_statement();
		return fn;
	}

	private parse_function_parameters(): Identifier[] | null {
		const identifiers: Identifier[] = [];
		if(this.compare_peek(TokenType.RPAREN)){
			this.advance();
			return identifiers;
		}

		this.advance();
		let identifier = new Identifier(this.#current);
		identifiers.push(identifier);

		while(this.compare_peek(TokenType.COMMA)){
			this.advance();
			this.advance();
			let identifier = new Identifier(this.#current);
			identifiers.push(identifier);
		}

		if(!this.expect(TokenType.RPAREN)) return null;
		return identifiers;
	}

	private parse_call_expression(caller: Expression): Expression | null {
		const expr = new CallExpression(this.#current);
		expr.caller = caller;
		expr.arguments = this.parse_expression_list(TokenType.RPAREN);
		return expr;
	}

	private parse_array_literal(): Expression | null {
		const array = new ArrayLiteral(this.#current);

		const elems = this.parse_expression_list(TokenType.RBRACKET);
		if(!elems) return null;
		
		array.elements = elems;
		return array;
	}

	private parse_expression_list(end: TokenType): Expression[] | null{
		const list: Expression[] = [];
		if(this.compare_peek(end)){
			this.advance();
			return list;
		}

		this.advance();
		let elem = this.parse_expression(Precedence.LOWEST);
		if(elem) list.push(elem);

		while(this.compare_peek(TokenType.COMMA)){
			this.advance();
			this.advance();
			elem = this.parse_expression(Precedence.LOWEST);
			if(elem) list.push(elem);
		}
		
		if(!this.expect(end)) return null;

		return list;
	}

	private parse_index_expression(left: Expression): Expression | null {
		const index = new IndexExpression(this.#current, left);

		this.advance();
		const expr = this.parse_expression(Precedence.LOWEST);
		if(!expr) return null;

		index.index = expr;

		if(!this.expect(TokenType.RBRACKET)) return null;

		return index;
	}

	private parse_member_expression(left: Expression): Expression | null {
		const memeber = new MemberExpression(this.#current, left);

		if(!this.expect(TokenType.IDENTIFIER)) return null;

		memeber.property = this.parse_expression(Precedence.MEMBER);
		return memeber;
	}
}
