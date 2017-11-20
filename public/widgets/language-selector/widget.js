"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var langSelector = angular.module("app.widgets.language-selector", ["app.i18n"]);

langSelector.controller("LanguageSelectorController", ["$scope", "$translate", "$lookup", "EventEmitter", "APIProvider", "i18n", function ($scope, $translate, $lookup, EventEmitter, APIProvider, i18n) {

  var eventEmitter = new EventEmitter($scope);
  angular.extend($scope, {
    selectLanguage: function selectLanguage(langKey) {
      $translate.use(langKey);
      $translate.refresh().then(function () {
        i18n.refresh();
      });
      eventEmitter.emit("selectLanguage", langKey);
    },
    languages: [{ key: "en", title: "English" }, { key: "uk", title: "Українська" }, { key: "ru", title: "Русский" }]
  });
}]);
//# sourceMappingURL=../language-selector/widget.js.map