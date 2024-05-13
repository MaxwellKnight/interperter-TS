"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testReturnStatement = exports.testLiteralExpression = exports.testInfixExpression = exports.testIdentifier = exports.checkParserErrors = void 0;
const nodes_1 = require("../../interfaces/nodes");
function checkParserErrors(parser) {
    const errors = parser.errors();
    if (errors.length > 0) {
        console.error(`Parser encountered errors: ${errors.join(", ")}`);
        throw new Error(`Parser errors found: ${errors.join(", ")}`);
    }
}
exports.checkParserErrors = checkParserErrors;
function testIdentifier(expression, expectedName) {
    if (!(expression instanceof nodes_1.Identifier)) {
        console.error(`Expression is not an Identifier. Got: ${typeof expression}`);
        return false;
    }
    if (expression.value !== expectedName) {
        console.error(`Identifier mismatch. Expected: ${expectedName}, Got: ${expression.value}`);
        return false;
    }
    return true;
}
exports.testIdentifier = testIdentifier;
function testInfixExpression(expression, expectedLeft, expectedOperator, expectedRight) {
    if (!(expression instanceof nodes_1.InfixExpression)) {
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
        const leftIdentifier = expression.left;
        if (leftIdentifier.value !== expectedLeft) {
            console.error(`Left operand identifier mismatch. Expected: ${expectedLeft}, Got: ${leftIdentifier.value}`);
            return false;
        }
    }
    else if (typeof expectedLeft === "number") {
        const leftLiteral = expression.left;
        if (leftLiteral.value !== expectedLeft) {
            console.error(`Left operand integer mismatch. Expected: ${expectedLeft}, Got: ${leftLiteral.value}`);
            return false;
        }
    }
    else {
        console.error(`Invalid type for left operand. Expected: string or number, Got: ${typeof expectedLeft}`);
        return false;
    }
    // Check the right operand
    if (typeof expectedRight === "string") {
        const rightIdentifier = expression.right;
        if (rightIdentifier.value !== expectedRight) {
            console.error(`Right operand identifier mismatch. Expected: ${expectedRight}, Got: ${rightIdentifier.value}`);
            return false;
        }
    }
    else if (typeof expectedRight === "number") {
        const rightLiteral = expression.right;
        if (rightLiteral.value !== expectedRight) {
            console.error(`Right operand integer mismatch. Expected: ${expectedRight}, Got: ${rightLiteral.value}`);
            return false;
        }
    }
    else {
        console.error(`Invalid type for right operand. Expected: string or number, Got: ${typeof expectedRight}`);
        return false;
    }
    return true; // If all checks pass, the test is successful
}
exports.testInfixExpression = testInfixExpression;
function testLiteralExpression(expression, expectedValue) {
    if (typeof expectedValue === "string") {
        if (expression instanceof nodes_1.Identifier) {
            // Test if the expression is an Identifier and its value matches the expected string
            if (expression.value !== expectedValue) {
                console.error(`Identifier mismatch. Expected: ${expectedValue}, Got: ${expression.value}`);
                return false;
            }
        }
        else {
            console.error(`Expected an Identifier or StringLiteral for string value. Got: ${typeof expression}`);
            return false;
        }
    }
    else if (typeof expectedValue === "number") {
        if (expression instanceof nodes_1.IntegerLiteral) {
            // Test if the expression is an IntegerLiteral and its value matches the expected number
            if (expression.value !== expectedValue) {
                console.error(`IntegerLiteral mismatch. Expected: ${expectedValue}, Got: ${expression.value}`);
                return false;
            }
        }
        else {
            console.error(`Expected an IntegerLiteral for numeric value. Got: ${typeof expression}`);
            return false;
        }
    }
    else if (typeof expectedValue === "boolean") {
        if (expression instanceof nodes_1.BooleanExpression) {
            if (expression.value !== expectedValue) {
                console.error(`BooleanLiteral mismatch. Expected: ${expectedValue}, Got: ${expression.value}`);
                return false;
            }
        }
        else {
            console.error(`Expected an Boolean for boolean value. Got: ${typeof expression}`);
            return false;
        }
    }
    else {
        console.error(`Invalid expected value type. Expected: string or number, Got: ${typeof expectedValue}`);
        return false;
    }
    return true; // If all checks pass, the test is successful
}
exports.testLiteralExpression = testLiteralExpression;
function testReturnStatement(stmt, expectedExpression) {
    if (!(stmt instanceof nodes_1.ReturnStatement)) {
        console.error(`Statement is not a ReturnStatement. Got=${typeof stmt}`);
        return false;
    }
    if (stmt.value instanceof nodes_1.Identifier &&
        stmt.value.value !== expectedExpression) {
        console.error(`Expected return expression to be ${expectedExpression}, but got ${stmt.value.token.type}`);
        return false;
    }
    return true;
}
exports.testReturnStatement = testReturnStatement;
