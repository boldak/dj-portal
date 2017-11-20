"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.v2.banner", []).controller("BannerController", ["$scope", "APIProvider", "parentHolder", function ($scope, APIProvider, parentHolder) {
  new APIProvider($scope).config(function () {
    $scope.bgImage = $scope.widget.bgImage || "./img/default-banner.png";
    $scope.enabled = $scope.widget.enabled;
  });
}]);
//# sourceMappingURL=../v2.banner/widget.js.map