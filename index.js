const fs = require("fs");
const path = require("path");
const glob = require("glob");
const pluginName = "WebpackPluginChmod";

const warn = (logger, message, path) => {
  const errorMessage = `${message} ${path}`;
  if (logger) {
    logger.warn(errorMessage);
  } else {
    console.warn(`${pluginName}: ${errorMessage}`);
  }
};

function WebpackPluginChmod(options) {
  this.paths = options.paths;
  this.globOptions = options.globOptions || {};
  this.chmod = options.chmod || 0o755;
}

WebpackPluginChmod.prototype.apply = function (compiler) {
  const webpackPluginChmod = () => {
    const logger =
      compiler.getInfrastructureLogger &&
      compiler.getInfrastructureLogger(pluginName);

    if (this.paths) {
      const outputPath = compiler.options.output.path;
      warn(logger, "Pattern in", outputPath);

      for (let k in this.paths) {
        let pattern, globOptions, chmod;
        if (typeof this.paths[k] === "string") {
          pattern = path.join(outputPath, this.paths[k]);
          globOptions = this.globOptions;
          chmod = this.chmod;
        } else {
          pattern = path.join(outputPath, this.paths[k].path);
          globOptions = this.paths[k].globOptions || this.globOptions;
          chmod = this.paths[k].chmod || this.chmod;
        }

        warn(logger, "List files with glob pattern", pattern);
        const files = glob.sync(pattern, globOptions);

        for (const fi of files) {
          if (fs.existsSync(fi)) {
            warn(logger, "Apply CHMOD to", fi);
            fs.chmodSync(fi, chmod);
          }
        }
      }
    }
  };

  const webpackTap =
    compiler.hooks &&
    compiler.hooks.done &&
    compiler.hooks.done.tap.bind(compiler.hooks.done);

  if (webpackTap) {
    webpackTap(pluginName, webpackPluginChmod);
  } else {
    compiler.plugin("done", webpackPluginChmod);
  }
};

module.exports = WebpackPluginChmod;
