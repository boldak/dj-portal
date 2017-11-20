"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.app-info", []).controller("AppInfoController", ["$scope", "APIProvider", "config", "author", "pageSubscriptions", function ($scope, APIProvider, config, author, pageSubscriptions) {

  var addListener = function addListener(listener) {
    var subscriptions = pageSubscriptions();
    for (var i in subscriptions) {
      if (subscriptions[i].emitter === listener.emitter && subscriptions[i].receiver === listener.receiver && subscriptions[i].signal === listener.signal && subscriptions[i].slot === listener.slot) {
        return;
      }
    }
    subscriptions.push(listener);
  };

  var removeListener = function removeListener(listener) {
    var subscriptions = pageSubscriptions();
    for (var i in subscriptions) {
      if (subscriptions[i].emitter === listener.emitter && subscriptions[i].receiver === listener.receiver && subscriptions[i].signal === listener.signal && subscriptions[i].slot === listener.slot) {
        subscriptions.splice(i, 1);
        return;
      }
    }
  };

  $scope.visibility = true;

  new APIProvider($scope).config(function () {
    $scope.author = author;
    $scope.config = config;

    if ($scope.widget.masterWidget) {
      addListener({
        emitter: $scope.widget.masterWidget,
        receiver: $scope.widget.instanceName,
        signal: "slaveVisibility",
        slot: "slaveVisibility"
      });
    }
  }).provide("slaveVisibility", function (evt, value) {
    console.log("slaveVisibility", evt, value);
    $scope.visibility = value;
  });
}]);
//# sourceMappingURL=../app-info/widget.js.map