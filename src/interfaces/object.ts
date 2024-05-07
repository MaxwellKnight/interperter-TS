import { Enviroment } from "../enviroment";
import { NULL } from "../evaluator";
import { BlockStatement, Expression, ExpressionStatement, Identifier } from "./nodes";

export enum ObjectType {
	INTEGER_OBJ = "integer",
	STRING_OBJ = "string",
	BOOLEAN_OBJ = "boolean",
	RETURN_OBJ = "return",
	FUNCTION_OBJ = "function",
	ARRAY_OBJ = "array",
	BUILTIN_OBJ = "builtin",
	ERROR_OBJ = "error",
	NULL_OBJ = "null"
}
export type ObjectValue = number | string | boolean | Obj
export type BuiltinFunction = (...args: Obj[]) => Obj
export type MemberFunction = (self: Obj, ...args: Obj[]) => Obj;

// Base class for all objects in the interpreter
export abstract class Obj {
	type: ObjectType; // Type of the object
	value!: ObjectValue;
	properties: Map<ObjectValue, Obj | MemberFunction>;

	constructor(type: ObjectType){
		this.properties = new Map<ObjectValue, Obj>;
		this.type = type;
	}

	//return a string representation of the object
	public abstract stringify(): string;
}

export class IntegerObj extends Obj {
	value: number;
	constructor(value: number){
		super(ObjectType.INTEGER_OBJ);
		this.value = value;
	}
	
	public stringify(): string { return `${this.value}`; }
}

export class StringObj extends Obj {
	value: string;
	constructor(value: string){
		super(ObjectType.STRING_OBJ);
		this.value = value;
	}
	
	public stringify(): string { return `"${this.value}"`; }
}

export class BooleanObj extends Obj {
	value: boolean;
	constructor(value: boolean){
		super(ObjectType.BOOLEAN_OBJ);
		this.value = value;
	}
	
	public stringify(): string { return `${this.value}`; }
}

export class ReturnObj extends Obj {
	value: Obj;
	constructor(value: Obj){
		super(ObjectType.RETURN_OBJ);
		this.value = value;
	}

	public stringify(): string { return this.value.stringify(); }
}

export class NullObj extends Obj {
	constructor(){
		super(ObjectType.NULL_OBJ);
	}
	
	public stringify(): string { return "null"; }
}

export class ArrayObj extends Obj {
	elements: Obj[];

	constructor(elements: Obj[]){
		super(ObjectType.ARRAY_OBJ);
		this.elements = elements;
		this.properties.set('push', ArrayObj.push);
	}

	public stringify(): string { 
		return `[${this.elements.map(obj => obj.stringify()).join(", ")}]`; 
	};

	static push(self: Obj, ...args: Obj[]): Obj  {
		if(!(self instanceof ArrayObj)) {
			return ErrorObj.create("first argument to push must be of type `array` got:", [self.type])
		}
		if(args.length != 1){
			return ErrorObj.create("Invalid argument count `push` takes 1, got:", [String(args.length)]);
		}	
		
		return new ArrayObj([...self.elements, args[0]]);
	}
}

export class FunctionObj extends Obj {
	parameters: Identifier[] | null;
	body: BlockStatement | Expression | null;
	env: Enviroment | null;

	constructor(){
		super(ObjectType.FUNCTION_OBJ);
		this.parameters = [];
		this.body = null;
		this.env = null;
	}

	public stringify(): string {
		return `f(${this.parameters?.map((param) => param.stringify())} {\n ${this.body?.stringify()} \n})`
	}
}

export class BuiltinObj extends Obj {
	fn: BuiltinFunction;

	constructor(fn: BuiltinFunction){
		super(ObjectType.BUILTIN_OBJ);
		this.fn = fn;
	}

	public stringify(): string { return `builtin function ${this.type}`; }
}

export class ErrorObj extends Obj {
	value: string;

	constructor(message: string){
		super(ObjectType.ERROR_OBJ);
		this.value = message;
	}

	static create(error: string, messages: string[]): ErrorObj{
		return new ErrorObj(`${error} ${messages.join(" ")}`);
	}

	static isError(obj: Obj): boolean {
		return obj.type === ObjectType.ERROR_OBJ;
	}

	public stringify(): string { return `ERROR: ${this.value}`; }
}
