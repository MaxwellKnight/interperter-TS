"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/expression.test.ts
const parser_1 = require("../../parser");
const nodes_1 = require("../../interfaces/nodes");
const helper_1 = require("./helper");
describe("Parser - Identifier Expression", () => {
    it("should parse a simple identifier expression", () => {
        const source = "foobar;\n";
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const identifier = expressionStatement.expression;
        expect(identifier.value).toBe("foobar");
    });
});
describe("Parser - Integer Literal Expression", () => {
    it("should parse a simple integer literal expression", () => {
        const source = "25;\n";
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const integerLiteral = expressionStatement.expression;
        expect(integerLiteral.value).toBe(25);
    });
});
describe("Parser - String Literal Expression", () => {
    it("should parse a simple string literal expression", () => {
        const source = `"shamenboy the man";\n`;
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const stringLiteral = expressionStatement.expression;
        expect(stringLiteral.value).toBe("shamenboy the man");
    });
});
describe("Parser - Array Literal Expression", () => {
    it("should parse an array literal expression", () => {
        var _a;
        const source = `[1, 2, 3 ** 4];\n`;
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const arrayLiteral = expressionStatement.expression;
        if (!(expressionStatement.expression instanceof nodes_1.ArrayLiteral)) {
            console.error("object is not ArrayLiteral, got: " + ((_a = expressionStatement.expression) === null || _a === void 0 ? void 0 : _a.stringify()));
            return;
        }
        if (arrayLiteral.elements.length != 3) {
            console.error("array size mismatch, expected 3, got: " + String(arrayLiteral.elements.length));
            return;
        }
        (0, helper_1.testLiteralExpression)(arrayLiteral.elements[0], 1);
        (0, helper_1.testLiteralExpression)(arrayLiteral.elements[1], 2);
        (0, helper_1.testInfixExpression)(arrayLiteral.elements[2], 3, "**", 4);
    });
});
describe("Parser - Index Expression", () => {
    it("should parse an index expression", () => {
        const source = `shamenboy[5 + 5];\n`;
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const index_expression = expressionStatement.expression;
        (0, helper_1.testIdentifier)(index_expression.left, "shamenboy");
        (0, helper_1.testInfixExpression)(index_expression.index, 5, "+", 5);
    });
});
describe("Parser - Prefix Expressions", () => {
    it("should parse prefix expressions with correct operators", () => {
        const source = "!5;\n";
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const prefixExpression = expressionStatement.expression;
        expect(prefixExpression.operator).toBe("!");
        expect(prefixExpression.right.value).toBe(5);
    });
});
describe("Parser - Infix Expressions", () => {
    it("should parse infix expressions with correct operators and values", () => {
        const source = "5 + 5;\n";
        const parser = new parser_1.Parser(source);
        const program = parser.parse_program();
        expect(program.statements.length).toBe(1);
        const expressionStatement = program.statements[0];
        const infixExpression = expressionStatement.expression;
        expect(infixExpression.operator).toBe("+");
        expect(infixExpression.left.value).toBe(5);
        expect(infixExpression.right.value).toBe(5);
    });
    it("should parse infix expressions with operator precedence", () => {
        const source = "5 + 5 * 3;\n"; // A source code with different operator precedence
        const parser = new parser_1.Parser(source); // Create a new parser with the source
        const program = parser.parse_program(); // Parse the program
        expect(program.statements.length).toBe(1); // Expect one statement in the program
        const expressionStatement = program.statements[0]; // Get the first statement
        const infixExpression = expressionStatement.expression; // Get the infix expression from the statement
        // Check the outermost operator is the correct one (operator precedence)
        expect(infixExpression.operator).toBe("+");
        // Check that the left operand has the expected value
        expect(infixExpression.left.value).toBe(5);
        // The right operand should be another infix expression (5 * 3)
        const innerInfix = infixExpression.right;
        // Check the inner operator is correct
        expect(innerInfix.operator).toBe("*");
        // Check the operands of the inner infix expression
        expect(innerInfix.left.value).toBe(5);
        expect(innerInfix.right.value).toBe(3);
        expect(expressionStatement.stringify()).toBe("(5 + (5 * 3))");
    });
});
describe("Parser - Infix Expression Parsing", () => {
    const tests = [
        { input: "-a * b", expected: "((-a) * b)" },
        { input: "a + b + c", expected: "((a + b) + c)" },
        { input: "a + b - c", expected: "((a + b) - c)" },
        { input: "a * b * c", expected: "((a * b) * c)" },
        { input: "a * b / c", expected: "((a * b) / c)" },
        { input: "a + b / c", expected: "(a + (b / c))" },
        { input: "a + b % c", expected: "(a + (b % c))" },
        { input: "a + b ** c", expected: "(a + (b ** c))" },
        { input: "a + b ** c % d", expected: "(a + ((b ** c) % d))" },
        { input: "a + -b ** c", expected: "(a + (-(b ** c)))" },
        { input: "a + b ** c / d", expected: "(a + ((b ** c) / d))" },
        { input: "a + b * c + d / e", expected: "((a + (b * c)) + (d / e))" },
        { input: "3 + 4 * 5", expected: "(3 + (4 * 5))" },
        { input: "a * [1, 2, 3, 4][b * c] * d", expected: "((a * (([1, 2, 3, 4])[(b * c)])) * d)" },
        { input: "5 > 4 == 3 < 4", expected: "((5 > 4) == (3 < 4))" },
        { input: "5 > 4 != 3 < 4", expected: "((5 > 4) != (3 < 4))" },
        { input: "3 + 4 * 5 == 3 * 1 + 4 * 5", expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))" },
    ];
    tests.forEach((test) => {
        it(`should correctly parse '${test.input}'`, () => {
            const parser = new parser_1.Parser(test.input);
            const program = parser.parse_program();
            // Check if there are no parsing errors
            expect(parser.errors().length).toBe(0);
            // Ensure there is exactly one statement in the program
            expect(program.statements.length).toBe(1);
            const expressionStatement = program.statements[0];
            const expression = expressionStatement.expression;
            // Check if the parsed expression's string representation matches the expected output
            expect(expression.stringify()).toBe(test.expected);
        });
    });
});
describe("Parser - Infix Expression Parsing", () => {
    const tests = [
        { input: "-a * b", expected: "((-a) * b)" },
        { input: "a + b + c", expected: "((a + b) + c)" },
        { input: "true;", expected: "true" },
        { input: "false;", expected: "false" },
        { input: "54 < 20 == false", expected: "((54 < 20) == false)" },
        { input: "70 > 12 == true", expected: "((70 > 12) == true)" },
        { input: "true == false", expected: "(true == false)" },
        { input: "true != false", expected: "(true != false)" },
        { input: "false == false", expected: "(false == false)" },
        { input: "true and false", expected: "(true and false)" },
        { input: "not true and false", expected: "((not true) and false)" },
        { input: "true and true == true and not false", expected: "((true and (true == true)) and (not false))" },
        { input: "5*3 == 15 and 10 + 5 == 15", expected: "(((5 * 3) == 15) and ((10 + 5) == 15))" },
        { input: "not (5 > 1)", expected: "(not (5 > 1))" },
    ];
    tests.forEach((test) => {
        it(`should correctly parse '${test.input}'`, () => {
            const parser = new parser_1.Parser(test.input);
            const program = parser.parse_program();
            // Check if there are no parsing errors
            expect(parser.errors().length).toBe(0);
            // Ensure there is exactly one statement in the program
            expect(program.statements.length).toBe(1);
            const expressionStatement = program.statements[0];
            const expression = expressionStatement.expression;
            // Check if the parsed expression's string representation matches the expected output
            expect(expression.stringify()).toBe(test.expected);
        });
    });
});
describe("Parser - Infix Grouped Expression Parsing", () => {
    const tests = [
        { input: "1 + (2 + 3) + 4", expected: "((1 + (2 + 3)) + 4)" },
        { input: "(5 + 5) * 2", expected: "((5 + 5) * 2)" },
        { input: "!(true == true)", expected: "(!(true == true))" },
    ];
    tests.forEach((test) => {
        it(`should correctly parse '${test.input}'`, () => {
            const parser = new parser_1.Parser(test.input);
            const program = parser.parse_program();
            // Check if there are no parsing errors
            expect(parser.errors().length).toBe(0);
            // Ensure there is exactly one statement in the program
            expect(program.statements.length).toBe(1);
            const expressionStatement = program.statements[0];
            const expression = expressionStatement.expression;
            // Check if the parsed expression's string representation matches the expected output
            expect(expression.stringify()).toBe(test.expected);
        });
    });
});
describe("Parser - Member Expression Parsing", () => {
    const tests = [
        { input: "max.the.king[0]", expected: "(((max.the).king)[0])" },
        { input: "max.the.king()[0]", expected: "(((max.the).king())[0])" },
        { input: "5 * 2 + orr.yona", expected: "((5 * 2) + (orr.yona))" },
        { input: "5 / dor.shamen", expected: "(5 / (dor.shamen))" },
        { input: `lior.the.shamen["duby"]`, expected: `(((lior.the).shamen)['duby'])` },
        { input: `[1, 2, 3].sort()`, expected: `(([1, 2, 3]).sort())` },
        { input: `[1, 2, 3].sort().map(x, y)`, expected: `((([1, 2, 3]).sort()).map(x, y))` },
    ];
    tests.forEach((test) => {
        it(`should correctly parse '${test.input} to '${test.expected}'`, () => {
            const parser = new parser_1.Parser(test.input);
            const program = parser.parse_program();
            // Check if there are no parsing errors
            expect(parser.errors().length).toBe(0);
            // Ensure there is exactly one statement in the program
            expect(program.statements.length).toBe(1);
            const expressionStatement = program.statements[0];
            const expression = expressionStatement.expression;
            // Check if the parsed expression's string representation matches the expected output
            expect(expression.stringify()).toBe(test.expected);
        });
    });
});
describe("Parser - Assignment Expressions", () => {
    const tests = [
        { input: "x = 5;", expectedIdentifier: "x", expectedValue: 5 },
        { input: "y = true;", expectedIdentifier: "y", expectedValue: true },
        { input: "foobar = y;", expectedIdentifier: "foobar", expectedValue: "y" },
    ];
    tests.forEach((test) => {
        it(`should parse assign expressions with identifier '${test.expectedIdentifier}' and value '${test.expectedValue}'`, () => {
            const parser = new parser_1.Parser(test.input); // Create a parser with the lexer
            const program = parser.parse_program(); // Parse the program into an AST
            (0, helper_1.checkParserErrors)(parser); // Ensure no parsing errors occurred
            expect(program.statements.length).toBe(1); // Ensure there's one statement in the program
            const stmt = program.statements[0]; // Get the first statement
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
