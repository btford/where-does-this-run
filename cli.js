#!/usr/bin/env node

var hook = require('./hook'),
    chalk = require('chalk'),
    patch = require('./patch');

hook();

var flags = {};

var GREEN_CHECK = chalk.green('✔'),
    RED_X       = chalk.red('✗');

process.on('exit', function () {
  var report = patch.report();
  if (flags.json) {
    console.log(JSON.stringify(report));
  } else {
    Object.keys(report.browsers).forEach(function (browser) {
      console.log(report.browsers[browser] ? GREEN_CHECK : RED_X, browserNamify(browser));
    });
  }
});

var modules = process.argv.slice(2).filter(function (thing) {
  return thing.substr(0, 2) !== '--' || (flags[thing.substr(2)] = true, false);
});

modules.forEach(function (mod) {
  require('./' + mod);
});

var BROWSER_RE = /^(.+?)([0-9_]+)?$/
function browserNamify (name) {
  var parts = BROWSER_RE.exec(name);
  return (parts[1] === 'ie' ? 'IE' : title(parts[1])) +
      (parts[2] ? (' ' + parts[2].replace('_', '.').replace('51', '5.1')) : '');
}

function title (str) {
  return str[0].toUpperCase() + str.substr(1);
}
