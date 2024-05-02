import promptSync from 'prompt-sync';
import { Parser } from './src/parser';
import { Evaluator } from './src/evaluator';
import { Enviroment } from './src/enviroment';
import fs from 'fs'

const prompt = promptSync();

export class REPL {
	#env: Enviroment;
	constructor(){
		this.#env = new Enviroment();
	}

	public run(): void{
		while (true){
			const source = prompt('>> ');
			const parser = new Parser(source);
			const program = parser.parse_program();
			const evaluate = new Evaluator();

			if(parser.errors().length != 0){
				this.print_errors(parser);
				continue;
			}

			const result = evaluate.eval(program, this.#env);
			console.log(result.stringify());
		}
	}

	public runFromFile(filePath: string): void {
		try {
		  const source = fs.readFileSync(filePath, 'utf-8');
		  const parser = new Parser(source);
		  const program = parser.parse_program();
		  const evaluate = new Evaluator();

		  const result = evaluate.eval(program, this.#env);
		  console.log(result.stringify());
		} catch (error: any) {
		  console.error(`Failed to read file: ${error.message}`);
		}
	 }

	private print_errors(parser: Parser){
		for(const error of parser.errors()){
			console.error(error);
		}
	}
}

// Get command-line arguments
const args = process.argv.slice(2); // Skip the first two (node and script name)

const repl = new REPL();

(() => {
	if (args.length > 0) {
		const fileName = args[0];

		if (fs.existsSync(fileName)) {
			repl.runFromFile(fileName);
			return;
		}
		console.error(`File not found: ${fileName}\n`);
	}
	// No arguments provided, run the interactive REPL
	repl.run(); 
})();
