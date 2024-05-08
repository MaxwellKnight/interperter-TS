import { Enviroment, builtin_first, builtin_last, builtin_len, builtin_print, builtin_rest } from "./enviroment";
import { ArrayLiteral, ArrowFunctionLiteral, BlockStatement, BooleanExpression, CallExpression, DefineStatement, Expression, ExpressionStatement, FunctionLiteral, Identifier, IfExpression, IndexExpression, InfixExpression, IntegerLiteral, MemberExpression, Node, PrefixExpression, Program, ReturnStatement, Statement, StringLiteral } from "./interfaces/nodes";
import { ArrayObj, BooleanObj, BuiltinObj, ErrorObj, FALSE, FunctionObj, IntegerObj, NULL, NullObj, Obj, ObjectType, ReturnObj, StringObj, TRUE } from "./interfaces/object";

export const envs: Enviroment[] = [];

class Evaluator {
	builtins: Map<string, BuiltinObj | NullObj>;

	constructor() {
		this.builtins = new Map<string, BuiltinObj | NullObj>;
		this.builtins.set("len", 	new BuiltinObj(builtin_len));
		this.builtins.set("first", new BuiltinObj(builtin_first));
		this.builtins.set("last", 	new BuiltinObj(builtin_last));
		this.builtins.set("rest", 	new BuiltinObj(builtin_rest));
		this.builtins.set("print", new BuiltinObj(builtin_print));
		this.builtins.set("null", 	new NullObj());
	};

	/**
   * Evaluates a given AST node, returning the appropriate object.
   */
	public eval(node: Node | null, env: Enviroment): Obj {
		if(envs.length === 0) envs.push(env);

		if(     node instanceof IntegerLiteral)		return new IntegerObj(node.value);
		else if(node instanceof StringLiteral)			return new StringObj(node.value);
		else if(node instanceof BooleanExpression)	return node.value ? TRUE : FALSE;
		else if(node instanceof Program)					return this.eval_program(node.statements, env);
		else if(node instanceof BlockStatement)		return this.eval_block_statement(node, env);
		else if(node instanceof ExpressionStatement)	return this.eval(node.expression, env);
		else if(node instanceof MemberExpression)		return this.eval_member_expression(node, env);
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
		else if(node instanceof FunctionLiteral || node instanceof ArrowFunctionLiteral){
			const fn = new FunctionObj();
			fn.body = node.body;
			fn.parameters = node.parameters;
			fn.env = env;
			return fn;
		}
		else if(node instanceof CallExpression){
			const args = this.eval_expressions(node.arguments || [], env);
			if(args.length == 1 && ErrorObj.isError(args[0]))
			return args[0];
			
			const fn = this.eval(node.caller, env);
			if(ErrorObj.isError(fn)) return fn;

			return this.apply_function(fn, args);
		}
		else if(node instanceof ArrayLiteral) {
			const elements = this.eval_expressions(node.elements, env);
			if(elements.length == 1 && ErrorObj.isError(elements[0])){
				return elements[0];
			}
			return new ArrayObj(elements);
		}
		else if(node instanceof IndexExpression){
			const left = this.eval(node.left, env);
			if(ErrorObj.isError(left)) return left;

			const index = this.eval(node.index, env);
			if(ErrorObj.isError(index)) return index;

			return this.eval_index_expression(left, index);
		}

		return NULL;
	}

