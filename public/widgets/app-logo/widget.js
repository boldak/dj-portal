"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var appListWidget = angular.module("app.widgets.app-logo", []);

appListWidget.controller("AppLogoController", ["$scope", "$window", "config", function ($scope, $window, config) {
  $scope.widget.logoURL = $scope.widget.logoURL || "/widgets/app-logo/default-logo.png";
  $scope.$watch("widget.logoURL", function (newUrl) {
    var absoluteUrlPattern = new RegExp("^(?:[a-z]+:)?//", "i");
    if (!absoluteUrlPattern.test(newUrl)) {
      $scope.widget.logoURL = "" + $window.location.origin + "" + newUrl;
    }
  });
}]);
//# sourceMappingURL=../app-logo/widget.js.map