# Custom Language Documentation

## Table of Contents

- [Overview](#overview)
- [Why](#why)
- [Installation](#installation)
- [Data Types](#data-types)
- [Operators](#operators)
- [Expressions](#expressions)
  - [Infix Expressions](#infix-expressions)
  - [Prefix Expressions](#prefix-expressions)
- [Statements](#statements)
  - [Expression Statements](#expression-statements)
  - [Assignment Statements](#assignment-statements)
  - [Return Statements](#return-statements)
- [Control Flow](#control-flow)
  - [If Statements](#if-statements)
  - [Loops](#loops)
- [Functions](#functions)
- [Objects and Arrays](#objects-and-arrays)
  - [Objects](#objects)
  - [Arrays](#arrays)
- [Built-in Functions](#built-in-functions)
- [Architecture](#architecture)
- [Using the Language](#using-the-language)
- [Example: Creating a Binary Search Tree](#example-creating-a-binary-search-tree)

## Overview

The custom language is a dynamically typed language designed to evaluate scripts and custom code. It supports various features like functions, control flow, recursion, arrays, objects, and built-in operations.

## Why

The courses I took on automata, formal languages, and principles of programming provided the theoretical foundation for my project. Studying topics such as lexical scoping, formal languages, Grammar rules and programming principles sparked my interest in understanding how programming languages function. By bridging theory with practical application, I aimed to deepen my understanding and explore the inner workings of programming languages. These courses fueled my passion for software development and motivated me to delve beyond theoretical concepts into hands-on implementation.

## Installation

To install the project, follow these steps:

1. Clone the Repository: Begin by cloning the repository to your local machine using the git clone command.

```bash
git clone https://github.com/MaxwellKnight/interperter-TS
```

2. Navigate to the Project Directory: Move into the project directory using the cd command.

```bash
cd interperter-TS
```

3. Install Dependencies: Use npm (Node Package Manager) to install the project dependencies defined in the package.json file.

```bash
npm install
```

4. Build the Project: Run the TypeScript compiler to transpile the TypeScript files into JavaScript.

```bash
npm run build
```

Start the Project: After building the project, you can run it using the start command defined in the package.json file.

```bash
npm start
```

## Data Types

The language supports the following data types:

- **Integer**: Represents whole numbers. Example: `1`, `-5`, `42`.
- **String**: Represents text enclosed in double quotes. Example: `"hello"`, `"world"`.
- **Boolean**: Represents `true` or `false`.
- **Array**: A collection of elements, enclosed in square brackets. Example: `[1, 2, 3]`.
- **Object**: A collection of key-value pairs, enclosed in curly braces. Example: `{ "key": "value" }`.
- **Function**: Represents a block of code that can be executed with parameters.
- **Null**: Represents the absence of a value.

## Operators

The language supports a variety of operators:

- **Arithmetic Operators**: `+`, `-`, `*`, `/`, `%`, `**`.
- **Comparison Operators**: `==`, `!=`, `<`, `<=`, `>`, `>=`.
- **Logical Operators**: `and`, `or`, `!`.
- **Assignment Operator**: `=`.
- **Other Operators**: `.` for member access, `[]` for indexing.

## Expressions

Expressions represent operations that produce a value. The language supports different types of expressions:

### Infix Expressions

Infix expressions involve an operator between two operands. Example:

```uglyface
1 + 2  # Arithmetic expression
a == b  # Comparison expression
```

### Prefix Expressions

Prefix expressions involve an operator before the operand. Example:

```uglyface
!true  # Logical negation
-5     # Negative number
```

### Assignment Expressions

Assignment expressions assign a value to a variable. Example:

```uglyface
x = 5  # Assign integer value
message = "hello"  # Assign string value
```

## Statements

Statements represent complete lines of code that perform an action. The language supports several types of statements:

### Expression Statements

Expression statements are single expressions that can stand alone as a complete statement. Example:

```uglyface
x + 1  # Expression statement
print("hello")  # Function call
```

### Return Statements

Return statements return a value from a function. Example:

```uglyface
f() {
  return 10
}
```

## Control Flow

Control flow allows conditional execution and looping. The language supports if statements and while loops.

### If Statements

If statements execute a block of code based on a condition. Example:

```uglyface
if (x > 0) {
  print("Positive")
} else {
  print("Non-positive")
}
```

### Loops

While loops execute a block of code repeatedly as long as a condition is true. Example:

```uglyface
x = 0
while (x < 5) {
  print(x)
  x = x + 1
}
```

## Functions

Functions are reusable blocks of code that can be defined with parameters and executed with arguments. The language supports both regular and arrow functions.

### Function Definition

Functions are defined with the f keyword. Example:

```uglyface
f(x) {
  return x * 2
}
```

### Arrow Functions

Arrow functions use the => syntax. Example:

```uglyface
add = f(x, y) => x + y
```

### Function Calls

Functions can be called with arguments. Example:

```uglyface
add(1, 2)  # Calls the add function with arguments 1 and 2
```

## Objects and Arrays

The language supports object literals and array literals.

### Objects

Objects are key-value pairs. Properties are accessed with the dot operator. Example:

```uglyface
person = {
  name: "John",
  age: 30
}

print(person.name)  # Access the "name" property
```

### Arrays

Arrays are indexed collections of elements. Indexing is done with square brackets. Example:

```uglyface
numbers = [1, 2, 3]

print(numbers[0])  # Access the first element
```

## Built-in Functions

The language includes built-in functions for common operations. Here are some examples:

- **len**: Returns the length of an array or string.
- **first**: Returns the first element of an array.
- **rest**: Returns the first element of an array.
- **print**: Outputs text to the console.
- **Array.map**: Maps over the array and apply transformation on it.
- **Array.filter**: filter an array given a filter function

Examples:

```uglyface
len([1, 2, 3]) 								# result = 3

first([1, 2, 3]) 								# result = 1

rest([1, 2, 3]) 								# result = [2, 3]

[1, 2, 3].map(f(x) => x ** 2) 			# result = [1, 4, 9]

[1, 2, 3].filter(f(x) => x % 2 == 1) 	# result = [1, 9]
```

## Architecture

The project is structured into different stages to parse and evaluate custom language code.

### Parsing Stage

The parsing stage is responsible for converting the source code into an Abstract Syntax Tree (AST). It involves the following components:

- **Lexer**: Tokenizes the source code into individual tokens.
- **Parser**: Converts tokens into an AST.
- **AST Nodes**: Defines various node types like Expression, Statement, Identifier, InfixExpression, etc.
- **Precedence**: Defines operator precedence to ensure correct parsing of complex expressions.

### Evaluation Stage

The evaluation stage executes the AST to produce results. It involves the following components:

- **Environment**: Manages variable bindings and scope, supporting nested scopes.
- **Evaluator**: Evaluates the AST, applying operations and built-in functions.
- **Objects**: Represents various object types like IntegerObj, StringObj, BooleanObj, etc.
- **Built-in Functions**: Provides built-in operations like len, first, last, print, etc.
- **Error Handling**: Manages errors during evaluation, providing detailed error messages when operations fail or invalid types are used.

## Using the Language

This section demonstrates how to use the custom language, highlighting key features through an example code snippet.

Example: Creating a Binary Search Tree
Here's a sample script that creates a binary search tree from an array and demonstrates recursion, functions, array manipulations, and object operations:

```uglyface
make_tree = f(arr) {
	create_tree = f(arr) {
		if(len(arr) == 0) return null;
		mid = len(arr) / 2;

		return {
			value: arr[mid],
			left: create_tree(arr.slice(0, mid)),
			right: create_tree(arr.slice(mid + 1)),
		};
	};

	inorder = f(root) {
		if(root == null) return;

		inorder(root.left);
		print(root.value);
		inorder(root.right);
	};

	sum_tree = f(root) {
		if(root == null) return 0;

		left_sum = sum_tree(root.left);
		right_sum = sum_tree(root.right);
		return left_sum + right_sum + root.value;
	};

	tree = create_tree(arr, 0, len(arr) - 1);

	return {
		view: 		f() => print(tree),
		inorder: 	f() => inorder(tree),
		sum: 			f() => sum_tree(tree),
		getRoot: 	f() => tree
	};
};

tree = make_tree([1,2,3,4,5,6,7])
tree.inorder();
tree.view();
```

This script showcases the creation of a binary search tree function object with encapsulated data, traversing it in-order, viewing the tree structure, and demonstrating a while loop.

MIT License

Copyright (c) [2024] [MaxwellKnight]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
