// tests/expression.test.ts
import { Parser } from "../../src/parser";
import { ExpressionStatement, Identifier, IntegerLiteral, PrefixExpression, InfixExpression, Expression } from "../../src/interfaces/nodes";

describe("Parser - Identifier Expression", () => {
	it("should parse a simple identifier expression", () => {
		const source = "foobar;\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const identifier = expressionStatement.expression as Identifier;

		expect(identifier.value).toBe("foobar");
	});
});

describe("Parser - Integer Literal Expression", () => {
	it("should parse a simple integer literal expression", () => {
		const source = "25;\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const integerLiteral = expressionStatement.expression as IntegerLiteral;

		expect(integerLiteral.value).toBe(25);
	});
});

describe("Parser - Prefix Expressions", () => {
	it("should parse prefix expressions with correct operators", () => {
		const source = "!5;\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const prefixExpression = expressionStatement.expression as PrefixExpression;

		expect(prefixExpression.operator).toBe("!");
		expect((prefixExpression.right as IntegerLiteral).value).toBe(5);
	});
});

describe("Parser - Infix Expressions", () => {
	it("should parse infix expressions with correct operators and values", () => {
		const source = "5 + 5;\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const infixExpression = expressionStatement.expression as InfixExpression;

		expect(infixExpression.operator).toBe("+");
		expect((infixExpression.left as IntegerLiteral).value).toBe(5);
		expect((infixExpression.right as IntegerLiteral).value).toBe(5);
	});
	
	it("should parse infix expressions with operator precedence", () => {
		const source = "5 + 5 * 3;\n";  // A source code with different operator precedence
		const parser = new Parser(source);  // Create a new parser with the source
	
		const program = parser.parse_program();  // Parse the program
	
		expect(program.statements.length).toBe(1);  // Expect one statement in the program
	
		const expressionStatement = program.statements[0] as ExpressionStatement;  // Get the first statement
		const infixExpression = expressionStatement.expression as InfixExpression;  // Get the infix expression from the statement
	
		// Check the outermost operator is the correct one (operator precedence)
		expect(infixExpression.operator).toBe("+");
	
		// Check that the left operand has the expected value
		expect((infixExpression.left as IntegerLiteral).value).toBe(5);
	
		// The right operand should be another infix expression (5 * 3)
		const innerInfix = infixExpression.right as InfixExpression;
	
		// Check the inner operator is correct
		expect(innerInfix.operator).toBe("*");
	
		// Check the operands of the inner infix expression
		expect((innerInfix.left as IntegerLiteral).value).toBe(5);
		expect((innerInfix.right as IntegerLiteral).value).toBe(3);
		expect((expressionStatement as ExpressionStatement).stringify()).toBe("(5 + (5 * 3))")
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
		{ input: "5 > 4 == 3 < 4", expected: "((5 > 4) == (3 < 4))" },
		{ input: "5 > 4 != 3 < 4", expected: "((5 > 4) != (3 < 4))" },
		{ input: "3 + 4 * 5 == 3 * 1 + 4 * 5", expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))" },
	];
 
	tests.forEach((test) => {
		it(`should correctly parse '${test.input}'`, () => {
			const parser = new Parser(test.input);
			const program = parser.parse_program();

			// Check if there are no parsing errors
			expect(parser.errors().length).toBe(0);
			// Ensure there is exactly one statement in the program
			expect(program.statements.length).toBe(1);

			const expressionStatement = program.statements[0] as ExpressionStatement;
			const expression = expressionStatement.expression as Expression;

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
		{ input: "true == false", expected: "(true == false)"},
		{ input: "true != false", expected: "(true != false)"},
		{ input: "false == false", expected: "(false == false)"}

	];
 
	tests.forEach((test) => {
		it(`should correctly parse '${test.input}'`, () => {
			const parser = new Parser(test.input);
			const program = parser.parse_program();

			// Check if there are no parsing errors
			expect(parser.errors().length).toBe(0);
			// Ensure there is exactly one statement in the program
			expect(program.statements.length).toBe(1);

			const expressionStatement = program.statements[0] as ExpressionStatement;
			const expression = expressionStatement.expression as Expression;

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
			const parser = new Parser(test.input);
			const program = parser.parse_program();

			// Check if there are no parsing errors
			expect(parser.errors().length).toBe(0);
			// Ensure there is exactly one statement in the program
			expect(program.statements.length).toBe(1);

			const expressionStatement = program.statements[0] as ExpressionStatement;
			const expression = expressionStatement.expression as Expression;

			// Check if the parsed expression's string representation matches the expected output
			expect(expression.stringify()).toBe(test.expected);
		});
	});
 });