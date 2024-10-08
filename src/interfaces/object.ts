import { Environment } from "../environment";
import { Evaluator } from "../evaluator";
import { BlockStatement, Expression, Identifier } from "./nodes";

export enum ObjectType {
	INTEGER_OBJ = "integer",
	STRING_OBJ = "string",
	BOOLEAN_OBJ = "boolean",
	RETURN_OBJ = "return",
	BREAK_OBJ = "break",
	FUNCTION_OBJ = "function",
	ARRAY_OBJ = "array",
	OBJECT_OBJ = "object",
	BUILTIN_OBJ = "builtin",
	ERROR_OBJ = "error",
	NULL_OBJ = "null"
}
export type ObjectValue = number | string | boolean | Obj
export type BuiltinFunction = (...args: Obj[]) => Obj
export type MemberFunction = (self: Obj, ...args: Obj[]) => Obj;

export abstract class Obj {
	type: ObjectType;
	value!: ObjectValue;
	properties: Map<ObjectValue, Obj | MemberFunction>;

	constructor(type: ObjectType) {
		this.properties = new Map<ObjectValue, Obj>;
		this.type = type;
	}

	public abstract stringify(): string;
}

export class ObjectObj extends Obj {
	constructor(type: ObjectType) {
		super(type);
		this.value = true;
	}

	public stringify(): string {
		const properties: string[][] = [];
		this.properties.forEach((value, key) => {
			if (typeof value === 'function')
				properties.push([`<function ${key}>`, key.toString()]);
			if (value instanceof Obj) properties.push([value.stringify(), key.toString()]);
		})
		return `{ ${properties.map(elem => `${elem[1]}${': ' + (elem[0] ? elem[0] : 'null')}`).join(", ")} }`;
	}
}

export class IntegerObj extends Obj {
	value: number;
	constructor(value: number) {
		super(ObjectType.INTEGER_OBJ);
		this.value = value;
	}

	public stringify(): string { return `${this.value}`; }
}

export class StringObj extends Obj {
	value: string;
	constructor(value: string) {
		super(ObjectType.STRING_OBJ);
		this.value = value;
		this.properties.set('split', StringObj.split);
		this.properties.set('strip', StringObj.strip);
		this.properties.set('into_int', StringObj.into_int);
		this.properties.set('is_numeric', StringObj.is_numeric);
	}

	static strip(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof StringObj)) {
			return ErrorObj.create("first argument to `strip` must be of type `string` got:", [self.type])
		}
		if (args.length != 0) {
			return ErrorObj.create("Invalid argument count `split` takes 0, got:", [String(args.length)]);
		}
		return new StringObj(self.value.replace(/\s/g, ''));
	}

	static split(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof StringObj)) {
			return ErrorObj.create("first argument to `split` must be of type `string` got:", [self.type])
		}
		if (args.length != 1) {
			return ErrorObj.create("Invalid argument count `split` takes 1, got:", [String(args.length)]);
		}
		if (!(args[0] instanceof StringObj)) {
			return ErrorObj.create("Invalid argument to `split` takes `string`, got:", [args[0].type]);
		}
		const values = self.value.split(args[0].value).map(v => new StringObj(v));
		return new ArrayObj(values);
	}

	static into_int(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof StringObj)) {
			return ErrorObj.create("first argument to `try_parse` must be of type `string`, got: ", [self.type]);
		}
		if (args.length != 0) {
			return ErrorObj.create("Invalid argument count `is_numeric` takes 0, got:", [String(args.length)]);
		}
		if (isNaN(Number(self.value))) {
			return ErrorObj.create("Cannot parse to a number, value contains non number values: ", [self.value]);
		}

		return new IntegerObj(Number(self.value));
	}

	static is_numeric(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof StringObj)) {
			return ErrorObj.create("first argument to `is_numeric` must be of type `string`, got: ", [self.type]);
		}
		if (args.length != 0) {
			return ErrorObj.create("Invalid argument count `is_numeric` takes 0, got:", [String(args.length)]);
		}
		if (isNaN(Number(self.value))) {
			return new BooleanObj(false);
		}

		return new BooleanObj(true);
	}

	public stringify(): string { return `'${this.value}'`; }
}

