"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.v2.app-description", []).controller("AppDescController", ["$scope", "APIProvider", "EventEmitter", "config", "author", "pageSubscriptions", "i18n", "$http", "appUrls", "$translate", "prompt", "alert", "user", "dialog", function ($scope, APIProvider, EventEmitter, config, author, pageSubscriptions, i18n, $http, appUrls, $translate, prompt, alert, user, dialog) {

  $scope.visibility = true;
  $scope.formatDate = i18n.formatDate;

  var emitter = new EventEmitter($scope);

  $http.get(appUrls.appList).success(function (apps) {
    apps.forEach(function (c) {
      if (c.i18n) {
        config.i18n = config.i18n ? config.i18n : {};
        for (var locale in c.i18n) {
          config.i18n[locale] = config.i18n[locale] ? config.i18n[locale] : {};
          angular.extend(config.i18n[locale], c.i18n[locale]);
        }
      }
    });
    i18n.refresh();
  });

  $scope.refresh = function () {
    emitter.emit("refresh");
  };

  $scope.renameApp = function (app) {
    var _this = this;

    dialog({
      title: "" + $translate.instant("WIDGET.V2.APP-DESCRIPTION.RENAME"),
      fields: {
        oldName: {
          title: "" + $translate.instant("WIDGET.V2.APP-DESCRIPTION.NAME") + ":",
          type: "text",
          value: app.name,
          editable: false
        },
        newName: {
          title: "" + $translate.instant("WIDGET.V2.APP-DESCRIPTION.NEW_NAME") + ":",
          type: "text",
          value: "",
          editable: true,
          required: true
        }
      }
    }).then(function (form) {
      var newAppName = form.fields.newName.value;
      // })

      // prompt(`${$translate.instant('WIDGET.V2.APP-DESCRIPTION.NEW_NAME')}:`)
      //   .then(newAppName => {
      $http.get(appUrls.api.rename(app.id, newAppName)).success(function () {
        $scope.refresh();
      }).error(function (data, error) {
        _this.restoreApps();
        alert.error($translate.instant("WIDGET.V2.APP-DESCRIPTION.ERROR_RENAMING_APP", { error: error, data: data }));
      });
    });
  };

  $scope.deleteApp = function (app) {
    dialog({
      title: $translate.instant("WIDGET.V2.APP-DESCRIPTION.TYPE_APP_NAME_TO_CONFIRM_DELETION"),
      fields: {
        name: {
          title: "" + $translate.instant("WIDGET.V2.APP-DESCRIPTION.NAME") + ":",
          type: "text",
          value: "",
          editable: true,
          required: true
        }
      }
    }).then(function (form) {
      var confirmName = form.fields.name.value;
      // prompt($translate.instant('WIDGET.V2.APP-DESCRIPTION.TYPE_APP_NAME_TO_CONFIRM_DELETION'))
      //   .then(confirmName => {
      if (confirmName !== app.name) {
        alert.error($translate.instant("WIDGET.V2.APP-DESCRIPTION.WRONG_NAME_APP_NOT_DELETED"));
        return;
      }

      $http.get(appUrls.api.destroy(app.id)).success(function () {
        $scope.refresh();
      }).error(function (data, error) {
        $scope.refresh();
        alert.error($translate.instant("WIDGET.V2.APP-DESCRIPTION.ERROR_DELETING_APP"));
      });
    });
  };

  $scope.isAdmin = function () {
    return user.isAdmin;
  };

  $scope.isOwner = function (app) {
    if (!user.id) {
      return false;
    }
    if (!app.owner) {
      return true;
    }
    return app.owner.id === user.id;
  };

  $scope.isCollaborator = function (app) {
    if (!user.id) {
      return false;
    }
    if (!app.collaborations) {
      return false;
    }
    return angular.isUndefined(app.collaborations.find(function (c) {
      return c.user.id === user.id;
    }));
  };

  $scope.selectTag = function (tag) {
    emitter.emit("setTag", [tag]);
  };

  new APIProvider($scope).config(function () {
    $scope.author = author;
    $scope.config = config;
    // $scope.app = ($scope.app)? $scope.app : config;

    if ($scope.widget.tagListeners) {
      pageSubscriptions().removeListeners({
        emitter: $scope.widget.instanceName,
        signal: "setTag"
      });
      $scope.tagListeners = $scope.widget.tagListeners ? $scope.widget.tagListeners.split(",") : [];

      pageSubscriptions().addListeners($scope.tagListeners.map(function (item) {
        return {
          emitter: $scope.widget.instanceName,
          receiver: item.trim(),
          signal: "setTag",
          slot: "setTag"
        };
      }));
    }

    if ($scope.widget.appWidget) {

      pageSubscriptions().removeListeners({
        receiver: $scope.widget.instanceName,
        signal: "setApplication"
      });

      pageSubscriptions().removeListeners({
        sender: $scope.widget.instanceName,
        signal: "refresh"
      });

      $scope.widget.appListeners = $scope.widget.appWidget ? $scope.widget.appWidget.split(",") : [];

      pageSubscriptions().addListeners($scope.widget.appListeners.map(function (item) {
        return {
          emitter: item.trim(),
          receiver: $scope.widget.instanceName,
          signal: "setApplication",
          slot: "setApplication"
        };
      }));

      pageSubscriptions().addListeners($scope.widget.appListeners.map(function (item) {
        return {
          emitter: $scope.widget.instanceName,
          receiver: item.trim(),
          signal: "refresh",
          slot: "refresh"
        };
      }));
    }
  }).provide("setApplication", function (evt, app) {
    console.log("set app", evt, app);
    $scope.app = app;
  });
}]);
// .translate(() => {
//   // console.log('translate app desc')
//   // if(!$scope.app) $scope.app = $scope.app
// })
//# sourceMappingURL=../v2.app-description/widget.js.map