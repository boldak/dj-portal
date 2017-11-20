"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.data-selector/wizard");

var m = angular.module("app.widgets.v2.data-selector", ["app.dps", "app.widgets.v2.data-selector-wizard"]);

m.controller("DataSelectorCtrlV2", ["$scope", "$http", "$dps", "DataSelectorWizard", "APIProvider", "EventEmitter", function ($scope, $http, $dps, DataSelectorWizard, APIProvider, EventEmitter) {

  $scope.emitter = new EventEmitter($scope);

  var Selector = function Selector() {
    var _this = this;

    this.objects = $scope.selectorData;

    this.selectOneObject = function (objectKey) {
      objectKey = objectKey.trim();
      _this.objects.forEach(function (o) {
        if (o.key == objectKey) {
          o.disabled = false;
        } else {
          o.disabled = true;
        }
      });
      // console.log("Emit selectObject1")
      $scope.emitter.emit("selectObject", _this.objects);
    };

    this.inverseObjectSelection = function () {
      _this.objects.forEach(function (o) {
        o.disabled = !!!o.disabled;
      });
    };
    this.clear = function () {
      _this.objects.forEach(function (item) {
        item.disabled = true;
      });
    };

    this.selectObject = function (objectKey) {

      var selectedObject = _this.objects.filter(function (o) {
        return o.key === objectKey;
      })[0];
      selectedObject.disabled = !selectedObject.disabled;
      if (_this.objects.filter(function (o) {
        return !o.disabled;
      }).length == 0) {
        selectedObject.disabled = !selectedObject.disabled;
        _this.inverseObjectSelection();
      }
      // console.log("Emit selectObject", this.objects);
      $scope.emitter.emit("selectObject", _this.objects);
    };
  };

  $scope.$parent.getSelectorData = function (list) {

    $scope.selectorData = list;

    $scope.selector = new Selector();
    $scope.selected = [];
    $scope.unselected = $scope.selectorData.map(function (item) {
      return item;
    });
  };

  $scope.$watch("selectorData", function (newList, oldList) {
    // console.log("selectorData changed")
    // if(newList == oldList) return;
    if (newList && newList.forEach) {
      $scope.selector = new Selector();
      $scope.selected = [];
      $scope.unselected = newList.map(function (item) {
        return item;
      });
    }
  });

  $scope.select = function (key) {
    var index = -1;
    for (var i in $scope.unselected) {
      if ($scope.unselected[i].key == key) {
        index = i;
        break;
      }
    }
    $scope.selected.push($scope.unselected[index]);
    $scope.unselected.splice(index, 1);
    $scope.selector.selectObject(key);
    $scope.selectedObject = undefined;
  };

  $scope.unselect = function (key) {
    if ($scope.selected.length < 2) return;
    var index = -1;
    for (var i in $scope.selected) {
      if ($scope.selected[i].key == key) {
        index = i;
        break;
      }
    }
    $scope.unselected.push($scope.selected[index]);
    $scope.selected.splice(index, 1);
    $scope.selector.selectObject(key);
  };

  $scope.keyFounded = function (key) {
    if (!key) return false;
    if (!$scope.unselected) return false;
    return $scope.unselected.filter(function (o) {
      return o.key == key;
    })[0];
  };

  $scope.load = function () {
    // $http
    //   .get("./api/data/process/"+$scope.widget.dataID)
    $dps.get("/api/data/process/" + $scope.widget.dataID).then(function (resp) {
      var table = resp.data.value;
      var list = $scope.widget.decoration.direction == "Rows" ? table.body : table.header;
      list = list.map(function (item) {
        return {
          id: item.metadata[$scope.widget.decoration.meta.index].id,
          key: item.metadata[$scope.widget.decoration.meta.index].label,
          disabled: true
        };
      });
      $scope.$parent.getSelectorData(list);
    });
  };

  new APIProvider($scope).config(function () {
    // console.log("Config selector")
    $scope.load();
  }).openCustomSettings(function () {
    $scope.wizard = DataSelectorWizard;
    return $scope.wizard.start($scope);
  }).translate(function () {
    $scope.selector.clear();
    $scope.selected.forEach(function (item) {
      $scope.selector.selectObject(item.key);
    });
  });
}]);
//# sourceMappingURL=../v2.data-selector/widget.js.map