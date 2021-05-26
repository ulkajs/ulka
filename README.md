<p align="center">
  <a href="https://ulka.js.org" target="_blank" rel="noopener noreferrer">
    <img width="120px" src="https://coderosh.github.io/static-files/ulkajs/svg/logo.svg" alt="Ulka logo">
  </a>
</p>
<br />
<p align="center">
<a href="https://www.npmjs.com/package/ulka"><img alt="NPM" src="https://img.shields.io/npm/v/ulka" /></a>
<a href="https://github.com/acharyaroshanji/ulka"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
<a href="#"><img alt="CI" src="https://img.shields.io/github/workflow/status/ulkajs/ulka/CI"></a>
<a href="https://github.com/ulkajs/ulka"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
<a href="https://github.com/ulkajs/ulka"><img src="https://img.shields.io/badge/types-typescript-blue.svg" alt="PRs welcome!" /></a>
</p>

<p align="center">A simple static site generator written in javascript.</p>

## 🚀 Getting Started

1. Create new ulka site.

   ```sh
   # with npm
   npm init @ulkajs/app

   # with yarn
   yarn create @ulkajs/app
   ```

   Then follow the prompts.

   OR you can directly specify project name and template

   ```sh
    # with npm
    npm init @ulkajs/app my-blog -- --template default-blog

    # with yarn
    yarn create @ulkajs/app my-blog --template default-blog
   ```

2. Navigate to project name and install dependencies.

   ```sh
    cd my-blog

    # with npm
    npm install

    # with yarn
    yarn install
   ```

3. Build your project.

   ```sh
   # with npx
   npx ulka # builds the project
   npx ulka -w # build and watch

   # with yarn
   yarn ulka # build the project
   yarn ulka -w # build and watch
   ```
