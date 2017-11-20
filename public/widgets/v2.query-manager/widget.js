"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/wizard/wizard");

require("widgets/v2.steps/select-dataset");

require("widgets/v2.steps/make-query");

require("md5");

require("custom-react-directives");

var m = angular.module("app.widgets.v2.query-manager", ["custom-react-directives", "app.widgets.wizard", "app.widgets.v2.steps.select-dataset", "app.widgets.v2.steps.make-query", "app.dps"]);

m.service("md5", function () {
  return md5;
});

m.factory("Queries", function () {
  var _this = this;

  return {
    scope: undefined,

    init: function (scope) {
      _this.scope = scope;
      scope.widget.queries = scope.widget.queries ? scope.widget.queries : [];
    },

    add: function (query, type, title) {
      var q = {
        $id: md5(angular.toJson(query)),
        $listeners: 0,
        $type: type,
        $title: title,
        context: query
      };
      var oq = _this.scope.widget.queries.filter(function (item) {
        return item.$id == q.$id;
      })[0];
      if (oq) {
        return oq;
      } else {
        _this.scope.widget.queries.push(q);
        return q;
      }
    },

    remove: function (queryID) {
      var query = _this.scope.widget.queries.filter(function (item) {
        return item.$id == queryID;
      })[0];
      if (query) {
        // && (query.$listeners.length == 0)){
        _this.scope.widget.queries = _this.scope.widget.queries.filter(function (item) {
          return item.$id != queryID;
        });
      }
    },

    get: function (queryID) {
      var query = _this.scope.widget.queries.filter(function (item) {
        return item.$id == queryID;
      })[0];
      if (query) query.$listeners++;
      return query;
    },

    release: function (queryID) {
      var query = _this.scope.widget.queries.filter(function (item) {
        return item.$id == queryID;
      })[0];
      if (query) query.$listeners--;
    },

    getQuery: function (query) {
      var id = md5(angular.toJson(query));
      return _this.scope.widget.queries.filter(function (item) {
        return item.$id == id;
      })[0];
    }
  };
});

m._projectionWizard = undefined;

m.factory("ProjectionWizard", ["$http", "$dps", "$modal", "Wizard", "SelectDataset", "MakeQuery", "i18n", function ($http, $dps, $modal, Wizard, SelectDataset, MakeQuery, i18n) {

  if (!m._projectionWizard) {
    m._projectionWizard = new Wizard($modal).setTitle("Data Cube Projection Wizard").setIcon("./widgets/v2.query-manager/projection.png").push(SelectDataset).push(MakeQuery).onStart(function (wizard) {
      wizard.context = {};
    }).onCompleteStep(function (wizard, step) {
      if (step.title == "Dataset") {
        wizard.enable(step.index + 1);
      }
    }).onProcessStep(function (wizard, step) {
      if (step.title == "Dataset") {
        wizard.disable(wizard.getAboveIndexes(step));
      }
    });
  }

  return m._projectionWizard;
}]);

