## v1.0.0

- `const/let` is no longer replaced
- Drop support for express
- Used runInContext instead of runInNewContext

## v0.4.1

- BugFix: use of declared variable throws error.

## v0.4.0

- Drop support for async inside ulka

## v0.3.0

- Array with async members returns a string with waited value.

## v0.2.11

- Require files other than javascript.

## v0.2.10

- Destructuring support.

## v0.2.9

- Array joined with empty string by default
  ```
  Prev: {% [1, 2, 3] %} => 1,2,3
  Now:  {% [1, 2, 3] %} => 123
  ```

## v0.2.8

- Require local files using absolute path.

## v0.2.7

- Support for Async/Await
- ulka-parser now returns promise.

## v0.2.6

- Bug fixes
- `-` sign after {% now returns empty string only
  ```
  {% const name = "Roshan Acharya" %}
  {%- name %} (returns empty string)
  ```

## v0.2.3

- Require syntax support.
- `=` sign after {% now allows to return value even after variable assignment.
  ```
  {%= const name  = "Roshan Acharya" %}
  // Roshan Acharya
  ```

## v0.2.0 - Command Line

- ulka-parser is able to convert .ulka files to .html files from command line.

  ```
  ulka-parser --template /path/to/template/folder/or/file --output /path/to/output/folder
  ```

  ```
  ulka-parser --t /path/to/template/folder/or/file --o /path/to/output/folder
  ```

## v0.1.0

- First release

```
npm install ulka-parser
```
