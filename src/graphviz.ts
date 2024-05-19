import { exec } from "child_process";
import { Environment } from "./environment";
import fs from 'fs';

export const create_env_dot = (environments: Environment[]) => {
	let dot = 'digraph Environment {\nrankdir="BT"\n';

	const envNodes = new Map<Environment | null, string>();
	let envCounter = 0;

	const getEnvNode = (env: Environment | null) => {
		 if (!envNodes.has(env)) {
			  const nodeName = `Env${envCounter++}`;
			  envNodes.set(env, nodeName);
			  return nodeName;
		 }
		 return envNodes.get(env);
	};

	environments.forEach((env: Environment, index: number) => {
		 const currentEnvNode = getEnvNode(env);
		 const vars: string[] = [];
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


export const dot_to_pdf = (dot: string, outputFilePath: string) => {
	const tempDotFilePath = "temp_dot_file.dot";
	fs.writeFileSync(tempDotFilePath, dot, "utf-8");

	const command = `dot -Tpdf ${tempDotFilePath} -o ${outputFilePath}`;
	exec(command, error => {
		if (error) 	console.error("Error executing Graphviz command:", error);
		else 			console.log(`PDF successfully generated at ${outputFilePath}`);
		
		fs.unlinkSync(tempDotFilePath);
	});
}