m.controller("PreparationDialogController", ["$scope", "$http", "$dps", "$modal", "dialog", "source", "$modalInstance", "Queries", "pageWidgets", "app", "i18n", function ($scope, $http, $dps, $modal, dialog, source, $modalInstance, Queries, pageWidgets, app, i18n) {

  $scope.source = source;
  $scope.script = [];
  $scope.operations = [];
  $scope.cursor = -1;

  $scope.pushOp = function (o) {
    if ($scope.cursor >= 0 && $scope.cursor < $scope.script.length - 1) {
      $scope.script.splice($scope.cursor + 1, $scope.script.length - $scope.cursor - 1);
    }
    $scope.script.push(o);
    $scope.cursor = $scope.script.length - 1;
    if (!o.send) $scope.runScript();
  };

  $scope.moveCursor = function (value) {
    $scope.cursor = value;
    $scope.runScript();
  };

  $scope.addPreparation = function () {

    var queries = [];

    pageWidgets().filter(function (item) {
      return item.type == "v2.query-manager";
    }).map(function (item) {
      return item.queries;
    }).forEach(function (item) {
      queries = queries.concat(item);
    });

    dialog({
      title: "Enter Table Name",
      fields: {
        name: {
          title: "Table Name",
          type: "text",
          value: ""
        }
      },
      validate: function (form) {
        var f1 = form.fields.name.value.length > 0;
        var f2 = queries.map(function (item) {
          return item.$title;
        }).indexOf(form.fields.name.value) == -1;
        return f1 && f2;
      }

    }).then(function (form) {
      $dps.post("/api/data/script", {
        data: $scope.script.map(function (item) {
          return item.shortName;
        }).join(";") + ";save()",
        locale: i18n.locale()
      }).success(function (resp) {
        console.log(resp);
        Queries.add(angular.copy({
          queryResultId: resp.data.data_id,
          script: $scope.script
        }), "preparation", form.fields.name.value);
        app.markModified();
        $modalInstance.close();
      });
    });
  };

  $scope.close = function () {
    $modalInstance.close();
  };

  $scope.avaibleAggregations = [{ title: "min", value: false }, { title: "max", value: false }, { title: "avg", value: false }, { title: "std", value: false }, { title: "sum", value: false }];

  $scope.operations.push({
    title: "Query data",
    action: function () {}
  });

  $scope.operations.push({
    title: "Reduce Nulls in Columns",
    action: function () {
      dialog({
        title: "Reduce Nulls in Columns",
        fields: {
          mode: {
            title: "Mode",
            type: "select",
            value: "",
            options: [{ title: "Remove column then it contains one or more null values", value: "Has Null" }, { title: "Remove column then it contains all null values", value: "All Nulls" }]
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "reduce(mode:'" + form.fields.mode.value + "',direction : 'Columns')", //"Reduce Columns ("+form.fields.mode.value+")",
          reduce: {
            enable: true,
            mode: form.fields.mode.value,
            direction: "Columns"
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Reduce Nulls in Rows",
    action: function () {
      dialog({
        title: "Reduce Nulls in Rows",
        fields: {
          mode: {
            title: "Mode",
            value: "",
            type: "select",
            options: [{ title: "Remove row then it contains one or more null values", value: "Has Null" }, { title: "Remove row then it contains all null values", value: "All Nulls" }]
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "reduce(mode:'" + form.fields.mode.value + "',direction : 'Rows')", //"Reduce Rows ("+form.fields.mode.value+")",
          reduce: {
            enable: true,
            mode: form.fields.mode.value,
            direction: "Rows"
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Principle Components from Rows",
    action: function () {
      dialog({
        title: "Principle Components from Rows",
        fields: {
          mode: {
            title: "Result type",
            type: "select",
            value: "",
            options: ["Scores", "Eigen Values"]
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "pca(result:'" + form.fields.mode.value + "',direction : 'Rows')", //"PCA ("+form.fields.mode.value+") from Rows",
          pca: {
            enable: true,
            direction: "Rows",
            result: form.fields.mode.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Principle Components from Columns",
    action: function () {
      dialog({
        title: "Principle Components from Columns",
        fields: {
          mode: {
            title: "Result type",
            type: "select",
            value: "",
            options: ["Scores", "Eigen Values"]
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "pca(result:'" + form.fields.mode.value + "',direction : 'Columns')", //"PCA ("+form.fields.mode.value+") from Columns",
          pca: {
            enable: true,
            direction: "Columns",
            result: form.fields.mode.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Clasterize Rows",
    action: function () {
      dialog({
        title: "Clasterize Rows",
        fields: {
          count: {
            title: "Count",
            type: "number",
            value: 2,
            min: 2,
            max: 10
          }
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "cluster(count:'" + form.fields.count.value + "',direction : 'Rows')", //"Clusters ("+form.fields.count.value+") for Rows",
          cluster: {
            enable: true,
            direction: "Rows",
            count: form.fields.count.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Clasterize Columns",
    action: function () {
      dialog({
        title: "Clasterize Columns",
        fields: {
          count: {
            title: "Count",
            type: "number",
            value: 2,
            min: 2,
            max: 10
          }
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "cluster(count:'" + form.fields.count.value + "',direction : 'Columns')", //"Clusters ("+form.fields.count.value+") for Columns",
          cluster: {
            enable: true,
            direction: "Columns",
            count: form.fields.count.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Histogram for Rows",
    action: function () {
      dialog({
        title: "Histogram for Rows",
        fields: {
          beans: {
            title: "Beans",
            type: "number",
            value: 5,
            min: 2,
            max: 20
          },
          cumulate: {
            title: "Cumulate",
            type: "checkbox",
            value: false
          }
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "cls(beans:" + form.fields.beans.value + ",cumulate:" + form.fields.cumulate.value + ",direction : 'Rows')", //,((form.fields.cumulate.value)? "Cumulate ": "")+"Histogram for Rows ("+form.fields.beans.value+" beans)",
          histogram: {
            enable: true,
            direction: "Rows",
            cumulate: form.fields.cumulate.value,
            beans: form.fields.beans.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Histogram for Columns",
    action: function () {
      dialog({
        title: "Histogram for Columns",
        fields: {
          beans: {
            title: "Beans",
            type: "number",
            value: 5,
            min: 2,
            max: 20
          },
          cumulate: {
            title: "Cumulate",
            type: "checkbox",
            value: false
          }
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "cls(beans:" + form.fields.beans.value + ",cumulate:" + form.fields.cumulate.value + ",direction : 'Columns')", //((form.fields.cumulate.value)? "Cumulate ": "")+"Histogram for Columns ("+form.fields.beans.value+" beans)",
          histogram: {
            enable: true,
            direction: "Columns",
            cumulate: form.fields.cumulate.value,
            beans: form.fields.beans.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Correlations for Rows",
    action: function () {
      $scope.pushOp({
        shortName: "corr(direction:'Rows')", //"Correlations for Rows",
        correlation: {
          enable: true,
          direction: "Rows"
        }
      });
    }
  });

  $scope.operations.push({
    title: "Correlations for Columns",
    action: function () {
      $scope.pushOp({
        shortName: "corr(direction:'Columns')", //"Correlations for Columns",
        correlation: {
          enable: true,
          direction: "Columns"
        }
      });
    }
  });

  $scope.operations.push({
    title: "Normalize Rows",
    action: function () {

      dialog({
        title: "Normalize data for Each Row",
        fields: {
          mode: {
            title: "Normalization Mode",
            type: "select",
            value: "",
            options: ["Range to [0,1]", "Standartization", "Logistic"]
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "norm(direction:'Rows', mode:'" + form.fields.mode.value + "')", //"Normalize Rows("+form.fields.mode.value+")",
          normalization: {
            enable: true,
            mode: form.fields.mode.value,
            direction: "Rows"
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Normalize Columns",
    action: function () {

      dialog({
        title: "Normalize data for Each Column",
        fields: {
          mode: {
            title: "Normalization Mode",
            type: "select",
            value: "",
            options: ["Range to [0,1]", "Standartization", "Logistic"]
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "norm(direction:'Columns', mode:'" + form.fields.mode.value + "')", //"Normalize Columns("+form.fields.mode.value+")",
          normalization: {
            enable: true,
            mode: form.fields.mode.value,
            direction: "Columns"
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Aggregate Rows",
    action: function () {
      dialog({
        title: "Aggregate Rows",
        fields: {
          agg: {
            title: "For Each Row Add Aggregation",
            type: "checkgroup",
            value: $scope.avaibleAggregations
          }
        },
        validate: function (form) {
          var oneOrMore = false;
          form.fields.agg.value.forEach(function (item) {
            oneOrMore |= item.value;
          });
          return oneOrMore;
        }
      }).then(function (form) {
        var aggs = $scope.avaibleAggregations.filter(function (item, index) {
          return form.fields.agg.value[index].value;
        }).map(function (item) {
          return item.title;
        });
        $scope.pushOp({
          shortName: "aggregate(direction:'Rows', data:" + JSON.stringify(aggs) + ")", //"Aggregate Rows("+aggs.join(",")+")",
          aggregation: {
            enable: true,
            direction: "Rows",
            data: aggs
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Aggregate Columns",
    action: function () {
      dialog({
        title: "Aggregate Columns",
        fields: {
          agg: {
            title: "For Each Column Add Aggregation",
            type: "checkgroup",
            value: $scope.avaibleAggregations
          }
        },
        validate: function (form) {
          var oneOrMore = false;
          form.fields.agg.value.forEach(function (item) {
            oneOrMore |= item.value;
          });
          return oneOrMore;
        }
      }).then(function (form) {
        var aggs = $scope.avaibleAggregations.filter(function (item, index) {
          return form.fields.agg.value[index].value;
        }).map(function (item) {
          return item.title;
        });
        $scope.pushOp({
          shortName: "aggregate(direction:'Columns', data:" + JSON.stringify(aggs) + ")", //"Aggregate Columns("+aggs.join(",")+")",
          aggregation: {
            enable: true,
            direction: "Columns",
            data: aggs
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Rank for Rows",
    action: function () {

      var rows = $scope.resultTable.header.map(function (item) {
        return item.metadata.map(function (m) {
          return m.label;
        }).join(".");
      });

      dialog({
        title: "Rank for Rows",
        fields: {
          asc: {
            title: "Order",
            type: "select",
            value: "A-Z",
            options: ["A-Z", "Z-A"]
          },
          rows: {
            title: "Columns",
            type: "checkgroup",
            value: rows
          }
        },
        validate: function (form) {
          var oneOrMore = false;
          form.fields.rows.value.forEach(function (item) {
            oneOrMore |= item.value;
          });
          return oneOrMore;
        }

      }).then(function (form) {
        var indexes = undefined;
        $scope.pushOp({
          shortName: "rank(direction:'Columns',asc:'" + form.fields.asc.value + "',indexes:" + JSON.stringify(form.fields.rows.value.map(function (item, index) {
            return item.value ? index : -1;
          }).filter(function (item) {
            return item >= 0;
          })) + ")",
          rank: {
            enable: true,
            direction: "Columns",
            asc: form.fields.asc.value,
            indexes: form.fields.rows.value.map(function (item, index) {
              return item.value ? index : -1;
            }).filter(function (item) {
              return item >= 0;
            })
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Rank for Columns",
    action: function () {

      var rows = $scope.resultTable.body.map(function (item) {
        return item.metadata.map(function (m) {
          return m.label;
        }).join(".");
      });

      dialog({
        title: "Rank for Columns",
        fields: {
          asc: {
            title: "Order",
            type: "select",
            value: "A-Z",
            options: ["A-Z", "Z-A"]
          },
          rows: {
            title: "Rows",
            type: "checkgroup",
            value: rows
          }
        },
        validate: function (form) {
          var oneOrMore = false;
          form.fields.rows.value.forEach(function (item) {
            oneOrMore |= item.value;
          });
          return oneOrMore;
        }

      }).then(function (form) {
        var indexes = undefined;
        $scope.pushOp({
          shortName: "rank(direction:'Columns',asc:'" + form.fields.asc.value + "',indexes:" + JSON.stringify(form.fields.rows.value.map(function (item, index) {
            return item.value ? index : -1;
          }).filter(function (item) {
            return item >= 0;
          })) + ")",
          rank: {
            enable: true,
            direction: "Rows",
            asc: form.fields.asc.value,
            indexes: form.fields.rows.value.map(function (item, index) {
              return item.value ? index : -1;
            }).filter(function (item) {
              return item >= 0;
            })
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Merge Rows",
    action: function () {

      var rows = $scope.resultTable.body.map(function (item, index) {
        return {
          title: item.metadata.map(function (m) {
            return m.label;
          }).join("."),
          value: index
        };
      });

      dialog({

        title: "Merge Rows",
        fields: {
          master: {
            title: "Master row",
            type: "select",
            options: rows
          },
          slave: {
            title: "Slave row",
            type: "select",
            options: rows
          }
        }

      }).then(function (form) {
        var indexes = undefined;
        $scope.pushOp({
          shortName: "merge(direction:'Rows',master:" + form.fields.master.value + ",slave:" + form.fields.slave.value + ")", //"Merge Rows("+form.fields.master.value+","+form.fields.slave.value+")",
          merge: {
            enable: true,
            direction: "Rows",
            master: form.fields.master.value,
            slave: form.fields.slave.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Merge Columns",
    action: function () {

      var rows = $scope.resultTable.header.map(function (item, index) {
        return {
          title: item.metadata.map(function (m) {
            return m.label;
          }).join("."),
          value: index
        };
      });

      dialog({

        title: "Merge Columns",
        fields: {
          master: {
            title: "Master column",
            type: "select",
            options: rows
          },
          slave: {
            title: "Slave column",
            type: "select",
            options: rows
          }
        }

      }).then(function (form) {
        var indexes = undefined;
        $scope.pushOp({
          shortName: "merge(direction:'Columns',master:" + form.fields.master.value + ",slave:" + form.fields.slave.value + ")", //"Merge Columns("+form.fields.master.value+","+form.fields.slave.value+")",
          merge: {
            enable: true,
            direction: "Columns",
            master: form.fields.master.value,
            slave: form.fields.slave.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Format numbers",
    action: function () {
      dialog({
        title: "Format numbers",
        fields: {
          precision: {
            title: "Float Precision",
            type: "number",
            value: 2,
            min: 0,
            max: 5
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "format(precision:" + form.fields.precision.value + ")", //"Number precision: "+form.fields.precision.value,
          precision: form.fields.precision.value
        });
      });
    }
  });

  $scope.operations.push({
    title: "Transpose Table",
    action: function () {
      $scope.pushOp({
        shortName: "transpose()",
        transpose: true
      });
    }
  });

  $scope.operations.push({
    title: "Inputation",
    action: function () {
      $scope.pushOp({
        shortName: "imput(direction:'Row', mode:'fill', from:'left'", //"Inputation",
        inputation: {
          enable: true,
          direction: "Row",
          mode: "fill",
          from: "left"
        }
      });
    }
  });

  $scope.operations.push({
    title: "Sort Rows",
    action: function () {

      var criterias = $scope.resultTable.body[0].metadata.map(function (m, index) {
        return { title: m.dimensionLabel, value: -index - 1 };
      }).concat($scope.resultTable.header.map(function (item, index) {
        return { title: item.metadata.map(function (m) {
            return m.label;
          }).join("."), value: index };
      }));

      dialog({
        title: "Sort Rows",
        fields: {
          asc: {
            title: "Order",
            type: "select",
            value: "A-Z",
            options: ["A-Z", "Z-A"]
          },
          index: {
            title: "Criteria",
            type: "select",
            value: "",
            options: criterias
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "order(direction:'Row', asc:'" + form.fields.asc.value + "', index:" + form.fields.index.value + ")",
          // "Sort Rows "+form.fields.asc.value+" order by "
          //   +criterias.filter((item) => { return (item.value - form.fields.index.value) == 0 })[0].title,
          order: {
            enable: true,
            direction: "Rows",
            asc: form.fields.asc.value,
            index: form.fields.index.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Sort Columns",
    action: function () {

      var criterias = $scope.resultTable.header[0].metadata.map(function (m, index) {
        return { title: m.dimensionLabel, value: -index - 1 };
      }).concat($scope.resultTable.body.map(function (item, index) {
        return { title: item.metadata.map(function (m) {
            return m.label;
          }).join("."), value: index };
      }));

      dialog({
        title: "Sort Columns",
        fields: {
          asc: {
            title: "Order",
            type: "select",
            value: "A-Z",
            options: ["A-Z", "Z-A"]
          },
          index: {
            title: "Criteria",
            type: "select",
            value: "",
            options: criterias
          }
        }
      }).then(function (form) {
        $scope.pushOp({
          shortName: "order(direction:'Columns', asc:'" + form.fields.asc.value + "', index:" + form.fields.index.value + ")",
          // "Sort Columns "+form.fields.asc.value+" order by "
          //   +criterias.filter((item) => item.value == form.fields.index.value)[0].title,
          order: {
            enable: true,
            direction: "Columns",
            asc: form.fields.asc.value,
            index: form.fields.index.value
          }
        });
      });
    }
  });

  $scope.operations.push({
    title: "Reduce Row Metadata",

    action: function () {

      dialog({
        title: "Reduce Row Metadata",
        fields: {
          rows: {
            title: "Metadata Item",
            type: "checkgroup",
            value: $scope.resultTable.body[0].metadata.map(function (item) {
              return item.dimensionLabel;
            })
          }
        },
        validate: function (form) {
          var oneOrMore = false;
          form.fields.rows.value.forEach(function (item) {
            oneOrMore |= item.value;
          });
          return oneOrMore;
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "reduceMeta(useRowMetadata:" + JSON.stringify(form.fields.rows.value.map(function (item) {
            return item.value;
          })) + ")",
          // "Use Row Metadata("+
          //   form.fields.rows.value
          //   .filter((item) => item.value)
          //   .map((item) => item.title)
          //   .join(",")
          //   +")",
          useRowMetadata: form.fields.rows.value.map(function (item) {
            return item.value;
          })
        });
      });
    }
  });

  $scope.operations.push({
    title: "Reduce Column Metadata",

    action: function () {

      dialog({
        title: "Reduce Column Metadata",
        fields: {
          rows: {
            title: "Metadata Item",
            type: "checkgroup",
            value: $scope.resultTable.header[0].metadata.map(function (item) {
              return item.dimensionLabel;
            })
          }
        },
        validate: function (form) {
          var oneOrMore = false;
          form.fields.rows.value.forEach(function (item) {
            oneOrMore |= item.value;
          });
          return oneOrMore;
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "reduceMeta(useColumnMetadata:" + JSON.stringify(form.fields.rows.value.map(function (item) {
            return item.value;
          })) + ")",
          // "Use Column Metadata("+
          //   form.fields.rows.value
          //   .filter((item) => item.value)
          //   .map((item) => item.title)
          //   .join(",")
          //   +")",
          useColumnMetadata: form.fields.rows.value.map(function (item) {
            return item.value;
          })
        });
      });
    }
  });

  $scope.operations.push({
    title: "Limit Rows",
    action: function () {
      dialog({
        title: "Limit Rows",
        fields: {
          start: {
            title: "Start Position",
            type: "number",
            value: 1,
            min: 1,
            max: $scope.resultTable.body.length
          },
          length: {
            title: "Row Count",
            type: "number",
            value: 1,
            min: 1
          }
        }

      }).then(function (form) {
        $scope.pushOp({
          shortName: "limit(start:" + form.fields.start.value + ", length:" + form.fields.length.value + ")",
          limit: {
            enable: true,
            start: form.fields.start.value,
            length: form.fields.length.value }
        });
      });
    }
  });

  // $dps
  //   .get("/api/data/process/"+source.context.queryResultId)
  //   .success(function (resp) {
  //       $scope.resultTable = resp.value;
  //       $scope.data_id = resp.data_id;
  //       $scope.pushOp({
  //         shortName: "source(table:'"+source.context.queryResultId+"')",//"Select "+source.$title+"("+ source.context.queryResultId +")",
  //         select:{
  //           "source":source.$title
  //         }
  //       })

  // });

  $scope.runScript = function () {
    var script = $scope.script.filter(function (item, index) {
      return index <= $scope.cursor;
    });
    $scope.resultTable = undefined;

    console.log("RUN SCRIPT", script.map(function (item) {
      return item.shortName;
    }).join(";")); //+";save()")

    $dps.post("/api/data/script", {
      data: script.map(function (item) {
        return item.shortName;
      }).join(";"), //+";save()",
      locale: i18n.locale()
    }).success(function (resp) {
      console.log(resp);
      $scope.resultTable = resp.data;
      // $scope.data_id = resp.data.data_id;
    });
  };

  $scope.addOp = function () {
    dialog({
      title: "Add Operation",
      fields: {
        operation: {
          title: "Operation",
          type: "select",
          options: $scope.operations.map(function (item, index) {
            return { title: item.title, value: index };
          })
        }
      }
    }).then(function (form) {
      $scope.operations[form.fields.operation.value].action();
    });
  };

  setTimeout(function () {
    $scope.pushOp({
      shortName: "source(table:'" + source.context.queryResultId + "')"
    });
  }, 0);
}]);

m.controller("JoinDialogController", ["$scope", "$modalInstance", "$http", "$dps", "pageWidgets", "source", "dialog", "Queries", "app", "i18n", function ($scope, $modalInstance, $http, $dps, pageWidgets, source, dialog, Queries, app, i18n) {

  $scope.queries = [];

  pageWidgets().filter(function (item) {
    return item.type == "v2.query-manager";
  }).map(function (item) {
    return item.queries;
  }).forEach(function (item) {
    $scope.queries = $scope.queries.concat(item);
  });

  $scope.t1_data_id = source.context.queryResultId;
  $scope.t1_title = source.$title;

  $dps.get("/api/data/process/" + $scope.t1_data_id).success(function (resp) {
    $scope.t1 = resp.value;
    $scope.t1_data_id = resp.id;
    $scope.t1_meta = $scope.t1.body.length > 0 ? $scope.t1.body[0].metadata.map(function (item, index) {
      return {
        title: item.dimensionLabel,
        value: index
      };
    }) : [];
  });

  function _init() {
    $scope.test = [];
    $scope.t2_title = undefined;
    $scope.t2 = undefined;
    $scope.t2_data_id = undefined;
  }

  _init();

  var queryTest = function () {

    if (!$scope.t2_title) {
      $scope.complete = false;
      return;
    }
    if (!$scope.mode) {
      $scope.complete = false;
      return;
    }
    if (!$scope.t1_data_id) {
      $scope.complete = false;
      return;
    }
    if (!$scope.t2_data_id) {
      $scope.complete = false;
      return;
    }
    $scope.complete = true;
    $scope.getJoin();
  };

  $scope.selectQuery = function (q) {
    _init();

    $scope.t2_title = q.$title;

    $dps.get("/api/data/process/" + q.context.queryResultId).success(function (resp) {
      $scope.t2 = resp.value;
      $scope.t2_data_id = resp.id;
      $scope.t2_meta = $scope.t2.body.length > 0 ? $scope.t2.body[0].metadata.map(function (item, index) {
        return {
          title: item.dimensionLabel,
          value: index
        };
      }) : [];
      queryTest();
    });
  };

  $scope.addRowTest = function () {
    dialog({
      title: "Add Row Test",
      fields: {
        t1: {
          title: "Table 1 Row Meta",
          type: "select",
          value: "",
          options: $scope.t1_meta
        },
        t2: {
          title: "Table 2 Row Meta",
          type: "select",
          value: "",
          options: $scope.t2_meta
        }
      }
    }).then(function (form) {
      $scope.test.push([form.fields.t1.value, form.fields.t2.value]);
      queryTest();
    });
  };

  $scope.deleteRowTest = function (index) {
    $scope.test.splice(index, 1);
    queryTest();
  };

  $scope.selectMode = function (m) {
    $scope.mode = m;
    queryTest();
  };

  $scope.condition = function () {
    return $scope.test.map(function (t) {
      return "( " + $scope.t1_title + "." + $scope.t1_meta[t[0]].title + " = " + $scope.t2_title + "." + $scope.t2_meta[t[1]].title + " )";
    }).join(" AND ");
  };

  $scope.getJoin = function () {

    $scope.resultTable = undefined;
    $scope.loaded = true;
    $dps.post("/api/data/script", {
      data: "source(table:'" + $scope.t2_data_id + "')" + "set('t1')" + "source(table:'" + $scope.t1_data_id + "')" + "join(with:'{{t1}}', mode:'" + $scope.mode + "', on:" + JSON.stringify($scope.test) + ")" + "cache()",
      locale: i18n.locale()
    })

    // $dps
    //     .post("/api/data/process/",
    //       {
    //         "cache": false,
    //         "data_id": [$scope.t1_data_id,$scope.t2_data_id],
    //         "params": {
    //           join:{
    //             enable : true,
    //             mode : $scope.mode,
    //             test:$scope.test
    //           } 
    //         },
    //         "proc_name": "post-process",
    //         "response_type": "data"
    //       }   
    //     )
    .success(function (resp) {
      $scope.resultTable = resp.data.data;
      $scope.loaded = false;
      $scope.data_id = resp.data.data_id;
    });
  };

  $scope.save = function () {

    dialog({
      title: "Enter Table Name",
      fields: {
        name: {
          title: "Table Name",
          type: "text",
          value: ""
        }
      },
      validate: function (form) {
        var f1 = form.fields.name.value.length > 0;
        var f2 = $scope.queries.map(function (item) {
          return item.$title;
        }).indexOf(form.fields.name.value) == -1;
        return f1 && f2;
      }

    }).then(function (form) {

      Queries.add(angular.copy({
        queryResultId: $scope.data_id }), "preparation", form.fields.name.value);
      app.markModified();
      $modalInstance.close();
    });
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
}]);

m.controller("QueryManagerController", ["$scope", "$http", "$dps", "$modal", "APIProvider", "EventEmitter", "pageSubscriptions", "Queries", "app", "confirm", "dialog", "pageWidgets", "ProjectionWizard", function ($scope, $http, $dps, $modal, APIProvider, EventEmitter, pageSubscriptions, Queries, app, confirm, dialog, pageWidgets, ProjectionWizard) {

  $scope.addProjection = function (context, title) {
    Queries.add(angular.copy(context), "projection", title);
    app.markModified();
  };

  $scope.addPreparation = function (context, title) {
    Queries.add(angular.copy(context), "preparation", title);
    app.markModified();
  };

  $scope.getQuery = function (context) {
    return Queries.getQuery(context);
  };

  $scope.invokeAddProjectionWizard = function () {
    $scope.wizard = ProjectionWizard;
    $scope.wizard.start($scope);
  };

  $scope.invokeAddJoinWizard = function () {

    var queries = [];

    pageWidgets().filter(function (item) {
      return item.type == "v2.query-manager";
    }).map(function (item) {
      return item.queries;
    }).forEach(function (item) {
      queries = queries.concat(item);
    });

    dialog({
      title: "Select Join Source",
      note: "One from available sources shuld be selected",
      fields: {
        source: {
          title: "Source",
          type: "select",
          options: queries.map(function (item, index) {
            return { title: item.$title, value: index };
          })
        }
      }
    }).then(function (form) {
      $modal.open({
        templateUrl: "/widgets/v2.query-manager/join-dialog.html",
        // windowClass: 'dialog-modal',
        backdrop: "static",
        controller: "JoinDialogController",
        resolve: {
          source: function () {
            return queries[form.fields.source.value];
          }
        }
      });
    });
  };

  $scope.invokeAddPreparationWizard = function () {

    var queries = [];

    pageWidgets().filter(function (item) {
      return item.type == "v2.query-manager";
    }).map(function (item) {
      return item.queries;
    }).forEach(function (item) {
      queries = queries.concat(item);
    });

    dialog({
      title: "Select Preparation Source",
      note: "One from available sources shuld be selected",
      fields: {
        source: {
          title: "Source",
          type: "select",
          options: queries.map(function (item, index) {
            return { title: item.$title, value: index };
          })
        }
      }
    }).then(function (form) {

      $modal.open({
        templateUrl: "widgets/v2.query-manager/preparation-dialog.html",
        controller: "PreparationDialogController",
        backdrop: "static",
        resolve: {
          source: function source() {
            return queries[form.fields.source.value];
          }
        }
      }).result.then(function (newQuery) {});
    });
  };

  $scope.select = function (query) {
    $scope.preview = undefined;
    $scope.selected = query;
    $scope.selectedScript = query.context.script ? "Script: " + query.context.script.map(function (item) {
      return item.shortName;
    }).join(". ") + ". Data ID: " + query.context.queryResultId : "Data ID: " + query.context.queryResultId;

    $dps.get("/api/data/process/" + query.context.queryResultId).success(function (resp) {
      $scope.preview = resp.value;
    });
  };

  $scope.del = function (query) {
    confirm("Delete query " + query.$title + " ?").then(function () {
      Queries.remove(query.$id);
      app.markModified();
    });
  };

  $scope.getQueries = function () {
    return $scope.widget.queries;
  };

  this.getQueries = $scope.getQueries;

  new APIProvider($scope).config(function () {
    Queries.init($scope);
  });
}]);
//# sourceMappingURL=../v2.query-manager/widget.js.map