"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.remote-html", []).controller("RemoteHtmlWidgetController", ["$scope", "APIProvider", "$translate", "pageSubscriptions", function ($scope, APIProvider, $translate, pageSubscriptions) {

  $scope.translate = $translate;
  $scope.visibility = true;

  function addListener(subscription) {
    var subscriptions = pageSubscriptions();
    for (var i in subscriptions) {
      if (subscriptions[i].emitter === subscription.emitter && subscriptions[i].receiver === subscription.receiver) {
        return;
      }
    }
    subscriptions.push(subscription);
  };

  new APIProvider($scope).config(function () {
    pageSubscriptions().removeListeners({
      receiver: $scope.widget.instanceName,
      signal: "slaveVisibility" });

    if ($scope.widget.masterWidget) {
      addListener({
        emitter: $scope.widget.masterWidget,
        receiver: $scope.widget.instanceName,
        signal: "slaveVisibility",
        slot: "slaveVisibility"
      });
    }

    $translate($scope.widget.url).then(function (translation) {
      $scope.url = translation;
    });
  }).translate(function () {
    $translate($scope.widget.url).then(function (translation) {
      $scope.url = translation;
    });
  }).provide("selectLanguage", function (evt, value) {
    $translate($scope.widget.url).then(function (translation) {
      $scope.url = translation;
    });
  }).provide("slaveVisibility", function (evt, value) {
    // console.log("slaveVisibility",evt, value)
    $scope.visibility = value;
  });
}]);
//# sourceMappingURL=../remote-html/widget.js.map