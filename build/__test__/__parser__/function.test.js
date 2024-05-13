"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("../../interfaces/nodes");
const parser_1 = require("../../parser");
const helper_1 = require("./helper");
describe("Parser - Functions", () => {
    it("Should parse function parameters correctly", () => {
        var _a;
        const input = "f(x, y) { x + y }";
        const parser = new parser_1.Parser(input);
        const program = parser.parse_program();
        (0, helper_1.checkParserErrors)(parser);
        expect(program.statements.length).toBe(1); //expect it to have only one statement
        const statement = program.statements[0]; // get the first statement as an expression statement
        const function_statement = statement.expression;
        expect((_a = function_statement.parameters) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
        const body = function_statement.body;
        expect(body === null || body === void 0 ? void 0 : body.statements.length).toBe(1);
        const infix_expr = body === null || body === void 0 ? void 0 : body.statements[0];
        expect((0, helper_1.testInfixExpression)(infix_expr.expression, "x", "+", "y")).toBe(true);
    });
});
describe("Parser - Functions", () => {
    it("Should parse arrow functions correctly", () => {
        var _a;
        const input = "f(x, y) =>  x + y;";
        const parser = new parser_1.Parser(input);
        const program = parser.parse_program();
        (0, helper_1.checkParserErrors)(parser);
        expect(program.statements.length).toBe(1); //expect it to have only one statement
        const statement = program.statements[0]; // get the first statement as an expression statement
        const arrow_function = statement.expression;
        expect((_a = arrow_function.parameters) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
        const infix = arrow_function.body;
        expect((0, helper_1.testInfixExpression)(infix, "x", "+", "y")).toBe(true);
    });
});
describe("Parser - Function Parameter Parsing", () => {
    it("should parse function parameters correctly", () => {
        const tests = [
            { input: "f() {};", expectedParams: [] }, // No parameters
            { input: "f(x) {};", expectedParams: ["x"] }, // One parameter
            { input: "f(x, y, z) {};", expectedParams: ["x", "y", "z"] }, // Multiple parameters
        ];
        tests.forEach((tt) => {
            var _a;
            const parser = new parser_1.Parser(tt.input); // Create a parser using the lexer
            const program = parser.parse_program(); // Parse the program
            (0, helper_1.checkParserErrors)(parser); // Ensure no parsing errors occurred
            expect(program.statements.length).toBe(1); // Ensure there's one statement in the program
            const stmt = program.statements[0]; // Get the first statement
            const functionLiteral = stmt.expression; // Assert it's a FunctionLiteral
            // Check if the number of parameters matches the expected count
            expect((_a = functionLiteral.parameters) === null || _a === void 0 ? void 0 : _a.length).toBe(tt.expectedParams.length);
            // Check each expected parameter with its name
            tt.expectedParams.forEach((expectedParam, index) => {
                const identifier = functionLiteral.parameters[index];
                // Ensure the identifier's value matches the expected parameter name
                expect(identifier.value).toBe(expectedParam);
            });
        });
    });
});
describe("Parser - Call Expression Parsing", () => {
    it("should parse call expressions with correct function name and arguments", () => {
        var _a;
        const input = "add(1, 2 * 3, 4 + 5);";
        const parser = new parser_1.Parser(input);
        const program = parser.parse_program();
        (0, helper_1.checkParserErrors)(parser);
        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0];
        // Check if the statement is an expression statement
        expect(stmt).toBeInstanceOf(nodes_1.ExpressionStatement);
        const callExpression = stmt.expression; // Assert the expression is a CallExpression
        // Validate the function being called is an identifier "add"
        expect((0, helper_1.testIdentifier)(callExpression.caller, "add")).toBe(true);
        // Validate the correct number of arguments
        expect((_a = callExpression.arguments) === null || _a === void 0 ? void 0 : _a.length).toBe(3);
        // Test the individual arguments
        (0, helper_1.testLiteralExpression)(callExpression.arguments[0], 1); // First argument should be 1
        (0, helper_1.testInfixExpression)(callExpression.arguments[1], 2, "*", 3); // Second argument should be 2 * 3
        (0, helper_1.testInfixExpression)(callExpression.arguments[2], 4, "+", 5); // Third argument should be 4 + 5
    });
});
describe("Parser - Operator Precedence Parsing", () => {
    const tests = [
        {
            input: "a + add(b * c) + d",
            expected: "((a + add((b * c))) + d)",
        },
        {
            input: "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
            expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
        },
        {
            input: "add(a + b + c * d / t + g)",
            expected: "add((((a + b) + ((c * d) / t)) + g))",
        },
    ];
    tests.forEach((test) => {
        it(`should parse '${test.input}' with correct operator precedence`, () => {
            const parser = new parser_1.Parser(test.input); // Create a parser from the lexer
            const program = parser.parse_program(); // Parse the program into an AST
            (0, helper_1.checkParserErrors)(parser); // Check for parsing errors
            expect(program.statements.length).toBe(1); // Ensure there's one statement in the program
            const stmt = program.statements[0]; // Get the first statement
            const callExpression = stmt.expression; // Assert the expression is a CallExpression
            const actualString = callExpression.stringify(); // Get the string representation of the CallExpression
            // Validate the parsed expression's string representation against the expected output
            expect(actualString).toBe(test.expected);
        });
    });
});
describe("Parser - Def Statements", () => {
    const tests = [
        { input: "x = 5;", expectedIdentifier: "x", expectedValue: 5 },
        { input: "y = true;", expectedIdentifier: "y", expectedValue: true },
        { input: "foobar = y;", expectedIdentifier: "foobar", expectedValue: "y" },
    ];
    tests.forEach((test) => {
        it(`should parse def statement with identifier '${test.expectedIdentifier}' and value '${test.expectedValue}'`, () => {
            const parser = new parser_1.Parser(test.input);
            const program = parser.parse_program();
            (0, helper_1.checkParserErrors)(parser);
            expect(program.statements.length).toBe(1);
            const stmt = program.statements[0];
            const assign = stmt.expression;
            const left = assign.left;
            // Validate that it's a define statement with the expected identifier
            expect(left.value).toBe(test.expectedIdentifier);
            // Test the value of the let statement
            const value = assign.value; // Get the value from the define statement
            expect((0, helper_1.testLiteralExpression)(value, test.expectedValue)).toBe(true); // Check if the value matches the expected value
        });
    });
});
