## kpy

> CLI and Node.js API to copy files with globs, promises, typescript and stuff.

[![npm](https://img.shields.io/npm/v/kpy/latest.svg)](https://www.npmjs.com/package/kpy)
[![](https://circleci.com/gh/kirillgroshkov/kpy.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/kirillgroshkov/kpy)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Features

- Dead simple (see examples), minimalistic
- Provides both CLI and API (so you don't need 2 separate packages)
- Provides Typescript typings (so you don't need 3 separate packages)
- Relies on proven lower-level libs (globby, cp-file, yargs)
- Report progress to STDOUT by default (unless `--silent` is used)

Just run `kpy help` to see CLI options.

# CLI API

    kpy <baseDir> <pattern1> <pattern2> ... <outputDir>

Example, copy all from `test` to `out`:

    kpy test out

Example, copy all `*.txt` file from `test`, except `one.txt` to `out`:

    kpy test **/*.txt !**/one.txt out

Options:

- `--silent` - don't output any progress
- `--dotfiles` - include files starting with `.`
- `--no-overwrite` - don't overwrite
- `--flat` - flatten the output folders
- `--dry` - don't copy (useful for debugging)
- `help` - show available options

# Why

`cpy` has issue with `--cwd`, `--parents`. `--parents` should be default, and `cwd` is confusing.

`cpx` is amazing, but doesn't support multiple globs and therefore negation globs (e.g `test/* !test/one.txt`)

## Example 1

Copy all files/dirs while keeping directory structure from `test/*` to `out`.

Simple, right?

#### cpy

    cpy ** ../out --cwd test --parent

Possible, but not trivial to figure out `..out`, `--cwd`, etc.

#### cpx

    cpx out test

Works really well here!

## Example 2

Copy all files/dirs while keeping directory structure from `test/*.txt` to `out`, excluding `one.txt`.

Simple, right?

#### cpy

    cpy ** !**/one.txt ../out --cwd test --parent

Possible, but not trivial to figure out `..out`, `--cwd`, etc.

#### cpx

Not possible to exclude :(
