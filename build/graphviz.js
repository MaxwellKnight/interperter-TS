"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotToPdf = exports.createEnvironmentDot = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const createEnvironmentDot = (environments) => {
    let dot = 'digraph Environment {\nrankdir="BT"\n';
    const envNodes = new Map();
    let envCounter = 0;
    const getEnvNode = (env) => {
        if (!envNodes.has(env)) {
            const nodeName = `Env${envCounter++}`;
            envNodes.set(env, nodeName);
            return nodeName;
        }
        return envNodes.get(env);
    };
    environments.forEach((env, index) => {
        const currentEnvNode = getEnvNode(env);
        const vars = [];
        env.getEnv().forEach((obj, key) => vars.push(`${key}: ${obj.stringify().replace(/\n/g, "\\l")}`)); // Replace newline characters with \l
        const variables = vars.join("\\l"); // Join with \l to ensure multiline labels are properly handled
        dot += `  ${currentEnvNode} [label="${variables}\\l" shape="box"];`;
        if (env.getParent()) {
            const parentEnvNode = getEnvNode(env.getParent());
            dot += `  ${currentEnvNode} -> ${parentEnvNode} [label=Env${index}];`;
        }
    });
    dot += "}";
    return dot;
};
exports.createEnvironmentDot = createEnvironmentDot;
const dotToPdf = (dot, outputFilePath) => {
    const tempDotFilePath = "temp_dot_file.dot";
    fs_1.default.writeFileSync(tempDotFilePath, dot, "utf-8");
    const command = `dot -Tpdf ${tempDotFilePath} -o ${outputFilePath}`;
    (0, child_process_1.exec)(command, error => {
        if (error)
            console.error("Error executing Graphviz command:", error);
        else
            console.log(`PDF successfully generated at ${outputFilePath}`);
        fs_1.default.unlinkSync(tempDotFilePath);
    });
};
exports.dotToPdf = dotToPdf;
