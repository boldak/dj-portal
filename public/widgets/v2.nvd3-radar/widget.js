"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-radar/wizard");

require("widgets/v2.nvd3-radar/adapter");

var m = angular.module("app.widgets.v2.nvd3-radar", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.radar-chart-wizard", "app.widgets.v2.radar-chart-adapter"]);

m.controller("Nvd3RadarChartCtrlV2", ["$scope", "NVD3WidgetV2", "RadarChartWizard", "RadarChartAdapter", function ($scope, NVD3WidgetV2, RadarChartWizard, RadarChartAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: RadarChartWizard,
    decorationAdapter: RadarChartAdapter,
    optionsURL: "/widgets/v2.nvd3-radar/options.json",
    sampleURL: "/widgets/v2.nvd3-radar/sample.json",
    acceptData: function acceptData(context) {
      return context.key == "radar";
    },
    serieAdapter: {
      //getX:function(d){return d.label},
      //getY:function(d){return d.value}
      tooltipContent: function tooltipContent(serie, x, y, s) {
        return "<center><b>" + s.point.label + "</b><br/>" + s.series.key + " : " + s.point.value.toFixed(2) + "</center>";
      },

      getSeriesSelection: function getSeriesSelection(data) {
        return data.map(function (s) {
          return { key: s.key, disabled: false };
        });
      },

      getObjectsSelection: function getObjectsSelection(data) {
        var r = [];
        data.forEach(function (s) {
          s.values.forEach(function (v) {
            r.push({ key: v.label, disabled: true });
          });
        });

        var result = [];
        r.forEach(function (item) {
          var notExists = true;
          result.forEach(function (v) {
            notExists &= item.key != v.key;
          });
          if (notExists == true) result.push(item);
        });
        return result;
      }
    }
  });
}]);
//# sourceMappingURL=../v2.nvd3-radar/widget.js.map