import fs from 'fs'
import path from 'path'
import c from 'ansi-colors'
import minimist from 'minimist'
import { prompt } from 'enquirer'

const args = minimist(process.argv.slice(2))

const cwd = process.cwd()

const templates = ['default', 'default-sass']

// modified from https://github.com/vitejs/vite/blob/main/packages/create-app/index.js
export async function run() {
  try {
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
      template = templates.includes(template) ? template : null
    }

    if (!template) {
      ;({ template } = await prompt({
        type: 'select',
        name: 'template',
        message: 'Choose a default starter',
        choices: templates.map((t) => ({
          value: t,
          name: t,
          message: c.cyan(t),
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
  } catch (err) {
    console.log(c.redBright(`> ${err.message}`))
  }
}

function copy(src: string, dest: string) {
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
