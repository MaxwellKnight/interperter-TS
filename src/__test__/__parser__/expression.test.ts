// tests/expression.test.ts
import { Parser } from "../../parser";
import { ExpressionStatement, Identifier, IntegerLiteral, PrefixExpression, InfixExpression, Expression, StringLiteral, ArrayLiteral, IndexExpression, AssignExpression, BlockStatement, IfExpression } from "../../interfaces/nodes";
import { checkParserErrors, testIdentifier, testInfixExpression, testLiteralExpression } from "./helper";

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

describe("Parser - String Literal Expression", () => {
	it("should parse a simple string literal expression", () => {
		const source = `"shamenboy the man";\n`;
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const stringLiteral = expressionStatement.expression as StringLiteral;

		expect(stringLiteral.value).toBe("shamenboy the man");
	});
});

describe("Parser - Array Literal Expression", () => {
	it("should parse an array literal expression", () => {
		const source = `[1, 2, 3 ** 4];\n`;
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const arrayLiteral = expressionStatement.expression as ArrayLiteral;

		if(!(expressionStatement.expression instanceof ArrayLiteral)){
			console.error("object is not ArrayLiteral, got: " + expressionStatement.expression?.stringify());
			return;
		}
		if(arrayLiteral.elements.length != 3){
			console.error("array size mismatch, expected 3, got: " + String(arrayLiteral.elements.length));
			return;
		}
		testLiteralExpression(arrayLiteral.elements[0], 1);
		testLiteralExpression(arrayLiteral.elements[1], 2);
		testInfixExpression(arrayLiteral.elements[2], 3, "**", 4);
	});
});

describe("Parser - Index Expression", () => {
	it("should parse an index expression", () => {
		const source = `shamenboy[5 + 5];\n`;
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(1);

		const expressionStatement = program.statements[0] as ExpressionStatement;
		const index_expression = expressionStatement.expression as IndexExpression;

		testIdentifier(index_expression.left, "shamenboy");
		testInfixExpression(index_expression.index, 5, "+", 5);
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
		{ input: "a * [1, 2, 3, 4][b * c] * d", expected: "((a * (([1, 2, 3, 4])[(b * c)])) * d)" },
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
		{ input: "false == false", expected: "(false == false)"},
		{ input: "true and false", expected: "(true and false)"},
		{ input: "not true and false", expected: "((not true) and false)"},
		{ input: "true and true == true and not false", expected: "((true and (true == true)) and (not false))"},
		{ input: "5*3 == 15 and 10 + 5 == 15", expected: "(((5 * 3) == 15) and ((10 + 5) == 15))"},
		{ input: "not (5 > 1)", expected: "(not (5 > 1))"},
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

describe("Parser - Assignment Expressions", () => {
	const tests = [
	  { input: "x = 5;", expectedIdentifier: "x", expectedValue: 5 },
	  { input: "y = true;", expectedIdentifier: "y", expectedValue: true },
	  { input: "foobar = y;", expectedIdentifier: "foobar", expectedValue: "y" },
	];
 
	tests.forEach((test) => {
	  it(`should parse assign expressions with identifier '${test.expectedIdentifier}' and value '${test.expectedValue}'`, () => {
			const parser = new Parser(test.input);  // Create a parser with the lexer
			const program = parser.parse_program();  // Parse the program into an AST

			checkParserErrors(parser);  // Ensure no parsing errors occurred

			expect(program.statements.length).toBe(1);  // Ensure there's one statement in the program
			const stmt = program.statements[0] as ExpressionStatement;  // Get the first statement
			const assign = stmt.expression as AssignExpression;
			const left = assign.left as Identifier;
			
			// Validate that it's a define statement with the expected identifier
			expect(left.value).toBe(test.expectedIdentifier);

			// Test the value of the let statement
			const value = assign.value;  // Get the value from the define statement
			expect(testLiteralExpression(value, test.expectedValue)).toBe(true);  // Check if the value matches the expected value
	  });
	});
});

// Test suite for If Expressions
describe("Parser - If Expressions", () => {
	it("should parse if expression with correct structure", () => {
		const if_block = `if (x < y) { x }`;  
		const if_expr = `if (x < y) x;`;  
		const parser = new Parser(if_block);  
		const parser_expr = new Parser(if_expr); 
		const program = parser.parse_program();  
		const program_expr = parser_expr.parse_program();  

		checkParserErrors(parser);  

		expect(program.statements.length).toBe(1);  // Ensure there's one statement in the program
		const stmt = program.statements[0] as ExpressionStatement;  // Get the first statement
		const stmt_expr = program_expr.statements[0] as ExpressionStatement;  // Get the first statement

		const ifExp = stmt.expression as IfExpression;  // Assert it's an IfExpression
		const ifExp_expr = stmt_expr.expression as IfExpression;  // Assert it's an IfExpression

		// Test the condition of the if statement
		expect(testInfixExpression(ifExp.condition, "x", "<", "y")).toBe(true);
		expect(testInfixExpression(ifExp_expr.condition, "x", "<", "y")).toBe(true);
		const if_case = ifExp.if_case as BlockStatement;
		const if_case_expr = ifExp_expr.if_case as ExpressionStatement;
		// Ensure the consequence block contains one statement
		expect(if_case.statements.length).toBe(1);

		const consequence = if_case.statements[0] as ExpressionStatement;
		const ifcase = if_case_expr.expression as Identifier;
		// Test the expression in the consequence block
		expect(testIdentifier(consequence.expression, "x")).toBe(true);
		expect(testIdentifier(ifcase, "x")).toBe(true);

		// Assert the else_case is null (no else part in the input)
		expect(ifExp.else_case).toBeNull();
		expect(ifExp_expr.else_case).toBeNull();
	});
});

describe("Parser - If Expressions with Else", () => {
	it("should parse if expression with else block", () => {
		const input = `if (x < y) { x } else { y }`;  
		const if_expr_str = `if (x < y)  x  else  y `;
		const parser = new Parser(input);  
		const parser_expr = new Parser(if_expr_str);
		const program = parser.parse_program();  
		const program2 = parser_expr.parse_program();

		checkParserErrors(parser);  
		checkParserErrors(parser_expr);  

		expect(program.statements.length).toBe(1);  
		expect(program2.statements.length).toBe(1);  
		const stmt = program.statements[0] as ExpressionStatement;  
		const stmt2 = program2.statements[0] as ExpressionStatement;  

		const ifExp = stmt.expression as IfExpression;  
		const ifExp2 = stmt2.expression as IfExpression;  

		// Test the condition of the if statement
		expect(testInfixExpression(ifExp.condition, "x", "<", "y")).toBe(true);
		expect(testInfixExpression(ifExp2.condition, "x", "<", "y")).toBe(true);

		const if_block = ifExp.if_case as BlockStatement;
		const if_expr = ifExp2.if_case as ExpressionStatement;
		// Check consequence block
		expect(if_block.statements.length).toBe(1);  
		const consequence = if_block.statements[0] as ExpressionStatement;  
		expect(testIdentifier(consequence.expression, "x")).toBe(true);  
		expect(testIdentifier(if_expr.expression, "x")).toBe(true);  

		const else_block = ifExp.else_case as BlockStatement;
		const else_expr = ifExp2.else_case as ExpressionStatement;
		// Check the else block
		expect(ifExp.else_case).toBeTruthy();  
		expect(else_block.statements.length).toBe(1);
		const alternative = else_block.statements[0] as ExpressionStatement;  
		expect(testIdentifier(alternative.expression, "y")).toBe(true);  
		expect(testIdentifier(else_expr.expression, "y")).toBe(true);  
	});
});