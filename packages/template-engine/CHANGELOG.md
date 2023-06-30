# 1.0.0 (2023-06-30)


### Bug Fixes

* fixed unknown type error on catch blocks ([d777b03](https://github.com/ulkajs/ulka/commit/d777b03bfc11c0c0563bb0b1bb2a935c11a5724c))
* **template-engine:** added console to engine's default context object ([13d4357](https://github.com/ulkajs/ulka/commit/13d43577315787609aaeae4434997dfa2a165063))
* **template-engine:** fixed base path for included files ([1b60320](https://github.com/ulkajs/ulka/commit/1b603205d275c8744ee73e51c70c3062594cd771))
* **template-engine:** fixed the error thrown on using variable from template which includes the another template ([f2adb6a](https://github.com/ulkajs/ulka/commit/f2adb6ab6890d9851a1158595750ad7aa4bfd885))
* **template-engine:** render empty string instead of undefine, specially needed in case of variable assignment ([e9ea783](https://github.com/ulkajs/ulka/commit/e9ea783a49ee850296469c61b04e715f28188b64))


### Features

* **template-engine:** add ulka-render cli support ([007eda9](https://github.com/ulkajs/ulka/commit/007eda9be6cd95dfed8ce0488a70478a2a693542))
* **template-engine:** create @ulka/template-engine ([d110f93](https://github.com/ulkajs/ulka/commit/d110f93a2d2660c8847cc89de1a85303b1f84c51))
* v1.0.0 ([fab8467](https://github.com/ulkajs/ulka/commit/fab8467efb77cfceb5c479c2dc7263bad1108f1a))



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
