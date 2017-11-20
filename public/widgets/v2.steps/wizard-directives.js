"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("ngReact");

require("widgets/v2.steps/palettes");

var m = angular.module("wizard-directives", ["react", "app.widgets.palettes"]);

var ulStyle = {
  height: "10rem",
  overflow: "auto"
};

var colorStyle = function (color) {
  return {
    backgroundColor: color,
    width: "10px",
    height: "10px",
    display: "inline-block",
    margin: "0",
    padding: "0",
    border: "1px solid #afafaf"
  };
};

var renderColor = function (color, indexc, indexp) {
  return React.createElement("span", { key: "color" + indexp + indexc, style: colorStyle(color) });
};

var renderRow = function (pal, indexp, onSelect, dest) {
  var clickHandler = function () {
    onSelect.call(dest, pal);
  };
  return React.createElement("li", { key: "pal" + indexp, onClick: clickHandler }, pal.map(function (c, indexc) {
    return renderColor(c, indexp, indexc);
  }));
};

var Pal = React.createClass({ displayName: "Pal",
  propTypes: {
    setter: React.PropTypes.func.isRequired,
    dest: React.PropTypes.object.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      setter: function (data) {
        console.log(data);
      },
      dest: {}
    };
  },

  render: function render() {

    var setter = this.props.setter;
    var dest = this.props.dest;
    return React.createElement("ul", { className: "f-dropdown tiny", style: ulStyle, id: "dropdown-example-3" }, Palettes.map(function (pal, index) {
      return renderRow(pal, index, setter, dest);
    }));
  }
});

m.value("Pal", Pal);

m.directive("fastPalettePeacker", ["reactDirective", function (reactDirective) {
  return reactDirective("Pal");
}]);

m.directive("titlesControl", function () {
  return {
    restrict: "E",
    templateUrl: "widgets/v2.steps/partials/titles-ctrl.html",
    transclude: true
  };
});
//# sourceMappingURL=../v2.steps/wizard-directives.js.map