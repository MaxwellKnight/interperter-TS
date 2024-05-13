"use strict";
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
var _Environment_env, _Environment_parent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtin_rest = exports.builtin_print = exports.builtin_len = exports.builtin_last = exports.builtin_first = exports.Environment = void 0;
const object_1 = require("./interfaces/object");
const object_2 = require("./interfaces/object");
class Environment {
    constructor(parent = null) {
        _Environment_env.set(this, void 0);
        _Environment_parent.set(this, void 0);
        __classPrivateFieldSet(this, _Environment_env, new Map, "f");
        __classPrivateFieldSet(this, _Environment_parent, parent, "f");
    }
    get(key) {
        const obj = __classPrivateFieldGet(this, _Environment_env, "f").get(key);
        if (!obj && __classPrivateFieldGet(this, _Environment_parent, "f"))
            return __classPrivateFieldGet(this, _Environment_parent, "f").get(key);
        return obj;
    }
    getEnv() {
        return __classPrivateFieldGet(this, _Environment_env, "f");
    }
    getParent() {
        return __classPrivateFieldGet(this, _Environment_parent, "f");
    }
    set(key, obj) {
        const env = Environment.retrieve(key, this);
        env.getEnv().set(key, obj);
        return obj;
    }
    assign(key, obj) {
        __classPrivateFieldGet(this, _Environment_env, "f").set(key, obj);
        return obj;
    }
    static retrieve(key, env) {
        let current = env;
        while (current !== null) {
            if (current.getEnv().has(key))
                return current;
            current = current.getParent();
        }
        return env;
    }
}
exports.Environment = Environment;
_Environment_env = new WeakMap(), _Environment_parent = new WeakMap();
const builtin_len = (...args) => {
    if (args.length != 1) {
        return object_2.ErrorObj.create("Invalid argument count `len` takes 1, got:", [String(args.length)]);
    }
    switch (args[0].type) {
        case object_2.ObjectType.STRING_OBJ:
            return new object_2.IntegerObj(args[0].value.toString().length);
        case object_2.ObjectType.ARRAY_OBJ:
            return new object_2.IntegerObj(args[0].elements.length);
        default:
            return object_2.ErrorObj.create("Unsupported argument to `len`, got:", [args[0].type]);
    }
};
exports.builtin_len = builtin_len;
const builtin_first = (...args) => {
    if (args.length != 1) {
        return object_2.ErrorObj.create("Invalid argument count `first` takes 1, got:", [String(args.length)]);
    }
    if (!(args[0] instanceof object_2.ArrayObj))
        return object_2.ErrorObj.create("`first` accepts only arrays as argument, got:", [args[0].type]);
    if (args[0].elements.length > 0)
        return args[0].elements[0];
    return object_1.NULL;
};
exports.builtin_first = builtin_first;
const builtin_last = (...args) => {
    if (args.length != 1) {
        return object_2.ErrorObj.create("Invalid argument count `last` takes 1, got:", [String(args.length)]);
    }
    if (!(args[0] instanceof object_2.ArrayObj))
        return object_2.ErrorObj.create("`last` accepts only arrays as argument, got:", [args[0].type]);
    if (args[0].elements.length > 0)
        return args[0].elements[args[0].elements.length - 1];
    return object_1.NULL;
};
exports.builtin_last = builtin_last;
const builtin_rest = (...args) => {
    if (args.length != 1) {
        return object_2.ErrorObj.create("Invalid argument count `rest` takes 1, got:", [String(args.length)]);
    }
    if (!(args[0] instanceof object_2.ArrayObj))
        return object_2.ErrorObj.create("`rest` accepts only arrays as argument, got:", [args[0].type]);
    if (args[0].elements.length > 0)
        return new object_2.ArrayObj(args[0].elements.slice(1));
    return object_1.NULL;
};
exports.builtin_rest = builtin_rest;
const builtin_print = (...args) => {
    const strs = args.map(arg => arg.type === object_2.ObjectType.STRING_OBJ ? arg.stringify().slice(1, -1) : arg.stringify());
    console.log(strs.join(" "));
    return object_1.NULL;
};
exports.builtin_print = builtin_print;
