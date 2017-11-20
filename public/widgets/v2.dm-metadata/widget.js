"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("dictionary");

angular.module("app.widgets.v2.dm-metadata", ["app.dictionary"]).controller("V2DataManagerMetadataController", ["$scope", "$http", "EventEmitter", "APIProvider", "$lookup", function ($scope, $http, EventEmitter, APIProvider, $lookup) {

  $scope.key = undefined;
  $scope.visibility = true;
  var eventEmitter = new EventEmitter($scope);

  new APIProvider($scope).config(function () {
    console.log("widget " + $scope.widget.instanceName + " is (re)configuring...");
    $scope.title = $scope.widget.title;
    $scope.icon_class = $scope.widget.icon_class;
    if ($scope.key) {
      $scope.object = $lookup($scope.key);
    } else {
      $scope.object = undefined;
    }
  }).provide("setLookupKey", function (evt, value) {
    // console.log("setLookupKey", value)
    if (angular.isDefined(value)) {
      $scope.fml = false;
      $scope.visibility = true;
      $scope.key = value;
      var tmp = $lookup($scope.key);
      if ($scope.key == tmp || tmp.en) {
        $scope.object = { label: $scope.key };
        $scope.meta = [];
      } else {
        $scope.object = tmp;
        $scope.object.label = $scope.object.label || $scope.object["Short Name"];
        $scope.meta = [];
        var keys = Object.keys($scope.object);
        for (var i = 0; i < keys.length; i++) {
          $scope.meta.push({ key: keys[i], value: $scope.object[keys[i]] });
        }

        console.log($scope.meta);
      }
    } else {
      $scope.meta = [];
      $scope.visibility = false;
    }
  }).provide("slaveVisibility", function (evt, value) {
    $scope.visibility = value;
  }).removal(function () {
    console.log("Lookup widget is destroyed");
  });
}]);
//# sourceMappingURL=../v2.dm-metadata/widget.js.map