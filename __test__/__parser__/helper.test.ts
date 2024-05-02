import { BooleanExpression, Identifier, InfixExpression, IntegerLiteral, ReturnStatement, Statement } from "../../src/interfaces/nodes";
import { Parser } from "../../src/parser";

/**
 * Helper function to check if a parser contains any errors and, if so, fails the test.
 *
 * @param parser - The parser to check.
 */
export function checkParserErrors(parser: Parser) {
	const errors = parser.errors();
 
	if (errors.length > 0) {
	  console.error(`Parser encountered errors: ${errors.join(", ")}`);
	  throw new Error(`Parser errors found: ${errors.join(", ")}`);
	}
 }
 
 /**
  * Helper function to test if a given expression is an identifier with the expected name.
  *
  * @param expression - The expression to test.
  * @param expectedName - The expected identifier name.
  * @returns True if the expression is an identifier with the expected name; otherwise, false.
  */
 export function testIdentifier(expression: any, expectedName: string): boolean {
	if (!(expression instanceof Identifier)) {
	  console.error(`Expression is not an Identifier. Got: ${typeof expression}`);
	  return false;
	}
 
	if (expression.value !== expectedName) {
	  console.error(`Identifier mismatch. Expected: ${expectedName}, Got: ${expression.value}`);
	  return false;
	}
 
	return true;
 }
/**
 * Helper function to check if an expression is an infix expression with expected left operand, operator, and right operand.
 * 
 * @param expression - The expression to test.
 * @param expectedLeft - The expected left operand (either a string for identifier or a number for integer literal).
 * @param expectedOperator - The expected operator.
 * @param expectedRight - The expected right operand (either a string for identifier or a number for integer literal).
 * @returns True if the infix expression matches the expected structure; otherwise, false.
 */
export function testInfixExpression(
	expression: any,
	expectedLeft: string | number,
	expectedOperator: string,
	expectedRight: string | number
 ): boolean {
	if (!(expression instanceof InfixExpression)) {
	  console.error(`Expression is not an InfixExpression. Got: ${typeof expression}`);
	  return false;
	}
 
	// Check the operator
	if (expression.operator !== expectedOperator) {
	  console.error(`Operator mismatch. Expected: ${expectedOperator}, Got: ${expression.operator}`);
	  return false;
	}
 
	// Check the left operand
	if (typeof expectedLeft === "string") {
		const leftIdentifier = expression.left as Identifier;
		if (leftIdentifier.value !== expectedLeft) {
			console.error(`Left operand identifier mismatch. Expected: ${expectedLeft}, Got: ${leftIdentifier.value}`);
			return false;
		}
	} else if (typeof expectedLeft === "number") {
		const leftLiteral = expression.left as IntegerLiteral;
		if (leftLiteral.value !== expectedLeft) {
			console.error(`Left operand integer mismatch. Expected: ${expectedLeft}, Got: ${leftLiteral.value}`);
			return false;
		}
	} else {
		console.error(`Invalid type for left operand. Expected: string or number, Got: ${typeof expectedLeft}`);
		return false;
	}
 
	// Check the right operand
	if (typeof expectedRight === "string") {
		const rightIdentifier = expression.right as Identifier;
		if (rightIdentifier.value !== expectedRight) {
			console.error(`Right operand identifier mismatch. Expected: ${expectedRight}, Got: ${rightIdentifier.value}`);
			return false;
		}
	} else if (typeof expectedRight === "number") {
		const rightLiteral = expression.right as IntegerLiteral;
		if (rightLiteral.value !== expectedRight) {
			console.error(`Right operand integer mismatch. Expected: ${expectedRight}, Got: ${rightLiteral.value}`);
			return false;
		}
	} else {
		console.error(`Invalid type for right operand. Expected: string or number, Got: ${typeof expectedRight}`);
		return false;
	}
 
	return true;  // If all checks pass, the test is successful
 }
 
  /**
 * Test function to check if a given expression is a literal with the expected value.
 *
 * @param expression - The expression to test.
 * @param expectedValue - The expected value for the literal.
 * @returns True if the expression is a literal with the expected value; otherwise, false.
 */
export function testLiteralExpression(expression: any, expectedValue: string | number | boolean): boolean {
	if (typeof expectedValue === "string") {
		if (expression instanceof Identifier) {
			// Test if the expression is an Identifier and its value matches the expected string
			if (expression.value !== expectedValue) {
			console.error(`Identifier mismatch. Expected: ${expectedValue}, Got: ${expression.value}`);
			return false;
			}
		} else {
			console.error(`Expected an Identifier or StringLiteral for string value. Got: ${typeof expression}`);
			return false;
		}
	} else if (typeof expectedValue === "number") {
		if (expression instanceof IntegerLiteral) {
			// Test if the expression is an IntegerLiteral and its value matches the expected number
			if (expression.value !== expectedValue) {
			console.error(`IntegerLiteral mismatch. Expected: ${expectedValue}, Got: ${expression.value}`);
			return false;
			}
		} else {
			console.error(`Expected an IntegerLiteral for numeric value. Got: ${typeof expression}`);
			return false;
		}
	} else if (typeof expectedValue === "boolean") {
		if (expression instanceof BooleanExpression) {
			if (expression.value !== expectedValue) {
			console.error(`BooleanLiteral mismatch. Expected: ${expectedValue}, Got: ${expression.value}`);
			return false;
			}
		} else {
			console.error(`Expected an Boolean for boolean value. Got: ${typeof expression}`);
			return false;
		}
	} else {
		console.error(`Invalid expected value type. Expected: string or number, Got: ${typeof expectedValue}`);
		return false;
	}
 
	return true;  // If all checks pass, the test is successful
}

 // Helper function to test return statements
export function testReturnStatement(
	stmt: Statement,
	expectedExpression: string
 ): boolean {
	if (!(stmt instanceof ReturnStatement)) {
		console.error(`Statement is not a ReturnStatement. Got=${typeof stmt}`);
		return false;
	}

	if (
		stmt.value instanceof Identifier &&
		stmt.value.value !== expectedExpression
	) {
		console.error(
			`Expected return expression to be ${expectedExpression}, but got ${stmt.value.token.type}`
		);
		return false;
	}
 
	return true;
}