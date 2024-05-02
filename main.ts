import promptSync from 'prompt-sync';
import { Parser } from './src/parser';
import { Evaluator } from './src/evaluator';
import { Enviroment } from './src/enviroment';

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
			//def x = 1 * 2 * 3 * 4 * 5
			const result = evaluate.eval(program, this.#env);
			console.log(result.stringify());
		}
	}

	private print_errors(parser: Parser){
		for(const error of parser.errors()){
			console.error(error);
		}
	}
}

const repl = new REPL();
repl.run();