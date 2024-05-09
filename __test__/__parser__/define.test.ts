import { DefineStatement } from "../../src/interfaces/nodes";
import { Parser } from "../../src/parser";
import { checkParserErrors, testLiteralExpression } from "./helper";

describe("Parser - Let Statements", () => {
	const tests = [
	  { input: "x = 5;", expectedIdentifier: "x", expectedValue: 5 },
	  { input: "y = true;", expectedIdentifier: "y", expectedValue: true },
	  { input: "foobar = y;", expectedIdentifier: "foobar", expectedValue: "y" },
	];
 
	tests.forEach((test) => {
	  it(`should parse let statement with identifier '${test.expectedIdentifier}' and value '${test.expectedValue}'`, () => {
		 const parser = new Parser(test.input);  // Create a parser with the lexer
		 const program = parser.parse_program();  // Parse the program into an AST
 
		 checkParserErrors(parser);  // Ensure no parsing errors occurred
 
		 expect(program.statements.length).toBe(1);  // Ensure there's one statement in the program
		 const stmt = program.statements[0] as DefineStatement;  // Get the first statement
 
		 // Validate that it's a define statement with the expected identifier
		 expect(stmt.name.value).toBe(test.expectedIdentifier);
 
		 // Test the value of the let statement
		 const value = stmt.value;  // Get the value from the define statement
		 expect(testLiteralExpression(value, test.expectedValue)).toBe(true);  // Check if the value matches the expected value
	  });
	});
});