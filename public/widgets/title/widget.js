"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.title", []).controller("TitleController", ["$scope", "APIProvider", function ($scope, APIProvider) {
  new APIProvider($scope).config(function () {
    // console.log($scope.widget);
    $scope.title = $scope.widget.title;
    $scope.level = $scope.widget.level;
  });
}]);
//# sourceMappingURL=../title/widget.js.map