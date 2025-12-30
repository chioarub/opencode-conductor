# C++ Style Guide Summary

This document summarizes key rules and best practices for modern C++ development, based on the Google C++ Style Guide and the C++ Core Guidelines.

## 1. Naming Conventions
- **Files**: `snake_case.cc` and `snake_case.h`.
- **Types (Classes, Structs, Type Aliases, Enums)**: `UpperCamelCase` (e.g., `HttpRequest`).
- **Variables (Local and Class Members)**: `lowerCamelCase` (e.g., `localVariable`). 
  - *Note: Some styles use `snake_case` or `trailing_underscore_` for private members.*
- **Functions & Methods**: `UpperCamelCase` (e.g., `OpenFile`).
- **Constants**: `kUpperCamelCase` (e.g., `kDaysInAWeek`).
- **Namespaces**: `lower_snake_case`.

## 2. Header Files
- **Self-contained Headers**: Headers should be self-contained and have `#define` guards (e.g., `PROJECT_PATH_FILE_H_`).
- **Include Order**: 
  1. Related header
  2. C system headers
  3. C++ library headers
  4. Other library headers
  5. Project headers

## 3. Scoping and Classes
- **Namespaces**: Wrap code in namespaces to avoid name collisions. Do not use `using namespace std;` in header files.
- **Classes**: 
  - Keep constructors small. Use `explicit` for single-argument constructors.
  - Avoid complex initialization in constructors; use an `Init()` method if necessary.
  - Mark overriding methods with `override`.
- **Structs vs. Classes**: Use `struct` only for passive data carriers (POD). Everything else should be a `class`.

## 4. Modern C++ Features (C++11 and later)
- **`auto`**: Use `auto` to avoid repeating type names, but only when it improves readability.
- **Smart Pointers**: Prefer `std::unique_ptr` for ownership. Use `std::shared_ptr` only when ownership must be shared. Never use `std::auto_ptr`.
- **`nullptr`**: Always use `nullptr` instead of `NULL` or `0`.
- **Brace Initialization**: Use `{}` for initialization where appropriate.

## 5. Memory Management
- **Avoid Raw Pointers**: Use smart pointers or references.
- **RAII**: Resource Acquisition Is Initialization is a fundamental pattern. Manage resources (memory, file handles, locks) via object lifetimes.

## 6. Formatting
- **Indentation**: 2 spaces (Google style).
- **Line Length**: 80 characters limit is preferred.
- **Braces**: Opening brace on the same line as the statement.

*Source: [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)*
