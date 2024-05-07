import { BooleanExpression, Identifier, InfixExpression, IntegerLiteral, ReturnStatement, Statement } from "../../src/interfaces/nodes";
import { Parser } from "../../src/parser";


export function checkParserErrors(parser: Parser) {
	const errors = parser.errors();
 
	if (errors.length > 0) {
	  console.error(`Parser encountered errors: ${errors.join(", ")}`);
	  throw new Error(`Parser errors found: ${errors.join(", ")}`);
	}
}
 
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

export function testReturnStatement(stmt: Statement, expectedExpression: string): boolean {
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