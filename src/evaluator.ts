import { Enviroment } from "./enviroment";
import { BlockStatement, BooleanExpression, CallExpression, DefineStatement, Expression, ExpressionStatement, FunctionLiteral, Identifier, IfExpression, InfixExpression, IntegerLiteral, Node, PrefixExpression, Program, ReturnStatement, Statement } from "./interfaces/nodes";
import { BooleanObj, ErrorObj, FunctionObj, IntegerObj, NullObj, Obj, ObjectType, ReturnObj } from "./interfaces/object";


const TRUE = new BooleanObj(true);
const FALSE = new BooleanObj(false);
const NULL = new NullObj();

export class Evaluator {
	constructor() {};

	/**
   * Checks if a given object is truthy, with specific rules for different object types.
   * - NullObj is always falsy.
   * - BooleanObj returns its value.
   * - All other objects are considered truthy.
   */
	private is_truthy(obj: Obj): boolean{
		if(obj instanceof NullObj) return false;
		else if(obj instanceof BooleanObj) return obj.value;
		return true;
	}

	/**
   * Evaluates a given AST node, returning the appropriate object.
   * Supports multiple node types, including literals, expressions, statements, etc.
   */
	public eval(node: Node | Program | null, env: Enviroment): Obj {
		if(node instanceof IntegerLiteral){
			return new IntegerObj(node.value);
		}
		else if(node instanceof BooleanExpression){
			return node.value ? TRUE : FALSE;
		}
		else if(node instanceof Program){
			return this.eval_program(node.statements, env);
		}
		else if(node instanceof BlockStatement){
			return this.eval_block_statement(node, env);
		}
		else if(node instanceof ExpressionStatement){
			return this.eval(node.expression, env);
		}
		else if(node instanceof PrefixExpression){
			const operand = this.eval(node.right, env)
			if(ErrorObj.isError(operand)) return operand;

			return this.eval_prefix_expression(node.operator, operand);
		}
		else if(node instanceof InfixExpression){
			const left = this.eval(node.left, env);
			if(ErrorObj.isError(left)) return left;

			const right = this.eval(node.right, env);
			if(ErrorObj.isError(right)) return right;

			return this.eval_infix_expression(node.operator, left, right);
		}
		else if(node instanceof IfExpression){
			return this.eval_if_expression(node, env);
		}
		else if(node instanceof ReturnStatement){
			const returnValue = this.eval(node.value, env);
			if(ErrorObj.isError(returnValue)) return returnValue;

			if(returnValue) return new ReturnObj(returnValue);
		}
		else if(node instanceof Identifier){
			return this.eval_identifier(node, env);
		}
		else if(node instanceof DefineStatement){
			const value = this.eval(node.value, env);
			if(ErrorObj.isError(value)) return value;

			env.set(node.name.value, value);
			return value;
		}
		else if(node instanceof FunctionLiteral){
			const fn = new FunctionObj();
			fn.body = node.body;
			fn.parameters = node.parameters;
			fn.env = env;
			return fn;
		}
		else if(node instanceof CallExpression){
			const fn = this.eval(node.function, env);
			if(ErrorObj.isError(fn)) return fn;

			const args = this.eval_expressions(node.arguments || [], env);
			if(args.length == 1 && ErrorObj.isError(args[0]))
				return args[0];
			return this.apply_function(fn, args);
		}

		return NULL;
	}

	/**
   * Evaluates a program consisting of multiple statements.
   * Returns the result of the last evaluated statement.
   */
	private eval_program(statements: Statement[], env: Enviroment): Obj {
		let result = new NullObj();

		for(const statement of statements){
			result = this.eval(statement, env)
			if(result instanceof ReturnObj)
				return result.value;
			else if(result instanceof ErrorObj)
				return result;
		}

		return result;
	}

	/**
   * Evaluates a block of statements, typically used in functions, if statements, etc.
   * Returns the result of the last evaluated statement, or a return or error if encountered.
   */
	private eval_block_statement(node: BlockStatement, env: Enviroment): Obj  {
		let result = new NullObj();

		for(const statement of node.statements){
			result = this.eval(statement, env)
			if(result instanceof ReturnObj || result instanceof ErrorObj)
				return result;
		}
		return result;
	}

