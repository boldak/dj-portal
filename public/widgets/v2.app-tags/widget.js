"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-foundation");

var appTags = angular.module("app.widgets.v2.app-tags", ["mm.foundation"]);

appTags.controller("AppTagsController", ["$scope", "$http", "$translate", "APIProvider", "EventEmitter", "i18n", "config", "appUrls", "$modal", "dialog", "prompt", "alert", "user", "appSkins", "pageSubscriptions", "$window", function ($scope, $http, $translate, APIProvider, EventEmitter, i18n, config, appUrls, $modal, dialog, prompt, alert, user, appSkins, pageSubscriptions, $window) {

  var emitter = new EventEmitter($scope);

  angular.extend($scope, {
    tags: [],
    selectedTags: [],
    update: function update() {
      $scope.tags = [];
      $scope.selectedTags = [];
      $http.get(appUrls.appList).success(function (apps) {
        apps.forEach(function (app) {
          app.keywords = app.keywords ? app.keywords : [];
          app.keywords.forEach(function (t) {
            var _t = $translate.instant(t);
            if ($scope.tags.indexOf(_t) < 0) $scope.tags.push(_t);
          });
        });

        // apps.forEach((c) =>{
        //   if(c.i18n){
        //     config.i18n = (config.i18n)? config.i18n : {};
        //     for(let locale in c.i18n){
        //       config.i18n[locale] = (config.i18n[locale]) ? config.i18n[locale] : {};
        //       angular.extend(config.i18n[locale],c.i18n[locale]) 
        //     }
        //   } 
        // })
        // i18n.refresh();
      });
      emitter.emit("appTags", $scope.selectedTags);
    },

    selectTag: function selectTag(t) {
      var index = $scope.tags.indexOf(t);
      $scope.tags.splice(index, 1);
      $scope.selectedTags.push(t);
      $scope.selectedObject = "";
      $scope.$viewValue = "";
      emitter.emit("appTags", $scope.selectedTags);
    },

    unselectTag: function unselectTag(t) {
      var index = $scope.selectedTags.indexOf(t);
      $scope.selectedTags.splice(index, 1);
      $scope.tags.push(t);
      emitter.emit("appTags", $scope.selectedTags);
    }

  });

  new APIProvider($scope).config(function () {

    if ($scope.widget.listeners && $scope.widget.listeners.length && $scope.widget.listeners.trim().length > 0) {

      pageSubscriptions().removeListeners({
        emitter: $scope.widget.instanceName,
        signal: "appTags"
      });

      $scope.appListeners = $scope.widget.listeners ? $scope.widget.listeners.split(",") : [];

      pageSubscriptions().addListeners($scope.appListeners.map(function (item) {
        return {
          emitter: $scope.widget.instanceName,
          receiver: item.trim(),
          signal: "appTags",
          slot: "appTags"
        };
      }));
    } else {

      pageSubscriptions().removeListeners({
        emitter: $scope.widget.instanceName,
        signal: "appTags"
      });
    }

    $scope.update();
  }).provide("refresh", function () {
    $scope.update();
  }).provide("setTag", function (e, tags) {
    tags = tags.map(function (t) {
      return $translate.instant(t);
    });
    $scope.selectedTags = tags;
    emitter.emit("appTags", $scope.selectedTags);
  }).translate(function () {
    $scope.update();
  });
}]);
// emitter.emit("setApplication",undefined);
//# sourceMappingURL=../v2.app-tags/widget.js.map