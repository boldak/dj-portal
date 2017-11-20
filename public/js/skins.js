"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var skins = angular.module("app.skins", ["app.config"]);
var list = [];
skins.run(["$http", function ($http) {
  $http.get("./api/app/skins").then(function (resp) {
    list = resp.data.map(function (item) {
      return { title: item, name: item };
    });
  });
}]);

skins.factory("appSkins", function () {
  return list;
});
//# sourceMappingURL=skins.js.map