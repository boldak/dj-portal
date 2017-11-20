"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var appListWidget = angular.module("app.widgets.app-list", []);

appListWidget.controller("AppListController", ["$scope", "$http", "$translate", "APIProvider", "appUrls", "prompt", "alert", "user", function ($scope, $http, $translate, APIProvider, appUrls, prompt, alert, user) {
  $http.get(appUrls.appList).success(function (apps) {
    $scope.apps = apps;
    $scope.oldApps = apps;
  });

  angular.extend($scope, {
    apps: undefined,
    oldApps: undefined,
    isOwner: function isOwner(app) {
      if (!user.id) {
        return false;
      }
      if (!app.owner) {
        return true;
      }
      return app.owner.id === user.id;
    },
    isCollaborator: function isCollaborator(app) {
      if (!user.id) {
        return false;
      }
      if (!app.collaborations) {
        return false;
      }
      return angular.isUndefined(app.collaborations.find(function (c) {
        return c.user.id === user.id;
      }));
    },
    saveApps: function saveApps() {
      this.oldApps = angular.copy(this.apps);
    },
    restoreApps: function restoreApps() {
      this.apps = this.oldApps;
    },

    renameApp: function renameApp(appId) {
      var _this = this;

      prompt("" + $translate.instant("WIDGET.APP-LIST.NEW_NAME") + ":").then(function (newAppName) {
        _this.saveApps();
        _this.apps[_this.apps.findIndex(function (app) {
          return appId === app.id;
        })].name = newAppName;
        $http.get(appUrls.api.rename(appId, newAppName)).error(function (data, error) {
          _this.restoreApps();
          alert.error($translate.instant("WIDGET.APP-LIST.ERROR_RENAMING_APP", { error: error, data: data }));
        });
      });
    },

    deleteApp: function deleteApp(appId, appName) {
      var _this = this;

      prompt($translate.instant("WIDGET.APP-LIST.TYPE_APP_NAME_TO_CONFIRM_DELETION")).then(function (confirmName) {
        if (confirmName !== appName) {
          alert.error($translate.instant("WIDGET.APP-LIST.WRONG_NAME_APP_NOT_DELETED"));
          return;
        }

        _this.saveApps();
        _this.apps.splice(_this.apps.findIndex(function (app) {
          return appId === app.id;
        }), 1);
        $http.get(appUrls.api.destroy(appId)).error(function (data, error) {
          _this.restoreApps();
          alert.error($translate.instant("WIDGET.APP-LIST.ERROR_DELETING_APP"));
        });
      });
    }
  });

  new APIProvider($scope).provide("new-app-added", function (evt, app) {
    $scope.saveApps();
    $scope.apps.push(app);
  }).autoWireSlotWithEvent("new-app-added", "new-app-created").autoWireSlotWithEvent("new-app-added", "new-app-imported");
}]);
//# sourceMappingURL=../app-list/widget.js.map