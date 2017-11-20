"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var appListWidget = angular.module("app.widgets.app-importer", []);

appListWidget.controller("AppImporterController", ["$scope", "$http", "$translate", "EventEmitter", "appUrls", "prompt", "alert", "user", function ($scope, $http, $translate, EventEmitter, appUrls, prompt, alert, user) {
  var evtEmitter = new EventEmitter($scope);

  angular.extend($scope, {
    model: {
      newAppName: ""
    },
    setImportFile: function setImportFile(file) {
      var _this = this;

      this.$apply(function () {
        _this.importFile = file;
      });
    },

    importApp: function importApp() {
      var fd = new FormData();
      // Take the first selected file
      fd.append("file", this.importFile, this.model.newAppName);
      $http.post(appUrls.api["import"], fd, {
        withCredentials: true,
        headers: { "Content-Type": undefined },
        transformRequest: angular.identity
      }).success(function (data) {
        var app = {
          name: data.name,
          owner: user,
          id: data.id
        };

        evtEmitter.emit("new-app-imported", app);
      }).error(function (data, status) {
        if (status === 415) {
          alert.error($translate.instant("WIDGET.APP-IMPORTER.CANNOT_PARSE_DATA_AS_VALID_JSON", { data: data }));
        } else {
          alert.error($translate.instant("WIDGET.APP-IMPORTER.ERROR_IMPORTING_APP", { status: status }));
        }
      });
    }
  });
}]);
//# sourceMappingURL=../app-importer/widget.js.map