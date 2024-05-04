import { BlockStatement, InfixExpression } from "../../src/interfaces/nodes";
import { FunctionObj, ObjectType } from "../../src/interfaces/object";
import { testInfixExpression } from "../__parser__/helper.test";
import { testIntegerObject, testBooleanObject, testEval, testNullObject, testErrorObj, testStringObject } from "./helper.test";

describe("Evaluator - Integer, Boolean and String Expression Evaluation", () => {
	// Define the test cases
	const testsIntegers = [
		{ input: "5;", expected: 5 },
		{ input: "10;", expected: 10 },
	];
	const testsBooleans = [
		{ input: "true;", expected: true },
		{ input: "false;", expected: false },
	];
	const testStrings = [
		{ input: "\"true;\";", expected: "true;" },
		{ input: "\"pj script\n\t\";", expected: "pj script\n\t" },
	];


	testsIntegers.forEach((test) => {
		it(`should evaluate integer expression '${test.input}' correctly`, () => {
		const evaluated = testEval(test.input);  
		expect(testIntegerObject(evaluated, test.expected)).toBe(true); 
		});
	});

	testsBooleans.forEach((test) => {
		it(`should evaluate boolean expression '${test.input}' correctly`, () => {
		const evaluated = testEval(test.input);  
		expect(testBooleanObject(evaluated, test.expected)).toBe(true); 
		});
	});

	testStrings.forEach((test) => {
		it(`should evaluate string expression '${test.input}' correctly`, () => {
		const evaluated = testEval(test.input);  
		expect(testStringObject(evaluated, test.expected)).toBe(true); 
		});
	});
});

describe("Evaluator - Bang Operator", () => {
	const tests = [
		{ input: "!true", expected: false },
		{ input: "!false", expected: true },
		{ input: "!5", expected: false },
		{ input: "!!true", expected: true },
		{ input: "!!false", expected: false },
		{ input: "!!5", expected: true },
	];

	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testBooleanObject(evaluated, test.expected);  
			expect(result).toBe(true);  
		});
	});
 });

describe("Evaluator - Minus Operator", () => {
	const tests = [
		{input: "5;", expected: 5},
		{input: "10;", expected: 10},
		{input: "-5;", expected: -5},
		{input: "-10;", expected: -10},
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testIntegerObject(evaluated, test.expected);  
			expect(result).toBe(true);  
		});
	});
});
describe("Evaluator - Arithmetic Infix Operator", () => {
	const tests = [
		{input: "5;",expected:  5},
		{input: "10;", expected: 10},
		{input: "-5", expected: -5},
		{input: "-10", expected: -10},
		{input: "5 + 5 + 5 + 5 - 10", expected: 10},
		{input: "2 * 2 * 2 * 2 * 2", expected: 32},
		{input: "-50 + 100 + -50",expected:  0},
		{input: "5 * 2 + 10", expected: 20},
		{input: "5 + 2 * 10", expected: 25},
		{input: "20 + 2 * -10",expected:  0},
		{input: "50 / 2 * 2 + 10", expected: 60},
		{input: "2 * (5 + 10)", expected: 30},
		{input: "3 * 3 * 3 + 10", expected: 37},
		{input: "3 * (3 * 3) + 10", expected: 37},
		{input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50},
		{input: "(15 % 4) * 3", expected: 9},
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testIntegerObject(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});

describe("Evaluator - Boolean Infix Operator", () => {
	const tests = [
		{input: "true;", expected: true},
		{input: "false;", expected: false},
		{input: "1 < 2", expected: true},
		{input: "1 > 2", expected: false},
		{input: "1 < 1", expected: false},
		{input: "1 > 1", expected: false},
		{input: "1 == 1", expected: true},
		{input: "1 != 1", expected: false},
		{input: "1 == 2", expected: false},
		{input: "1 != 2", expected: true},
		{input: "true == true", expected: true},
		{input: "false == false", expected: true},
		{input: "true == false", expected: false},
		{input: "true != false", expected: true},
		{input: "false != true", expected: true},
		{input: "(1 < 2) == true", expected: true},
		{input: "(1 < 2) == false", expected: false},
		{input: "(1 > 2) == true", expected: false},
		{input: "(1 > 2) == false", expected: true},
	];

	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testBooleanObject(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});

describe("Evaluator - If Else Expressions", () => {
	const tests = [
		{input: "if (true) { 10 }", expected: 10},
		{input: "if (false) { 10 }", expected: null},
		{input: "if (1) { 10 }", expected: 10},
		{input: "if (1 < 2) { 10 }", expected: 10},
		{input: "if (1 > 2) { 10 }", expected: null},
		{input: "if (1 > 2) { 10 } else { 20 }", expected: 20},
		{input: "if (1 < 2) { 10 } else { 20 }", expected: 10},
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			let result: boolean;
			if(test.expected === null)
				result = testNullObject(evaluated);
			else result = testIntegerObject(evaluated, test.expected); 

			expect(result).toBe(true);  
		});
	});
});

