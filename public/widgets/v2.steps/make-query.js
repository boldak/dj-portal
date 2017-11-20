"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("dictionary");

require("custom-react-directives");

var m = angular.module("app.widgets.v2.steps.make-query", ["app", "app.dictionary", "custom-react-directives", "app.dps"]);

m.factory("MakeQuery", ["$http", "$dps", "$timeout", "$lookup", "$translate", "$q", "dialog", "alert", function ($http, $dps, $timeout, $lookup, $translate, $q, dialog, alert) {

  return {

    id: "MakeQuery",

    title: "Query",

    description: "Make Query",

    html: "./widgets/v2.steps/make-query.html",

    onStartWizard: function onStartWizard(wizard) {
      this.wizard = wizard;
      this.conf = {}
      //
      // this.conf = {
      //   query : wizard.conf.query,
      //   dataset : wizard.conf.dataset
      // }

      // wizard.context.query = this.conf.query;

      // if (angular.isUndefined(this.conf.query)){
      //     wizard.process(this);
      // }else{
      //     this.complete()
      // } 
      ;
    },

    onFinishWizard: function onFinishWizard(wizard) {},

    activate: function activate(wizard) {
      // this.query = wizard.conf.query;
      this.conf.dataset = wizard.context.dataset;
      if (angular.isUndefined(this.conf.query)) {
        wizard.process(this);
      } else {
        this.tryGetTable();
        // this.complete();
      }
    },

    complete: function complete() {
      var _this = this;

      this.wizard.context.dataset = this.conf.dataset;
      this.wizard.context.query = this.conf.query;
      if (!this.wizard.context.table && this.conf.query) {
        (function () {
          var thos = _this;
          $dps.post("/api/dataset/query", _this.conf.query).success(function (resp) {
            thos.wizard.context.table = resp;
            thos.wizard.complete(thos);
          });
        })();
      } else {
        this.wizard.complete(this);
      }
    },

    addQuery: function addQuery() {
      var _this = this;

      var defaultSettings = {
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
        }
      };

      var q = this.wizard.parentScope.getQuery(this.conf.query);

      if (!q) {
        (function () {
          var thos = _this;
          dialog({
            title: "Enter Data Projection Title",
            fields: {
              title: {
                title: "Title",
                value: "",
                editable: true,
                required: true
              }
            }
          }).then(function (form) {

            $dps.post("/api/data/process/", {
              cache: false,
              data_query: thos.conf.query,
              params: defaultSettings,
              proc_name: "post-process",
              response_type: "data"
            }).success(function (resp) {
              thos.conf.queryResultId = resp.data_id;
              thos.wizard.context.postprocessedTable = resp.data;
              thos.conf.dataset = undefined;
              thos.wizard.parentScope.addProjection(thos.conf, form.fields.title.value);
              // thos.wizard.context.queryResultId = resp.data_id;
              // thos.conf.queryResultId = resp.data_id;
              // thos.wizard.complete(thos);
            });
          });
        })();
      } else {
        alert.message(["Doublicate of Projection", "This projection exists with title: " + q.$title]);
      }
    },

    lookup: $lookup,

    setRole: function setRole(dim, role) {
      dim.role = role;
      this.wizard.process(this);
      this.tryGetTable();
    },

    genSelectionString: function genSelectionString(dim) {
      var buf = [];
      // let s = "";
      dim.selectionString = "";

      dim.values.forEach(function (item) {
        if (item.selected) {
          buf.push(item);
        }
      });
      if (buf.length === 0) {
        dim.selectionString = "";
      }

      for (var i in buf) {
        var k = $lookup(buf[i].label).label ? $lookup(buf[i].label).label : buf[i].label;
        $translate(k).then(function (translation) {
          dim.selectionString += translation + ", ";
          if (dim.selectionString.length >= 45) {
            dim.selectionString = dim.selectionString.substring(0, 40) + "... (" + buf.length + " items) ";
          }
        });
      }
    },

    select: function select(dim, item) {
      this.wizard.process(this);
      item.selected = item.selected || false;
      item.selected = !item.selected;
      this.genSelectionString(dim);
      this.tryGetTable();
    },

    selectAll: function selectAll(dim) {
      this.wizard.process(this);
      dim.values.forEach(function (item) {
        item.selected = true;
      });
      this.genSelectionString(dim);
      this.tryGetTable();
    },

    clear: function clear(dim) {
      this.wizard.process(this);
      dim.values.forEach(function (item) {
        item.selected = false;
      });
      this.genSelectionString(dim);
      this.tryGetTable();
    },

    reverse: function reverse(dim) {
      this.wizard.process(this);
      dim.values.forEach(function (item) {
        item.selected = !item.selected;
      });
      this.genSelectionString(dim);
      this.tryGetTable();
    },

    getItemStyle: function getItemStyle(obj) {
      if (obj.selected) {
        return {
          color: "#FFFFFF",
          "background-color": "#008CBA"
        };
      }
      return {
        color: "#008CBA",
        "background-color": "#FFFFFF"
      };
    },

    tryGetTable: function tryGetTable() {
      var _this = this;

      this.requestComplete = this.testQuery(this.conf.dataset);
      if (this.requestComplete) {
        (function () {
          _this.request = _this.makeRequest(_this.conf.dataset);
          _this.conf.query = _this.request;
          if (_this.canceler) {
            _this.canceler.resolve();
          } else {}

          _this.canceler = $q.defer();
          var thos = _this;
          if (_this.wizard.context.table) {
            $dps.get("/api/table/delete/" + _this.wizard.context.table.id).success(function () {
              thos.wizard.context.table = undefined;
              // item.tableID = undefined;

              $dps.post("/api/dataset/query", thos.request, { timeout: thos.canceler.promise }).success(function (resp) {
                thos.wizard.context.table = resp;
                thos.complete();
                // item.tableID = resp.id;
                // $scope.canceler.resolve();
                // $scope.canceler = undefined;
              });
            });
          } else {
            _this.wizard.context.table = undefined;
            // item.tableID = undefined;
            $dps.post("/api/dataset/query", _this.request, { timeout: _this.canceler.promise }).success(function (resp) {
              thos.wizard.context.table = resp;
              thos.complete();
              // item.tableID = resp.id;
            });
          }
        })();
      } else {
        (function () {
          var thos = _this;
          if (_this.wizard.context.table) {
            $dps.get("/api/table/delete/" + _this.wizard.context.table.id).success(function () {
              thos.wizard.context.table = undefined;
              // item.tableID = undefined;
            });
          }
        })();
      }
    },

    makeRequest: function makeRequest(item) {
      var req = {};
      req.commitID = item.dataset.commit.id;
      req.datasetID = item.dataset.id;

      req.query = [];
      req.locale = $translate.use();
      for (var i in item.dimension) {
        var d = item.dimension[i];
        var collection = this.getSelectedItems(d);
        if (collection.length == d.values.length) {
          collection = [];
        } else {
          collection = collection.map(function (item) {
            return item.id;
          });
        }
        req.query.push({
          dimension: i,
          role: d.role,
          collection: collection
        });
      }
      return req;
    },

    getSelectedItems: function getSelectedItems(d) {
      var buf = [];
      d.values.forEach(function (item) {
        if (item.selected) {
          buf.push(item);
        }
      });
      return buf;
    },

    testQuery: function testQuery(item) {
      var columnsAvailable = false;
      var rowsAvailable = false;
      var splitColumnsAvailable = true;
      var splitRowsAvailable = true;
      for (var i in item.dimension) {
        var d = item.dimension[i];
        if (d.role == "Columns" && this.getSelectedItems(d).length > 0) columnsAvailable = true;
        if (d.role == "Rows" && this.getSelectedItems(d).length > 0) rowsAvailable = true;
        if (d.role == "Split Columns") {
          if (this.getSelectedItems(d).length > 0) {
            splitColumnsAvailable &= true;
          } else {
            splitColumnsAvailable &= false;
          }
        }
        if (d.role == "Split Rows") {
          if (this.getSelectedItems(d).length > 0) {
            splitRowsAvailable &= true;
          } else {
            splitRowsAvailable &= false;
          }
        }
      }
      return columnsAvailable && rowsAvailable && splitColumnsAvailable && splitRowsAvailable;
    }

  };
}]);

// wizard.conf.query = this.conf.query;
// wizard.conf.dataset = this.conf.dataset;
// this.conf = {};

// this.wizard.process(this);
//# sourceMappingURL=../v2.steps/make-query.js.map