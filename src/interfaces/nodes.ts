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
	public abstract stringify(level?: number): string;
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
	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return this.expression ? `${level_str + this.expression.stringify(level)}` : "";
	}
}

/**
 * The root of the AST, contains a list of statements.
 */
export class Program extends Statement {
	statements: Statement[];

	constructor() {
		super(new Token(TokenType.START, TokenType.START));
		this.statements = [];
	}

	public type(): string {
		return this.statements.length > 0 ? this.statements[0].token.type : "";
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return this.statements.map((stmnt) => `${level_str + stmnt.stringify(level)}`).join('\n');
	}
}

/**
 * Represents a block of statements. Often used in control structures like "if" or "while".
 */
export class BlockStatement extends Statement {
	statements: Statement[];
	constructor(token: Token) {
		super(token);
		this.statements = [];
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return this.statements.map((stmnt) => `${level_str}${stmnt.stringify(level)}`).join('\n');
	}
}

export class ReturnStatement extends Statement {
	value: Expression | null;

	constructor(token: Token) {
		super(token);
		this.value = null;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level + 1; i++) level_str += ' ';
		return this.value ? `${level_str}${this.token.literal} ${this.value.stringify(level)}` : level_str;
	}
}

export class BreakStatement extends Statement {

	constructor(token: Token) {
		super(token);
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level + 1; i++) level_str += ' ';
		return 'break';
	}
}

export class WhileStatement extends Statement {
	condition: Expression | null;
	body: BlockStatement | ExpressionStatement | null;

	constructor(token: Token) {
		super(token);
		this.condition = null;
		this.body = null;
	}

	public stringify(level: number = 0): string {
		let level_str = '';
		for (let i = 0; i < level + 1; i++) level_str += ' ';
		return `${level_str}${this.condition?.stringify()} {\n ${this.body?.stringify(level + 1)}\n}`;
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

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return `${level_str + this.value}`;
	}
}

/**
 * Represents a 'def' statement, variable | functions declarations.
 */
export class AssignExpression extends Expression {
	left: Expression;
	value: Expression | null;

	constructor(token: Token, left: Expression) {
		super(token);
		this.left = left;
		this.value = null;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		let template = `${this.left.stringify(level)}`;
		return this.value ? `${level_str + template} = ${this.value.stringify()}` : template;
	}
}

export class IntegerLiteral extends Expression {
	value: number;

	constructor(token: Token) {
		super(token);
		this.value = Number(token.literal);
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return `${level_str + this.token.literal}`;
	}
}

export class StringLiteral extends Expression {
	value: string;

	constructor(token: Token) {
		super(token);
		this.value = token.literal;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return `${level_str + `'${this.token.literal}'`}`;
	}
}

export class BooleanExpression extends Expression {
	value: boolean;

	constructor(token: Token, value: boolean) {
		super(token);
		this.value = value;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return `${level_str + this.token.literal}`;
	}
}

/**
 * Represents an expression with a prefix operator (e.g., -x).
 */
export class PrefixExpression extends Expression {
	operator: string;
	right: Expression | null;
	constructor(token: Token, operator: string) {
		super(token);
		this.operator = operator;
		this.right = null;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return this.right ? `(${level_str + this.operator}${this.operator === 'not' ? ' ' : ''}${level_str + this.right.stringify()})` : "";
	}
}

/**
 * Represents an expression with an infix operator (e.g., x + y).
 */
export class InfixExpression extends Expression {
	left: Expression | null;
	operator: string;
	right: Expression | null;

	constructor(token: Token, operator: string, left: Expression) {
		super(token);
		this.operator = operator;
		this.left = left;
		this.right = null;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return `(${this.left ? level_str + this.left.stringify() : level_str} ${this.operator} ${this.right ? this.right.stringify() : ""})`
	}
}

/**
 * Represents an "if" expression with optional "else" clause.
 */
export class IfExpression extends Expression {
	condition: Expression | null;
	if_case: BlockStatement | Statement | null;
	else_case: BlockStatement | Statement | null;

	constructor(token: Token) {
		super(token);
		this.condition = null;
		this.if_case = null;
		this.else_case = null;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		return `${level_str}if (${this.condition?.stringify()}) { ${this.if_case?.stringify(level + 1)} } ${this.else_case ? `else { ${this.else_case.stringify(level + 1)} }` : ""}`;
	}
}

/**
 * Represents an "function" expression 
 */
export class FunctionLiteral extends Expression {
	parameters: Identifier[] | null;
	body: BlockStatement | null;

	constructor(token: Token) {
		super(token);
		this.parameters = [];
		this.body = null;
	}

	public stringify(level = 0): string {
		let level_str = '';
		for (let i = 0; i < level; i++) level_str += ' ';
		const params_str = this.parameters?.map((ident) => ident.stringify()).join(",");
		const body_str = this.body ? this.body.stringify(level + 1) : ''; // Indent the body

		return `${level_str + this.token.literal}(${params_str}) {\n${body_str}\n${level_str}}`;
	}
}

/**
 * Represents an "arrow function" expression e.g def add = f(x, y) => x + y;
 */
export class ArrowFunctionLiteral extends Expression {
	parameters: Identifier[] | null;
	body: Expression | null;

	constructor(token: Token) {
		super(token);
		this.parameters = [];
		this.body = null;
	}

	public stringify(level = 0): string {
		const params_str = this.parameters?.map((ident) => ident.stringify(level)).join(",");
		return `${this.token.literal}(${params_str}) => ${this.body?.stringify()};`;
	}
}

/**
 * Represents a call expression" expression e.g add(1,2,3)
 */
export class CallExpression extends Expression {
	caller: Expression | null;
	arguments: Expression[] | null;

	constructor(token: Token) {
		super(token);
		this.caller = null;
		this.arguments = null;
	}

	public stringify(level = 0): string {
		const args: string[] = [];
		if (this.arguments) {
			for (const arg of this.arguments) {
				args.push(arg.stringify(level));
			}
		}

		return `${this.caller?.stringify(level)}(${args.join(', ')})`;
	}
}

export class MemberExpression extends Expression {
	object: Expression;
	property: Expression | null;

	constructor(token: Token, object: Expression) {
		super(token);
		this.object = object;
		this.property = null;
	}

	public stringify(level = 0): string { return `(${this.object?.stringify(level)}.${this.property?.stringify(level)})`; }
}

export class ArrayLiteral extends Expression {
	elements: Expression[];

	constructor(token: Token) {
		super(token);
		this.elements = [];
	}

	public stringify(level = 0): string {
		const elems = this.elements.map((elem) => elem.stringify(level));
		return `([${elems.join(", ")}])`;
	}
}

export class IndexExpression extends Expression {
	left: Expression;
	index: Expression | null;

	constructor(token: Token, left: Expression) {
		super(token);
		this.left = left;
		this.index = null;
	}

	public stringify(level = 0): string { return `(${this.left.stringify(level)}[${this.index?.stringify(level)}])`; }
}

export class ObjectLiteral extends Expression {

	properties: Map<Expression, Expression | null>
	constructor(token: Token) {
		super(token);
		this.properties = new Map<Expression, Expression | null>;
	}

	public stringify(level = 0): string {
		const properties: string[][] = [];
		this.properties.forEach((value, key) => {
			if (typeof value === 'function')
				properties.push([`<function ${key.stringify()}>`, key.stringify()]);
			properties.push([value ? value.stringify() : "", key.stringify()]);
		})
		return `{ ${properties.map(elem => `${elem[1]}${': ' + (elem[0] ? elem[0] : 'null')}`).join(", ")} }`;
	}
}
