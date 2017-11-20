"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.html-scroll-button", []).controller("ScrollButtonController", ["$scope", "APIProvider", "$scroll", function ($scope, APIProvider, $scroll) {
  $scope.scroll = $scroll;
  new APIProvider($scope).config(function () {
    $scope.targets = $scope.widget.targets || [];
  });
}]);
//# sourceMappingURL=../html-scroll-button/widget.js.map