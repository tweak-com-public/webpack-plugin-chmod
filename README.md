# Webpack Plugin chmod

Improved version of [webpack-permissions-plugin](https://github.com/GeKorm/webpack-permissions-plugin) using GLOB to identify files.

A webpack plugin to manage the permissions of output files and directories
Tested with **Webpack 2, 3 and 4**

### Install

- Yarn: `yarn add -D webpack-plugin-chmod`
- Npm: `npm i -D webpack-plugin-chmod`

### Usage

**paths** (_Array< String|Object>_) The directories to chmod recursively
**globOptions** (_Object_) Options to pass to GLOB
**chmod** (_Number|String_ defaulted to 755) Permissions to set to all paths

###### Simple: Files 755

```javascript
const ChmodPlugin = require("webpack-plugin-chmod");

plugins.push(
  new ChmodPlugin({
    paths: [
      "./node_modules/.bin/**",
      "./node_modules/**/.bin/**",
      "./node_modules/**/bin/**",
      "./node_modules/**/vendor/**",
    ],
  })
);
```

###### Advanced: Per-path modes

```javascript
const ChmodPlugin = require("webpack-plugin-chmod");

plugins.push(
  new ChmodPlugin({
    paths: [
      {
        path: "./node_modules/.bin/**",
        globOptions: {},
        chmod: 0o755,
      },
    ],
  })
);
```
