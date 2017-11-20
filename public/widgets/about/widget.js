"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.about", []).controller("AboutAuthorsController", ["$scope", "APIProvider", "author", function ($scope, APIProvider, author) {
  new APIProvider($scope).config(function () {
    $scope.author = author;
  });
}]);
//# sourceMappingURL=../about/widget.js.map