# Evo - JS parser combinators

Naive implementation of some parsers and combinators. It works, but can be confusing and needs better parsing error handling.

## Examples

### Addition

TODO

### JSON

TODO

## Parser Builders

Used to build simple parsers.

- char
- notChar
- literal

## Parsers

Receives a string as input and returns either a pair with the parsed value and the remaining input or a string informing an error.

- digit
- integer
- lowerLetter
- upperLetter
- letter
- word
- whitespace

## Combinators

Receives one or more parsers and combine or modify their results.

- choice
- seq
- map
- many
- many1
- skip

## Quick start

It requires no dependency, you can just run it with Node.
