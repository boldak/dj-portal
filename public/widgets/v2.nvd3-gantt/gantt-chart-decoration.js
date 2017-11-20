"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-gantt/adapter");

require("wizard-directives");

var m = angular.module("app.widgets.v2.steps.gantt-chart-decoration", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.gantt-chart-adapter", "wizard-directives"]);

m.factory("GanttChartDecoration", ["$http", "$q", "dialog", "appUrls", "parentHolder", "GanttChartAdapter", "pageWidgets", function ($http, $q, dialog, appUrls, parentHolder, GanttChartAdapter, pageWidgets) {

	var chartAdapter = GanttChartAdapter;

	return {
		id: "GanttChartChartDecoration",

		title: "Chart Decoration",

		description: "Setup chart decoration options",

		html: "./widgets/v2.nvd3-gantt/gantt-chart-decoration.html",

		onStartWizard: function onStartWizard(wizard) {
			this.wizard = wizard;
			this.conf = {
				decoration: wizard.conf.decoration,
				dataID: wizard.conf.dataID,
				serieDataId: wizard.conf.dataID,
				optionsUrl: "./widgets/v2.nvd3-gantt/options.json",
				dataUrl: "./api/data/process/"
			};
		},

		onFinishWizard: function onFinishWizard(wizard) {
			wizard.conf.decoration = this.conf.decoration;
			wizard.conf.dataID = this.conf.dataID;
			wizard.conf.serieDataId = this.conf.serieDataId;
			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
		},

		onCancelWizard: function onCancelWizard(wizard) {
			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
		},

		_prepare: function _prepare(data) {
			var result = data.map(function (item) {
				return item;
			});
			result.forEach(function (item) {
				if (item.end == null) delete item.end;
				if (item.note == null) delete item.note;

				if (item.income == null) {
					delete item.income;
				} else {
					item.income.forEach(function (p) {
						if (p.marker == null) delete p.marker;
					});
				}

				if (item.expenditure == null) {
					delete item.expenditure;
				} else {
					item.expenditure.forEach(function (p) {
						if (p.marker == null) delete p.marker;
					});
				}

				if (item.causes == null) {
					delete item.causes;
				} else {
					item.causes.forEach(function (p) {
						if (p.type == null) {
							delete p.type;
							delete p.src.type;
							delete p.target.type;
						}
					});
				}
			});
			return result;
		},

		createTimeline: function createTimeline() {
			var thos = this;
			dialog({
				title: "Select Timeline Excel file",
				fields: {
					file: {
						title: "Timeline file:",
						type: "file",
						editable: true,
						required: true
					}
				}
			}).then(function (form) {

				var fd = new FormData();
				// Take the first selected file
				fd.append("file", form.fields.file.value);
				$http.post(appUrls.createTimeline, fd, {
					withCredentials: true,
					headers: { "Content-Type": undefined },
					transformRequest: angular.identity
				}).success(function (resp) {
					thos.data = resp.value;
					thos.conf.dataID = resp.id;
					thos.conf.serieDataId = resp.id;
					thos.loadData();
				}).error(function (data, status) {
					if (status === 415) {
						alert.error($translate.instant("WIDGET.V2.APP-LIST.CANNOT_PARSE_DATA_AS_VALID_JSON", { data: data }));
					} else {
						alert.error($translate.instant("WIDGET.V2.APP-LIST.ERROR_IMPORTING_APP", { status: status }));
					}
				});
			});
		},

		loadOptions: function loadOptions() {
			return $http.get(this.conf.optionsUrl);
		},

		loadSeries: function loadSeries() {
			return $http.get("./api/data/process/" + this.conf.serieDataId);
		},

		loadData: function loadData() {
			var thos = this;
			$q.all([thos.loadOptions().then(function (resp) {
				thos.options = resp.data;
				if (!thos.conf.decoration) {
					thos.conf.decoration = chartAdapter.getDecoration(thos.options);
				}
				// console.log("thos.options",thos.options)
			}), thos.loadSeries().then(function (resp) {
				// console.log("resp",resp.data.value)
				thos.data = thos._prepare(resp.data.value);
				console.log("thos.data", thos.data);
			})]).then(function () {
				thos.apply();
			});
		},

		activate: function activate(wizard) {
			if (this.conf.dataID) {
				this.loadData();
			}
		},

		apply: function apply() {
			this.conf.decoration.width = parentHolder(this.wizard.conf).width;
			chartAdapter.applyDecoration(this.options, this.conf.decoration);
			this.settings = { options: angular.copy(this.options), data: angular.copy(this.data) };
			// console.log("this.settings",this.settings)
		}
	};
}]);
//# sourceMappingURL=../v2.nvd3-gantt/gantt-chart-decoration.js.map