"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var angular = _interopRequire(require("angular"));

require("angular-translate");

/**
 * @ngdoc module
 * @name app.widgetApi
 * @module app.widgetApi
 * @description
 * Services from this module are a public API for all the widget developers.
 * They are documented and are allowed to use.
 */
var widgetApi = angular.module("app.widgetApi", ["app.i18n"]);

/**
 * @ngdoc object
 * @name eventWires
 * @private
 * @description Map of emitter scope to array of event-to-slot wires
 * @returns {Object.<string, object>}
 */
widgetApi.constant("eventWires", new Map()); // emitterScope -> [{signalName, providerScope, slotName}]

/**
 * @ngdoc object
 * @name widgetSlots
 * @private
 * @description Mapping from providerScope to it's slot and slot's name
 * @returns {Object.<string, object>}
 */
widgetApi.constant("widgetSlots", new Map()); // providerScope -> [{slotName, fn}]

/**
 * @ngdoc object
 * @name instanceNameToScope
 * @private
 * @description Mapping from instance name to it's scope
 * @returns {Object.<string, object>}
 */
widgetApi.constant("instanceNameToScope", new Map()); // name -> scope

/**
 * @ngdoc object
 * @name autoWiredSlotsAndEvents
 * @private
 * @description Array of signa/slot/providerNames that
 * allows widget event auto-configuring api.
 */
widgetApi.constant("autoWiredSlotsAndEvents", []); // index -> {slotName, signalName, providerScope}

widgetApi.constant("getWidgetDirectiveScopeFromControllerScope", function (scope) {
  if (scope && scope.$parent && scope.$parent.$parent && scope.$parent.$parent.$parent) {
    return scope.$parent.$parent.$parent;
  } else {
    return scope;
  }
});

