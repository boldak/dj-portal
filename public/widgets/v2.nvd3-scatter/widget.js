"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-scatter/wizard");

require("widgets/v2.nvd3-scatter/adapter");

var m = angular.module("app.widgets.v2.nvd3-scatter", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.scatter-chart-wizard", "app.widgets.v2.scatter-chart-adapter"]);

m.controller("Nvd3ScatterChartCtrlV2", ["$scope", "NVD3WidgetV2", "ScatterChartWizard", "NVD3ScatterAdapter", function ($scope, NVD3WidgetV2, ScatterChartWizard, NVD3ScatterAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: ScatterChartWizard,
    decorationAdapter: NVD3ScatterAdapter,
    optionsURL: "/widgets/v2.nvd3-scatter/options.json",
    sampleURL: "/widgets/v2.nvd3-scatter/sample.json",
    acceptData: function acceptData(context) {
      return context.key == "scatter";
    },
    serieAdapter: {
      getX: function getX(d) {
        return d.x;
      },
      getY: function getY(d) {
        return d.y;
      },

      getLabel: function getLabel(d) {
        return d.label;
      },

      tooltipContent: function tooltipContent(serie, x, y, s) {
        //console.log(serie,x,y,s)
        return "<b><center>" + s.point.label + "</center></b>" + "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + s.series.base + ": " + x + "</div>" + "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + serie + ": " + y + "</div>";
      },

      tooltipXContent: function tooltipXContent(serie, x, y, s) {
        //console.log("X",serie,x,y,s)
        return "<b>" + s.series.base + ": </b>" + x;
      },
      tooltipYContent: function tooltipYContent(serie, x, y, s) {
        //console.log("X",serie,x,y,s)
        return "<b>" + serie + ": </b>" + y;
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
//# sourceMappingURL=../v2.nvd3-scatter/widget.js.map