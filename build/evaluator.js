"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluator = exports.envs = void 0;
const environment_1 = require("./environment");
const nodes_1 = require("./interfaces/nodes");
const object_1 = require("./interfaces/object");
exports.envs = [];
class Evaluator {
    constructor() {
        this.builtins = new Map;
        this.builtins.set("len", new object_1.BuiltinObj(environment_1.builtin_len, "len"));
        this.builtins.set("first", new object_1.BuiltinObj(environment_1.builtin_first, "first"));
        this.builtins.set("last", new object_1.BuiltinObj(environment_1.builtin_last, "last"));
        this.builtins.set("rest", new object_1.BuiltinObj(environment_1.builtin_rest, "rest"));
        this.builtins.set("print", new object_1.BuiltinObj(environment_1.builtin_print, "print"));
        this.builtins.set("null", new object_1.NullObj());
    }
    ;
    /**
   * Evaluates a given AST node, returning the appropriate object.
   */
    eval(node, env) {
        if (exports.envs.length === 0)
            exports.envs.push(env);
        if (node instanceof nodes_1.IntegerLiteral)
            return new object_1.IntegerObj(node.value);
        else if (node instanceof nodes_1.StringLiteral)
            return new object_1.StringObj(node.value);
        else if (node instanceof nodes_1.BooleanExpression)
            return node.value ? object_1.TRUE : object_1.FALSE;
        else if (node instanceof nodes_1.Program)
            return this.eval_program(node.statements, env);
        else if (node instanceof nodes_1.BlockStatement)
            return this.eval_block_statement(node, env);
        else if (node instanceof nodes_1.ExpressionStatement)
            return this.eval(node.expression, env);
        else if (node instanceof nodes_1.MemberExpression)
            return this.eval_member_expression(node, env);
        else if (node instanceof nodes_1.WhileStatement)
            return this.eval_while_statement(node, env);
        else if (node instanceof nodes_1.PrefixExpression) {
            const operand = this.eval(node.right, env);
            if (object_1.ErrorObj.isError(operand))
                return operand;
            return this.eval_prefix_expression(node.operator, operand);
        }
        else if (node instanceof nodes_1.InfixExpression) {
            const left = this.eval(node.left, env);
            if (object_1.ErrorObj.isError(left))
                return left;
            const right = this.eval(node.right, env);
            if (object_1.ErrorObj.isError(right))
                return right;
            return this.eval_infix_expression(node.operator, left, right);
        }
        else if (node instanceof nodes_1.IfExpression) {
            return this.eval_if_expression(node, env);
        }
        else if (node instanceof nodes_1.ReturnStatement) {
            const returnValue = this.eval(node.value, env);
            if (object_1.ErrorObj.isError(returnValue))
                return returnValue;
            if (returnValue)
                return new object_1.ReturnObj(returnValue);
        }
        else if (node instanceof nodes_1.Identifier) {
            return this.eval_identifier(node, env);
        }
        else if (node instanceof nodes_1.AssignExpression) {
            return this.eval_assignment_expr(node, env);
        }
        else if (node instanceof nodes_1.FunctionLiteral || node instanceof nodes_1.ArrowFunctionLiteral) {
            const fn = new object_1.FunctionObj();
            fn.body = node.body;
            fn.parameters = node.parameters;
            fn.env = env;
            return fn;
        }
        else if (node instanceof nodes_1.CallExpression) {
            const args = this.eval_expressions(node.arguments || [], env);
            if (args.length == 1 && object_1.ErrorObj.isError(args[0]))
                return args[0];
            const fn = this.eval(node.caller, env);
            if (object_1.ErrorObj.isError(fn))
                return fn;
            return this.apply_function(fn, args);
        }
        else if (node instanceof nodes_1.ArrayLiteral) {
            const elements = this.eval_expressions(node.elements, env);
            if (elements.length == 1 && object_1.ErrorObj.isError(elements[0])) {
                return elements[0];
            }
            return new object_1.ArrayObj(elements);
        }
        else if (node instanceof nodes_1.IndexExpression) {
            const left = this.eval(node.left, env);
            if (object_1.ErrorObj.isError(left))
                return left;
            const index = this.eval(node.index, env);
            if (object_1.ErrorObj.isError(index))
                return index;
            return this.eval_index_expression(left, index);
        }
        else if (node instanceof nodes_1.ObjectLiteral) {
            const obj = new object_1.ObjectObj(object_1.ObjectType.OBJECT_OBJ);
            node.properties.forEach((v, k, map) => {
                const value = this.eval(v, env);
                if (object_1.ErrorObj.isError(value))
                    return value;
                let key;
                if (k instanceof nodes_1.Identifier) {
                    if (map.get(k) === null) {
                        const val = this.eval(k, env);
                        if (object_1.ErrorObj.isError(val))
                            return val;
                        obj.properties.set(k.value, val);
                    }
                    else
                        obj.properties.set(k.value, value);
                }
                else {
                    key = this.eval(k, env);
                    if (object_1.ErrorObj.isError(key))
                        return key;
                    obj.properties.set(key.value, value);
                }
            });
            return obj;
        }
        return object_1.NULL;
    }
    /**
   * Evaluates a program consisting of multiple statements.
   */
    eval_program(statements, env) {
        let result = new object_1.NullObj();
        for (const statement of statements) {
            result = this.eval(statement, env);
            if (result instanceof object_1.ReturnObj)
                return result.value;
            else if (result instanceof object_1.ErrorObj)
                return result;
        }
        return result;
    }
    eval_block_statement(node, env) {
        let result = new object_1.NullObj();
        for (const statement of node.statements) {
            result = this.eval(statement, env);
            if (result instanceof object_1.ReturnObj || result instanceof object_1.ErrorObj)
                return result;
        }
        return result;
    }
    eval_prefix_expression(operator, operand) {
        switch (operator) {
            case "!": return this.eval_bang_prefix(operand);
            case "-": return this.eval_minus_prefix(operand);
            case "not": return this.is_truthy(operand) ? object_1.FALSE : object_1.TRUE;
            default: return object_1.ErrorObj.create("Unknown operator:", [operator + operand.type]);
        }
    }
    eval_bang_prefix(operand) {
        if (operand instanceof object_1.BooleanObj) {
            if (operand.value)
                return object_1.FALSE;
            return object_1.TRUE;
        }
        if (operand instanceof object_1.NullObj)
            return object_1.TRUE;
        return object_1.FALSE;
    }
    eval_minus_prefix(operand) {
        if (operand.type !== object_1.ObjectType.INTEGER_OBJ)
            return object_1.ErrorObj.create("Unknown operator:", ["-" + operand.type]);
        if (!(operand instanceof object_1.IntegerObj))
            return object_1.NULL;
        return new object_1.IntegerObj(-operand.value);
    }
    /**
   * Evaluates an expression with a given operator and two operands (infix).
   */
    eval_infix_expression(operator, left, right) {
        if ((left instanceof object_1.IntegerObj) && (right instanceof object_1.IntegerObj))
            return this.eval_integer_infix_expression(operator, left, right);
        else if ((left instanceof object_1.StringObj) && (right instanceof object_1.StringObj))
            return this.eval_string_infix_expression(operator, left, right);
        else if (operator === "==")
            return left.value === right.value ? object_1.TRUE : object_1.FALSE;
        else if (operator === "!=")
            return left.value !== right.value ? object_1.TRUE : object_1.FALSE;
        else if (operator === 'and')
            return this.is_truthy(left) && this.is_truthy(right) ? object_1.TRUE : object_1.FALSE;
        else if (operator === 'or')
            return this.is_truthy(left) || this.is_truthy(right) ? object_1.TRUE : object_1.FALSE;
        if (left.type !== right.type)
            return object_1.ErrorObj.create("Invalid operation on operands tryin:", [left.type, operator, right.type]);
        return object_1.ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
    }
    eval_integer_infix_expression(operator, left, right) {
        switch (operator) {
            case "+": return new object_1.IntegerObj(left.value + right.value);
            case "-": return new object_1.IntegerObj(left.value - right.value);
            case "*": return new object_1.IntegerObj(left.value * right.value);
            case "/": return new object_1.IntegerObj(Math.floor(left.value / right.value));
            case "%": return new object_1.IntegerObj(left.value % right.value);
            case "**": return new object_1.IntegerObj(Math.pow(left.value, right.value));
            case "<": return left.value < right.value ? object_1.TRUE : object_1.FALSE;
            case "<=": return left.value <= right.value ? object_1.TRUE : object_1.FALSE;
            case ">": return left.value > right.value ? object_1.TRUE : object_1.FALSE;
            case ">=": return left.value >= right.value ? object_1.TRUE : object_1.FALSE;
            case "==": return left.value === right.value ? object_1.TRUE : object_1.FALSE;
            case "!=": return left.value !== right.value ? object_1.TRUE : object_1.FALSE;
            default: return object_1.ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
        }
    }
    eval_string_infix_expression(operator, left, right) {
        switch (operator) {
            case "+": return new object_1.StringObj(left.value + right.value);
            case "==": return new object_1.BooleanObj(left.value === right.value);
            default: return object_1.ErrorObj.create("Unknown operator:", [left.type, operator, right.type]);
        }
    }
    eval_if_expression(if_expr, env) {
        const condition = this.eval(if_expr.condition, env);
        if (object_1.ErrorObj.isError(condition))
            return condition;
        if (this.is_truthy(condition) && if_expr.if_case) {
            return this.eval(if_expr.if_case, env);
        }
        else if (if_expr.else_case)
            return this.eval(if_expr.else_case, env);
        return object_1.NULL;
    }
    eval_identifier(node, env) {
        const obj = env.get(node.value);
        if (obj)
            return obj;
        const builtin = this.builtins.get(node.value);
        if (builtin)
            return builtin;
        return object_1.ErrorObj.create("Unknown identifier:", [node.value]);
    }
    eval_expressions(expressions, env) {
        const result = [];
        for (const expression of expressions) {
            const expr = this.eval(expression, env);
            if (object_1.ErrorObj.isError(expr))
                return [expr];
            result.push(expr);
        }
        return result;
    }
    eval_assignment_expr(node, env) {
        const value = this.eval(node.value, env);
        if (object_1.ErrorObj.isError(value))
            return value;
        const left = node.left;
        if (left instanceof nodes_1.Identifier)
            return this.assign_identifier(left, value, env);
        else if (left instanceof nodes_1.IndexExpression)
            return this.assign_index_expr(left, value, env);
        else if (left instanceof nodes_1.MemberExpression)
            return this.assign_member_expr(left, value, env);
        return object_1.ErrorObj.create("Illegal assignment to type:", [left.stringify()]);
    }
    assign_identifier(left, value, env) {
        env.set(left.value, value);
        return value;
    }
    assign_index_expr(left, value, env) {
        const obj = env.get(left.left.value);
        if (!obj)
            return object_1.ErrorObj.create("Unidentified variable name", [left.left.value]);
        if (left.index instanceof nodes_1.StringLiteral) {
            obj.properties.set(left.index.value, value);
            return value;
        }
        else if (left.index instanceof nodes_1.IntegerLiteral) {
            if (!(obj instanceof object_1.ArrayObj))
                return object_1.ErrorObj.create(`Object of type '${obj.type}' is immutable.`, []);
            const index = left.index.value;
            if (index < 0 || index >= obj.elements.length)
                return object_1.ErrorObj.create("Index Error, out of range.", []);
            obj.elements[index] = value;
            return value;
        }
        return object_1.ErrorObj.create("Invalid index type.", []);
    }
    assign_member_expr(left, value, env) {
        const obj = this.eval(left.object, env);
        if (object_1.ErrorObj.isError(obj))
            return obj;
        const property = left.property;
        obj.properties.set(property.value, value);
        return value;
    }
    apply_function(fn, args) {
        if (fn instanceof object_1.FunctionObj) {
            const extendedEnv = this.extend_function_env(fn, args);
            exports.envs.push(extendedEnv);
            const result = this.eval(fn.body, extendedEnv);
            return this.unwrap_return(result);
        }
        else if (fn instanceof object_1.BuiltinObj) {
            return fn.fn(...args);
        }
        return object_1.ErrorObj.create("not a function:", [fn.type]);
    }
    extend_function_env(fn, args) {
        const env = new environment_1.Environment(fn.env);
        for (let i = 0; i < fn.parameters.length; i++) {
            env.assign(fn.parameters[i].value, args[i]);
        }
        return env;
    }
    eval_index_expression(left, index) {
        if (left.type === object_1.ObjectType.ARRAY_OBJ && index.type === object_1.ObjectType.INTEGER_OBJ)
            return this.eval_array_index_expression(left, index);
        else if (left.type === object_1.ObjectType.STRING_OBJ && index.type === object_1.ObjectType.INTEGER_OBJ)
            return this.eval_string_index_expression(left, index);
        else if (index instanceof object_1.StringObj) {
            const property = left.properties.get(index.value);
            if (!property)
                return object_1.ErrorObj.create(`Property named ${index.value} does not exist in`, [left.type]);
            if (property instanceof object_1.Obj)
                return property;
            return new object_1.BuiltinObj((...args) => property(left, ...args), index.value);
        }
        return object_1.ErrorObj.create(`index operator of type "${index.type}" not supported on type:`, [`"${left.type}"`]);
    }
    eval_array_index_expression(left, index) {
        const array = left;
        const idx = index.value;
        const max_idx = array.elements.length - 1;
        if (idx < 0 || idx > max_idx)
            return object_1.ErrorObj.create("index out of range", []);
        return array.elements[idx];
    }
    eval_string_index_expression(left, index) {
        const string = left;
        const idx = index.value;
        const max_idx = string.value.length - 1;
        if (idx < 0 || idx > max_idx)
            return object_1.ErrorObj.create("index out of range", []);
        return new object_1.StringObj(string.value[idx]);
    }
    eval_member_expression(node, env) {
        const obj = this.eval(node.object, env);
        if (object_1.ErrorObj.isError(obj))
            return obj;
        if (node.property instanceof nodes_1.CallExpression && node.property.caller instanceof nodes_1.Identifier) {
            const property = obj.properties.get(node.property.caller.value);
            if (!property)
                return object_1.ErrorObj.create(`Property named "${node.property.caller.value}" does not exist on type: ${obj.type}`, []);
            if (property instanceof object_1.FunctionObj) {
                return this.apply_function(property, [...this.eval_expressions(node.property.arguments || [], env)]);
            }
            if (property instanceof object_1.Obj)
                return object_1.ErrorObj.create(`"${node.property.caller.value}" is not a function. got:`, [property.type]);
            ;
            return property(obj, ...this.eval_expressions(node.property.arguments || [], env));
        }
        else if (node.property instanceof nodes_1.Identifier) {
            const property = obj.properties.get(node.property.value);
            if (!property)
                return object_1.ErrorObj.create(`Property named "${node.property.value}" does not exist on type: ${obj.type}`, []);
            return property;
        }
        return object_1.NULL;
    }
    eval_while_statement(node, env) {
        let condition = this.eval(node.condition, env);
        while (this.is_truthy(condition)) {
            this.eval(node.body, env);
            condition = this.eval(node.condition, env);
        }
        return object_1.NULL;
    }
    unwrap_return(obj) {
        if (obj instanceof object_1.ReturnObj)
            return obj.value;
        return obj;
    }
    /**
   * - NullObj is always falsy.
   * - BooleanObj returns its value.
   * - All other objects are considered truthy.
   */
    is_truthy(obj) {
        if (obj instanceof object_1.NullObj)
            return false;
        else if (obj instanceof object_1.BooleanObj)
            return obj.value;
        return true;
    }
}
exports.Evaluator = Evaluator;
