"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("dictionary");

angular.module("app.widgets.dm-tags-total", ["app.dictionary"]).controller("DataManagerTagsTotalController", ["$scope", "$http", "EventEmitter", "APIProvider", "$lookup", "user", function ($scope, $http, EventEmitter, APIProvider, $lookup, user) {

  new APIProvider($scope).config(function () {
    console.log("widget " + $scope.widget.instanceName + " is (re)configuring...");
    $scope.title = $scope.widget.title;
    $scope.tags = $scope.widget.tags || [];
    $scope.icon_class = $scope.widget.icon_class;
    var status = user.isOwner || user.isCollaborator ? "private" : "public";
    $scope.tags.forEach(function (item) {
      $http.post("./api/metadata/tag/total", { property: item.path, status: status }).success(function (resp) {
        item.count = resp.count;
      });
    });
  }).provide("refresh", function (evt) {
    var status = user.isOwner || user.isCollaborator ? "private" : "public";
    $scope.tags.forEach(function (item) {
      $http.post("./api/metadata/tag/total", { property: item.path, status: status }).success(function (resp) {
        item.count = resp.count;
      });
    });
  }).removal(function () {
    console.log("TagsTotal widget is destroyed");
  });
}]);
//# sourceMappingURL=../dm-tags-total/widget.js.map