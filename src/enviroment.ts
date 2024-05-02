import { Obj } from "./interfaces/object";

export class Enviroment {
	#env: Map<string, Obj>;
	#parent: Enviroment | null;

	constructor(parent: Enviroment | null = null){
		this.#env = new Map<string, Obj>;
		this.#parent = parent;
	}

	public get(key: string): Obj | undefined{
		const obj = this.#env.get(key);
		if(!obj && this.#parent)
			return this.#parent.get(key);
		return obj;
	}

	public set(key: string, obj: Obj): Obj {
		this.#env.set(key, obj);
		return obj;
	}

	public set_parent(env: Enviroment){
		this.#parent = env;
	}

	public get_parent(): Enviroment | null {
		return this.#parent;
	}

	static enclosed_env(parent: Enviroment | null){
		return new Enviroment(parent);
	}
}