widgetApi.factory("APIProvider", ["$rootScope", "$log", "app", "widgetSlots", "autoWiredSlotsAndEvents", "getWidgetDirectiveScopeFromControllerScope", function ($rootScope, $log, app, widgetSlots, autoWiredSlotsAndEvents, getWidgetDirectiveScopeFromControllerScope) {
  /**
   * @class APIProvider
   * @description Injectable class
   * @param {$rootScope.Scope} scope Widget's scope
   * @param [scope.widget.instanceName] Widget's unique name
   */

  var APIProvider = (function () {
    function APIProvider(controllerScope) {
      _classCallCheck(this, APIProvider);

      this.scope = getWidgetDirectiveScopeFromControllerScope(controllerScope);
    }

    _createClass(APIProvider, {
      provide: {

        /**
         * @description Provides a slot
         * @param {string} slotName Name of the slot
         * @param {Function} slot Slot function
         * @returns {APIProvider}
         */

        value: function provide(slotName, fn) {
          if (typeof fn !== "function") {
            throw "Second argument should be a function, " + typeof fn + " passed instead";
          }
          widgetSlots.get(this.scope).push({ slotName: slotName, fn: fn });
          return this;
        }
      },
      config: {

        /**
         * @description Provides a slot automatically called when widget is instantiated and
         * optionally when config was changed
         * @param {Function} slotFn
         * @param {boolean} enableReconfiguring
         * @returns {APIProvider}
         */

        value: function config(slotFn, enableReconfiguring) {
          enableReconfiguring = enableReconfiguring === undefined ? true : enableReconfiguring;
          slotFn();
          if (enableReconfiguring) {
            this.provide(APIProvider.RECONFIG_SLOT, slotFn);
          }
          return this;
        }
      },
      translate: {
        value: function translate(slotFn) {
          this.provide(APIProvider.TRANSLATE_SLOT, slotFn);
          return this;
        }
      },
      beforeDesignMode: {
        value: function beforeDesignMode(slotFn) {
          this.provide(APIProvider.BEFORE_DESIGN_MODE_SLOT, slotFn);
          return this;
        }
      },
      beforePresentationMode: {
        value: function beforePresentationMode(slotFn) {
          this.provide(APIProvider.BEFORE_PRESENTATION_MODE_SLOT, slotFn);
          return this;
        }
      },
      reconfig: {

        /**
         * @description Provides a slot which is
         * automatically called when widget config was changed
         * @param {Function} slotFn
         * @returns {APIProvider}
         */

        value: function reconfig(slotFn) {
          this.provide(APIProvider.RECONFIG_SLOT, slotFn);
          slotFn();
          return this;
        }
      },
      autoWireSlotWithEvent: {

        /**
         * @description Provides possibility auto-wiring events with widget's slots.
         * @param {string} slotName Name of this widget's slot
         * @param {string} signalName Name of signal name; when this signal is emitted; slot `slotName` is called
         * @returns {APIProvider}
         */

        value: function autoWireSlotWithEvent(slotName, signalName) {
          autoWiredSlotsAndEvents.push({
            slotName: slotName,
            signalName: signalName,
            providerScope: this.scope
          });
          return this;
        }
      },
      openCustomSettings: {

        /**
         * @description Provides a slot which is
         * automatically called when widget settings are opened
         * @param {Function} slotFn
         * @returns {APIProvider}
         */

        value: function openCustomSettings(slotFn) {
          this.provide(APIProvider.OPEN_CUSTOM_SETTINGS_SLOT, slotFn);
          return this;
        }
      },
      removal: {

        /**
         * @description Provides a slot automatically called when widget is removed by user
         * @param {Function} slotFn
         * @returns {APIProvider}
         */

        value: function removal(slotFn) {
          this.provide(APIProvider.REMOVAL_SLOT, slotFn);
          return this;
        }
      },
      beforeChangePage: {
        value: function beforeChangePage(slotFn) {
          this.provide(APIProvider.BEFORE_CHANGE_PAGE_SLOT, slotFn);
          return this;
        }
      },
      pageComplete: {
        value: function pageComplete(slotFn) {
          this.provide(APIProvider.PAGE_COMPLETE_SLOT, slotFn);
          return this;
        }

        // beforeConfig(slotFn) {
        //   this.provide(APIProvider.BEFORE_CONFIG_SLOT, slotFn);
        //   return this;
        // }

        // beforeCloneWidget(slotFn) {
        //   this.provide(APIProvider.BEFORE_CLONE_WIDGET_SLOT, slotFn);
        //   return this;
        // }

      }
    });

    return APIProvider;
  })();

  APIProvider.RECONFIG_SLOT = "RECONFIG_SLOT";
  APIProvider.PAGE_COMPLETE_SLOT = "PAGE_COMPLETE_SLOT";
  APIProvider.TRANSLATE_SLOT = "TRANSLATE_SLOT";
  APIProvider.REMOVAL_SLOT = "DESTROY_SLOT";
  APIProvider.OPEN_CUSTOM_SETTINGS_SLOT = "OPEN_CUSTOM_SETTINGS_SLOT";
  APIProvider.BEFORE_DESIGN_MODE_SLOT = "BEFORE_DESIGN_MODE_SLOT";
  APIProvider.BEFORE_PRESENTATION_MODE_SLOT = "BEFORE_PRESENTATION_MODE_SLOT";
  APIProvider.BEFORE_CHANGE_PAGE_SLOT = "BEFORE_CHANGE_PAGE_SLOT";
  // APIProvider.BEFORE_CONFIG_SLOT = 'BEFORE_CONFIG_SLOT';
  // APIProvider.BEFORE_CLONE_WIDGET_SLOT = 'BEFORE_CLONE_WIDGET_SLOT';

  $rootScope.$watch(function () {
    var pageConf = app.pageConfig();
    return pageConf && pageConf.subscriptions;
  }, function () {
    app.updatePageSubscriptions();
  }, true);

  return APIProvider;
}]);

