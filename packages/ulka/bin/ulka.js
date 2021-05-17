#!/usr/bin/env node

const c = require('ansi-colors')
const { program } = require('commander')

const pkgJson = require('../package.json')
const { run } = require('../dist/cli')

// disable color if DISABLE_COLOR env is true
c.enabled = !process.env.DISABLE_COLOR

program
  .option('-w --watch [boolean]', 'create live server and watch files', false)
  .option('-c --config-path [string]', 'path to config', 'ulka-config.js')
  .option('-d --cwd [string]', 'project directory', '.')
  .option('-p --port [string]', 'server port', '8000')
  .option('-l --log [boolean]', 'verbose logs', false)
  .action(run)

program.configureHelp({
  optionTerm: (op) => c.bold.cyan(op.flags),
  optionDescription: (op) => c.dim(op.description),
})

program.configureOutput({
  outputError: (err, write) =>
    write(
      c.redBright.bold('> ') +
        err +
        `\nUse ulka --help to see available options\n`
    ),
})

program.addHelpText(
  'afterAll',
  `
${c.yellow('Github')}: https://github.com/ulkajs/ulka/
${c.blueBright('Website')}: https://ulka.js.org/
  `
)
program.name(pkgJson.name).description(pkgJson.description)
program.version(pkgJson.version, '-v --version')
program.parse(process.argv)
