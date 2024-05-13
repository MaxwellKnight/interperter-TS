"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULL = exports.FALSE = exports.TRUE = exports.ErrorObj = exports.BuiltinObj = exports.FunctionObj = exports.ArrayObj = exports.NullObj = exports.ReturnObj = exports.BooleanObj = exports.StringObj = exports.IntegerObj = exports.ObjectObj = exports.Obj = exports.ObjectType = void 0;
const evaluator_1 = require("../evaluator");
const nodes_1 = require("./nodes");
var ObjectType;
(function (ObjectType) {
    ObjectType["INTEGER_OBJ"] = "integer";
    ObjectType["STRING_OBJ"] = "string";
    ObjectType["BOOLEAN_OBJ"] = "boolean";
    ObjectType["RETURN_OBJ"] = "return";
    ObjectType["FUNCTION_OBJ"] = "function";
    ObjectType["ARRAY_OBJ"] = "array";
    ObjectType["OBJECT_OBJ"] = "object";
    ObjectType["BUILTIN_OBJ"] = "builtin";
    ObjectType["ERROR_OBJ"] = "error";
    ObjectType["NULL_OBJ"] = "null";
})(ObjectType || (exports.ObjectType = ObjectType = {}));
// Base class for all objects in the interpreter
class Obj {
    constructor(type) {
        this.properties = new Map;
        this.type = type;
    }
}
exports.Obj = Obj;
class ObjectObj extends Obj {
    constructor(type) {
        super(type);
        this.value = true;
    }
    stringify(level = 0) {
        const properties = [];
        this.properties.forEach((value, key) => {
            if (typeof value === 'function')
                properties.push([`<function ${key}>`, key.toString()]);
            if (value instanceof Obj)
                properties.push([value.stringify(), key.toString()]);
        });
        return `{ ${properties.map(elem => `${elem[1]}${': ' + (elem[0] ? elem[0] : 'null')}`).join(", ")} }`;
    }
}
exports.ObjectObj = ObjectObj;
class IntegerObj extends Obj {
    constructor(value) {
        super(ObjectType.INTEGER_OBJ);
        this.value = value;
    }
    stringify() { return `${this.value}`; }
}
exports.IntegerObj = IntegerObj;
class StringObj extends Obj {
    constructor(value) {
        super(ObjectType.STRING_OBJ);
        this.value = value;
    }
    stringify(level = 0) { return `'${this.value}'`; }
}
exports.StringObj = StringObj;
class BooleanObj extends Obj {
    constructor(value) {
        super(ObjectType.BOOLEAN_OBJ);
        this.value = value;
    }
    stringify(level = 0) { return `${this.value}`; }
}
exports.BooleanObj = BooleanObj;
class ReturnObj extends Obj {
    constructor(value) {
        super(ObjectType.RETURN_OBJ);
        this.value = value;
    }
    stringify(level = 0) { return `return ${this.value.stringify()}`; }
}
exports.ReturnObj = ReturnObj;
class NullObj extends Obj {
    constructor() {
        super(ObjectType.NULL_OBJ);
        this.value = false;
    }
    stringify() { return "null"; }
}
exports.NullObj = NullObj;
class ArrayObj extends Obj {
    constructor(elements) {
        super(ObjectType.ARRAY_OBJ);
        this.elements = elements;
        this.properties.set('push', ArrayObj.push);
        this.properties.set('filter', ArrayObj.filter);
        this.properties.set('map', ArrayObj.map);
        this.properties.set('reduce', ArrayObj.reduce);
        this.properties.set('slice', ArrayObj.slice);
    }
    stringify(level = 0) {
        return `[${this.elements.map(obj => obj.stringify()).join(", ")}]`;
    }
    ;
    static push(self, ...args) {
        if (!(self instanceof ArrayObj)) {
            return ErrorObj.create("first argument to `push` must be of type `array` got:", [self.type]);
        }
        if (args.length != 1) {
            return ErrorObj.create("Invalid argument count `push` takes 1, got:", [String(args.length)]);
        }
        self.elements.push(args[0]);
        return exports.NULL;
    }
    static filter(self, ...args) {
        if (!(self instanceof ArrayObj)) {
            return ErrorObj.create("first argument to `filter` must be of type `array` got:", [self.type]);
        }
        if (args.length != 1) {
            return ErrorObj.create("Invalid argument count `filter` takes 1, got:", [String(args.length)]);
        }
        if (args[0].type !== ObjectType.FUNCTION_OBJ)
            return ErrorObj.create("`filter` takes a function as argument", []);
        const evaluator = new evaluator_1.Evaluator();
        const result = [];
        for (let i = 0; i < self.elements.length; i += 1) {
            const ans = evaluator.apply_function(args[0], [self.elements[i]]);
            if (ans.type !== ObjectType.BOOLEAN_OBJ) {
                return ErrorObj.create("function to `filter` must return a boolean.", []);
            }
            if (ans.value)
                result.push(self.elements[i]);
        }
        return new ArrayObj(result);
    }
    static map(self, ...args) {
        if (!(self instanceof ArrayObj)) {
            return ErrorObj.create("first argument to `map` must be of type `array` got:", [self.type]);
        }
        if (args.length != 1) {
            return ErrorObj.create("Invalid argument count `map` takes 1, got:", [String(args.length)]);
        }
        if (args[0].type !== ObjectType.FUNCTION_OBJ)
            return ErrorObj.create("`map` takes a function as argument", []);
        const evaluator = new evaluator_1.Evaluator();
        const result = [];
        for (let i = 0; i < self.elements.length; i += 1) {
            const ans = evaluator.apply_function(args[0], [self.elements[i]]);
            result.push(ans);
        }
        return new ArrayObj(result);
    }
    static reduce(self, ...args) {
        if (!(self instanceof ArrayObj))
            return ErrorObj.create('First argument to `reduce` must be of type `array`, got:', [self.type]);
        if (args.length < 1 || args.length > 2)
            return ErrorObj.create('Invalid argument count `reduce` takes 1 or 2, got:', [String(args.length)]);
        const reducer = args[0];
        if (reducer.type !== ObjectType.FUNCTION_OBJ)
            return ErrorObj.create('`reduce` requires a reducer function as the first argument', []);
        let accumulator;
        if (args.length === 2)
            accumulator = args[1];
        else
            accumulator = self.elements[0];
        const evaluator = new evaluator_1.Evaluator();
        const startIndex = args.length === 2 ? 0 : 1;
        for (let i = startIndex; i < self.elements.length; i += 1)
            accumulator = evaluator.apply_function(reducer, [accumulator, self.elements[i]]);
        return accumulator;
    }
    static slice(self, ...args) {
        if (!(self instanceof ArrayObj)) {
            return ErrorObj.create("First argument to `slice` must be of type `array`, got:", [self.type]);
        }
        let start = 0;
        let end = self.elements.length;
        if (args.length === 0)
            return new ArrayObj([...self.elements]);
        if (args.length > 0) {
            const startArg = args[0];
            if (startArg instanceof IntegerObj)
                start = startArg.value;
            else
                return ErrorObj.create("`slice` expects integer arguments for start.", []);
        }
        if (args.length > 1) {
            const endArg = args[1];
            if (endArg instanceof IntegerObj)
                end = endArg.value;
            else
                return ErrorObj.create("`slice` expects integer arguments for end.", []);
        }
        // Handle negative indices
        if (start < 0)
            start = Math.max(0, self.elements.length + start);
        if (end < 0)
            end = Math.max(0, self.elements.length + end);
        // Ensure start and end are within bounds
        start = Math.min(self.elements.length, start);
        end = Math.min(self.elements.length, end);
        if (start >= end)
            return new ArrayObj([]);
        const slicedElements = self.elements.slice(start, end);
        return new ArrayObj(slicedElements);
    }
}
exports.ArrayObj = ArrayObj;
class FunctionObj extends Obj {
    constructor() {
        super(ObjectType.FUNCTION_OBJ);
        this.parameters = [];
        this.body = null;
        this.env = null;
    }
    stringify(level = 0) {
        var _a, _b;
        const body = this.body instanceof nodes_1.Expression ? `=> ${this.body.stringify()}` : `{\n${(_a = this.body) === null || _a === void 0 ? void 0 : _a.stringify()} \n}`;
        return `f(${(_b = this.parameters) === null || _b === void 0 ? void 0 : _b.map((param) => param.stringify(level + 1))}) ${body} `;
    }
}
exports.FunctionObj = FunctionObj;
class BuiltinObj extends Obj {
    constructor(fn, name = "") {
        super(ObjectType.BUILTIN_OBJ);
        this.fn = fn;
        this.name = "`" + name + "`";
    }
    stringify(level = 0) { return `<builtin function ${this.name}>`; }
}
exports.BuiltinObj = BuiltinObj;
class ErrorObj extends Obj {
    constructor(message) {
        super(ObjectType.ERROR_OBJ);
        this.value = message;
    }
    static create(error, messages) {
        return new ErrorObj(`${error} ${messages.join(" ")}`);
    }
    static isError(obj) {
        return obj.type === ObjectType.ERROR_OBJ;
    }
    stringify(level = 0) { return `RuntimeError: ${this.value}`; }
}
exports.ErrorObj = ErrorObj;
exports.TRUE = new BooleanObj(true);
exports.FALSE = new BooleanObj(false);
exports.NULL = new NullObj();
