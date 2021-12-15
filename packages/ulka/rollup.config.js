import fs from 'fs'
import path from 'path'
import MagicString from 'magic-string'

// plugins
import json from '@rollup/plugin-json'
import license from 'rollup-plugin-license'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'

export default [
  {
    input: {
      index: path.join(__dirname, 'src', 'index.ts'),
      cli: path.join(__dirname, 'src', 'cli.ts'),
    },
    output: {
      dir: path.join(__dirname, 'dist'),
      entryFileNames: `[name].js`,
      chunkFileNames: 'chunk-[hash].js',
      exports: 'named',
      format: 'cjs',
    },
    external: ['fsevents'],
    plugins: [
      typescript(),
      nodeResolve({ preferBuiltins: true }),
      commonjs({
        ignoreTryCatch: true,
        ignoreDynamicRequires: true,
      }),
      json(),
      licensePlugin(),
      replaceEvalWithFunction(),
    ],
  },
]

function replaceEvalWithFunction() {
  const evalStatement = 'eval(str)'
  const replacementCode = `(new Function('return ' + str)())`
  return {
    transform(code, id) {
      if (id.replace(/\\/g, '/').includes('gray-matter/lib/engines.js')) {
        const positionOfEvalStatement = code.indexOf(evalStatement)

        if (positionOfEvalStatement < 0) return

        const magicString = new MagicString(code)

        magicString.overwrite(
          positionOfEvalStatement,
          positionOfEvalStatement + evalStatement.length,
          replacementCode
        )

        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true }),
        }
      }
    },
  }
}

// https://github.com/vitejs/vite/blob/main/packages/vite/rollup.config.js
function licensePlugin() {
  return license({
    thirdParty(dependencies) {
      const coreLicense = fs.readFileSync(
        path.resolve(__dirname, '../../LICENSE')
      )
      const licenses = new Set()
      const dependencyLicenseTexts = dependencies
        .sort(({ name: nameA }, { name: nameB }) => (nameA > nameB ? 1 : -1))
        .map(
          ({
            name,
            license,
            licenseText,
            author,
            maintainers,
            contributors,
            repository,
          }) => {
            let text = `## ${name}\n`
            if (license) {
              text += `License: ${license}\n`
            }
            const names = new Set()
            if (author && author.name) {
              names.add(author.name)
            }
            for (const person of maintainers.concat(contributors)) {
              if (person && person.name) {
                names.add(person.name)
              }
            }
            if (names.size > 0) {
              text += `By: ${Array.from(names).join(', ')}\n`
            }
            if (repository) {
              text += `Repository: ${repository.url || repository}\n`
            }
            if (licenseText) {
              text +=
                '\n' +
                licenseText
                  .trim()
                  .replace(/(\r\n|\r)/gm, '\n')
                  .split('\n')
                  .map((line) => `> ${line}`)
                  .join('\n') +
                '\n'
            }
            licenses.add(license)
            return text
          }
        )
        .join('\n---------------------------------------\n\n')
      const licenseText =
        `# Ulka core license\n` +
        `Ulka is released under the MIT license:\n\n` +
        coreLicense +
        `\n# Licenses of bundled dependencies\n` +
        `The published Ulka artifact additionally contains code with the following licenses:\n` +
        `${Array.from(licenses).join(', ')}\n\n` +
        `# Bundled dependencies:\n` +
        dependencyLicenseTexts

      fs.writeFileSync('LICENSE.md', licenseText)
    },
  })
}
