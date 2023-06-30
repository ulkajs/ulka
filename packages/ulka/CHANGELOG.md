# 1.0.0 (2023-06-30)


### Bug Fixes

* add api-extractor ad dev deps ([c2875ce](https://github.com/ulkajs/ulka/commit/c2875ceb7e41fc475cdb1c2f45aee82f71a8886c))
* added include path as root to fix include not working ([7d186bf](https://github.com/ulkajs/ulka/commit/7d186bf150f1779181b990fca60b6928650a651d))
* added support delete cache for user provided config path ([0092a8a](https://github.com/ulkajs/ulka/commit/0092a8ac6706b85145178e8a1b173f83ad2d91be))
* checked for extension before appending slash in cleanlink ([58bd003](https://github.com/ulkajs/ulka/commit/58bd003558649a18a29add3d12406aa90973628b))
* collectionContents now returns fresh contents ([57e351b](https://github.com/ulkajs/ulka/commit/57e351b31746667e7f9cc27c9fa3daea6e5607a3))
* create directory before copying files ([0f87078](https://github.com/ulkajs/ulka/commit/0f87078405de42a416e4b5a95d64b1026ed37acd))
* fix shebang in bin/ulka.js and add @ulka/template-engine as dep in ulka ([a901a3b](https://github.com/ulkajs/ulka/commit/a901a3b4ba5c42f5c1fc3715b5a514447caede5e))
* fix types import in ./types ([ddabe24](https://github.com/ulkajs/ulka/commit/ddabe2476820b4d35609f3abc71ea422363f9d85))
* fixed collection.paginate returning without pushing paginated conteents to the collection contents ([529d3a2](https://github.com/ulkajs/ulka/commit/529d3a251f98d3b132a6d223f9df9756d60ee20f))
* fixed custom port not working ([0c056b6](https://github.com/ulkajs/ulka/commit/0c056b6992b4bc4def85d1c18976fecd48a7f9fa))
* fixed first index of paginate link not working when permalink is infer ([655c063](https://github.com/ulkajs/ulka/commit/655c063e91e031b52b219a1c748575ce172edac8))
* fixed matter being lost on layout ([80158d1](https://github.com/ulkajs/ulka/commit/80158d18afe1694fb843c3f674ddc9859190061c))
* fixed tpl.link is empty string in config.link function ([e248f76](https://github.com/ulkajs/ulka/commit/e248f767f27b00044a834e3d76bdc470363cbca0))
* fixed unknown type error on catch blocks ([d777b03](https://github.com/ulkajs/ulka/commit/d777b03bfc11c0c0563bb0b1bb2a935c11a5724c))
* **plugin-sass:** add ulka and sass as dev dependencies ([a554641](https://github.com/ulkajs/ulka/commit/a554641860a194e01df2103365b5631e5c16398f))
* **plugin-sass:** removed cache cause my implementation of cache sucked ([9b67466](https://github.com/ulkajs/ulka/commit/9b674662982fe47288c4447d16e785facf7b7a8e))
* read configs at last so that all props will be available inside ulka-config ([fc23b97](https://github.com/ulkajs/ulka/commit/fc23b97a381785a38010b24d72c9d56e3345125e))
* removed code to empty the plugins in ulka.reset ([26b2aaa](https://github.com/ulkajs/ulka/commit/26b2aaa2e26b263a8aa889b104e72f255ad821b1))
* replaced unixify with normalize-path ([0484dc2](https://github.com/ulkajs/ulka/commit/0484dc297824a3a96d5a961877e2f8cae1768501))
* reset all renderers on change ([f426774](https://github.com/ulkajs/ulka/commit/f4267747285bc8d6c102b2c897ed90bc6d765dfa))
* set dynamic partials as true for liquidjs in mdtemplate ([8050432](https://github.com/ulkajs/ulka/commit/805043278d23251e7f4462294015dab3ff3a972a))
* used static server middleware right before listening to server instead of in constructor ([38d5319](https://github.com/ulkajs/ulka/commit/38d5319ea68ccf64e1cb449177b1047fb835a47a))
* used unixify on layoutpath ([0e5be09](https://github.com/ulkajs/ulka/commit/0e5be09b2bf9fe86bd7d85e73fff4f841d316bdc))


### Features

* add custom server to servestatic files ([02cf75c](https://github.com/ulkajs/ulka/commit/02cf75cfe61a10ca8eea492ba8b73da32bfa5adb))
* add pagination support ([883d9e8](https://github.com/ulkajs/ulka/commit/883d9e8db0a1e6b43ac4a3b5b587127862fe45a6))
* add support for liquid syntax inside special frontmatters ([6e15390](https://github.com/ulkajs/ulka/commit/6e1539089e78006977db98f7652b432c769d740a))
* add support for nested layout ([635372e](https://github.com/ulkajs/ulka/commit/635372e65eaf6203d4cc618475c902d3409dcb09))
* add template classes for ejs, liquid and markdown ([904f029](https://github.com/ulkajs/ulka/commit/904f029a129db6a8b678552f85927da00ccfe61a))
* add ulka and collection class ([07c4658](https://github.com/ulkajs/ulka/commit/07c4658f67cd2e32c89095b430f0922828e88984))
* add ulka cli ([67ac3a7](https://github.com/ulkajs/ulka/commit/67ac3a764ae22bb6f8df5c13eb006bec76aeca19))
* add ulka template support ([aa85142](https://github.com/ulkajs/ulka/commit/aa85142e9d3935129c1376c2006883ae12a778e9))
* added connect server and cors middleware ([80624d4](https://github.com/ulkajs/ulka/commit/80624d4ece7b30a6a3b00bfbba16865b7e2357cd))
* added feature to infer _permalink from _paginate.permalink ([225f04e](https://github.com/ulkajs/ulka/commit/225f04e1ed31018138e66ae04b3b6a9efd372f91))
* added feature to run plugins before and after context creation ([bd2b04f](https://github.com/ulkajs/ulka/commit/bd2b04f837d3d79528887c75372cb7fe0b57552a))
* added metaData from configs to context of template ([6b40f83](https://github.com/ulkajs/ulka/commit/6b40f8338ab2802a07afa9d3cf59e21d18bad9f2))
* added option to add layout from config without mutating matter ([f0da72e](https://github.com/ulkajs/ulka/commit/f0da72e132f760ccd7049a0f6be1bf7f44efaf12))
* added support to copy file directly to build folder ([d86db4e](https://github.com/ulkajs/ulka/commit/d86db4e283e3895e245ac9cc63adab27c99658b4))
* added support to get single value in current, next and prev when size is 1 ([c975ea1](https://github.com/ulkajs/ulka/commit/c975ea1e6548479d7e76f2f8070329d4ee4e346b))
* added support to provide functions in ulka-configs.plugin ([78e3ac4](https://github.com/ulkajs/ulka/commit/78e3ac4cef67f6a6fe7ac373d9e95cdb52e94452))
* added support to provide key in _paginate.data ([fe59bdf](https://github.com/ulkajs/ulka/commit/fe59bdfbf25746301fd75f3950f104d7b5dd1a9a))
* added use function to add plugin from ulka instance ([a78b051](https://github.com/ulkajs/ulka/commit/a78b05130dff50af55133c6b91c7e07309ef8b89))
* allow option to pass output function for copying ([9ef5d96](https://github.com/ulkajs/ulka/commit/9ef5d966afccb8d6a7d2bca51fe484e35045a8b1))
* created sass plugin ([1848df2](https://github.com/ulkajs/ulka/commit/1848df22aa75092694bb9e1cad1e583383a058a0))
* exported defineConfig function for auto completion ([4d0672e](https://github.com/ulkajs/ulka/commit/4d0672eee039f38614dfc20ede5a90f7390b6f12))
* print network address of server ([3ae6a07](https://github.com/ulkajs/ulka/commit/3ae6a078d4c987e546f70e6b3f0a8683e7ebc398))
* set dynamic partials as true for liquidjs ([291883a](https://github.com/ulkajs/ulka/commit/291883a899947074cd20b854e237184f586728fc))
* setup ulka again if config file is changed ([a67b9af](https://github.com/ulkajs/ulka/commit/a67b9afb8651eba0705d2920b0f12bb64a63d3a7))
* slugify name of html files ([af52c7e](https://github.com/ulkajs/ulka/commit/af52c7e2d63a3740fb209622a9f161419f7497d6))
* used object keys to paginate from typeof context[data] as object ([489b715](https://github.com/ulkajs/ulka/commit/489b715620f2612ef84b3c892f662c12ad04fc9a))
* used object keys to paginate if typeof data is object ([3b6d1a6](https://github.com/ulkajs/ulka/commit/3b6d1a65512699bd9e721fc7c46dcda88c557b35))
* v1.0.0 ([fab8467](https://github.com/ulkajs/ulka/commit/fab8467efb77cfceb5c479c2dc7263bad1108f1a))


### Performance Improvements

* allowed option to pass concurrency in ulka-config.js for p-map ([c3d0f72](https://github.com/ulkajs/ulka/commit/c3d0f727080cd92461f67088f9a8dfd483314d27))



# v1.0.0

- Rewritten entire source code from scratch
- Every content is treated as a template
- Only files mentioned in config file are built
- Context of all templates can be changed from config file
- Different approach for layout and contents
- Build is faster than previous versions
- Support added for `liquid`, `ejs`
- Moved from `remarkable` to `markdown-it`
- Markdown template now supports `liquid` syntax.
- Plugin hooks changed
  ```
  1. afterSetup
  2. beforeBuild
  3. beforeRender -> afterRender -> beforeWrite -> afterWrite
  4. afterBuild
  ```
- Bundled source code with rollup for a faster installation.
- Source is now written in typescript.

# v0.6.7

- Make installer option optional if yarn isn't installed.
- Add charset=utf-8 in Content-Type.
- Fixed svg import.
- Fixed log for server
- Option to return raw data in \$import function.

# v0.6.6

- Assets with format \*.ignore.[ext] are ignored while copying.
- More tests and coverage
- Supported beforeSetup plugin (beforeSetup plugins run before setting map contents map and pages array).
- Removed support for getting prefix from domain in siteMetaData.
- Bug fixes
- Now it's more easy to add templating engines
- Supported use of templating files inside contents (also supports frontmatter).

# v0.6.5

- Added prefix link support
- Added context to external renderers
- Added static files support.
- Made ignore extensions avaiable in info. So that ignore extension can be easily through plugins.
- Bug fix for 404 page. Create 404.html instead of 404/index.html.

# v0.6.4

- Removed cache from ulka render
- Allow plugin to add renderer to info.

# v0.6.3

- Bug fix for async plugins
- Cache hash generate and ulka render

# v0.6.2

- Bug fix for plugins.
- Log whole error if error is due to plugins.

# v0.6.0 - v0.6.1

- Used remarkable to parser markdown.
- Build logic changed.
  - collect data.
  - render to html.
  - generate html files.
  - copy assets.
- Hash function changed to use sha1.
- Async support removed.
- Build speed increased.
- Plugins logic changed.
- Commands changed.
  - serve: serve already built files.
  - develop: built, serve and watch.
  - create: create new project.
- starter template verification before creating new project.

# v0.5.3

- ulka-parser -> 0.3.1
- await the content generate.

# v0.5.2

- globalInfo is exported from index file.
- Better name for functions

# v0.5.1

- Support relative images in markdown.
- Support ulka syntax in markdown.
- Use relative image path for generating hash.
- Bug fixes.

# v0.5.0

- Source class added
  - UlkaSource
  - MdSource
- Removed `$importUlka`
- Added new function `$import`
  - Returns base64 from images.
  - Returns transformed html from ulka and markdown
- [name].ulka.[ext] files are ignored and aren't copied to build directory.
- Complete build on file change (live-server)
- Plugins can modify the arguements provided.
- pagesPath is made optional.
- Jest codecoverage setup and added more tests.
- Refactored code.

# v0.4.2

- Removed remarkable from project. Now ulka uses unifiedjs ecosystem to parse markdown to html.
- Refactored code.
- Support for remark and rehype plugins.

# v0.4.1

- Made plugin more flexible. Plugins now accepts
  - string (package name)
  - function
  - Object with key of resolve and options.
- Build speed increased
- Added mimeTypes for `xml`
- Migrated to typescript
- Upgraded ulka-parser

# v0.4.0

- Implemented plugin system.
- Preparse, postParse, parseFrontMatter supoprt removed.
- Contents folder now accepts both object and array
- Refactored code.

# v0.3.9

- Option to provide default port
- Create command to generate ulka project (deprecated `npx create-ulka-app`)
  ```
  npx ulka create project_name
  ```
- Content files data made available to templates.

# v0.3.8

- Open browser on serving.
- Better logs.

# v0.3.7

- Whole project isn't built when static files changes.
- Error logging improved

# v0.3.6

- Set default base for ulka-parser to cwd.
- Better logs.

# v0.3.3 - v0.3.5

- Generate available port to serve files if asked is already in use
- Update ulka-parse (promises support)
- Relative path supported (Removed absolute path support) in `$importUlka`, `$assets` and in `url` (css).

# v0.2.7 - v0.3.2

- `url(path)` in css transformed to the path in `__assets__` folder.
- Change `.ucss` to `.css`
- Write `ulka` syntax inside `.ucss` file
- Fix `link` value in `contentFiles`

# v0.2.3 - v0.2.6

- Don't reload whole browser for css change. Reload css only.
- Use buildPath from configs intead of static path
- Use `fs.promises` instead of `fs/promises`
- Serving before building fixed.

# v0.2.2

- Server created from scratch to serve build files
- Live reload on change

# v0.2.1

- Import ulka from another file using `$importUlka`
- List of contents generated available in pages `.ulka` files.

# v0.2.0

- Image support in markdown
- Ulka syntax support in markdown

# v0.1.1

- import assets from ulka files

```html
<link rel="stylesheet" href="{% assets('/src/.../style.css') %}" />
```

- Assets are placed in one folder `__assets__` and name is generated using crypto module.

# v0.1.0

First release

```
npx ulka build
```