	/**
   * Evaluates a prefix expression with the given operator and operand.
   * Supports common operators like '!' (bang) and '-' (minus).
   */
	private eval_prefix_expression(operator: string, operand: Obj): Obj {
		switch(operator){
			case "!": 	return this.eval_bang_prefix(operand);
			case "-": 	return this.eval_minus_prefix(operand);
			default: 	return ErrorObj.create("Unknown operator:", [operator + operand.type]);
		}
	}

	private eval_bang_prefix(operand: Obj | null): Obj {
		if(operand instanceof BooleanObj){
			if(operand.value) return FALSE
			return TRUE;
		}
		if(operand instanceof NullObj) return TRUE;
		return FALSE;
	}

	private eval_minus_prefix(operand: Obj): Obj{
		if(operand.type !== ObjectType.INTEGER_OBJ)
			return ErrorObj.create("Unknown operator:", ["-" + operand.type]);

		if(!(operand instanceof IntegerObj))
			return NULL;

		return new IntegerObj(-operand.value);
	}

	/**
   * Evaluates an expression with a given operator and two operands (infix).
   * Supports various operators like arithmetic and comparison operators.
   */
	private eval_infix_expression(operator: string, left: Obj, right: Obj): Obj {
		if(left.type !== right.type) 
			return ErrorObj.create("Invalid operation on operands tryin:", [left.type, operator, right.type]);

		if((left instanceof IntegerObj) && (right instanceof IntegerObj))
			return this.eval_integer_infix_expression(operator, left, right);

		else if(operator == "==")
			return left.value == right.value ? TRUE : FALSE;
		
		else if(operator == "!=")
			return left.value != right.value ? TRUE : FALSE;
		
		return ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
	}

	private eval_integer_infix_expression(operator: string, left: IntegerObj, right: IntegerObj): Obj  {
		switch(operator){
			case "+": 	return new IntegerObj(left.value + right.value);
			case "-": 	return new IntegerObj(left.value - right.value);
			case "*": 	return new IntegerObj(left.value * right.value);
			case "/": 	return new IntegerObj(left.value / right.value);
			case "%": 	return new IntegerObj(left.value % right.value);
			case "**": 	return new IntegerObj(Math.pow(left.value, right.value));
			case "<": 	return left.value < right.value ? TRUE : FALSE;
			case ">": 	return left.value > right.value ? TRUE : FALSE;
			case "==":	return left.value === right.value ? TRUE : FALSE;
			case "!=":	return left.value !== right.value ? TRUE : FALSE;
			default:	 	return ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
		}
	}

	private eval_if_expression(if_expr: IfExpression, env: Enviroment): Obj {
		const condition = this.eval(if_expr.condition, env);
		if(ErrorObj.isError(condition)) return condition;

		if(this.is_truthy(condition) && if_expr.if_case){
			return this.eval(if_expr.if_case, env);
		}
		else if(if_expr.else_case !== null && if_expr.else_case) 
			return this.eval(if_expr.else_case, env);

		return NULL;
	}

	private eval_identifier(node: Identifier, env: Enviroment): Obj{
		const obj =  env.get(node.value);
		if(!obj) return ErrorObj.create("Unknown identifier:", [node.value]);

		return obj;
	}

	private eval_expressions(expressions: Expression[], env: Enviroment): Obj[]{
		const result: Obj[] = [];

		for(const expression of expressions){
			const expr = this.eval(expression, env);
			if(ErrorObj.isError(expr)) return [expr];
			result.push(expr);
		}
		return result;
	}

	private apply_function(fn: Obj, args: Obj[]): Obj{
		if(!(fn instanceof FunctionObj)){
			return ErrorObj.create("not a function:", [fn.type]);
		}
		const extendedEnv = this.extend_function_env(fn, args);
		const result = this.eval(fn.body, extendedEnv);
		return this.unwrap_return(result);
	}
	
	private extend_function_env(fn: FunctionObj, args: Obj[]): Enviroment {
		const env = Enviroment.enclosed_env(fn.env);
		for(let i = 0; i < fn.parameters!.length; i++){
			env.set(fn.parameters![i].value, args[i]);
		}
		return env;
	}
	private unwrap_return(obj: Obj): Obj{
		if(obj instanceof ReturnObj)
			return obj.value;

		return obj;
	}
 }