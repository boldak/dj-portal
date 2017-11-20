"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-foundation");

var appListWidget = angular.module("app.widgets.v2.app-list", ["mm.foundation"]);

// appListWidget.controller('AppCreatorController', function ($scope, $http, $translate,
//                                                            EventEmitter,
//                                                            // $modalInstance,
//                                                            appSkins,
//                                                            appUrls, prompt, alert, user) {
//   console.log('INIT AppCreatorController')
//   const evtEmitter = new EventEmitter($scope);

//   angular.extend($scope, {
//     "user" : user,
//     model: {
//       newAppName: "",
//       skinName: "default"
//     },
//     skins: appSkins,
//     createApp() {
//       const app = {
//         name: this.model.newAppName,
//         skin: this.model.skinName,
//         owner: user
//       };

//       $http.get(appUrls.api.createApp(app.name, app.skin))
//         .success(data => {
//           app.id = data.id;
//           evtEmitter.emit('new-app-created', app);
//           // $modalInstance.close();
//         })
//         .error((data, error) => {
//           alert.error($translate.instant('WIDGET.APP-CREATOR.ERROR_CREATING_APP', {data, error}));
//         });
//     }
//   });
//   console.log($scope)
// });

appListWidget.controller("AppListController", ["$scope", "$http", "$translate", "APIProvider", "EventEmitter", "i18n", "config", "appUrls", "$modal", "dialog", "prompt", "alert", "user", "appSkins", "pageSubscriptions", "$window", function ($scope, $http, $translate, APIProvider, EventEmitter, i18n, config, appUrls, $modal, dialog, prompt, alert, user, appSkins, pageSubscriptions, $window) {

  var emitter = new EventEmitter($scope);

  angular.extend($scope, {
    apps: undefined,
    oldApps: undefined,
    update: function update() {
      $http.get(appUrls.appList).success(function (apps) {
        $scope.apps = apps;
        $scope.oldApps = apps;
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
      // emitter.emit("setApplication",undefined);
    },
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

    gotoApp: function gotoApp(app) {
      $window.location.href = "/app/" + app.name;
    },

    openImportAppDialog: function openImportAppDialog() {
      dialog({
        title: "" + $translate.instant("WIDGET.V2.APP-LIST.IMPORT_APP") + ":",
        fields: {
          name: {
            title: "" + $translate.instant("WIDGET.V2.APP-LIST.NAME") + ":",
            type: "text",
            value: "",
            editable: true,
            required: true
          },
          file: {
            title: "" + $translate.instant("WIDGET.V2.APP-LIST.CONF") + ":",
            type: "file",
            editable: true,
            required: true
          }
        }
      }).then(function (form) {
        var fd = new FormData();
        // Take the first selected file
        fd.append("file", form.fields.file.value, form.fields.name.value);
        $http.post(appUrls.api["import"], fd, {
          withCredentials: true,
          headers: { "Content-Type": undefined },
          transformRequest: angular.identity
        }).success(function (data) {
          $scope.update();
        }).error(function (data, status) {
          if (status === 415) {
            alert.error($translate.instant("WIDGET.V2.APP-LIST.CANNOT_PARSE_DATA_AS_VALID_JSON", { data: data }));
          } else {
            alert.error($translate.instant("WIDGET.V2.APP-LIST.ERROR_IMPORTING_APP", { status: status }));
          }
        });
      });
    },

    openCreateAppDialog: function openCreateAppDialog() {
      dialog({
        title: "" + $translate.instant("WIDGET.V2.APP-LIST.ADD_NEW_APP") + ":",
        fields: {
          name: {
            title: "" + $translate.instant("WIDGET.V2.APP-LIST.NAME") + ":",
            type: "text",
            value: "",
            editable: true,
            required: true
          },
          skin: {
            title: "" + $translate.instant("WIDGET.V2.APP-LIST.CHOOSE_SKIN") + ":",
            type: "select",
            value: "",
            options: appSkins.map(function (item) {
              return { title: item.title, value: item.name };
            }),
            editable: true,
            required: true
          }
        }
      }).then(function (form) {
        $http.get(appUrls.api.createApp(form.fields.name.value, form.fields.skin.value)).success(function (data) {
          $scope.update();
        }).error(function (data, error) {
          alert.error($translate.instant("WIDGET.V2.APP-LIST.ERROR_CREATING_APP", { data: data, error: error }));
        });
      });
    }
  });
  //   saveApps() {
  //     this.oldApps = angular.copy(this.apps);
  //   },
  //   restoreApps() {
  //     this.apps = this.oldApps;
  //   },

  //   renameApp(appId) {
  //     prompt(`${$translate.instant('WIDGET.APP-LIST.NEW_NAME')}:`).then(newAppName => {
  //       this.saveApps();
  //       this.apps[this.apps.findIndex(app => appId === app.id)].name = newAppName;
  //       $http.get(appUrls.api.rename(appId, newAppName))
  //         .error((data, error) => {
  //           this.restoreApps();
  //           alert.error($translate.instant('WIDGET.APP-LIST.ERROR_RENAMING_APP', {error, data}));
  //         });
  //     });
  //   },

  //   deleteApp(appId, appName) {
  //     prompt($translate.instant('WIDGET.APP-LIST.TYPE_APP_NAME_TO_CONFIRM_DELETION')).then(confirmName => {
  //       if (confirmName !== appName) {
  //         alert.error($translate.instant('WIDGET.APP-LIST.WRONG_NAME_APP_NOT_DELETED'));
  //         return;
  //       }

  //       this.saveApps();
  //       this.apps.splice(this.apps.findIndex(app => appId === app.id), 1);
  //       $http.get(appUrls.api.destroy(appId)).error((data, error) => {
  //         this.restoreApps();
  //         alert.error($translate.instant('WIDGET.APP-LIST.ERROR_DELETING_APP'));
  //       });
  //     });
  //   }
  // });
  //

  $scope.tags = [];

  $scope.select = function (app) {
    if ($scope.selection) {
      $scope.selection.selected = false;
    }
    app.selected = true;
    $scope.selection = app;

    emitter.emit("setApplication", app);
  };

  $scope.hasTags = function (app) {
    var f = true;
    app.keywords = app.keywords ? app.keywords : [];
    var keywords = app.keywords.map(function (k) {
      return $translate.instant(k);
    });
    if ($scope.tags) {
      $scope.tags.forEach(function (t) {
        return f &= keywords.indexOf(t) >= 0;
      });
    }
    return f;
  };

  new APIProvider($scope).config(function () {

    if ($scope.widget.appWidget && $scope.widget.appWidget.length && $scope.widget.appWidget.trim().length > 0) {

      pageSubscriptions().removeListeners({
        receiver: $scope.widget.instanceName,
        signal: "setApplication"
      });

      $scope.appListeners = $scope.widget.appWidget ? $scope.widget.appWidget.split(",") : [];

      pageSubscriptions().addListeners($scope.appListeners.map(function (item) {
        return {
          emitter: item.trim(),
          receiver: $scope.widget.instanceName,
          signal: "setApplication",
          slot: "setApplication"
        };
      }));
    } else {

      pageSubscriptions().removeListeners({
        receiver: $scope.widget.instanceName,
        signal: "setApplication"
      });
    }

    $scope.update();
  }).translate(function () {
    console.log("transl", $scope.selection);
    emitter.emit("setApplication", $scope.selection);
  }).provide("refresh", function () {
    $scope.update();
  }).provide("appTags", function (e, tags) {
    $scope.tags = tags;
    emitter.emit("setApplication", $scope.selection);
  }).provide("setApplication", function (evt, app) {
    if (app) $scope.gotoApp(app);
  });
}]);
//# sourceMappingURL=../v2.app-list/widget.js.map