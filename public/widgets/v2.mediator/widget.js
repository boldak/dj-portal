"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("ng-ace");

var m = angular.module("app.widgets.v2.mediator", ["app.dps", "ng.ace"]);

m.controller("MediatorController", ["$scope", "$http", "$dps", "EventEmitter", "APIProvider", "pageSubscriptions", "$lookup", "$translate", "$modal", "user", "i18n", "$scroll", "clipboard", "dialog", "$error", "log", "instanceNameToScope", "config", "$info", "app", "logIn", "splash", function ($scope, $http, $dps, EventEmitter, APIProvider, pageSubscriptions, $lookup, $translate, $modal, user, i18n, $scroll, clipboard, dialog, $error, log, instanceNameToScope, config, $info, app, logIn, splash) {

    var eventEmitter = new EventEmitter($scope);
    var apiProvider = new APIProvider($scope);

    var __script;

    // $scope.options = {
    //     mode:'dps',
    //     theme:'tomorrow',
    //     onChange: function(e){
    //      __script = e[1].getSession().getValue();
    //     }
    // }

    $scope.options = {
        mode: "javascript",
        theme: "tomorrow",
        onChange: function onChange(e) {
            __script = e[1].getSession().getValue();
        }
    };

    $scope.getEditorScript = function () {
        return __script;
    };

    $scope._api = {

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
        logIn: logIn,

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

    $scope.run = function () {
        try {
            pageSubscriptions().removeListeners({
                emitter: $scope.widget.instanceName
            });

            pageSubscriptions().removeListeners({
                receiver: $scope.widget.instanceName
            });

            $scope.$eval(eval("(function($scope){ " + "return (function(API, api, Api, $api){" + $scope.widget.script + "})($scope._api, $scope._api, $scope._api, $scope._api)" + "})"));
        } catch (e) {
            $error({
                name: "Mediator script " + $scope.widget.instanceName + " error",
                message: e.toString()
            });
        }
    };

    $scope.runScript = function () {
        app.markModified();
        $scope.widget.script = $scope.getEditorScript();
        $scope.run();
    };

    apiProvider.config(function () {
        if (!$scope.globalConfig.designMode) $scope.run();
    })
    // .openCustomSettings(function() {
    //     return dialog({
    //             title: "Mediator Script settings",
    //             fields: {
    //                 listeners: {
    //                     title: "Listeners",
    //                     type: "text",
    //                     value: $scope.widget.listeners,
    //                     required: false
    //                 }
    //             }
    //         })
    //         .then(function(form) {
    //             $scope.widget.listeners = form.fields.listeners.value;
    //             $scope.widget.script = $scope.getEditorScript();
    //         })
    // })

    .removal(function () {
        console.log("Mediator widget is destroyed");
    });
}]);
//# sourceMappingURL=../v2.mediator/widget.js.map