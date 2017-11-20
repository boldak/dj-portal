"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var appListWidget = angular.module("app.widgets.app-creator", []);

appListWidget.controller("AppCreatorController", ["$scope", "$http", "$translate", "EventEmitter", "appSkins", "appUrls", "prompt", "alert", "user", function ($scope, $http, $translate, EventEmitter, appSkins, appUrls, prompt, alert, user) {
  var evtEmitter = new EventEmitter($scope);

  angular.extend($scope, {
    model: {
      newAppName: "",
      skinName: "default"
    },
    skins: appSkins,
    createApp: function createApp() {
      var app = {
        name: this.model.newAppName,
        skin: this.model.skinName,
        owner: user
      };

      $http.get(appUrls.api.createApp(app.name, app.skin)).success(function (data) {
        app.id = data.id;
        evtEmitter.emit("new-app-created", app);
      }).error(function (data, error) {
        alert.error($translate.instant("WIDGET.APP-CREATOR.ERROR_CREATING_APP", { data: data, error: error }));
      });
    }
  });
}]);
//# sourceMappingURL=../app-creator/widget.js.map