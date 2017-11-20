"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("ngReact");

require("widgets/v2.steps/palettes");

require("d3");

require("date-and-time");

var m = angular.module("custom-react-directives", ["react", "app.widgets.palettes"]);
m.service("d3", function () {
  return d3;
});

var WdcTable = React.createClass({ displayName: "WdcTable",

  //default style properties

  defaultHeaderLabelStyle: {
    textAlign: "center",
    fontStretch: "ultra-condensed",
    fontSize: "medium",
    // color: "#008CBA",
    padding: "0.3em 1em"
    // border: "solid 1px #DDDDDD"
  },

  defaultHeaderValueStyle: {
    textAlign: "center",
    fontStretch: "ultra-condensed",
    fontSize: "small",
    fontWeight: "normal",
    // color: "#008CBA",
    padding: "0.3em 1em"
    // border: "solid 1px #DDDDDD"
  },

  defaultValueStyle: {
    fontStretch: "ultra-condensed",
    fontSize: "small",
    padding: "0.3em 1em",
    textAlign: "right"
    // border: "solid 1px #DDDDDD"

  },

  // react-directive properties
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getDefaultProps: function getDefaultProps() {

    return {
      data: {
        table: { header: [], body: [] },
        decoration: {}
      }
    };
  },

  //partials rendering
  getHeader: function getHeader(table) {
    var _this = this;

    var headRows = [];

    // let rowspan = function(r){return {__html: "rowspan="+r}};
    // let colspan = function(c){return {__html: "colspan="+c}};

    for (var i = 0; i < table.header[0].metadata.length * 2; i++) {
      (function (i) {
        var headCells = [];
        if (i == 0) {
          headCells = table.body[0].metadata.map(function (item, index) {
            return (
              // React.DOM.th({key:"mth"+i+"_"+index, style:headerLabelStyle,rowSpan:table.header[0].metadata.length*2},item.dimensionLabel)

              React.createElement("th", { key: "mth" + i + "_" + index,
                style: _this.headerLabelStyle,
                rowSpan: table.header[0].metadata.length * 2 }, item.dimensionLabel)
            );
          });
        }

        if (i % 2 == 0) {
          headCells.push((function () {
            return React.createElement("th", { key: "th" + i, style: _this.headerLabelStyle, colSpan: table.header.length }, table.header[0].metadata[Math.floor(i / 2)].dimensionLabel);
          })());
        }

        if (i % 2 == 1) {
          headCells = table.header.map(function (item, index) {
            return React.createElement("th", { key: "vth" + index + "_" + i, style: _this.headerValueStyle }, item.metadata[Math.floor(i / 2)].role == "time" && item.metadata[Math.floor(i / 2)].format ? date.format(new Date(item.metadata[Math.floor(i / 2)].label), item.metadata[Math.floor(i / 2)].format) : item.metadata[Math.floor(i / 2)].label);
          });
        }

        headRows.push(React.DOM.tr({ key: "headtr" + i }, headCells));
      })(i);
    }
    return headRows;
  },

  preparePalette: function preparePalette() {
    if (!this.decoration.color) {
      this.palette = [];
      return;
    }

    var opacity = this.decoration.opacity ? this.decoration.opacity : 1;
    this.palette = this.decoration.color.map(function (item) {
      var c = d3.rgb(item);
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + opacity + ")";
    });
  },

  prepareScales: function prepareScales(table) {
    var _this = this;

    if (this.decoration.colorize) {
      (function () {

        var data = [];

        table.body.forEach(function (row) {
          data.push(row.value);
        });

        if (_this.decoration.direction == "Columns") {
          data = d3.transpose(data);
        }

        if (_this.decoration.direction == "All") {
          (function () {
            var d = [];
            data.forEach(function (row) {
              d = d.concat(row);
            });
            data = [d];
          })();
        }

        _this.scales = data.map(function (row) {
          return d3.scale.linear().domain([d3.min(row), d3.max(row)]).rangeRound([0, _this.palette.length - 1]);
        });
      })();
    }
  },

  // generate fill style for cell value
  getValueStyle: function getValueStyle(value, rowIndex, colIndex) {
    if (!this.decoration.colorize) {
      return this.valueStyle;
    }var result = angular.copy(this.valueStyle);

    var index = 0;

    if (this.decoration.direction == "Rows") {
      index = rowIndex;
    }

    if (this.decoration.direction == "Columns") {
      index = colIndex;
    }

    result.backgroundColor = value == null ? undefined : this.palette[this.scales[index](value)];
    return result;
  },

  getValues: function getValues(row, rowIndex) {
    var _this = this;

    var meta = row.metadata.map(function (m, i) {
      return React.createElement("td", { key: "m" + i, style: _this.headerValueStyle }, m.role == "time" && m.format ? date.format(new Date(m.label), m.format) : m.label);
    });

    var values = row.value.map(function (v, colIndex) {
      return React.createElement("td", { key: "v" + colIndex, style: _this.getValueStyle(v, rowIndex, colIndex) }, v == null ? "-" : v);
    });
    return meta.concat(values);
  },

  render: function render() {
    // console.log("render", this.props)

    // get all render settings

    this.decoration = this.props.data.decoration ? this.props.data.decoration : {};

    // this.decoration.colorize = true;
    // this.decoration.direction = "All";

    // let c  = (decoration.color) ? decoration.color[0] : "green";

    this.headerLabelStyle = this.decoration.headerLabelStyle ? this.decoration.headerLabelStyle : this.defaultHeaderLabelStyle;

    this.headerValueStyle = this.decoration.headerValueStyle ? this.decoration.headerValueStyle : this.defaultHeaderValueStyle;

    this.valueStyle = this.decoration.valueStyle ? this.decoration.valueStyle : this.defaultValueStyle;

    var dataTable = this.props.data.table;

    if (angular.isUndefined(dataTable)) {
      return React.createElement("h5", null, this.noDataAvailable);
    }if (dataTable.body.length == 0) {
      return React.createElement("h5", null, "No Data Available");
    } // if (angular.isUndefined(dataTable.metadata)) return <h5>No Metadata Available</h5>;

    // prepare palettes
    this.preparePalette();
    this.prepareScales(dataTable);

    var thos = this;
    // main rendering

    var head = React.createElement("thead", { key: "head" }, this.getHeader(dataTable));
    // React.DOM.thead({key:"head"},getHeader(this.props.table));

    var rows = dataTable.body.map(function (row, rowIndex) {
      return React.DOM.tr({ key: rowIndex }, thos.getValues(row, rowIndex));
    });

    var body = React.createElement("tbody", { key: "body" }, rows);

    // React.DOM.tbody({key:"body"},rows);

    return React.createElement("table", { key: "table", border: "1" }, [head, body])

    // React.DOM.table({key:"table", border:"1"},[head,body]);
    ;
  }
});

m.value("WdcTable", WdcTable);

m.directive("wdcTable", ["reactDirective", function (reactDirective) {
  return reactDirective("WdcTable");
}]);
//# sourceMappingURL=custom-react-directives.js.map