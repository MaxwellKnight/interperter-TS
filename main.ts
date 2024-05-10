import promptSync from 'prompt-sync';
import { Parser } from './src/parser';
import { Evaluator, envs } from './src/evaluator';
import { Enviroment } from './src/enviroment';
import { exec } from 'child_process';
import fs from 'fs';
import { dotToPdf, createEnvironmentDot } from './src/graphviz';

const prompt = promptSync();
class REPL {
  #env: Enviroment;

	constructor() {
		this.#env = new Enviroment();
	}

	public run(): void {
		while (true) {
			const source = prompt('>> ');
			if(source && (source.trim() === 'exit' || source.trim() === 'quit')){
				console.log("Exiting REPL."); return;
			}
			this.process(source || "", true);
		}
	}

	public runFromFile(filePath: string): void {
		try {
			const source = fs.readFileSync(filePath, 'utf-8');
			this.process(source, false);

		} catch (error: any) {
			console.error(`Failed to read file: ${error.message}`);
		}
	}

	private process(source: string, should_continue: boolean): void {
		const parser = new Parser(source + ";");
		const program = parser.parse_program();
		const evaluator = new Evaluator();

		if (parser.errors().length > 0) {
			this.print_errors(parser);
			if (should_continue) return;
		} else {
			const result = evaluator.eval(program, this.#env);
			if(should_continue) console.log(result.stringify ? result.stringify() : result);
		}
	}

	private print_errors(parser: Parser): void {
		for (const error of parser.errors())
			console.error(error);
	}
}

(async () => {
	// Get command-line arguments
	const args = process.argv.slice(2); // Skip the first two (node and script name)
	const repl = new REPL();
	if (args.length > 0) {
		const fileName = args[0];

		if (fs.existsSync(fileName)) {
			repl.runFromFile(fileName);
			if(args[1] && args[1] === '-d') dotToPdf(createEnvironmentDot(envs), "dot.pdf")
			return;
		}
		console.error(`File not found: ${fileName}\n`);
	}
	// No arguments provided, run the interactive REPL
	repl.run();
})();