export class BooleanObj extends Obj {
	value: boolean;
	constructor(value: boolean) {
		super(ObjectType.BOOLEAN_OBJ);
		this.value = value;
	}

	public stringify(): string { return `${this.value}`; }
}

export class ReturnObj extends Obj {
	value: Obj;
	constructor(value: Obj) {
		super(ObjectType.RETURN_OBJ);
		this.value = value;
	}

	public stringify(): string { return `return ${this.value.stringify()}`; }
}

export class BreakObj extends Obj {
	constructor() {
		super(ObjectType.BREAK_OBJ);
	}

	public stringify(): string { return `break`; }
}

export class NullObj extends Obj {
	constructor() {
		super(ObjectType.NULL_OBJ);
		this.value = false;
	}

	public stringify(): string { return "null"; }
}

export class ArrayObj extends Obj {
	elements: Obj[];

	constructor(elements: Obj[]) {
		super(ObjectType.ARRAY_OBJ);
		this.elements = elements;
		this.properties.set('push', ArrayObj.push);
		this.properties.set('pop', ArrayObj.pop);
		this.properties.set('dequeue', ArrayObj.dequeue);
		this.properties.set('filter', ArrayObj.filter);
		this.properties.set('map', ArrayObj.map);
		this.properties.set('reduce', ArrayObj.reduce);
		this.properties.set('slice', ArrayObj.slice);
	}

	public stringify(): string {
		return `[${this.elements.map(obj => obj.stringify()).join(", ")}]`;
	};

