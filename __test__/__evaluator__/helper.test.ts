import { Enviroment } from "../../src/enviroment";
import { Evaluator } from "../../src/evaluator";
import { ArrayObj, BooleanObj, ErrorObj, IntegerObj, NullObj, Obj, StringObj } from "../../src/interfaces/object";
import { Parser } from "../../src/parser";
import { checkParserErrors } from "../__parser__/helper.test";

// Function to test if an object is an IntegerObj with the expected value
export function testIntegerObject(obj: Obj | null, expected: number): boolean {
	if (!(obj instanceof IntegerObj)) { 
		console.error(`Object is not IntegerObj. Got: ${obj?.type}`);
		return false;
	}

	if (obj.value !== expected) {  // Check the integer value
		console.error(`IntegerObj has wrong value. Got: ${obj.value}, expected: ${expected}`);
		return false;
	}

	return true; 
}
 
export function testNullObject(obj: Obj | null): boolean {
	if (!(obj instanceof NullObj)) { 
		console.error(`Object is not NullObj. Got: ${obj?.type}`);
		return false;
	}

	return true; 
}

export function testBooleanObject(obj: Obj | null, expected: boolean): boolean {
	if (!(obj instanceof BooleanObj)) { 
		console.error(`Object is not BooleanObj. Got: ${obj?.type}`);
		return false;
	}

	if (obj.value !== expected) { 
		console.error(`BooleanObj has wrong value. Got: ${obj.value}, expected: ${expected}`);
		return false;
	}
	return true; 
}

export function testStringObject(obj: Obj | null, expected: string): boolean {
	if (!(obj instanceof StringObj)) { 
		console.error(`Object is not StringObj. Got: ${typeof obj?.type}`);
		return false;
	}

	if (obj.value !== expected) { 
		console.error(`StringObj has wrong value. Got: ${obj.value}, expected: ${expected}`);
		return false;
	}
	return true; 
}

export function testArrayObject(obj: Obj | null, expected: number[]): boolean {
	if (!(obj instanceof ArrayObj)) { 
		console.error(`Object is not ArrayObj. Got: ${obj?.type}`);
		return false;
	}
	const nums = obj.elements;
	expect(nums.length).toBe(expected.length);

	for(let i = 0; i < nums.length; i += 1){
		expect(typeof nums[i].value === 'number').toBe(true);

		if (nums[i].value !== expected[i]) {  // Check the integer value
			console.error(`ArrayObj has wrong value at index: ${i}, Got: ${obj.value}, expected: ${expected}`);
			return false;
		}
	}
	return true; 
}
 

// Function to test if an object is an ErrorObj with the expected value
export function testErrorObj(obj: Obj | null, expected: string): boolean {
	if (!(obj instanceof ErrorObj)) { 
		console.error(`Object is not ErrorObj. Got: ${obj?.type}`);
		return false;
	}

	if (obj.value !== expected) { 
		console.error(`Error message has wrong value. Got: ${obj.value}, expected: ${expected}`);
		return false;
	}
	return true; 
}

// Function to evaluate a string input
export function testEval(input: string): Obj | null {
	const parser = new Parser(input); 
	const program = parser.parse_program();
	const env = new Enviroment();
	checkParserErrors(parser);


	const evaluator = new Evaluator();
	return evaluator.eval(program, env);
}