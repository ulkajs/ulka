#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const c = require('ansi-colors')
const { prompt } = require('enquirer')
const args = require('minimist')(process.argv.slice(2))

const cwd = process.cwd()

const templates = [
  {
    name: 'default',
    color: c.yellow,
  },
  {
    name: 'default-sass',
    color: c.magentaBright,
  },
  {
    name: 'default-typescript',
    color: c.blueBright,
  },
]

async function run() {
  let targetDir = args._[0]

  if (!targetDir) {
    ;({ projectName: targetDir } = await prompt({
      type: 'input',
      name: 'projectName',
      message: 'Project name: ',
      initial: 'my-blog',
    }))
  }

  const packageName = targetDir
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')

  const root = path.join(cwd, targetDir)

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  } else {
    if (fs.readdirSync(root).length)
      throw new Error(`${root} is not a empty directory`)
  }

  let template = args.t || args.template

  if (typeof template === 'string') {
    template = templates.some((val) => val.name === template) ? template : null
  }

  if (!template) {
    ;({ template } = await prompt({
      type: 'select',
      name: 'template',
      choices: templates.map((m) => ({
        value: m.name,
        message: m.color(m.name + '-starter'),
      })),
    }))
  }

  const templateDir = path.join(__dirname, `templates`, template)
  const pkgFile = path.join(templateDir, 'package.json')
  const pkgJson = require(pkgFile)
  pkgJson.name = packageName

  console.log(c.greenBright(`\n> Scaffolding project in ${root}...`))

  copy(templateDir, root)
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(pkgJson, null, 2)
  )

  console.log(c.cyanBright(`\nDone. Now run:\n`))
  if (root !== cwd)
    console.log(c.yellowBright(`> cd ${path.relative(cwd, root)}`))

  console.log(c.blueBright(`> npm install`))
  console.log(c.blueBright(`> npm run dev`))
  console.log()
}

run().catch((err) => {
  console.log(c.redBright(err.message))
})

function copy(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })

    for (let file of fs.readdirSync(src)) {
      if (file === '_gitignore') file = '.gitignore'
      copy(path.join(src, file), path.join(dest, file))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}