	static push(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj)) {
			return ErrorObj.create("first argument to `push` must be of type `array` got:", [self.type])
		}
		if (args.length != 1) {
			return ErrorObj.create("Invalid argument count `push` takes 1, got:", [String(args.length)]);
		}

		self.elements.push(args[0]);
		return NULL;
	}

	static pop(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj)) {
			return ErrorObj.create("first argument to `pop` must be of type `array` got:", [self.type])
		}
		if (args.length != 0) {
			return ErrorObj.create("Invalid argument count `pop` takes 0, got:", [String(args.length)]);
		}
		if (self.elements.length == 0) {
			return ErrorObj.create("Cannot pop from an empty array", []);
		}

		const elem = self.elements.pop();
		if (!elem) return NULL;

		return elem;
	}

	static dequeue(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj)) {
			return ErrorObj.create("first argument to `dequeue` must be of type `array` got:", [self.type])
		}
		if (args.length != 0) {
			return ErrorObj.create("Invalid argument count `dequeue` takes 0, got:", [String(args.length)]);
		}
		if (self.elements.length == 0) {
			return ErrorObj.create("Cannot pop from an empty array", []);
		}

		const elem = self.elements.shift();
		if (!elem) return NULL;

		return elem;
	}

	static filter(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj)) {
			return ErrorObj.create("first argument to `filter` must be of type `array` got:", [self.type])
		}
		if (args.length != 1) {
			return ErrorObj.create("Invalid argument count `filter` takes 1, got:", [String(args.length)]);
		}

		if (args[0].type !== ObjectType.FUNCTION_OBJ) return ErrorObj.create("`filter` takes a function as argument", []);

		const evaluator = new Evaluator();
		const result: Obj[] = [];
		for (let i = 0; i < self.elements.length; i += 1) {
			const ans = evaluator.apply_function(args[0], [self.elements[i]]);
			if (ans.type !== ObjectType.BOOLEAN_OBJ) {
				return ErrorObj.create("function to `filter` must return a boolean.", []);
			}
			if (ans.value) result.push(self.elements[i]);
		}

		return new ArrayObj(result);
	}

	static map(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj)) {
			return ErrorObj.create("first argument to `map` must be of type `array` got:", [self.type])
		}
		if (args.length != 1) {
			return ErrorObj.create("Invalid argument count `map` takes 1, got:", [String(args.length)]);
		}

		if (args[0].type !== ObjectType.FUNCTION_OBJ) return ErrorObj.create("`map` takes a function as argument", []);

		const evaluator = new Evaluator();
		const result: Obj[] = [];
		for (let i = 0; i < self.elements.length; i += 1) {
			const ans = evaluator.apply_function(args[0], [self.elements[i]]);
			result.push(ans);
		}

		return new ArrayObj(result);
	}

	static reduce(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj))
			return ErrorObj.create('First argument to `reduce` must be of type `array`, got:', [self.type]);

		if (args.length < 1 || args.length > 2)
			return ErrorObj.create('Invalid argument count `reduce` takes 1 or 2, got:', [String(args.length)]);


		const reducer = args[0];
		if (reducer.type !== ObjectType.FUNCTION_OBJ)
			return ErrorObj.create('`reduce` requires a reducer function as the first argument', []);

		let accumulator: Obj;
		if (args.length === 2) accumulator = args[1];
		else accumulator = self.elements[0];

		const evaluator = new Evaluator();
		const startIndex = args.length === 2 ? 0 : 1;

		for (let i = startIndex; i < self.elements.length; i += 1)
			accumulator = evaluator.apply_function(reducer, [accumulator, self.elements[i]]);

		return accumulator;
	}

	static slice(self: Obj, ...args: Obj[]): Obj {
		if (!(self instanceof ArrayObj)) {
			return ErrorObj.create("First argument to `slice` must be of type `array`, got:", [self.type]);
		}

		let start = 0;
		let end = self.elements.length;

		if (args.length === 0) return new ArrayObj([...self.elements]);

		if (args.length > 0) {
			const startArg = args[0];
			if (startArg instanceof IntegerObj) start = startArg.value;
			else return ErrorObj.create("`slice` expects integer arguments for start.", []);
		}

		if (args.length > 1) {
			const endArg = args[1];
			if (endArg instanceof IntegerObj) end = endArg.value;
			else return ErrorObj.create("`slice` expects integer arguments for end.", []);
		}

		if (start < 0) start = Math.max(0, self.elements.length + start);
		if (end < 0) end = Math.max(0, self.elements.length + end);

		start = Math.min(self.elements.length, start);
		end = Math.min(self.elements.length, end);

		if (start >= end) return new ArrayObj([]);

		const slicedElements = self.elements.slice(start, end);
		return new ArrayObj(slicedElements);
	}

}

export class FunctionObj extends Obj {
	parameters: Identifier[] | null;
	body: BlockStatement | Expression | null;
	env: Environment | null;

	constructor() {
		super(ObjectType.FUNCTION_OBJ);
		this.parameters = [];
		this.body = null;
		this.env = null;
	}

	public stringify(level = 0): string {
		const body = this.body instanceof Expression ? `=> ${this.body.stringify()}` : `{\n${this.body?.stringify()} \n}`
		return `f(${this.parameters?.map((param) => param.stringify(level + 1))}) ${body} `
	}
}

export class BuiltinObj extends Obj {
	fn: BuiltinFunction;
	name: string

	constructor(fn: BuiltinFunction, name: string = "") {
		super(ObjectType.BUILTIN_OBJ);
		this.fn = fn;
		this.name = "`" + name + "`";
	}

	public stringify(): string { return `<builtin function ${this.name}>`; }
}

export class ErrorObj extends Obj {
	value: string;

	constructor(message: string) {
		super(ObjectType.ERROR_OBJ);
		this.value = message;
	}

	static create(error: string, messages: string[]): ErrorObj {
		return new ErrorObj(`${error} ${messages.join(" ")}`);
	}

	static isError(obj: Obj): boolean {
		return obj.type === ObjectType.ERROR_OBJ;
	}

	public stringify(): string { return `RuntimeError: ${this.value}`; }
}

export const TRUE = new BooleanObj(true);
export const FALSE = new BooleanObj(false);
export const NULL = new NullObj();

