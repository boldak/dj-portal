"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-bar/adapter");

require("wizard-directives");

var m = angular.module("app.widgets.v2.steps.bar-chart-decoration", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.bar-chart-adapter", "wizard-directives"]);

m.factory("BarChartDecoration", ["$http", "$q", "parentHolder", "BarChartAdapter", "pageWidgets", function ($http, $q, parentHolder, BarChartAdapter, pageWidgets) {

	return {
		id: "BarChartDecoration",

		title: "Chart Decoration",

		description: "Setup chart decoration options",

		html: "./widgets/v2.steps/bar-chart-decoration.html",

		onStartWizard: function onStartWizard(wizard) {
			var _this = this;

			this.wizard = wizard;
			this.conf = {
				decoration: wizard.conf.decoration,
				dataID: wizard.conf.dataID,
				queryID: wizard.conf.queryID,
				serieDataId: wizard.conf.serieDataId,
				optionsUrl: "./widgets/v2.nvd3-bar/options.json",
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
				params: {},
				proc_name: "barchartserie",
				response_type: "data"
			});
			return r;
		},

		loadData: function loadData() {
			var thos = this;

			if (!this.wizard.context.postprocessedTable) {
				$http.get("./api/data/process/" + this.conf.dataID).success(function (resp) {
					thos.wizard.context.postprocessedTable = resp.value;
				});
			}

			this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
			this.loadOptions().then(function (options) {
				thos.options = options.data;
				if (!thos.conf.decoration) {
					thos.conf.decoration = BarChartAdapter.getDecoration(thos.options);
				}

				thos.conf.decoration.setColor = function (palette) {
					console.log(thos, palette);thos.conf.decoration.color = angular.copy(palette);
				};
				thos.options.chart.x = function (d) {
					return d.label;
				};
				thos.options.chart.y = function (d) {
					return d.value;
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
				thos.apply();
			});
		},

		activate: function activate(wizard) {
			// this.dataset = wizard.context.dataset;
			if (this.conf.dataID) {
				this.loadData();
			}
		},

		apply: function apply() {
			this.conf.decoration.width = parentHolder(this.wizard.conf).width;
			BarChartAdapter.applyDecoration(this.options, this.conf.decoration);
			this.settings = { options: angular.copy(this.options), data: angular.copy(this.data) };
		}
	};
}]);
//# sourceMappingURL=../v2.steps/bar-chart-decoration.js.map