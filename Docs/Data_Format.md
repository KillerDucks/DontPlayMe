# Data Formatting
A simple format to keep data consistency between programming languages.

## Sample of a Data Object
```csharp
// Single Object Examples
|KEY:VALUE| // Single item of information in a single object
|KEY:VALUE#KEY:VALUE| // Two items of information in a single object

// Multiple Object Examples
|KEY:VALUE#KEY:VALUE|+|KEY:VALUE#KEY:VALUE| // Two items of information in two objects

// Data Types
|KEY:1,2,3,4| // Array {Numerical Example}
|KEY:"a","b","c","d"| // Array {Alphanumerically Example}

|KEY:/|KEY2#VALUE|| // Nested Objects [TODO]
```