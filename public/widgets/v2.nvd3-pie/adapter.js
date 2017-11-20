"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var m = angular.module("app.widgets.v2.pie-chart-adapter", []);

m.service("PieChartAdapter", function () {

  this.onSelectSerie = function (selection, settings, api) {
    var data = d3.select(api.getSVG()).data();
    settings.data.forEach(function (s) {
      var f = selection.filter(function (l) {
        return l.key == s.label;
      })[0];
      if (f) {
        s.disabled = f.disabled;
      }
    });
    return settings;
  };

  this.applyDecoration = function (options, decoration, selector, api) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      options.chart.donut = decoration.donut;
      options.chart.donutRatio = decoration.donutRatio;
      options.chart.donutLabelsOutside = decoration.labelsOutside;
      options.chart.pieLabelsOutside = decoration.labelsOutside;
      options.chart.labelType = decoration.valueAsLabel ? "value" : "key";
      options.chart.color = decoration.color ? decoration.color : null;

      if (decoration.enableEmitEvents) {

        options.chart.legend.dispatch = {
          stateChange: function stateChange(e) {
            selector.selectSerie(e.disabled);
          }
        };
      }
    }
    return options;
  };

  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
      var decoration = {};
      decoration.height = options.chart.height;
      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      decoration.donut = options.chart.donut;
      decoration.donutRatio = options.chart.donutRatio;
      decoration.labelsOutside = options.chart.donutLabelsOutside || options.chart.pieLabelsOutside;
      decoration.valueAsLabel = options.chart.labelType == "value";
      decoration.color = options.chart.color;
      return decoration;
    }
  };
});
//# sourceMappingURL=../v2.nvd3-pie/adapter.js.map