widgetApi.factory("APIUser", ["widgetSlots", "instanceNameToScope", "getWidgetDirectiveScopeFromControllerScope", function (widgetSlots, instanceNameToScope, getWidgetDirectiveScopeFromControllerScope) {
  /**
   * @class APIUser
   * @description Provides a class which allows to consume widget's
   * public API provided with `APIProvider`
   * @param scope Widget's scope
   */

  var APIUser = (function () {
    function APIUser(controllerScope) {
      _classCallCheck(this, APIUser);

      this.scope = getWidgetDirectiveScopeFromControllerScope(controllerScope);
    }

    _createClass(APIUser, {
      userName: {

        /**
         * @private
         * @returns {string|undefined}
         */

        value: function userName() {
          if (this.scope && this.scope.widget) {
            return this.scope.widget.instanceName;
          } else {
            return undefined;
          }
        }
      },
      invoke: {

        /**
         * Invokes widget's slot
         * @param providerName
         * @param slotName
         * @throws if widget doesn't provide this slot
         * @returns {*}
         */

        value: function invoke(providerName, slotName) {
          for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }

          var providerScope = APIUser.getScopeByInstanceName(providerName);
          if (!widgetSlots.has(providerScope)) {
            throw "Provider " + providerName + " doesn't exist";
          }
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = widgetSlots.get(providerScope)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var slot = _step.value;

              if (slot.slotName === slotName) {
                return slot.fn.apply(undefined, [{
                  emitterName: this.userName(),
                  signalName: undefined
                }].concat(args));
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          throw "Provider " + providerName + " doesn't have slot called " + slotName;
        }
      },
      tryInvoke: {

        /**
         * Invokes widget's slot
         * @param providerName
         * @param slotName
         * @returns {object} invocation
         * @returns {boolean} invocation.success - was slot found?
         * @returns {*} invocation.result - value returned by slot
         */

        value: function tryInvoke(providerName, slotName) {
          try {
            return {
              success: true,
              result: this.invoke(providerName, slotName) // might throw
            };
          } catch (e) {
            if (typeof e === "string" && e.indexOf("Provider") > -1) {
              return {
                success: false,
                result: undefined
              };
            } else {
              throw e;
            }
          }
        }
      },
      invokeAll: {

        /**
         * Invokes slot on all widgets
         * @param slotName Name of the slot
         */

        value: function invokeAll(slotName) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = widgetSlots.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var slots = _step.value;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = slots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var slot = _step2.value;

                  if (slot.slotName === slotName) {
                    slot.fn.apply(undefined, [{
                      emitterName: this.userName(),
                      signalName: undefined
                    }].concat(args));
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                    _iterator2["return"]();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return undefined;
        }
      },
      getScopeByInstanceName: {

        /**
         * WARNING: this is a deprecated method; use APIUser.getScopeByInstanceName instead
         * of this (APIUser.prototype.getScopeByInstanceName)
         * Returns registered scope by widget's name
         * @param name Widget's instanceName
         * @returns {$rootScope.Scope|undefined}
         */

        value: function getScopeByInstanceName(name) {
          return APIUser.getScopeByInstanceName(name);
        }
      }
    }, {
      getScopeByInstanceName: {

        /**
         * Returns registered scope by widget's name
         * @param name Widget's instanceName
         * @returns {$rootScope.Scope|undefined}
         */

        value: function getScopeByInstanceName(name) {
          return instanceNameToScope.get(name);
        }
      }
    });

    return APIUser;
  })();

  return APIUser;
}]);

