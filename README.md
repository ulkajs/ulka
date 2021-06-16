<p align="center">
  <a href="https://ulka.js.org" target="_blank" rel="noopener noreferrer">
    <img width="120px" src="https://coderosh.github.io/static-files/ulkajs/svg/logo.svg" alt="Ulka logo">
  </a>
</p>
<h2 align="center">Ulka</h2>
<p align="center">A simple, fast and lightweight static site generator written in javascript.</p>

<br />
<p align="center">
<a href="https://www.npmjs.com/package/ulka"><img alt="NPM" src="https://img.shields.io/npm/v/ulka" /></a>
<a href="https://github.com/ulkajs/ulka"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
<a href="#"><img alt="CI" src="https://img.shields.io/github/workflow/status/ulkajs/ulka/CI"></a>
<a href="https://github.com/ulkajs/ulka"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
<a href="https://github.com/ulkajs/ulka"><img src="https://img.shields.io/badge/types-typescript-blue.svg" alt="PRs welcome!" /></a>
</p>

## 🚀 Getting Started

1. Create new ulka site.

   ```sh
   # with npm
   npm init @ulkajs/app

   # with yarn
   yarn create @ulkajs/app
   ```

   Then chose the template and project name.

   OR you can directly specify project name and template

   ```sh
    # with npm
    npm init @ulkajs/app my-blog -- --template default-blog

    # with yarn
    yarn create @ulkajs/app my-blog --template default-blog
   ```

1. Navigate to project name and install dependencies.

   ```sh
    cd my-blog

    # with npm
    npm install

    # with yarn
    yarn install
   ```

1. Build your project.

   ```sh
   # with npx
   npx ulka # build the project
   npx ulka -w # build and watch

   # with yarn
   yarn ulka # build the project
   yarn ulka -w # build and watch
   ```

## Documentation

Visit [ulka.js.org](https://ulka.js.org) for documentation and tutorial.

## License

[MIT](https://mit-license.org/)
