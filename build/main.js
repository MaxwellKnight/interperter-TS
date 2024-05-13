"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _REPL_env;
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const parser_1 = require("./parser");
const evaluator_1 = require("./evaluator");
const environment_1 = require("./environment");
const fs_1 = __importDefault(require("fs"));
const graphviz_1 = require("./graphviz");
const prompt = (0, prompt_sync_1.default)();
class REPL {
    constructor() {
        _REPL_env.set(this, void 0);
        __classPrivateFieldSet(this, _REPL_env, new environment_1.Environment(), "f");
    }
    run() {
        while (true) {
            const source = prompt('>> ');
            if (source && (source.trim() === 'exit' || source.trim() === 'quit')) {
                console.log("Exiting REPL.");
                return;
            }
            this.process(source || "", true);
        }
    }
    runFromFile(filePath) {
        try {
            const source = fs_1.default.readFileSync(filePath, 'utf-8');
            this.process(source, false);
        }
        catch (error) {
            console.error(`Failed to read file: ${error.message}`);
        }
    }
    process(source, should_continue) {
        const parser = new parser_1.Parser(source + ";");
        const program = parser.parse_program();
        const evaluator = new evaluator_1.Evaluator();
        if (parser.errors().length > 0) {
            this.print_errors(parser);
            if (should_continue)
                return;
        }
        else {
            const result = evaluator.eval(program, __classPrivateFieldGet(this, _REPL_env, "f"));
            if (should_continue)
                console.log(result.stringify ? result.stringify() : result);
        }
    }
    print_errors(parser) {
        for (const error of parser.errors())
            console.error(error);
    }
}
_REPL_env = new WeakMap();
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Get command-line arguments
    const args = process.argv.slice(2); // Skip the first two (node and script name)
    const repl = new REPL();
    if (args.length > 0) {
        const fileName = args[0];
        if (fs_1.default.existsSync(fileName)) {
            repl.runFromFile(fileName);
            if (args[1] && args[1] === '-d')
                (0, graphviz_1.dotToPdf)((0, graphviz_1.createEnvironmentDot)(evaluator_1.envs), "dot.pdf");
            return;
        }
        console.error(`File not found: ${fileName}\n`);
    }
    // No arguments provided, run the interactive REPL
    repl.run();
}))();
