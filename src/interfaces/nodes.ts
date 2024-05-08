import { Token, TokenType } from "./token";

/**
 * Base class for all nodes in the AST (Abstract Syntax Tree).
 * Each node has an associated token.
 */
export abstract class Node {
  token: Token;

	constructor(token: Token) {
		this.token = token; // The token that represents this node
	}

	/**
	* Returns a string representation of the node.
	* Abstract, must be implemented in subclasses.
	*/
	public abstract stringify(): string;
}

/**
 * Base class for all statement nodes in the AST.
 */
export abstract class Statement extends Node {
	constructor(token: Token) {
		super(token); 
	}
}

/**
 * Base class for all expression nodes in the AST.
 */
export abstract class Expression extends Node {
	constructor(token: Token) {
		super(token); 
	}
}

/**
 * A statement that contains a single expression.
 */
export class ExpressionStatement extends Statement {
  expression: Expression | null;

	constructor(token: Token) {
		super(token); 
		this.expression = null;
	}

	public stringify(): string { return this.expression ? this.expression.stringify() : ""; }
}

/**
 * The root of the AST, contains a list of statements.
 */
export class Program extends Statement{
  statements: Statement[];

	constructor() {
		super(new Token(TokenType.START, TokenType.START));
		this.statements = []; 
	}

	public type(): string {
		return this.statements.length > 0 ? this.statements[0].token.type : ""; 
	}

	public stringify(): string{
		return this.statements.map((stmnt) => stmnt.stringify()).join(';\n');
	} 
}

/**
 * Represents an identifier (variable name, etc.) in the AST.
 */
export class Identifier extends Expression {
  value: string;

	constructor(token: Token) {
		super(token); 
		this.value = token.literal; 
	}

	public stringify(): string {
		return this.value; 
	}
}

/**
 * Represents a 'def' statement, variable | functions declarations.
 */
export class DefineStatement extends Statement {
  name: Identifier;
  value: Expression | null;

	constructor(token: Token) {
		super(token); 
		this.name = new Identifier(token);
		this.value = null; 
	}

	public stringify(): string {
		let template = `${this.token.literal} ${this.name.stringify()}`; 
		return this.value ? `${template} = ${this.value.stringify()}` : template;
	}
}

export class ReturnStatement extends Statement {
  value: Expression | null;

	constructor(token: Token) {
		super(token); 
		this.value = null; 
	}

	public stringify(): string {
		return this.value ? `${this.token.literal} ${this.value.stringify()}` : ""; 
	}
}

export class IntegerLiteral extends Expression {
  value: number;

	constructor(token: Token) {
		super(token);
		this.value = Number(token.literal); 
	}

	public stringify(): string { return this.token.literal; }
}

export class StringLiteral extends Expression {
  value: string;

	constructor(token: Token) {
		super(token);
		this.value = token.literal; 
	}

	public stringify(): string { return `"${this.token.literal}"`; }
}

export class BooleanExpression extends Expression {
  value: boolean;

	constructor(token: Token, value: boolean) {
		super(token);
		this.value = value;
	}

	public stringify(): string { return this.token.literal; }
}

/**
 * Represents an expression with a prefix operator (e.g., -x).
 */
export class PrefixExpression extends Expression {
	operator: string;
	right: Expression | null;
	constructor(token: Token, operator: string){
		super(token);
		this.operator = operator;
		this.right = null;
	}

	public stringify(): string { return this.right ? `(${this.operator}${this.operator === 'not' ? ' ': ''}${this.right.stringify()})` : ""; }
}

/**
 * Represents an expression with an infix operator (e.g., x + y).
 */
export class InfixExpression extends Expression {
	left: Expression | null;
	operator: string;
	right: Expression | null;

	constructor(token: Token, operator: string, left: Expression){
		super(token);
		this.operator = operator;
		this.left = left;
		this.right = null;
	}

	public stringify(): string {
		return `(${this.left ? this.left.stringify() : ""} ${this.operator} ${this.right ? this.right.stringify() : ""})`
	}
}

/**
 * Represents a block of statements. Often used in control structures like "if" or "while".
 */
export class BlockStatement extends Statement {
	statements: Statement[];
	constructor(token: Token){
		super(token);
		this.statements = [];
	}

	public stringify(): string {
		return this.statements.map((stmnt) => stmnt.stringify()).join(';\n');
	}
}

/**
 * Represents an "if" expression with optional "else" clause.
 */
export class IfExpression extends Expression {
	condition: Expression | null;
	if_case: BlockStatement | Statement | null;
	else_case: BlockStatement | Statement | null;

	constructor(token: Token){
		super(token);
		this.condition = null;
		this.if_case = null;
		this.else_case = null;
	}

	public stringify(): string {
		return `if (${this.condition?.stringify()}) { ${this.if_case} } ${this.else_case ? `else { ${this.else_case.stringify()} }` : ""}`;
	}
}

/**
 * Represents an "function" expression 
 */
export class FunctionLiteral extends Expression {
	parameters: Identifier[] | null;
	body: BlockStatement | null;

	constructor(token: Token){
		super(token);
		this.parameters = [];
		this.body = null;
	}

	public stringify(): string {
		const params_str = this.parameters?.map((ident) => ident.stringify()).join(",");
		return `${this.token.literal}(${params_str}) { ${this.body?.stringify()} }`;
	}
}

/**
 * Represents an "arrow function" expression e.g def add = f(x, y) => x + y;
 */
export class ArrowFunctionLiteral extends Expression {
	parameters: Identifier[] | null;
	body: Expression | null;

	constructor(token: Token){
		super(token);
		this.parameters = [];
		this.body = null;
	}

	public stringify(): string {
		const params_str = this.parameters?.map((ident) => ident.stringify()).join(",");
		return `${this.token.literal}(${params_str}) => ${this.body?.stringify()};`;
	}
}

/**
 * Represents a call expression" expression e.g add(1,2,3)
 */
export class CallExpression extends Expression {
	caller: Expression | null;
	arguments: Expression[] | null;

	constructor(token: Token){
		super(token);
		this.caller = null;
		this.arguments = null;
	}

	public stringify(): string {
		const args: string[] = [];
		if(this.arguments){
			for(const arg of this.arguments){
				args.push(arg.stringify());
			}
		}

		return `${this.caller?.stringify()}(${args.join(', ')})`;
	}
}

export class MemberExpression extends Expression {
	object: Expression;
	property: Expression | null;

	constructor(token: Token, object: Expression){
		super(token);
		this.object = object;
		this.property = null;
	}

	public stringify(): string { return `(${this.object?.stringify()}.${this.property?.stringify()})`; }
}

export class ArrayLiteral extends Expression {
	elements: Expression[];

	constructor(token: Token){
		super(token);
		this.elements = [];
	}

	public stringify(): string { 
		const elems = this.elements.map((elem) => elem.stringify());
		return `([${elems.join(", ")}])`;
	}
}

export class IndexExpression extends Expression {
	left: Expression;
	index: Expression | null;

	constructor(token: Token, left: Expression){
		super(token);
		this.left = left;
		this.index = null;
	}

	public stringify(): string { return `(${this.left.stringify()}[${this.index?.stringify()}])`; }
}