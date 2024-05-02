import { Parser } from "../../src/parser";
import { ExpressionStatement, IfExpression } from "../../src/interfaces/nodes";
import { checkParserErrors, testIdentifier, testInfixExpression } from "./helper.test";

// Test suite for If Expressions
describe("Parser - If Expressions", () => {
	it("should parse if expression with correct structure", () => {
		const input = `if (x < y) { x }`;  // The source code for the if statement
		const parser = new Parser(input);  // Create a parser using the lexer
		const program = parser.parse_program();  // Parse the program

		checkParserErrors(parser);  // Check for parsing errors

		expect(program.statements.length).toBe(1);  // Ensure there's one statement in the program
		const stmt = program.statements[0] as ExpressionStatement;  // Get the first statement

		const ifExp = stmt.expression as IfExpression;  // Assert it's an IfExpression

		// Test the condition of the if statement
		expect(testInfixExpression(ifExp.condition, "x", "<", "y")).toBe(true);

		// Ensure the consequence block contains one statement
		expect(ifExp.if_case?.statements.length).toBe(1);

		const consequence = ifExp.if_case?.statements[0] as ExpressionStatement;

		// Test the expression in the consequence block
		expect(testIdentifier(consequence.expression, "x")).toBe(true);

		// Assert the else_case is null (no else part in the input)
		expect(ifExp.else_case).toBeNull();
	});
});

describe("Parser - If Expressions with Else", () => {
	it("should parse if expression with else block", () => {
		const input = `if (x < y) { x } else { y }`;  // Source code with else block
		const parser = new Parser(input);  // Create a parser
		const program = parser.parse_program();  // Parse the program

		checkParserErrors(parser);  // Ensure no errors in parsing

		expect(program.statements.length).toBe(1);  // There should be one statement
		const stmt = program.statements[0] as ExpressionStatement;  // First statement

		const ifExp = stmt.expression as IfExpression;  // Assert it's an IfExpression

		// Test the condition of the if statement
		expect(testInfixExpression(ifExp.condition, "x", "<", "y")).toBe(true);

		// Check consequence block
		expect(ifExp.if_case?.statements.length).toBe(1);  // Ensure there's one statement in the block
		const consequence = ifExp.if_case?.statements[0] as ExpressionStatement;  // Get the statement
		expect(testIdentifier(consequence.expression, "x")).toBe(true);  // Ensure it's "x"

		// Check the else block
		expect(ifExp.else_case).toBeTruthy();  // Ensure the else block exists
		expect(ifExp.else_case?.statements.length).toBe(1);  // Should have one statement
		const alternative = ifExp.else_case?.statements[0] as ExpressionStatement;  // Get the else block statement
		expect(testIdentifier(alternative.expression, "y")).toBe(true);  // Ensure it's "y"
	});
});