describe("Evaluator - Return Statements", () => {
	const tests = [
		{input: "return 10;", expected: 10},
		{input: "return 10; 9;", expected: 10},
		{input: "return 2 * 5; 9;", expected: 10},
		{input: "9; return 2 * 5; 9;", expected: 10},
		{input: 
				`if (10 > 1) {
					if (10 > 1) {
						return 10;
					}
					129
					return 1; 
				}`, expected: 10}
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testIntegerObject(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});

describe("Evaluator - Test Error Object and Error messages", () => {
	const tests = [
		{input: "shamenboy;", expected: "Unknown identifier: shamenboy"},
		{input: "5 + true;", expected: "Invalid operation on operands tryin: integer + boolean"},
		{input: "5 + true; 5;", expected: "Invalid operation on operands tryin: integer + boolean"},
		{input: "-true", expected: "Unknown operator: -boolean"},
		{input: "true + false;", expected: "Unknown operator: boolean + boolean"}, 
		{input: "5; true + false; 5", expected: "Unknown operator: boolean + boolean"},
		{input: "if (10 > 1) { true + false; }", expected: "Unknown operator: boolean + boolean"},
		{input: `
					if (10 > 1) {
						if (10 > 1) {
							return true + false;
						}
						return 1; 
					}
			`, expected: "Unknown operator: boolean + boolean"}
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testErrorObj(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});

describe("Evaluator - Test Def statements", () => {
	const tests = [
		{input: "def a = 5; a;", expected: 5},
		{input: "def a = 5 * 5; a;", expected: 25},
		{input: "def a = 5; def b = a; b;", expected: 5},
		{input: "def a = 5; def b = a; def c = a + b + 5; c;", expected: 15}, 
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testIntegerObject(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});

describe("Function Object Tests", () => {
	it("should evaluate and validate a function object", () => {
		const input = "f(x) { x + 2; };";  // Function declaration
		const evaluated = testEval(input);  // Evaluate the function

		// Ensure the evaluated object is a FunctionObj
		expect(evaluated?.type).toBe(ObjectType.FUNCTION_OBJ);

		const fn = evaluated as FunctionObj;

		// Check if the function has exactly one parameter
		expect(fn.parameters?.length).toBe(1);

		// Validate that the parameter is 'x'
		const param = fn.parameters![0];
		expect(param.stringify()).toBe("x");

		// Expected body content
		const expectedBody = fn.body as BlockStatement;
		const expression = expectedBody.statements[0] as InfixExpression;  // This is a simplified string representation of the body
		testInfixExpression(expression, "x", "+", "2");
	});
});

describe("Evaluator - Test Call Expressions", () => {
	const tests = [
		{input: "def identity = f(x) { x; }; identity(5);", expected: 5},
		{input: "def identity = f(x) { return x; }; identity(5);", expected: 5},
		{input: "def double = f(x) { x * 2; }; double(5);", expected: 10},
		{input: "def add = f(x, y) { x + y; }; add(5, 5);", expected: 10}, 
		{input: "def add = f(x, y) { x + y; }; add(5 + 5, add(5, 5));", expected: 20},
		{input: "f(x) { x; }(5)", expected: 5}
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testIntegerObject(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});

describe("Evaluator - Test Closure", () => {
	const tests = [
		{input: `
		def newAdder = f(x) {
		  f(y) { x + y };
		};
		def addTwo = newAdder(2);
		addTwo(2);`, expected: 4}
	];
 
	tests.forEach((test) => {
		it(`should evaluate '${test.input}' to ${test.expected}`, () => {
			const evaluated = testEval(test.input);  
			const result = testIntegerObject(evaluated, test.expected); 
			expect(result).toBe(true);  
		});
	});
});
