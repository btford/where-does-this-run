var Module = require('module'),
    falafel = require('falafel'),
    fs = require('fs');

var patch = 'require("' + __dirname + '/patch.js")';

function patchAndReport(source) {
  return falafel(source, function (node) {
    if (node.type === 'CallExpression') {
      node.update(patch + '.run(function() { return ' + node.source() + '; })');
    }
  });
  //return 'require("' + __dirname + '/patch.js").patch(global);' + source + ';console.log(require("' + __dirname + '/patch.js").reportBrowsers());';
}

var IGNORED_FILES = [
  __dirname + '/node_modules/es5-compat-table/data-es5.js',
  __dirname + '/node_modules/es5-compat-table/data-non-standard.js',
  __dirname + '/patch.js'
];

var patchService = require('./patch.js');

module.exports = function () {
  var jsLoader = Module._extensions['.js'];
  Module._extensions['.js'] = function (module, filename) {
    // console.log(module, filename)
    if (IGNORED_FILES.indexOf(filename) > -1) {
      return jsLoader(module, filename);
    }
    var source = fs.readFileSync(filename, 'utf8');
    var patched = patchAndReport(source).toString();
    module._compile(patched, filename);
  };
  patchService.patch(global);
}
