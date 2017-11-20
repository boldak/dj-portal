"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-timeline/wizard");

require("widgets/v2.nvd3-timeline/adapter");

var m = angular.module("app.widgets.v2.nvd3-timeline", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.timeline-chart-wizard", "app.widgets.v2.timeline-chart-adapter"]);

m.controller("Nvd3TimelineChartCtrlV2", ["$scope", "NVD3WidgetV2", "TimelineChartWizard", "TimelineChartAdapter", "i18n", function ($scope, NVD3WidgetV2, TimelineChartWizard, TimelineChartAdapter, i18n) {

  console.log("CREATE CONTROLLER");
  new NVD3WidgetV2($scope, {
    wizard: TimelineChartWizard,

    decorationAdapter: TimelineChartAdapter,

    optionsURL: "/widgets/v2.nvd3-timeline/options.json",
    sampleURL: "/widgets/v2.nvd3-timeline/sample.json",

    acceptData: function acceptData(context) {
      if (!context || !context.data) {
        return false;
      }return context.key == "timeline" || context.data.tag == "timeline";
    },

    translate: function () {
      $scope.data = $scope.params.serieAdapter.getSeries($scope.loadedData);
      $scope.options.chart.localeDef = i18n.localeDef();
      $scope.settings = {
        options: angular.copy($scope.expandOptions($scope.options)),
        data: angular.copy($scope.data)
      };
    },

    onBeforeDesignMode: function () {
      if ($scope.api && $scope.api.chart()) $scope.api.chart().destroy();
    },

    onBeforePresentationMode: function () {
      if ($scope.api && $scope.api.chart()) $scope.api.chart().destroy();
    },

    onBeforeConfig: function () {
      if ($scope.api && $scope.api.chart()) $scope.api.chart().destroy();
    },

    onRemove: function () {
      $scope.api.chart().destroy();
    },

    onBeforeChangePage: function () {
      if ($scope.api && $scope.api.chart()) $scope.api.chart().destroy();
    },

    dictionary: function (data) {
      if (!data) return [];

      if (!data.dictionary) {
        data = data.value;
      }

      if (!data) return [];

      if (!data.dictionary) return [];

      return data.dictionary;
    },

    translations: function (data) {
      console.log("TRANSLATIONS", data);
      if (!data) return [];

      if (!data.dictionary) {
        data = data.value;
      }

      if (!data) return [];

      if (!data.dictionary) return [];

      return data.dictionary.filter(function (item) {
        return item.type == "i18n";
      });
    },

    serieAdapter: {

      getSeriesSelection: function getSeriesSelection(data) {
        return [];
      },

      getObjectsSelection: function getObjectsSelection(data) {
        return [];
      },

      getSeries: function (data) {
        if (!data) return [];
        if (!data.dictionary) {
          data = data.value;
        }

        if (!data) return [];
        if (!data.data) return [];
        if (!data.data.series) return [];

        var result = angular.copy(data.data.series);

        result.forEach(function (d, i) {
          d.colorIndex = i;
          d.category = $scope.dictionary.lookup(d.category).label;
          d.category = $scope.translations.translate(d.category);
        });

        return result;
      }
    }
  });
}]);
//# sourceMappingURL=../v2.nvd3-timeline/widget.js.map