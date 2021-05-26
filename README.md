<p align="center">
  <a href="https://ulka.js.org" target="_blank" rel="noopener noreferrer">
    <img src="https://i.imgur.com/1XTIJAZ.png" alt="Ulka logo">
  </a>
</p>
<br />
<p align="center">
<a href="https://www.npmjs.com/package/ulka"><img alt="NPM" src="https://img.shields.io/npm/v/ulka?&labelColor=black&color=darkred&logo=npm&label=npm" /></a>
<a href="https://github.com/acharyaroshanji/ulka"><img alt="MIT" src="https://img.shields.io/npm/l/ulka?color=darkgreen&labelColor=black&&logo=github" /></a>
<a href="https://github.com/prettier/prettier"><img alt="Prettuer" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?color=b3095d&labelColor=black&logo=prettier"></a>
<a href="#"><img alt="CI" src="https://img.shields.io/github/workflow/status/ulkajs/ulka/CI?color=darkgreen&label=CI&logo=github&labelColor=black"></a>
<a href="https://github.com/ulkajs/ulka"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?labelColor=black&logo=github&color=darkgreen" alt="PRs welcome!" /></a>
<a href="https://github.com/ulkajs/ulka"><img src="https://img.shields.io/badge/types-Typescript-black?labelColor=black&logo=typescript&color=blue" alt="PRs welcome!" /></a>
</p>

# Ulka

> A simple static site generator written in javascript.

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
