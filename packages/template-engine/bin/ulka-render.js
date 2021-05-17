#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const { render } = require('../dist')
const pkg = require('../package.json')

const cwd = process.cwd()
const args = process.argv.splice(2)

const helpText = `
Usage: ulka-render <input> [options]

${pkg.description}

Options:
    -t --template\t path to template if input not provided
    -h --help    \t display help
`

function run() {
  if (args.includes('--help') || args.includes('-h'))
    return console.log(helpText)

  if (args[0].startsWith('--') || args[0].startsWith('-')) {
    let indexOfT = args.indexOf('-t')
    if (indexOfT < 0) indexOfT = args.indexOf('--template')
    if (indexOfT < 0 || typeof args[indexOfT + 1] !== 'string')
      return console.log(`> You need to provide valid template or input`)

    const tmpPath = path.join(cwd, args[indexOfT + 1])
    if (!fs.existsSync(tmpPath))
      return console.log("> Given template path doesn't exist")

    if (fs.statSync(tmpPath).isDirectory())
      return console.log(
        '> Template path should be to a file, instead given a directory'
      )

    const input = fs.readFileSync(tmpPath, 'utf-8')
    console.log(render(input, {}, { base: path.parse(tmpPath).dir }))
  } else {
    console.log(render(args[0] || '', {}, { base: cwd }))
  }
}

run()
