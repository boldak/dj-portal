"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var pageListWidget = angular.module("app.widgets.page-list", []);

pageListWidget.factory("addNewPageInModal", ["app", "$modal", function (app, $modal) {
  return function () {
    $modal.open({
      templateUrl: "/widgets/page-list/new-page-modal-config.html",
      controller: "AddNewPageModalController",
      backdrop: "static",
      resolve: {
        templateTypes: ["templateTypesPromise", function templateTypes(templateTypesPromise) {
          return templateTypesPromise;
        }]
      }
    }).result.then(function () {
      return app.markModified(true);
    });
  };
}]);

pageListWidget.factory("openPageConfig", ["app", "$modal", function (app, $modal) {
  return function (page) {
    var thisPage = app.pageConfig().href === page.href;
    $modal.open({
      templateUrl: "/widgets/page-list/page-modal-config.html",
      controller: "PageSettingsModalController",
      backdrop: "static",
      resolve: {
        page: function () {
          return page;
        }
      }
    }).result.then(function () {
      app.markModified(true);
      if (thisPage) {
        $state.go("page", { href: page.href }, { reload: true });
      }
    });
  };
}]);

pageListWidget.controller("PageListController", ["$scope", "$translate", "$modal", "$state", "app", "appName", "config", "globalConfig", "confirm", "addNewPageInModal", "openPageConfig", function ($scope, $translate, $modal, $state, app, appName, config, globalConfig, confirm, addNewPageInModal, openPageConfig) {
  // TODO: synchronize css styles on active link after clicking
  angular.extend($scope, {
    appName: appName,
    config: config,

    addNewPageInModal: addNewPageInModal,

    openPageConfig: openPageConfig,

    deletePageWithConfirmation: function deletePageWithConfirmation(page) {
      $translate("WIDGET.PAGE-LIST.ARE_YOU_SURE_DELETE_PAGE").then(confirm).then(function () {
        return app.deletePage(page);
      });
    }
  });
}]);
/*ok*/
//# sourceMappingURL=../page-list/widget.js.map