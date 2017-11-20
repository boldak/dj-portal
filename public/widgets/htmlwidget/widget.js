"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.htmlwidget", []).controller("HtmlWidgetController", ["$scope", "$http", "$dps", "EventEmitter", "APIProvider", "pageSubscriptions", "$lookup", "$translate", "$modal", "user", "i18n", "$scroll", "clipboard", "dialog", "$error", "log", "instanceNameToScope", "config", "$info", "app", "$sce", function ($scope, $http, $dps, EventEmitter, APIProvider, pageSubscriptions, $lookup, $translate, $modal, user, i18n, $scroll, clipboard, dialog, $error, log, instanceNameToScope, config, $info, app, $sce) {

    var eventEmitter = new EventEmitter($scope);
    var apiProvider = new APIProvider($scope);

    $scope.$api = $scope.api = $scope.Api = $scope.API = {

        widget: function widget(widgetName) {
            return instanceNameToScope.get(widgetName);
        },

        config: function () {
            return config;
        },
        user: function () {
            return user;
        },
        app: function () {
            return app;
        },
        logIn: function () {
            return logIn;
        },

        provide: function provide(params) {
            var event = params.event;
            var widgets = params.widgets;
            var callback = params.callback;
            widgets = widgets || [];
            widgets = widgets.forEach ? widgets : [widgets];

            apiProvider.provide(event, callback);

            widgets.forEach(function (w) {

                pageSubscriptions().removeListeners({
                    emitter: w,
                    receiver: $scope.widget.instanceName,
                    signal: event,
                    slot: event
                });

                pageSubscriptions().addListener({
                    emitter: w,
                    receiver: $scope.widget.instanceName,
                    signal: event,
                    slot: event
                });
            });
        },

        addListeners: function addListeners(params) {
            var event = params.event;
            var widgets = params.widgets;
            widgets = widgets || [];
            widgets = widgets.forEach ? widgets : [widgets];
            widgets.forEach(function (w) {

                pageSubscriptions().removeListeners({
                    emitter: $scope.widget.instanceName,
                    receiver: w,
                    signal: event,
                    slot: event
                });

                pageSubscriptions().addListener({
                    emitter: $scope.widget.instanceName,
                    receiver: w,
                    signal: event,
                    slot: event
                });
            });
        },

        emit: function emit(event, data) {
            eventEmitter.emit(event, data);
        },

        error: function error() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var messages = args.map(function (item) {
                if (item.toString && item.toString().indexOf("[") !== 0) {
                    return item.toString();
                }
                if (angular.isString(item)) return item;
                return JSON.stringify(item);
            }).join("\n");
            $error({
                name: "Mediator script \"" + $scope.widget.instanceName + "\" error",
                message: messages
            });
        },

        info: function info(message) {
            $info(message);
        },

        splash: (function (_splash) {
            var _splashWrapper = function splash(_x) {
                return _splash.apply(this, arguments);
            };

            _splashWrapper.toString = function () {
                return _splash.toString();
            };

            return _splashWrapper;
        })(function (message) {
            splash(message);
        }),

        dialog: (function (_dialog) {
            var _dialogWrapper = function dialog(_x) {
                return _dialog.apply(this, arguments);
            };

            _dialogWrapper.toString = function () {
                return _dialog.toString();
            };

            return _dialogWrapper;
        })(function (form) {
            return dialog(form);
        }),

        runDPS: function runDPS(params) {

            var script = params.script;
            var storage = params.state;

            var state = {
                storage: storage,
                locale: i18n.locale()
            };

            return $dps.post("/api/script", {
                script: script,
                state: state
            }).then(function (response) {
                return {
                    type: response.data.type,
                    data: response.data.data
                };
            });
        }

    };

    $scope.update = function (data) {
        var container = $scope.globalConfig.designMode ? $scope.container.getElement().find("div")[2] : $scope.container.getElement().find("div")[1];

        container.innerHTML = "";
        var content = angular.element("<div>" + data + "</div>")[0];

        angular.element(container).append(content);
        angular.element(container).injector().invoke(function ($compile) {
            var scope = angular.element(content).scope();
            $compile(content)(scope);
        });
    };

    apiProvider.config(function () {
        $scope.update($scope.widget.text);
    }).provide("updateWithData", function (e, context) {
        if (!context) return;

        if (context.widget) {
            context.widget = context.widget.forEach ? context.widget : [context.widget];
        }

        if (!context.widget || context.widget.indexOf($scope.widget.instanceName) >= 0) {
            $scope.update(context.data);

            if (context.options) {
                $scope.hidden = context.options.hidden;
            }
        }
    }).provide("updateWithOptions", function (e, context) {
        if (!context) return;

        if (context.widget) {
            context.widget = context.widget.forEach ? context.widget : [context.widget];
        }

        if (!context.widget || context.widget.indexOf($scope.widget.instanceName) >= 0) {

            $scope.hidden = context.options.hidden;
        }
    }).provide("setData", function (e, context) {
        if (!context) {
            $scope.text = "";
            // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
            $scope.hidden = true;
            return;
        }
        if (context.key == "html") {
            $scope.update(context.data);
            // $scope.text = $sce.trustAsHtml(context.data)
            // $scope.container.getElement()[0].children[0].children[0].innerHTML = context.data;
            $scope.hidden = false;
        } else {
            $scope.hidden = true;
            $scope.text = ""
            // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
            ;
        }
    });
}]);
// $scope.test = "TEST";
// $scope.API = $scope.API;
// $scope.text = $sce.trustAsHtml($scope.widget.text);
//# sourceMappingURL=../htmlwidget/widget.js.map