"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("dictionary");

angular.module("app.widgets.dm-lookup", ["app.dictionary"]).controller("DataManagerLookupController", ["$scope", "$http", "EventEmitter", "APIProvider", "$lookup", function ($scope, $http, EventEmitter, APIProvider, $lookup) {

  $scope.key = undefined;
  var eventEmitter = new EventEmitter($scope);

  new APIProvider($scope).config(function () {
    console.log("widget " + $scope.widget.instanceName + " is (re)configuring...");
    // $scope.key = $scope.key || "#WB";
    $scope.title = $scope.widget.title;
    $scope.icon_class = $scope.widget.icon_class;
    // console.log($scope.key,$lookup($scope.key));
    if ($scope.key) {
      $scope.object = $lookup($scope.key);
      // eventEmitter.emit("slaveVisibility",false);
    } else {
      $scope.object = undefined;
      // eventEmitter.emit("slaveVisibility",true);
    }
  }).provide("setLookupKey", function (evt, value) {
    $scope.key = value;
    var tmp = $lookup($scope.key);
    if ($scope.key == tmp || tmp.en) {
      $scope.object = undefined;
      // $scope.object = {label:$scope.key};
    } else {
      $scope.object = tmp;
    }
    if (!$scope.object) {} else {}
  }).removal(function () {
    console.log("Lookup widget is destroyed");
  });
}]);

// eventEmitter.emit("slaveVisibility",false);

// eventEmitter.emit("slaveVisibility",true);
//# sourceMappingURL=../dm-lookup/widget.js.map