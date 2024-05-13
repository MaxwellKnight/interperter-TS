import { AssignExpression, BlockStatement, BooleanExpression, ExpressionStatement, Identifier, InfixExpression, WhileStatement } from "../../interfaces/nodes";
import { Parser } from "../../parser";
import { checkParserErrors, testIdentifier, testInfixExpression, testLiteralExpression } from "./helper";

describe("Parser - While statements", () => {
	const tests = [
	  { input: "x = 0; i = 0; while(i < 5) { x = x + 1; }", expectedIdentifier: "x", expectedValue: 5 },
	];
 
	tests.forEach((test) => {
	  it(`should parse while statement correctly`, () => {
			const parser = new Parser(test.input);  // Create a parser with the input
			const program = parser.parse_program();  // Parse the program into an AST

			checkParserErrors(parser);  // Ensure no parsing errors occurred

			expect(program.statements.length).toBe(3);  // Ensure there are three statements in the program
			
			// Get the while statement
			const whileStatement = program.statements[2] as WhileStatement;  

			// Validate the condition of the while statement
			const condition = whileStatement.condition as InfixExpression;
			expect(testInfixExpression(condition, "i", "<", 5)).toBe(true);

			// Validate the body of the while statement
			const body = whileStatement.body as BlockStatement;
			expect(body.statements.length).toBe(1);  // Ensure there's one statement in the body
			
			// Get the assignment statement inside the while loop body
			const bodyStmt = body.statements[0] as ExpressionStatement;
			const assign = bodyStmt.expression as AssignExpression;
			expect(testIdentifier(assign.left, test.expectedIdentifier)).toBe(true);
	  });
	});
});