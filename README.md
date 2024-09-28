# Custom Language Interpreter

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Data Types](#data-types)
  - [Operators](#operators)
  - [Control Flow](#control-flow)
  - [Functions](#functions)
  - [Built-in Functions](#built-in-functions)
  - [Object Methods](#object-methods)
- [Installation](#installation)
- [Usage](#usage)
- [Language Syntax](#language-syntax)
- [Architecture](#architecture)
- [Tutorial](#tutorial)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project implements a custom programming language interpreter written in TypeScript. It includes a lexer for tokenizing the source code and a parser for creating an Abstract Syntax Tree (AST). The interpreter supports various features such as functions, control flow, recursion, arrays, objects, and built-in operations.

## Features

### Data Types

- Integer
- String
- Boolean
- Array
- Object
- Function
- Null

### Operators

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `**` (exponentiation)
- Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`
- Logical: `and`, `or`, `!` (not)
- Assignment: `=`
- Member access: `.`
- Index access: `[]`

### Control Flow

- If-else statements
- While loops
- Break statements

### Functions

- Regular function definition
- Arrow function definition
- Anonymous functions
- Recursion
- Closures
- Higher-order functions

### Built-in Functions

- `len(iterable)`: Returns the length of an array or string
- `first(array)`: Returns the first element of an array
- `rest(array)`: Returns all elements of an array except the first
- `print(value)`: Outputs text to the console

### Object Methods

#### String Methods

- `split(delimiter)`: Splits the string by the given delimiter and returns an array of substrings.
- `strip()`: Removes all whitespace from the string.
- `into_int()`: Converts the string to an integer if possible.
- `is_numeric()`: Returns a boolean indicating whether the string can be parsed as a number.

#### Array Methods

- `push(element)`: Adds an element to the end of the array.
- `pop()`: Removes and returns the last element of the array.
- `dequeue()`: Removes and returns the first element of the array.
- `filter(function)`: Creates a new array with all elements that pass the test implemented by the provided function.
- `map(function)`: Creates a new array with the results of calling a provided function on every element in this array.
- `reduce(function, [initial_value])`: Executes a reducer function on each element of the array, resulting in a single output value.
- `slice([start], [end])`: Returns a shallow copy of a portion of an array into a new array object.

#### Object Methods

Objects in this language are flexible and can have custom methods defined. The built-in methods for objects are primarily related to property access and modification.

## Installation

To install the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/MaxwellKnight/interperter-TS
   ```

2. Navigate to the project directory:
   ```bash
   cd interperter-TS
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the project:
   ```bash
   npm start
   ```

## Usage

After starting the project, you can input your code in the custom language. The interpreter will tokenize, parse, and execute the code, providing the output or any error messages.

## Language Syntax

The custom language supports the following syntax:

```plaintext
# Variables
x = 5

# Functions
f(x, y) { 
    return x + y 
}

# Arrow Functions
add = f(x, y) => x + y

# If Statements
if (condition) { 
    # code 
} else { 
    # code 
}

# While Loops
while (condition) { 
    # code 
}

# Arrays
numbers = [1, 2, 3]

# Objects
person = { 
    name: "John", 
    greet: f() { 
        print("Hello, " + this.name + "!") 
    } 
}

# Built-in Functions
len([1, 2, 3])
print("Hello, World!")

# Array Methods
doubled = [1, 2, 3].map(f(x) => x * 2)

# Break Statements
while (true) {
    if (condition) {
        break
    }
}

# String Methods
text = "Hello, World!"
words = text.split(", ")
stripped = text.strip()
```

## Architecture

The project is structured into different components:

1. **Lexer**: Tokenizes the source code into individual tokens.
2. **Parser**: Converts tokens into an Abstract Syntax Tree (AST).
3. **AST Nodes**: Defines various node types like Expression, Statement, Identifier, etc.
4. **Evaluator**: Executes the AST, applying operations and built-in functions.
5. **Environment**: Manages variable bindings and scope.
6. **Objects**: Represents different types of values in the language (e.g., Integer, String, Array).

## Tutorial

Let's create a simple program to demonstrate some features of the custom language:

```plaintext
# Define a function to calculate factorial
factorial = f(n) {
    if (n == 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
};

# Create an array of numbers
numbers = [5, 3, 7, 2, 8];

# Use built-in functions and a loop to calculate factorials
print("Factorials:");
i = 0;
while (i < len(numbers)) {
    num = numbers[i];
    result = factorial(num);
    print(num + "! = " + result);
    i = i + 1;
}

# Define an object with methods
math_helper = {
    square: f(x) { return x * x; },
    cube: f(x) { return x * x * x; }
};

# Use object methods and array methods
print("Squares and Cubes:");
numbers.map(f(num) {
    print(num + ": square = " + math_helper.square(num) + ", cube = " + math_helper.cube(num));
});

# Demonstrate array filter method
even_numbers = numbers.filter(f(num) { return num % 2 == 0; });
print("Even numbers: " + even_numbers);

# String manipulation
message = "Hello, World!";
words = message.split(", ");
print("Words: " + words);
```

This program demonstrates:
1. Function definition and recursion (factorial function)
2. Array usage and array methods (map, filter)
3. While loops
4. Built-in functions (len, print)
5. Object definition with methods
6. Higher-order functions
7. String manipulation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
