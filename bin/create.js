#!/usr/bin/env node

const path = require('path')
const { execSync } = require('child_process')
const fs = require('fs')

const create = async (
  projectName,
  template = 'https://www.github.com/ulkajs/ulka-starter-default.git'
) => {
  try {
    execSync(`git clone ${template} ${projectName}`, {
      stdio: [0, 1, 2]
    })

    console.log('\n>> Installing dependencies... \n'.green)
    execSync(`cd ${projectName} && npm install`, {
      stdio: [0, 1, 2]
    })

    await fs.promises.rmdir(path.join(projectName, '.git'), {
      recursive: true
    })

    console.log(`\n>> cd ${projectName} \n>> npm start`.yellow)
  } catch (e) {
    console.log(`>> ${e.message}`.red)
    throw e
  }
}

module.exports = create
