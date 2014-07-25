var path = Npm.require("path");
var fs   = Npm.require("fs");
var sh   = Npm.require('execSync');

var isEmpty = function(obj) {
  if (typeof obj === "object")
    if (obj instanceof Array)
      return obj.length === 0
    else {
      return Object.keys(obj).length === 0
    }
  else
    return !Boolean(obj)
}

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

var isModified = function(stat, file) {
  var newStat = fs.statSync(file)
  var t1 = stat.mtime && stat.mtime.getTime();
  var t2 = newStat.mtime && newStat.mtime.getTime();
  var eq = (t1 !== t2);
  stat.mtime = newStat.mtime;
  return eq;
}

var _options = {};
var _optionsStat = {};
var readOptions = function(file) {

  var read = function(file) {
    var content = fs.readFileSync(file);
    return JSON.parse(content);
  }

  var exists = fs.existsSync(file);

  if (exists && isEmpty(_options)) {
    _options = read(file);
  }
  else if (exists && isModified(_optionsStat, file)) {
    _options = read(file);
  }
  return _options;
}


var _cache = {};
var sourceHandler = function(compileStep) {
  var optionsFile = path.join(process.cwd(), 'ruby-sass.json');
  var options     = readOptions(optionsFile);
  var cmd         = optionsBuilder(options);

  _cache[compileStep.inputPath] = _cache[compileStep.inputPath] || {}
  var stat = _cache[compileStep.inputPath];

  if (cmd && isModified(stat, compileStep.inputPath)) {
    if (!stat.data) {
      var r = sh.exec(cmd);
      stat.data = r.stdout;
      stat.code = r.code;
    }
    if (stat.code) {
      compileStep.error({
        message: "Sass compiler error: \n" + stat.data
      });
    }
    else {
      var data = stat.data;
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
