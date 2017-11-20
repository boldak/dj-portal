"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-line/adapter");

require("wizard-directives");

require("ng-ace");

var m = angular.module("app.widgets.v2.steps.line-chart-decoration", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.line-chart-adapter", "wizard-directives", "app.dps", "ng.ace"]);

m.factory("LineChartDecoration", ["$http", "$dps", "$q", "parentHolder", "LineChartAdapter", "pageWidgets", "i18n", "dialog", "$error", "dpsEditor", function ($http, $dps, $q, parentHolder, LineChartAdapter, pageWidgets, i18n, dialog, $error, dpsEditor) {

	var chartAdapter = LineChartAdapter;

	return {
		id: "LineChartDecoration",

		title: "Chart Decoration",

		description: "Setup chart decoration options",

		html: "./widgets/v2.nvd3-line/line-chart-decoration.html",

		onStartWizard: function onStartWizard(wizard) {
			var _this = this;

			// console.log("DECORATION START Wizard CONF", wizard.conf);
			// console.log("DECORATION START axisX", wizard.conf.axisX);
			this.inputQuery = undefined;

			this.wizard = wizard;
			this.conf = {
				axisX: angular.isDefined(wizard.conf.axisX) ? wizard.conf.axisX : -1,
				category: wizard.conf.category,
				index: wizard.conf.index ? wizard.conf.index : [],
				decoration: wizard.conf.decoration,
				dataID: wizard.conf.dataID,
				script: wizard.conf.script,
				queryID: wizard.conf.queryID,
				serieDataId: wizard.conf.serieDataId,
				optionsUrl: "./widgets/v2.nvd3-line/options.json",
				dataUrl: "/api/data/process/",
				emitters: wizard.conf.emitters
			};

			this.queries = [{ $id: "eventSource", $title: "setData(updateWithData) event" }];

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
			wizard.conf.script = this.conf.script;
			wizard.conf.axisX = this.conf.axisX;
			wizard.conf.category = this.conf.category;
			wizard.conf.index = this.conf.index;
			wizard.conf.emitters = this.conf.emitters;

			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
			this.inputQuery = undefined;
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
			this.conf.dataID = iq.context ? iq.context.queryResultId : undefined;
			this.conf.queryID = iq.$id;
			this.conf.axisX = -1;
			this.conf.category = undefined;
			this.conf.index = [];
			this.loadData();
		},

		loadOptions: function loadOptions() {
			return $http.get(this.conf.optionsUrl);
		},

		loadSeries: function loadSeries() {
			this.data = undefined;
			if (this.conf.dataID) {
				return $dps.post("/api/data/script", {
					data: "source(table:'" + this.conf.dataID + "');" + "line(x:" + this.conf.axisX + "," + "index:" + JSON.stringify(this.conf.index) + "," + "category:" + this.conf.category + ");" + "save()",
					locale: i18n.locale()
				});
			}if (this.conf.script) {
				return $dps.post("/api/script", {
					script: this.conf.script,
					locale: i18n.locale()
				}).then(function (resp) {
					if (resp.data.type == "error") {
						$error(resp.data.data);
						return;
					};
					return { data: resp };
				});
			}return $http.get("./widgets/v2.nvd3-line/sample.json");
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

		makeCatList: function makeCatList(table) {
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
			// console.log("CatList",result)
			var thos = this;
			var c = result.filter(function (item) {
				return item.index == thos.conf.category;
			});
			if (c.length > 0) {
				this.catColumn = c[0].label;
			} else {
				this.catColumn = undefined;
			}
			return result;
		},

		selectCat: function selectCat() {
			if (this.catEnable && this.catColumn) {
				var thos = this;
				this.conf.category = this.catList.filter(function (item) {
					return item.label == thos.catColumn;
				})[0].index;
			} else {
				this.conf.category = undefined;
			}
		},

		makeIndexList: function makeIndexList(table) {
			var thos = this;
			return table.header.map(function (item, index) {
				return {
					label: item.metadata.map(function (m) {
						return m.label;
					}).join("."),
					index: index,
					enable: thos.conf.index.indexOf(index) >= 0
				};
			});
		},

		selectIndex: function selectIndex() {
			this.conf.index = this.indexList.filter(function (item) {
				return item.enable == true;
			}).map(function (item) {
				return item.index;
			});
			if (this.conf.index.length == 0) {
				this.indexList[0].enable = true;
				this.conf.index = [0];
			}
		},

		selectAllIndexes: function selectAllIndexes() {
			this.indexList.forEach(function (item) {
				item.enable = true;
			});
			this.selectIndex();
		},

		inverseIndexesSelection: function inverseIndexesSelection() {
			this.indexList.forEach(function (item) {
				item.enable = !item.enable;
			});
			this.selectIndex();
		},

		clearIndexesSelection: function clearIndexesSelection() {
			this.indexList.forEach(function (item) {
				item.enable = false;
			});
			this.selectIndex();
		},

		loadData: function loadData() {
			var thos = this;

			if (!this.wizard.context.postprocessedTable) {
				$dps.get("/api/data/process/" + this.conf.dataID).success(function (resp) {
					thos.wizard.context.postprocessedTable = resp.value;
					thos.axisXList = thos.makeAxisXList(thos.wizard.context.postprocessedTable);
					thos.catList = thos.makeCatList(thos.wizard.context.postprocessedTable);
					thos.indexList = thos.makeIndexList(thos.wizard.context.postprocessedTable);
				});
			} else {
				this.axisXList = this.makeAxisXList(this.wizard.context.postprocessedTable);
				this.catList = this.makeCatList(thos.wizard.context.postprocessedTable);
				this.indexList = this.makeIndexList(thos.wizard.context.postprocessedTable);
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

				thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;

				//             thos.conf.decoration.title = thos.dataset.dataset.label;
				// thos.conf.decoration.subtitle = thos.dataset.dataset.source;
				// thos.conf.decoration.caption = 'Note:'+ thos.dataset.dataset.note;
				// thos.conf.decoration.xAxisName = thos.dataset.dataset.label;
				// thos.conf.decoration.yAxisName = thos.dataset.dataset.label;
			});

			this.dataLoaded = //(this.dataLoaded) ? this.dataLoaded :
			this.loadSeries().then(function (resp) {
				thos.data = resp.data.data.data;
				if (!thos.data.length) {
					thos.data = [];
				}
				thos.conf.serieDataId = resp.data.data.data_id;
			});

			$q.all([this.optionsLoaded, this.dataLoaded]).then(function () {
				// thos.apply()
				thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
				chartAdapter.applyDecoration(thos.options, thos.conf.decoration);
				thos.settings = { options: angular.copy(thos.options), data: angular.copy(thos.data) };
			});
		},

		editScript: function editScript() {
			var thos = this;
			dpsEditor(thos.conf.script).then(function (script) {
				thos.conf.script = script;
				thos.loadData();
			});
		},

		activate: function activate(wizard) {
			// if (this.conf.dataID){
			this.loadData();
			// }
		},

		apply: function apply() {
			this.activate(this.wizard);
		}
	};
}]);
//# sourceMappingURL=../v2.nvd3-line/line-chart-decoration.js.map