"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../../interfaces/object");
const helper_1 = require("../__parser__/helper");
const helper_2 = require("./helper");
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
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testIntegerObject)(evaluated, test.expected)).toBe(true);
        });
    });
    testsBooleans.forEach((test) => {
        it(`should evaluate boolean expression '${test.input}' correctly`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testBooleanObject)(evaluated, test.expected)).toBe(true);
        });
    });
    testStrings.forEach((test) => {
        it(`should evaluate string expression '${test.input}' correctly`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testStringObject)(evaluated, test.expected)).toBe(true);
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
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testBooleanObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Minus Operator", () => {
    const tests = [
        { input: "5;", expected: 5 },
        { input: "10;", expected: 10 },
        { input: "-5;", expected: -5 },
        { input: "-10;", expected: -10 },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Arithmetic Infix Operator", () => {
    const tests = [
        { input: "5;", expected: 5 },
        { input: "10;", expected: 10 },
        { input: "-5", expected: -5 },
        { input: "-10", expected: -10 },
        { input: "5 + 5 + 5 + 5 - 10", expected: 10 },
        { input: "2 * 2 * 2 * 2 * 2", expected: 32 },
        { input: "-50 + 100 + -50", expected: 0 },
        { input: "5 * 2 + 10", expected: 20 },
        { input: "5 + 2 * 10", expected: 25 },
        { input: "20 + 2 * -10", expected: 0 },
        { input: "50 / 2 * 2 + 10", expected: 60 },
        { input: "2 * (5 + 10)", expected: 30 },
        { input: "3 * 3 * 3 + 10", expected: 37 },
        { input: "3 * (3 * 3) + 10", expected: 37 },
        { input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50 },
        { input: "(15 % 4) * 3", expected: 9 },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - String concatenation", () => {
    const tests = [
        { input: "\"Maxwell\" + \" The\" + \" King\"", expected: "Maxwell The King" },
        { input: "\"Dor\" + \" \" +  \"Or\" + \" \" + \"Shmenim\"", expected: "Dor Or Shmenim" }
    ];
    tests.forEach((test) => {
        it(`Should evaluate ${test.input} to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testStringObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Array Literals", () => {
    const tests = [
        { input: "[1, 2, 3 ** 2]", expected: [1, 2, 9] },
        { input: "foo = 5; [foo]", expected: [5] },
    ];
    tests.forEach((test) => {
        it(`Should evaluate ${test.input} to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            if (!(evaluated instanceof object_1.ArrayObj)) {
                console.error("expected ArrayObj instead got: " + (evaluated === null || evaluated === void 0 ? void 0 : evaluated.type));
                return;
            }
            evaluated.elements.forEach((elem, i) => {
                const result = (0, helper_2.testIntegerObject)(elem, test.expected[i]);
                expect(result).toBe(true);
            });
        });
    });
});
describe("Evaluator - Boolean Infix Operator", () => {
    const tests = [
        { input: "true;", expected: true },
        { input: "false;", expected: false },
        { input: "1 < 2", expected: true },
        { input: "1 > 2", expected: false },
        { input: "1 < 1", expected: false },
        { input: "1 > 1", expected: false },
        { input: "1 == 1", expected: true },
        { input: "1 != 1", expected: false },
        { input: "1 == 2", expected: false },
        { input: "1 != 2", expected: true },
        { input: "true == true", expected: true },
        { input: "false == false", expected: true },
        { input: "true == false", expected: false },
        { input: "true != false", expected: true },
        { input: "false != true", expected: true },
        { input: "(1 < 2) == true", expected: true },
        { input: "(1 < 2) == false", expected: false },
        { input: "(1 > 2) == true", expected: false },
        { input: "(1 > 2) == false", expected: true },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testBooleanObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - If Else Expressions", () => {
    const tests = [
        { input: "if (true) { 10 }", expected: 10 },
        { input: "if (false) { 10 }", expected: null },
        { input: "if (1) { 10 }", expected: 10 },
        { input: "if (1 < 2) { 10 }", expected: 10 },
        { input: "if (1 > 2) { 10 }", expected: null },
        { input: "if (1 > 2) { 10 } else { 20 }", expected: 20 },
        { input: "if (1 < 2) { 10 } else { 20 }", expected: 10 },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            let result;
            if (test.expected === null)
                result = (0, helper_2.testNullObject)(evaluated);
            else
                result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Return Statements", () => {
    const tests = [
        { input: "return 10;", expected: 10 },
        { input: "return 10; 9;", expected: 10 },
        { input: "return 2 * 5; 9;", expected: 10 },
        { input: "9; return 2 * 5; 9;", expected: 10 },
        { input: `if (10 > 1) {
					if (10 > 1) {
						return 10;
					}
					129
					return 1; 
				}`, expected: 10 }
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Test Error Object and Error messages", () => {
    const tests = [
        { input: "shamenboy;", expected: "Unknown identifier: shamenboy" },
        { input: "5 + true;", expected: "Invalid operation on operands tryin: integer + boolean" },
        { input: "5 + true; 5;", expected: "Invalid operation on operands tryin: integer + boolean" },
        { input: "-true", expected: "Unknown operator: -boolean" },
        { input: "true + false;", expected: "Unknown operator: boolean + boolean" },
        { input: "5; true + false; 5", expected: "Unknown operator: boolean + boolean" },
        { input: "\"Shamen\" / \"Boy\";", expected: "Unknown operator: string / string" },
        { input: "if (10 > 1) { true + false; }", expected: "Unknown operator: boolean + boolean" },
        { input: `
					if (10 > 1) {
						if (10 > 1) {
							return true + false;
						}
						return 1; 
					}
			`, expected: "Unknown operator: boolean + boolean" }
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testErrorObj)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Test Def statements", () => {
    const tests = [
        { input: "a = 5; a;", expected: 5 },
        { input: "a = 5 * 5; a;", expected: 25 },
        { input: "a = 5; b = a; b;", expected: 5 },
        { input: "a = 5; b = a; c = a + b + 5; c;", expected: 15 },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Function Object Tests", () => {
    it("should evaluate and validate a function object", () => {
        var _a, _b;
        const input = "f(x) { x + 2; }"; // Function declaration
        const arrowfunction = "f(x) => x ** 2;"; // Function declaration
        const evaluated = (0, helper_2.testEval)(input); // Evaluate the function
        const evaluatedArrow = (0, helper_2.testEval)(arrowfunction); // Evaluate the function
        // Ensure the evaluated object is a FunctionObj
        expect(evaluated === null || evaluated === void 0 ? void 0 : evaluated.type).toBe(object_1.ObjectType.FUNCTION_OBJ);
        expect(evaluatedArrow === null || evaluatedArrow === void 0 ? void 0 : evaluatedArrow.type).toBe(object_1.ObjectType.FUNCTION_OBJ);
        const fn = evaluated;
        const arrowfn = evaluatedArrow;
        // Check if the function has exactly one parameter
        expect((_a = fn.parameters) === null || _a === void 0 ? void 0 : _a.length).toBe(1);
        expect((_b = arrowfn.parameters) === null || _b === void 0 ? void 0 : _b.length).toBe(1);
        // Validate that the parameter is 'x'
        const param = fn.parameters[0];
        const arrowParam = arrowfn.parameters[0];
        expect(param.stringify()).toBe("x");
        expect(arrowParam.stringify()).toBe("x");
        // Expected body content
        const expectedBody = fn.body;
        const expr_stmnt = expectedBody.statements[0];
        expect((0, helper_1.testInfixExpression)(expr_stmnt.expression, "x", "+", 2)).toBe(true);
        expect((0, helper_1.testInfixExpression)(arrowfn.body, "x", "**", 2)).toBe(true);
    });
});
describe("Evaluator - Test Call Expressions", () => {
    const tests = [
        { input: "identity = f(x) { x; }; identity(5);", expected: 5 },
        { input: "identity = f(x) { return x; }; identity(5);", expected: 5 },
        { input: "double = f(x) { x * 2; }; double(5);", expected: 10 },
        { input: "add = f(x, y) { x + y; }; add(5, 5);", expected: 10 },
        { input: "add = f(x, y) { x + y; }; add(5 + 5, add(5, 5));", expected: 20 },
        { input: "f(x) { x; }(5)", expected: 5 }
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Test Closure", () => {
    const tests = [
        { input: `
		newAdder = f(x) {
		  f(y) { x + y };
		};
		addTwo = newAdder(2);
		addTwo(2);`, expected: 4 }
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            const result = (0, helper_2.testIntegerObject)(evaluated, test.expected);
            expect(result).toBe(true);
        });
    });
});
describe("Evaluator - Test Builtin Functions", () => {
    const tests = [
        { input: `len("")`, expected: 0 },
        { input: `len("DorTheShamen")`, expected: 12 },
        { input: `len("iliaboy")`, expected: 7 },
        { input: `len(1)`, expected: "Unsupported argument to `len`, got: integer" },
        { input: `len("shamen", "boy", "man")`, expected: "Invalid argument count `len` takes 1, got: 3" },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            if (typeof test.expected === 'number') {
                expect((0, helper_2.testIntegerObject)(evaluated, Number(test.expected))).toBe(true);
            }
            else {
                expect((0, helper_2.testErrorObj)(evaluated, String(test.expected))).toBe(true);
            }
        });
    });
});
describe("Evaluator - Test Index Expressions", () => {
    const tests = [
        { input: "i = 0; [1][i];", expected: 1 },
        { input: "[1, 2, 3][1 + 1];", expected: 3 },
        { input: "myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];", expected: 6 },
        { input: "[1, 2, 3][3]", expected: "index out of range " },
        { input: "[1, 2, 3][-1]", expected: "index out of range " }
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            if (typeof test.expected === 'number') {
                expect((0, helper_2.testIntegerObject)(evaluated, Number(test.expected))).toBe(true);
            }
            else {
                expect((0, helper_2.testErrorObj)(evaluated, test.expected)).toBe(true);
            }
        });
    });
});
describe("Evaluator - Test Member Expressions", () => {
    const tests = [
        { input: "arr = [1, 2, 3]; arr.push(4); arr;", expected: [1, 2, 3, 4] },
        { input: "[1, 2, 3].filter(f(x) => x % 2 == 0)", expected: [2] },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testArrayObject)(evaluated, test.expected)).toBe(true);
        });
    });
});
describe("Evaluator - Test Logical Expressions", () => {
    const tests = [
        { input: "not true and false", expected: false },
        { input: "true and true == true and not false", expected: true },
        { input: "5*3 == 15 and 10 + 5 == 15", expected: true },
    ];
    tests.forEach((test) => {
        it(`should evaluate '${test.input}' to ${test.expected}`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testBooleanObject)(evaluated, test.expected)).toBe(true);
        });
    });
});
describe("Parser - Assignment Expressions", () => {
    const tests = [
        { input: "foobar = { key: 5 }; foobar.key = 10; foobar.key;", expectedValue: 10 },
        { input: "arr = [1,2,3]; arr[0] = 5; arr[0];", expectedValue: 5 },
    ];
    tests.forEach((test) => {
        it(`should evaluate assignment expression with member expr: '${test.expectedValue}'`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testIntegerObject)(evaluated, test.expectedValue)).toBe(true); // Check if the value matches the expected value
        });
    });
});
describe("Parser - While Statements", () => {
    const tests = [
        { input: "x = 0; i = 0; while(i < 5) { x = x + 1; i = i + 1;}; x;", expectedIdentifier: "x", expectedValue: 5 },
    ];
    tests.forEach((test) => {
        it(`should evaluate while statement: '${test.expectedValue}'`, () => {
            const evaluated = (0, helper_2.testEval)(test.input);
            expect((0, helper_2.testIntegerObject)(evaluated, test.expectedValue)).toBe(true); // Check if the value matches the expected value
        });
    });
});
