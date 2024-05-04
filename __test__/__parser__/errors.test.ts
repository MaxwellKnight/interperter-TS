import { Parser } from "../../src/parser";

describe("Parser - Error Handling", () => {
	it("should record an error when an unexpected token is encountered", () => {
	  const source = `
		def kaki  5
		def  = 29
		def 8200
	  `;  // Missing right operand after '+' operator
	  const parser = new Parser(source);
 
	  const program = parser.parse_program();
 
	  // Even if there's an error, the parser should still try to parse
	  expect(program.statements.length).toBe(3);  // At least one statement exists
	  // Retrieve errors from the parser
	  const errors = parser.errors();
	  // The error message should indicate the expected and actual tokens
	  expect(errors.length).toBe(3);  // There should be at least one error
	  expect(errors[0]).toBe("expected assign but instead got 5");  // Expected integer, but got end of file (EOF)
	  expect(errors[1]).toBe("expected identifier but instead got =");  // Expected integer, but got end of file (EOF)
	  expect(errors[2]).toBe("expected identifier but instead got 8200");  // Expected integer, but got end of file (EOF)
	});
 
 });
 