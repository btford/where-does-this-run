
var METHOD_RE = /^[\w]+\.[\w\.]+$/i;
var ES5_DATA = require('es5-compat-table/data-es5').tests ;

var APIS_BY_NAME = {};

var APIS = ES5_DATA.filter(function (api) {
  return METHOD_RE.test(api.name);
}).
map(function (api) {
  APIS_BY_NAME[api.name] = api;
  return api.name;
});

var report = {};

// a guard to ensure that internal functions do not call interesting methods
var suspend = true;


/*
 * takes a context and patches all of the interesting APIs so we know whether they were called.
 * returns a function that unpatches the APIs so we don't record calls in uninteresting parts
 * of the instrumented code
 */
exports.patch = function (context) {
  suspend = true;
  var unpatchFns = APIS.map(function (api) {
    return patchApi(context, api);
  });

  var log = context.console.log;

  context.console.log = function () {
    suspend = true;
    var ret = log.apply(this, arguments);
    return ret;
  }

  var require = context.require;
  context.require = function () {
    suspend = true;
    var ret = require.apply(this, arguments);
    return ret;
  }

  return function unpatch () {
    while (unpatchFns.length > 0) {
      (unpatchFns.shift())();
    }
  };
};


/*
 * returns a map of API name to whether or not the given API was called
 */
exports.report = function () {
  return {
    browsers: exports.reportBrowsers(),
    features: exports.reportFeatures()
  };
};

/*
 * returns a map of API name to whether or not the given API was called
 */
exports.reportFeatures = function () {
  return report;
};


/*
 * returns an array of browsers that the code we're reporting on should support
 */
exports.reportBrowsers = function () {
  suspend = true;
  var res = Object.keys(report).reduce(function (acc, name) {
    return deepAnd(APIS_BY_NAME[name].res, acc);
  }, Object.keys(APIS_BY_NAME[APIS[0]].res).reduce(function (acc, prop) {
    acc[prop] = true;
    return acc;
  }, {}));
  return res;
};

exports.run = function (fn) {
  suspend = false;
  var ret = fn();
  suspend = true;
  return ret;
};

function deepAnd (a, b) {
  return Object.keys(a).concat(Object.keys(b)).reduce(function (c, key) {
    c[key] = a[key] && b[key];
    return c;
  }, {});
}


/*
 * resets the state of a report
 */
exports.reset = function reset () {
  report = {};
  APIS.forEach(function (api) {
    report[api] = false;
  });
};


function patch (obj, method, name) {
  var original = obj[method];
  obj[method] = function () {
    suspend || (report[name] = true);
    return original.apply(this, arguments);
  };
  return function unpatch () {
    obj[method] = original;
  };
}


function patchApi (obj, api) {
  var parts = api.split('.'),
      method = parts.pop();

  while (parts.length > 0) {
    // there's an implicit assumption that this will never fail
    obj = obj[parts.shift()];
  }

  return patch(obj, method, api);
}

exports.reset();
