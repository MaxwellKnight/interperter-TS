"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEval = exports.testErrorObj = exports.testArrayObject = exports.testStringObject = exports.testBooleanObject = exports.testNullObject = exports.testIntegerObject = void 0;
const environment_1 = require("../../environment");
const evaluator_1 = require("../../evaluator");
const object_1 = require("../../interfaces/object");
const parser_1 = require("../../parser");
const helper_1 = require("../__parser__/helper");
// Function to test if an object is an IntegerObj with the expected value
function testIntegerObject(obj, expected) {
    if (!(obj instanceof object_1.IntegerObj)) {
        console.error(`Object is not IntegerObj. Got: ${obj === null || obj === void 0 ? void 0 : obj.type}`);
        return false;
    }
    if (obj.value !== expected) { // Check the integer value
        console.error(`IntegerObj has wrong value. Got: ${obj.value}, expected: ${expected}`);
        return false;
    }
    return true;
}
exports.testIntegerObject = testIntegerObject;
function testNullObject(obj) {
    if (!(obj instanceof object_1.NullObj)) {
        console.error(`Object is not NullObj. Got: ${obj === null || obj === void 0 ? void 0 : obj.type}`);
        return false;
    }
    return true;
}
exports.testNullObject = testNullObject;
function testBooleanObject(obj, expected) {
    if (!(obj instanceof object_1.BooleanObj)) {
        console.error(`Object is not BooleanObj. Got: ${obj === null || obj === void 0 ? void 0 : obj.type}`);
        return false;
    }
    if (obj.value !== expected) {
        console.error(`BooleanObj has wrong value. Got: ${obj.value}, expected: ${expected}`);
        return false;
    }
    return true;
}
exports.testBooleanObject = testBooleanObject;
function testStringObject(obj, expected) {
    if (!(obj instanceof object_1.StringObj)) {
        console.error(`Object is not StringObj. Got: ${typeof (obj === null || obj === void 0 ? void 0 : obj.type)}`);
        return false;
    }
    if (obj.value !== expected) {
        console.error(`StringObj has wrong value. Got: ${obj.value}, expected: ${expected}`);
        return false;
    }
    return true;
}
exports.testStringObject = testStringObject;
function testArrayObject(obj, expected) {
    if (!(obj instanceof object_1.ArrayObj)) {
        console.error(`Object is not ArrayObj. Got: ${obj === null || obj === void 0 ? void 0 : obj.type}`);
        return false;
    }
    const nums = obj.elements;
    expect(nums.length).toBe(expected.length);
    for (let i = 0; i < nums.length; i += 1) {
        expect(typeof nums[i].value === 'number').toBe(true);
        if (nums[i].value !== expected[i]) { // Check the integer value
            console.error(`ArrayObj has wrong value at index: ${i}, Got: ${obj.value}, expected: ${expected}`);
            return false;
        }
    }
    return true;
}
exports.testArrayObject = testArrayObject;
// Function to test if an object is an ErrorObj with the expected value
function testErrorObj(obj, expected) {
    if (!(obj instanceof object_1.ErrorObj)) {
        console.error(`Object is not ErrorObj. Got: ${obj === null || obj === void 0 ? void 0 : obj.type}`);
        return false;
    }
    if (obj.value !== expected) {
        console.error(`Error message has wrong value. Got: ${obj.value}, expected: ${expected}`);
        return false;
    }
    return true;
}
exports.testErrorObj = testErrorObj;
// Function to evaluate a string input
function testEval(input) {
    const parser = new parser_1.Parser(input);
    const program = parser.parse_program();
    const env = new environment_1.Environment();
    (0, helper_1.checkParserErrors)(parser);
    const evaluator = new evaluator_1.Evaluator();
    return evaluator.eval(program, env);
}
exports.testEval = testEval;
