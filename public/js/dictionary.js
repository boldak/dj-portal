"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-translate");

require("angular-translate-loader-static-files");

require("angular-translate-storage-cookie");

require("angular-translate-storage-local");

require("i18n");

require("dps");

var dictionaryModule = angular.module("app.dictionary", ["pascalprecht.translate", "app.i18n", "app.dps"]);
dictionaryModule.dictionary = {};

dictionaryModule.run(["$http", "i18n", "$dps", function ($http, i18n, $dps) {

  // $http.get("./api/dictionary")
  $dps.get("/api/dictionary").success(function (data) {
    // console.log(data)
    var d = {};
    for (var i in data) {
      d[data[i].key] = data[i].value;
    }
    dictionaryModule.dictionary = d;
    var tua = {};
    var ten = {};
    for (var i in data) {
      if (data[i].type == "i18n" && data[i].value) {
        tua[data[i].key] = data[i].value.ua;
        ten[data[i].key] = data[i].value.en;
      }
    }
    i18n.add("uk", tua, true);
    i18n.add("en", ten, true);
  });
}]);

dictionaryModule.service("$lookup", ["$http", "$translate", "i18n", "$dps", function ($http, $translate, i18n, $dps) {
  var LocalDictionary = function LocalDictionary(dictionary) {
    this._table = {};
    if (dictionary) this._init(dictionary);
  };

  LocalDictionary.prototype = {

    lookup: function lookup(key) {
      return this._table[key] || key;
    },

    _init: function _init(dict) {
      for (var i in dict) {
        this._table[dict[i].key] = dict[i].value;
      }
      return this;
    }
  };

  var lookup = function lookup(key) {
    return dictionaryModule.dictionary[key] || key;
  };

  lookup.dictionary = function (dict) {
    return new LocalDictionary()._init(dict);
  };

  lookup.reload = function () {
    // $http.get("./api/dictionary")

    $dps.get("/api/dictionary").success(function (data) {
      var d = {};
      for (var i in data) {
        d[data[i].key] = data[i].value;
      }
      dictionaryModule.dictionary = d;
      var tua = {};
      var ten = {};
      for (var i in data) {
        if (data[i].type == "i18n" && data[i].value) {
          tua[data[i].key] = data[i].value.ua;
          ten[data[i].key] = data[i].value.en;
        }
      }
      i18n.add("uk", tua, true);
      i18n.add("en", ten, true);
    });
  };

  return lookup;
}]);
//# sourceMappingURL=dictionary.js.map