"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.html-article", []).controller("ArticleController", ["$scope", "APIProvider", function ($scope, APIProvider) {
  new APIProvider($scope).config(function () {
    if ($scope.widget.href) {
      $scope.widget.href = $scope.widget.href.url ? $scope.widget.href : undefined;
    }
    if ($scope.widget.href) {
      $scope.widget.href.description = $scope.widget.href.description ? $scope.widget.href.description : decodeURIComponent($scope.widget.href.url);
    }
  });
}]);
//# sourceMappingURL=../html-article/widget.js.map