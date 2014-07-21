var path = Npm.require("path");
var fs   = Npm.require("fs");
var sh   = Npm.require('execSync');

var sourceHandler = function(compileStep) {
  var optionsFile = path.join(process.cwd(), 'ruby-sass.json');
  var options = {};

  if (fs.existsSync(optionsFile)) {
    var content = fs.readFileSync(optionsFile);
    options = JSON.parse(content);
  }
  if (options.input) {
    var r = sh.exec("sass " + options.input);
    if (r.code) {
      compileStep.error({
        message: "Scss compiler error: \n" + r.stderr
      });
    }
    else {
      compileStep.addStylesheet({
        path: options.input + ".css",
        data: r.stdout
      });
    }
  }
  else {
    return;
  }
}

Plugin.registerSourceHandler("scss", sourceHandler);
Plugin.registerSourceHandler("sass", sourceHandler);