	/**
   * Evaluates a program consisting of multiple statements.
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

	private eval_block_statement(node: BlockStatement, env: Enviroment): Obj  {
		let result = new NullObj();

		for(const statement of node.statements){
			result = this.eval(statement, env)
			if(result instanceof ReturnObj || result instanceof ErrorObj)
				return result;
		}
		return result;
	}

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
   */
	private eval_infix_expression(operator: string, left: Obj, right: Obj): Obj {
		if(left.type !== right.type) 
			return ErrorObj.create("Invalid operation on operands tryin:", [left.type, operator, right.type]);

		if((left instanceof IntegerObj) && (right instanceof IntegerObj))
			return this.eval_integer_infix_expression(operator, left, right);

		else if((left instanceof StringObj) && (right instanceof StringObj))
			return this.eval_string_infix_expression(operator, left, right);

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
			case "<=": 	return left.value <= right.value ? TRUE : FALSE;
			case ">": 	return left.value > right.value ? TRUE : FALSE;
			case ">=": 	return left.value >= right.value ? TRUE : FALSE;
			case "==":	return left.value === right.value ? TRUE : FALSE;
			case "!=":	return left.value !== right.value ? TRUE : FALSE;
			default:	 	return ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
		}
	}
	private eval_string_infix_expression(operator: string, left: StringObj, right: StringObj): Obj  {
		switch(operator){
			case "+":	return new StringObj(left.value + right.value);
			default:	 	return ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
		}
	}

	private eval_if_expression(if_expr: IfExpression, env: Enviroment): Obj {
		const condition = this.eval(if_expr.condition, env);
		if(ErrorObj.isError(condition)) return condition;

		if(this.is_truthy(condition) && if_expr.if_case){
			return this.eval(if_expr.if_case, env);
		}
		else if(if_expr.else_case) 
			return this.eval(if_expr.else_case, env);

		return NULL;
	}

	private eval_identifier(node: Identifier, env: Enviroment): Obj{
		const obj =  env.get(node.value);
		if(obj) return obj

		const builtin = this.builtins.get(node.value);
		if(builtin) return builtin;

		return ErrorObj.create("Unknown identifier:", [node.value]);
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

	public apply_function(fn: Obj, args: Obj[]): Obj{
		if(fn instanceof FunctionObj){
			const extendedEnv = this.extend_function_env(fn, args);
			envs.push(extendedEnv);
			const result = this.eval(fn.body, extendedEnv);
			return this.unwrap_return(result);
		}
		else if(fn instanceof BuiltinObj){
			return fn.fn(...args);
		}
		return ErrorObj.create("not a function:", [fn.type]);
	}
	
	private extend_function_env(fn: FunctionObj, args: Obj[]): Enviroment {
		const env = new Enviroment(fn.env);
		for(let i = 0; i < fn.parameters!.length; i++){
			env.set(fn.parameters![i].value, args[i]);
		}
		return env;
	}

	private eval_index_expression(left: Obj, index: Obj): Obj{
		if(left.type === ObjectType.ARRAY_OBJ && index.type === ObjectType.INTEGER_OBJ)
			return this.eval_array_index_expression(left, index);
		
		return ErrorObj.create(`index operator of type "${index.type}" not supported on type:`, [`"${left.type}"`]);
	}

	private eval_array_index_expression(left: Obj, index: Obj): Obj{
		const array = left as ArrayObj;
		const idx = index.value as number;
		const max_idx = array.elements.length - 1;

		if(idx < 0 || idx > max_idx) return NULL;

		return array.elements[idx];
	}

	private eval_member_expression(node: MemberExpression, env: Enviroment): Obj {
		const obj = this.eval(node.object, env);
		if(ErrorObj.isError(obj)) return obj;
		if(node.property instanceof CallExpression && node.property.caller instanceof Identifier){
			const property = obj.properties.get(node.property.caller.value);
			if(!property) 
				return ErrorObj.create(`Property named "${node.property.caller.value}" does not exist on type: ${obj.type}`, []);
			if(property instanceof Obj) 
				return ErrorObj.create(`"${node.property.caller.value}" is not a function. got:`, [property.type]);
;
			return property(obj, ...this.eval_expressions(node.property.arguments || [], env));
		}
		else if(node.property instanceof Identifier){
			const property = obj.properties.get(node.property.value) as Obj;
			if(!property) 
				return ErrorObj.create(`Property named "${node.property.value}" does not exist on type: ${obj.type}`, []);
			
			return property;
		}
		return NULL;
	}
	
	private unwrap_return(obj: Obj): Obj{
		if(obj instanceof ReturnObj)
			return obj.value;

		return obj;
	}

	/**
   * - NullObj is always falsy.
   * - BooleanObj returns its value.
   * - All other objects are considered truthy.
   */
	private is_truthy(obj: Obj): boolean{
		if(obj instanceof NullObj) return false;
		else if(obj instanceof BooleanObj) return obj.value;
		return true;
	}
}


export {
	Evaluator, 
	NULL,
}