widgetApi.factory("EventEmitter", ["$log", "$rootScope", "eventWires", "widgetSlots", "autoWiredSlotsAndEvents", "getWidgetDirectiveScopeFromControllerScope", "app", function ($log, $rootScope, eventWires, widgetSlots, autoWiredSlotsAndEvents, getWidgetDirectiveScopeFromControllerScope, app) {
  /**
   * @class EventEmitter
   * @description Provides a class which allows to emit events which, in row, can invoke slots on other widgets
   * using publish/subscribe mechanism
   */

  var EventEmitter = (function () {
    function EventEmitter(controllerScope) {
      _classCallCheck(this, EventEmitter);

      this.scope = getWidgetDirectiveScopeFromControllerScope(controllerScope);

      app.updatePageSubscriptions();
    }

    _createClass(EventEmitter, {
      emitterName: {

        /**
         * @private
         * @returns {string|undefined}
         */

        value: function emitterName() {
          if (this.scope && this.scope.widget) {
            return this.scope.widget.instanceName;
          } else {
            return undefined;
          }
        }
      },
      emit: {

        /**
         * Emit event
         * This automatically calls slots on all subscribed providers
         * Providers (widgets) can subscribe either using APIProvider.prototype.autoWireSlotWithEvent
         * or by user event wiring system.
         * @param signalName Name of the signal
         */

        value: function emit(signalName) {
          var _this = this;

          for (var _len = arguments.length, slotArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            slotArgs[_key - 1] = arguments[_key];
          }

          $rootScope.$evalAsync(function () {
            var args = [{
              emitterName: _this.emitterName(),
              signalName: signalName
            }].concat(slotArgs);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = autoWiredSlotsAndEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var wire = _step.value;

                if (wire.signalName === signalName) {

                  var slots = widgetSlots.get(wire.providerScope);
                  if (!slots) {
                    continue;
                  }

                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = slots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var slot = _step2.value;

                      if (!slot || slot.slotName !== wire.slotName) continue;
                      slot.fn.apply(undefined, args);
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            if (!_this.emitterName() || typeof _this.emitterName() !== "string") {
              $log.info("Not emitting event through user event wiring system\n            because widget's instanceName is not set");
            }
            var wires = eventWires.get(_this.scope);
            if (!wires) {
              return;
            }
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = wires[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var wire = _step3.value;

                if (wire && wire.signalName === signalName) {

                  var slots = widgetSlots.get(wire.providerScope);
                  if (!slots) {
                    continue;
                  }

                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    for (var _iterator4 = slots[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var slot = _step4.value;

                      if (!slot || slot.slotName !== wire.slotName) continue;
                      slot.fn.apply(undefined, args);
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                        _iterator4["return"]();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          });
        }
      }
    });

    return EventEmitter;
  })();

  return EventEmitter;
}]);

/**
 * @ngdoc function
 * @name pageSubscriptions
 *
 * @description Injectable function which returns
 * a plain JavaScript array of subscriptions on the current page.
 * All the Array.prototype methods are available
 * @example
 * // To add one more subscription, inject pageSubscriptions and execute
 * pageSubscriptions().push({
   *   emitter: 'summator-master',
   *   receiver: 'summator-slave',
   *   signal: 'sumUpdated',
   *   slot: 'setValueOfA'
   * });
 *
 * @returns {Array}
 */
widgetApi.factory("pageSubscriptions", ["app", function (app) {
  return app.pageSubscriptions.bind(app);
}]);

/**
 * @ngdoc function
 * @name pageWidgets
 *
 * @description Injectable function which returns
 * a plain JavaScript array of widgets
 * (their config objects containing at least `type` and `instanceName`)
 * on the current page.
 * All the Array.prototype methods are available on the returned result
 *
 * Please don't modify returned object!
 * @returns {Array}
 */
widgetApi.factory("pageWidgets", ["app", function (app) {
  return function () {
    var holders = app.pageConfig().holders;
    var widgets = [];
    for (var holderName in holders) {
      if (holders.hasOwnProperty(holderName)) {
        widgets = widgets.concat(holders[holderName].widgets);
      }
    }
    return widgets;
  };
}]);

widgetApi.factory("parentHolder", ["app", function (app) {
  return function (widget) {
    var holders = app.pageConfig().holders;
    for (var holderName in holders) {
      if (holders.hasOwnProperty(holderName)) {
        var holder = holders[holderName];
        if (holder.widgets.find(function (w) {
          return w.instanceName === widget.instanceName;
        })) {
          return holder;
        }
      }
    }
  };
}]);

widgetApi.directive("widgetTranslate", ["translateDirective", function (translateDirective) {
  var directive = translateDirective[0];
  return {
    restrict: "AE",
    scope: true,
    require: "^widget",
    compile: function (tElement, tAttr) {
      var link = directive.compile(tElement, tAttr);

      return function (scope, elem, attrs) {
        var widgetType = scope.type;
        var prefix = "WIDGET." + widgetType.toUpperCase() + ".";
        if (attrs.translate) {
          var translationId = "" + prefix + "" + attrs.translate.trim();
          attrs.translate = translationId;
        } else if (elem.html().trim()) {
          var translationId = "" + prefix + "" + elem.html().trim();
          elem.html(translationId);
        }

        for (var attr in attrs) {
          if (/^translateAttr.*/.test(attr) || /^translate-attr-.*/.test(attr)) {
            attrs[attr] = "" + prefix + "" + attrs[attr];
          }
        }

        return link(scope, elem, attrs);
      };
    }
  };
}]);
//# sourceMappingURL=widget-api.js.map