"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-scatter/adapter");

require("wizard-directives");

var m = angular.module("app.widgets.v2.steps.scatter-chart-decoration", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.scatter-chart-adapter", "wizard-directives"]);

m.factory("ScatterChartDecoration", ["$http", "$q", "parentHolder", "NVD3ScatterAdapter", "pageWidgets", function ($http, $q, parentHolder, NVD3ScatterAdapter, pageWidgets) {

	var chartAdapter = NVD3ScatterAdapter;

	return {
		id: "ScatterChartDecoration",

		title: "Chart Decoration",

		description: "Setup chart decoration options",

		html: "./widgets/v2.steps/scatter-chart-decoration.html",

		onStartWizard: function onStartWizard(wizard) {
			var _this = this;

			this.wizard = wizard;
			this.conf = {
				axisX: wizard.conf.axisX ? wizard.conf.axisX : -1,
				decoration: wizard.conf.decoration,
				dataID: wizard.conf.dataID,
				queryID: wizard.conf.queryID,
				serieDataId: wizard.conf.serieDataId,
				optionsUrl: "./widgets/v2.nvd3-scatter/options.json",
				dataUrl: "./api/data/process/"
			};

			this.queries = [];

			pageWidgets().filter(function (item) {
				return item.type == "v2.query-manager";
			}).map(function (item) {
				return item.queries;
			}).forEach(function (item) {
				_this.queries = _this.queries.concat(item);
			});

			if (this.conf.queryID) {
				var thos = this;
				this.inputQuery = this.queries.filter(function (item) {
					return item.$id == _this.conf.queryID;
				})[0].$title;
			}
		},

		onFinishWizard: function onFinishWizard(wizard) {

			this.conf.decoration.setColor = undefined;
			wizard.conf.decoration = this.conf.decoration;
			wizard.conf.serieDataId = this.conf.serieDataId;
			wizard.conf.queryID = this.conf.queryID;
			wizard.conf.dataID = this.conf.dataID;
			wizard.conf.axisX = this.conf.axisX;

			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
		},

		onCancelWizard: function onCancelWizard(wizard) {
			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
		},

		reversePalette: function reversePalette() {
			if (this.conf.decoration.color) {
				this.conf.decoration.color = this.conf.decoration.color.reverse();
			}
		},

		selectInputData: function selectInputData() {
			var thos = this;
			thos.wizard.context.postprocessedTable = undefined;
			var iq = this.queries.filter(function (item) {
				return item.$title == thos.inputQuery;
			})[0];
			this.conf.dataID = iq.context.queryResultId;
			this.conf.queryID = iq.$id;
			this.loadData();
		},

		loadOptions: function loadOptions() {
			return $http.get(this.conf.optionsUrl);
		},

		loadSeries: function loadSeries() {
			var r = $http.post(this.conf.dataUrl, {
				cache: false,
				data_id: this.conf.dataID,
				params: { axisX: this.conf.axisX },
				proc_name: "scatter-serie",
				response_type: "data"
			});
			return r;
		},

		makeAxisXList: function makeAxisXList(table) {
			var result = [];
			table.body[0].metadata.forEach(function (item, index) {
				result.push({
					index: -index - 1,
					label: item.dimensionLabel
				});
			});
			if (table.header.length > 1) {
				table.header.forEach(function (column, index) {
					var label = "";
					column.metadata.forEach(function (item) {
						label = label == "" ? item.label : label + ", " + item.label;
					});
					result.push({
						index: index,
						label: label
					});
				});
			}
			var thos = this;
			this.axisXColumn = result.filter(function (item) {
				return item.index == thos.conf.axisX;
			})[0].label;

			return result;
		},

		selectAxisX: function selectAxisX() {
			var thos = this;
			this.conf.axisX = this.axisXList.filter(function (item) {
				return item.label == thos.axisXColumn;
			})[0].index;

			// console.log(this.conf)
		},

		loadData: function loadData() {
			var thos = this;

			if (!this.wizard.context.postprocessedTable) {
				$http.get("./api/data/process/" + this.conf.dataID).success(function (resp) {
					thos.wizard.context.postprocessedTable = resp.value;
					thos.axisXList = thos.makeAxisXList(thos.wizard.context.postprocessedTable);
				});
			} else {
				this.axisXList = this.makeAxisXList(this.wizard.context.postprocessedTable);
			}

			this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
			this.loadOptions().then(function (options) {
				thos.options = options.data;
				if (!thos.conf.decoration) {
					thos.conf.decoration = chartAdapter.getDecoration(thos.options);
				}

				thos.conf.decoration.setColor = function (palette) {
					thos.conf.decoration.color = angular.copy(palette);
				};
				thos.options.chart.x = function (d) {
					return d.x;
				};
				thos.options.chart.y = function (d) {
					return d.y;
				};
				thos.options.tooltipContent = function (serie, x, y, s) {
					//console.thos.options.log(serie,x,y,s)
					return "<b><center>" + s.point.label + "</center></b>" + "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + s.series.base + ": " + x + "</div>" + "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + serie + ": " + y + "</div>";
				};

				thos.options.tooltipXContent = function (serie, x, y, s) {
					//console.log("X",serie,x,y,s)
					return "<b>" + s.series.base + ": </b>" + x;
				};
				thos.options.tooltipYContent = function (serie, x, y, s) {
					//console.log("X",serie,x,y,s)
					return "<b>" + serie + ": </b>" + y;
				};

				thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;

				//             thos.conf.decoration.title = thos.dataset.dataset.label;
				// thos.conf.decoration.subtitle = thos.dataset.dataset.source;
				// thos.conf.decoration.caption = 'Note:'+ thos.dataset.dataset.note;
				// thos.conf.decoration.xAxisName = thos.dataset.dataset.label;
				// thos.conf.decoration.yAxisName = thos.dataset.dataset.label;
			});

			this.dataLoaded = //(this.dataLoaded) ? this.dataLoaded :
			this.loadSeries().then(function (resp) {
				thos.data = resp.data.data;
				thos.conf.serieDataId = resp.data.data_id;
			});

			$q.all([this.optionsLoaded, this.dataLoaded]).then(function () {
				// thos.apply()
				thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
				chartAdapter.applyDecoration(thos.options, thos.conf.decoration);
				thos.settings = { options: angular.copy(thos.options), data: angular.copy(thos.data) };
			});
		},

		activate: function activate(wizard) {
			if (this.conf.dataID) {
				this.loadData();
			}
		},

		apply: function apply() {
			this.activate(this.wizard);
		}
	};
}]);
//# sourceMappingURL=../v2.steps/scatter-chart-decoration.js.map