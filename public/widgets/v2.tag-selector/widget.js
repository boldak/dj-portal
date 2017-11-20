"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.data-selector/wizard");

var m = angular.module("app.widgets.v2.tag-selector", ["app.dps", "app.widgets.v2.data-selector-wizard"]);

m.controller("TagSelectorCtrlV2", ["$scope", "$http", "$dps", "APIProvider", "EventEmitter", "dialog", function ($scope, $http, $dps, APIProvider, EventEmitter, dialog) {

    $scope.emitter = new EventEmitter($scope);

    var Selector = function Selector() {
        var _this = this;

        this.objects = $scope.selectorData;

        this.add = function (key) {
            var ff = _this.objects.filter(function (item) {
                return item.key === key;
            });
            if (ff.length == 0) {
                var res = {
                    key: key,
                    disabled: true
                };
                _this.objects.push(res);
                return res;
            }
            return ff[0];
        };

        this.selected = function () {
            return _this.objects.filter(function (item) {
                return !item.disabled;
            });
        };

        this.unselected = function () {
            return _this.objects.filter(function (item) {
                return item.disabled;
            });
        };

        this.selectOneObject = function (objectKey) {
            objectKey = objectKey.trim();
            _this.objects.forEach(function (o) {
                if (o.key == objectKey) {
                    o.disabled = false;
                } else {
                    o.disabled = true;
                }
            });
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
            // console.log("Emit selectObject2")
            // $scope.emitter.emit("selectObject",this.objects);
        };

        this.emit = function () {
            $scope.emitter.emit("selectObject", this.objects);
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

        var item = $scope.selector.add(key);
        $scope.selector.selectObject(key);
        $scope.selected = $scope.selector.selected();
        $scope.unselected = $scope.selector.unselected()

        // let index = -1;

        // for (let i in $scope.unselected){
        //   if($scope.unselected[i].key == item.key){
        //     index = i;
        //     break;
        //   }
        // }

        // if(index == -1){
        //   $scope.unselected.push(item)
        //   index = $scope.unselected.length-1; 
        // }

        // $scope.selected.push($scope.unselected[index])
        // $scope.unselected.splice(index,1);
        // $scope.selector.selectObject(key)
        // $scope.selectedObject = undefined;
        ;
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

    $scope.keydown = function (event) {
        // console.log(event.key)
        if (event.key == "Enter") {
            // console.log("add user tag ", $scope.inputKey)

            $scope.select($scope.inputKey);
        }
    };

    $scope.change = function (value) {
        $scope.inputKey = value;
        // console.log($scope.inputKey)
    };

    new APIProvider($scope).config(function () {}).openCustomSettings(function () {
        dialog({
            title: "Tag selector settings",
            fields: {
                title: {
                    title: "Widget title",
                    type: "text",
                    value: $scope.widget.title,
                    required: false
                },
                view: {
                    title: "Widget view",
                    type: "select",
                    value: $scope.widget.view || "Grid",
                    options: ["Select", "List", "Grid", "Typeahead"],
                    required: false
                },

                button: {
                    title: "Button label",
                    type: "text",
                    value: $scope.widget.button || "Go...",
                    required: false
                }
            }
        }).then(function (form) {
            $scope.widget.title = form.fields.title.value;
            $scope.widget.view = form.fields.view.value;
            $scope.widget.button = form.fields.button.value;
        });
    }).translate(function () {}).provide("updateWithData", function (e, context) {
        if (!context) return;

        if (context.widget) {
            context.widget = context.widget.forEach ? context.widget : [context.widget];
        }

        if (!context.widget || context.widget.indexOf($scope.widget.instanceName) >= 0) {

            $scope.selectorData = context.data;
        }

        if (context.options) {
            $scope.hidden = context.options.hidden;
            $scope.widget.decoration.title = context.options.title ? context.options.title : $scope.widget.decoration.title;
            $scope.widget.decoration.view = context.options.view ? context.options.view : $scope.widget.decoration.view;
            $scope.widget.decoration.runnable = context.options.view ? context.options.runnable : $scope.widget.decoration.runnable;
            $scope.widget.button = context.options.button ? context.options.button : $scope.widget.button;
        }
    }).provide("updateWithOptions", function (e, context) {
        if (!context) return;

        if (context.widget) {
            context.widget = context.widget.forEach ? context.widget : [context.widget];
        }

        if (!context.widget || context.widget.indexOf($scope.widget.instanceName) >= 0) {

            $scope.hidden = context.options.hidden;
            $scope.widget.decoration.title = context.options.title ? context.options.title : $scope.widget.decoration.title;
            $scope.widget.decoration.view = context.options.view ? context.options.view : $scope.widget.decoration.view;
            $scope.widget.decoration.runnable = context.options.view ? context.options.runnable : $scope.widget.decoration.runnable;
            $scope.widget.button = context.options.button ? context.options.button : $scope.widget.button;
        }
    });
}]);
// console.log("Emit selectObject1")
// $scope.emitter.emit("selectObject",this.objects); 
// $scope.lock = false;
// $scope.lock = true;
//# sourceMappingURL=../v2.tag-selector/widget.js.map