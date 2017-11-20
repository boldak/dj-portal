"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-foundation");

angular.module("app.widgets.html-paragraph", ["mm.foundation"]).controller("ParaController", ["$scope", "pageSubscriptions", "APIProvider", "i18n", function ($scope, pageSubscriptions, APIProvider, i18n) {

  new APIProvider($scope).config(function () {
    $scope.text = $scope.widget.text;
    $scope.img = $scope.widget.img;
    $scope.ref = $scope.widget.ref;
    $scope.withImage = angular.isDefined($scope.img) && angular.isDefined($scope.img.url) && $scope.img.url != "";
    $scope.withRef = angular.isDefined($scope.ref) && $scope.ref.url && $scope.ref.url != "";
    if ($scope.withRef) {
      $scope.ref.text = $scope.ref.text || decodeURIComponent($scope.ref.url);
    }
  });
}]);
//# sourceMappingURL=../html-paragraph/widget.js.map