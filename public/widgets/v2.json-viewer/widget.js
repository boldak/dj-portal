"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("ng-prettyjson");

var m = angular.module("app.widgets.v2.json-viewer", ["ngPrettyJson"]);

m.controller("JsonViewerController", ["$scope", "APIProvider", function ($scope, APIProvider) {
  var data;
  new APIProvider($scope).config(function () {
    $scope.data = data;
  }).provide("setData", function (e, context) {
    if (!context) {
      $scope.hidden = true;
      return;
    }
    if (context.key == "json" || context.key == "url"
    // || context.key == "help"
    // || context.key == "error"
    ) {
      $scope.dataset = context.dataset;
      $scope.data = context.data;
      data = context.data;
      $scope.hidden = false;
    } else {
      if ($scope.dataset != context.dataset) {
        $scope.hidden = true;
      }
    }
  }).removal(function () {});
}]);
//# sourceMappingURL=../v2.json-viewer/widget.js.map