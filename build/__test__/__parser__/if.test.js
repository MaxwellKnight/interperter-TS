"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../../parser");
const helper_1 = require("./helper");
// Test suite for If Expressions
describe("Parser - If Expressions", () => {
    it("should parse if expression with correct structure", () => {
        const if_block = `if (x < y) { x }`;
        const if_expr = `if (x < y) x;`;
        const parser = new parser_1.Parser(if_block);
        const parser_expr = new parser_1.Parser(if_expr);
        const program = parser.parse_program();
        const program_expr = parser_expr.parse_program();
        (0, helper_1.checkParserErrors)(parser);
        expect(program.statements.length).toBe(1); // Ensure there's one statement in the program
        const stmt = program.statements[0]; // Get the first statement
        const stmt_expr = program_expr.statements[0]; // Get the first statement
        const ifExp = stmt.expression; // Assert it's an IfExpression
        const ifExp_expr = stmt_expr.expression; // Assert it's an IfExpression
        // Test the condition of the if statement
        expect((0, helper_1.testInfixExpression)(ifExp.condition, "x", "<", "y")).toBe(true);
        expect((0, helper_1.testInfixExpression)(ifExp_expr.condition, "x", "<", "y")).toBe(true);
        const if_case = ifExp.if_case;
        const if_case_expr = ifExp_expr.if_case;
        // Ensure the consequence block contains one statement
        expect(if_case.statements.length).toBe(1);
        const consequence = if_case.statements[0];
        const ifcase = if_case_expr.expression;
        // Test the expression in the consequence block
        expect((0, helper_1.testIdentifier)(consequence.expression, "x")).toBe(true);
        expect((0, helper_1.testIdentifier)(ifcase, "x")).toBe(true);
        // Assert the else_case is null (no else part in the input)
        expect(ifExp.else_case).toBeNull();
        expect(ifExp_expr.else_case).toBeNull();
    });
});
describe("Parser - If Expressions with Else", () => {
    it("should parse if expression with else block", () => {
        const input = `if (x < y) { x } else { y }`;
        const if_expr_str = `if (x < y)  x  else  y `;
        const parser = new parser_1.Parser(input);
        const parser_expr = new parser_1.Parser(if_expr_str);
        const program = parser.parse_program();
        const program2 = parser_expr.parse_program();
        (0, helper_1.checkParserErrors)(parser);
        (0, helper_1.checkParserErrors)(parser_expr);
        expect(program.statements.length).toBe(1);
        expect(program2.statements.length).toBe(1);
        const stmt = program.statements[0];
        const stmt2 = program2.statements[0];
        const ifExp = stmt.expression;
        const ifExp2 = stmt2.expression;
        // Test the condition of the if statement
        expect((0, helper_1.testInfixExpression)(ifExp.condition, "x", "<", "y")).toBe(true);
        expect((0, helper_1.testInfixExpression)(ifExp2.condition, "x", "<", "y")).toBe(true);
        const if_block = ifExp.if_case;
        const if_expr = ifExp2.if_case;
        // Check consequence block
        expect(if_block.statements.length).toBe(1);
        const consequence = if_block.statements[0];
        expect((0, helper_1.testIdentifier)(consequence.expression, "x")).toBe(true);
        expect((0, helper_1.testIdentifier)(if_expr.expression, "x")).toBe(true);
        const else_block = ifExp.else_case;
        const else_expr = ifExp2.else_case;
        // Check the else block
        expect(ifExp.else_case).toBeTruthy();
        expect(else_block.statements.length).toBe(1);
        const alternative = else_block.statements[0];
        expect((0, helper_1.testIdentifier)(alternative.expression, "y")).toBe(true);
        expect((0, helper_1.testIdentifier)(else_expr.expression, "y")).toBe(true);
    });
});
