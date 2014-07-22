var path = Npm.require("path");
var fs   = Npm.require("fs");
var sh   = Npm.require('execSync');


var optionsBuilder = function(options) {
  if (typeof options !== "object")
    return null;
  if (typeof options.file !== "string")
    return null;

  var bool = function(name, value) {
    return function(v) {
      if (v === value)
        return name;
      else
        return null;
    }
  }
  var param = function(name) {
    return function(value) {
      if (value)
        return name + " " + value;
      else
        return null;
    }
  }
  var map = {
    "style":           param("--style"),
    "cacheLocation":   param("--cache-location"),
    "import":          param("--load-path"),
    "precision":       param("--precision"),
    "require":         param("--require"),
    "defaultEncoding": param("--default-encoding"),

    "unixNewlines":    bool("--unix-newlines", true),
    "comments":        bool("--line-comments", true),
    "scss":            bool("--scss",          true),
    "compass":         bool("--compass",       true),
    "noCache":         bool("--no-cache",      true),
    "sourcemap":       bool("--sourcemap",     true)
  }

  var result = [];
  result.push("sass");
  result.push(options.file);

  for (var key in map) {
    var r = map[key](options[key]);
    if (r) result.push(r);
  }

  if (options.output) result.push(options.output);

  return result.join(" ");
}


var sourceHandler = function(compileStep) {
  var optionsFile = path.join(process.cwd(), 'ruby-sass.json');
  var options = {};

  if (fs.existsSync(optionsFile)) {
    var content = fs.readFileSync(optionsFile);
    options = JSON.parse(content);
  }
  var cmd = optionsBuilder(options);
  if (cmd) {
    var r = sh.exec(cmd);
    if (r.code) {
      compileStep.error({
        message: "Sass compiler error: \n" + r.stdout
      });
    }
    else {
      var data = r.stdout;
      if (options.output) {
        data = fs.readFileSync(optionsFile, "utf-8");
      }
      compileStep.addStylesheet({
        path: options.output || (options.file + ".css"),
        data: data
      });
    }
  }
  else {
    return;
  }
}

Plugin.registerSourceHandler("scss", sourceHandler);
Plugin.registerSourceHandler("sass", sourceHandler);
