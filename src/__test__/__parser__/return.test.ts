import { ReturnStatement, Statement } from "../../interfaces/nodes";
import { Parser } from "../../parser";
import { testReturnStatement } from "./helper";
 // Test case for parsing return statements
 describe("Parser - Return Statements", () => {
	it("should parse a simple return statement", () => {
		const source = "return x;\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		if (!program) {
			throw new Error("ParseProgram() returned null");
		}

		expect(program.statements.length).toBe(1);

		const firstStatement = program.statements[0];

		// The first statement should be a ReturnStatement
		expect(firstStatement).toBeInstanceOf(ReturnStatement);

	});

	it("should parse multiple return statements", () => {
		const source = "return a;\nreturn b;\nreturn c;\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		if (!program) {
			throw new Error("ParseProgram() returned null");
		}

		expect(program.statements.length).toBe(3);

		const statements = program.statements;

		expect(testReturnStatement(statements[0], "a")).toBe(true);
		expect(testReturnStatement(statements[1], "b")).toBe(true);
		expect(testReturnStatement(statements[2], "c")).toBe(true);
	});

	it("should return null for unexpected input", () => {
		const source = "unexpected_token\n";
		const parser = new Parser(source);

		const program = parser.parse_program();

		expect(program.statements.length).toBe(0);
	});
 });