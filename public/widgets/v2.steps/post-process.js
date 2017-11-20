"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("custom-react-directives");

var m = angular.module("app.widgets.v2.steps.post-process", ["custom-react-directives"]);

m.factory("PostProcess", ["$http", "dialog", "alert", function ($http, dialog, alert) {
  return {
    id: "PostProcess",

    title: "Data Preparation",

    description: "Select input data and set preparation settings",

    html: "./widgets/v2.steps/post-process.html",

    defaultSettings: {
      useColumnMetadata: [],
      useRowMetadata: [],
      normalization: {
        enable: false,
        mode: "Range to [0,1]",
        direction: "Columns"
      },
      reduce: {
        enable: false,
        mode: "Has Null",
        direction: "Columns"
      },
      transpose: false,

      order: {
        enable: false,
        direction: "Rows",
        asc: "A-Z",
        index: 0
      },

      cluster: {
        enable: false,
        direction: "Rows",
        count: 2
      },

      aggregation: {
        enable: false,
        direction: "Rows",
        data: []
      },

      rank: {
        enable: false,
        direction: "Rows",
        asc: "A-Z",
        indexes: []
      },

      limit: {
        enable: false,
        start: 1,
        length: 10
      },

      histogram: {
        enable: false,
        direction: "Rows",
        cumulate: false,
        beans: 5
      },

      correlation: {
        enable: false,
        direction: "Rows"
      },

      pca: {
        enable: false,
        direction: "Rows",
        result: "Scores"
      }

    },

    avaibleAggregations: [{ v: "min", enable: false }, { v: "max", enable: false }, { v: "avg", enable: false }, { v: "std", enable: false }, { v: "sum", enable: false }],

    selectAggregation: function selectAggregation() {
      this.conf.postprocessSettings.aggregation.data = this.avaibleAggregations.filter(function (item) {
        return item.enable;
      }).map(function (item) {
        return item.v;
      });
    },

    onStartWizard: function onStartWizard(wizard) {
      this.wizard = wizard;
      this.queries = wizard.parentScope.getQueries();
      this.inputQuery = undefined;
      this.conf = {
        postprocessSettings: this.defaultSettings };
    },

    selectInputData: function selectInputData() {

      this.avaibleAggregations.forEach(function (item) {
        item.enable = false;
      });

      var thos = this;
      var iq = this.queries.filter(function (item) {
        return item.$title == thos.inputQuery;
      })[0];

      this.conf.postprocessSettings = angular.copy(this.defaultSettings);
      this.conf.query = iq.context;
      $http.get("./api/data/process/" + iq.context.queryResultId).success(function (resp) {
        thos.wizard.context.table = resp.value;
        thos.conf.inputQueryResultId = resp.id;
        thos.makeLabelList(thos.wizard.context.table);
        thos.selectRankDirection(thos.wizard.context.table);
        thos.apply();
      });
    },

    activate: function activate(wizard) {
      this.queries = wizard.parentScope.getQueries();
    },

    getSelectedItemsCount: function getSelectedItemsCount(collection) {
      return collection.filter(function (item) {
        return item == true;
      }).length;
    },

    addQuery: function addQuery() {
      var _this = this;

      var q = this.wizard.parentScope.getQuery(this.conf);
      if (!q) {
        (function () {
          var thos = _this;
          dialog({
            title: "Enter Data Preparation Title",
            fields: {
              title: { title: "Title", value: "", editable: true, required: true }
            }
          }).then(function (form) {
            thos.wizard.parentScope.addPreparation(thos.conf, form.fields.title.value);
          });
        })();
      } else {
        alert.message(["Doublicate of Preparation", "This preparation exists with title: " + q.$title]);
      }
    },

    makeRowLabelList: function makeRowLabelList(table) {
      var metas = table.header[0].metadata.map(function (m, index) {
        return { label: m.dimensionLabel, index: -index - 1 };
      });

      var rows = table.body.map(function (item, index) {
        return { label: item.metadata.map(function (m) {
            return m.label;
          }).join("."), index: index };
      });

      this.rowLabelList = metas.concat(rows);
    },

    makeColLabelList: function makeColLabelList(table) {

      var metas = table.body[0].metadata.map(function (m, index) {
        return { label: m.dimensionLabel, index: -index - 1 };
      });

      var cols = table.header.map(function (item, index) {
        return { label: item.metadata.map(function (m) {
            return m.label;
          }).join("."), index: index };
      });

      this.colLabelList = metas.concat(cols);
    },

    makeLabelList: function makeLabelList(table) {
      this.makeRowLabelList(table);
      this.makeColLabelList(table);
      this.selectOrderDirection();
    },

    selectOrderDirection: function selectOrderDirection() {
      this.criteriaLabel = undefined;
      if (this.conf.postprocessSettings.order.direction == "Rows") {
        this.orderCriteriaList = this.colLabelList;
      } else {
        this.orderCriteriaList = this.rowLabelList;
      }
    },

    selectOrderCriteria: function selectOrderCriteria() {
      var thos = this;
      this.conf.postprocessSettings.order.index = this.orderCriteriaList.filter(function (item) {
        return thos.criteriaLabel == item.label;
      })[0].index;
    },

    selectRankDirection: function selectRankDirection() {
      var table = this.wizard.context.table;
      if (this.conf.postprocessSettings.rank.direction == "Rows") {

        this.rankAlt = table.body.map(function (item, index) {
          return { label: item.metadata.map(function (m) {
              return m.label;
            }).join("."), index: index, enable: false };
        });
      } else {
        this.rankAlt = table.header.map(function (item, index) {
          return { label: item.metadata.map(function (m) {
              return m.label;
            }).join("."), index: index, enable: false };
        });
      }
    },

    selectRankAlt: function selectRankAlt() {
      this.conf.postprocessSettings.rank.indexes = this.rankAlt.filter(function (item) {
        return item.enable == true;
      }).map(function (item) {
        return item.index;
      });
    },

    apply: function apply() {
      var thos = this;
      thos.wizard.context.postprocessedTable = undefined;
      $http.post("./api/data/process/", {
        cache: false,
        data_id: this.conf.inputQueryResultId,
        params: this.conf.postprocessSettings,
        proc_name: "post-process",
        response_type: "data"
      }).success(function (resp) {
        thos.conf.queryResultId = resp.data_id;
        thos.wizard.context.postprocessedTable = resp.data;
      });
    }
  };
}]);
//# sourceMappingURL=../v2.steps/post-process.js.map