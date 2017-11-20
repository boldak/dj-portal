"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// Bower modules

var angular = _interopRequire(require("angular"));

require("angular-animate");

require("angular-cookies");

require("angular-foundation");

require("angular-json-editor");

require("angular-oclazyload");

require("angular-ui-router");

require("angular-ui-tree");

require("angular-clipboard");

require("angular-hotkeys");

require("angular-scroll");

require("ngReact");

require("file-upload");

require("ngstorage");

require("sceditor");

require("template-cached-pages");

// Our modules

require("app-config");

require("author");

require("i18n");

require("dps");

require("skins");

require("dictionary");

require("info");

require("modal-controllers");

require("skin-directives");

require("user");

require("widget-api");

var app = angular.module("app", ["ui.router", "ngStorage", "ngAnimate", "oc.lazyLoad", "mm.foundation", "ngCookies", "angular-json-editor", "ui.tree", "angular-clipboard", "cfp.hotkeys", "app.templates", "react", "duScroll", "app.widgetApi", "app.config", "app.i18n", "app.dps", "app.skins", "app.skinDirectives", "app.user", "app.info", "app.author", "app.modals", "app.dictionary"]);

app.constant("portal", {
  api: {
    setConfig: "/api/app/config/set",
    getConfig: "/api/app/config/get"
  }
});

app.factory("appUrls", ["appId", function (appId) {
  return {
    api: {
      createApp: function (appName) {
        var skinName = arguments[1] === undefined ? "default" : arguments[1];
        return "/api/app/create/" + appName + "?skinName=" + skinName;
      },
      destroy: function (appId) {
        return "/api/app/destroy/" + appId;
      },
      "import": "/api/app/import",
      rename: function (appId, newAppName) {
        return "/api/app/rename/" + appId + "/" + newAppName + "/";
      }
    },
    app: function (appName, page) {
      return "/app/" + appName + "/" + (page || "");
    },
    appConfig: "/api/app/config/" + appId,
    appList: "/api/app/get-list",
    googleAuth: "/auth/google",
    logout: "/logout",
    usersList: "/api/users/list",
    setAdmin: "/api/admin/set",
    createTimeline: "/api/timeline/upload",
    templateTypes: "/templates/templates.json",
    widgetTypes: "/widgets/widgets.json",
    shareSettingsHTML: "/partials/share-settings.html",
    appSettingsHTML: "/partials/app-settings.html",
    resourceManagerHTML: "/partials/resource-manager.html",
    pageManagerHTML: "/partials/page-manager.html",
    translationManagerHTML: "/partials/translation-manager.html",
    widgetHolderHTML: "/partials/widget-holder.html",
    widgetModalConfigHTML: "/partials/widget-modal-config.html",
    widgetModalAddNewHTML: "/partials/widget-modal-add-new.html",
    viewPageConfigHTML: "/partials/view-page-config.html",
    defaultWidgetIcon: "/widgets/default_widgets_icon.png",
    skinUrl: function (skinName) {
      return "/skins/" + skinName + ".html";
    },
    templateHTML: function (templateName) {
      return "/templates/" + templateName + "/template.html";
    },
    templateIcon: function (templateName) {
      return "/templates/" + templateName + "/icon.png";
    },
    widgetJS: function (widgetName) {
      return "/widgets/" + widgetName + "/widget.js";
    },
    widgetJSModule: function (widgetName) {
      return "widgets/" + widgetName + "/widget";
    },
    widgetHTML: function (widgetName) {
      return "/widgets/" + widgetName + "/widget.html";
    },
    widgetIcon: function (widgetName) {
      return "/widgets/" + widgetName + "/icon.png";
    },
    widgetHelp: function (type, lang) {
      return "/help/widget/" + type + "/" + lang;
    }
  };
}]);

// app.constant('homePageAppName', defaultApp);

app.constant("globalConfig", {
  designMode: false,
  debugMode: false
});

app.constant("selectedHolder", null);

// app.constant('appSkins', [
//   {
//     name: "default",
//     title: "Default"
//   }
// ]);

// app.factory("appSkins", function($http){
//  var list = [];
//  if(list.length == 0){
//       $http
//       .get("./api/app/skins")
//       .then(function(resp){

//         list = resp.data.map((item) => {return {title:item, name:item}});
//         console.log("Skins", list)
//       })
//  }
//  return list;
// })

app.constant("randomWidgetName", function () {
  return Math.random().toString(36).substring(2);
});

app.value("duScrollDuration", 500);
app.value("duScrollOffset", 50);
app.value("duScrollEasing", function (t) {
  return 1 + --t * t * t * t * t;
});

app.service("$scroll", ["$document", "APIUser", function ($document, APIUser) {
  return function (scope) {
    if (!scope.widget) {
      scope = new APIUser().getScopeByInstanceName(scope);
    }

    if (scope) {
      var element = scope.container.getElement()[0].children[0];
      $document.scrollToElementAnimated(element);
    }
  };
}]);

app.config(["$stateProvider", "$urlRouterProvider", "$urlMatcherFactoryProvider", "$locationProvider", "$ocLazyLoadProvider", "JSONEditorProvider", "appName", "defaultApp", function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $ocLazyLoadProvider, //$ViewScrollProvider,
JSONEditorProvider, appName, defaultApp) {

  $ocLazyLoadProvider.config({
    loadedModules: ["app"],
    asyncLoader: System.amdRequire.bind(System)
  });

  JSONEditorProvider.configure({
    defaults: {
      options: {
        iconlib: "foundation3",
        theme: "foundation5",
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        required_by_default: true
      }
    },
    plugins: {
      sceditor: {
        style: "/components/SCEditor/minified/jquery.sceditor.default.min.css",
        resizeWidth: false
      }
    }
  });

  $locationProvider.html5Mode(true);
  // $ViewScrollProvider.useAnchorScroll();

  // this doesn't seem to work, that's why the next snippet does the same
  $urlMatcherFactoryProvider.strictMode(false);

  $urlRouterProvider.when("/app/" + appName, ["$state", function ($state) {
    console.log("WHEN state", $state);
    $state.go("page", { href: "" });
  }]);

  // If url is not in this app URL scope - reload the whole page.
  $urlRouterProvider.otherwise(function ($injector, $location) {
    console.log("otherwise location", $location);
    $injector.get("$window").location.href = $location.url();
  });

  var pageConfig = function ($q, alert, app, widgetLoader) {
    return $q(function (resolve, reject) {
      var pageConfig = app.pageConfig();

      if (!pageConfig || !pageConfig.holders) {
        resolve(pageConfig);
        return;
      }

      var widgetTypes = [];
      for (var holderName in pageConfig.holders) {
        if (pageConfig.holders.hasOwnProperty(holderName)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = pageConfig.holders[holderName].widgets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var widget = _step.value;

              widgetTypes.push(widget.type);
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
        }
      }
      widgetLoader.load(widgetTypes).then(function () {
        resolve(pageConfig);
      }, function (err) {
        alert.error("Error loading widget controllers. <br><br> " + err);
        reject(err);
      });
    });
  };
  pageConfig.$inject = ["$q", "alert", "app", "widgetLoader"];

  var templateProvider = function ($http, $templateCache, appUrls, app) {
    var pageConfig = app.pageConfig();
    if (!pageConfig || !pageConfig.template) {
      return "Page not found!";
    }

    var url = appUrls.templateHTML(pageConfig.template);
    return $http.get(url, { cache: $templateCache }).then(function (result) {
      return result.data;
    });
  };
  templateProvider.$inject = ["$http", "$templateCache", "appUrls", "app"];

  $stateProvider.state("page", {
    url: appName !== defaultApp ? "/app/" + appName + "/:href" : "/:href",
    resolve: {
      pageConfig: pageConfig
    },
    templateProvider: templateProvider,
    controller: "PageController"
  });
}]);

app.factory("fullReload", ["$window", function ($window) {
  return function (url) {
    return $window.location.href = url;
  };
}]);

app.factory("selectHolder", ["selectedHolder", function (selectedHolder) {
  return function (holderScope) {
    // console.log("Selected holder", selectedHolder, "Event Holder", holderScope)
    if (selectedHolder && selectedHolder != null) {
      selectedHolder.acceptDrop = "";
    }
    selectedHolder = holderScope;
    if (selectedHolder && selectedHolder != null) {
      selectedHolder.acceptDrop = "accept-drop";
    }
  };
}]);

app.factory("widgetTypesPromise", ["$http", "appUrls", function ($http, appUrls) {
  return $http.get(appUrls.widgetTypes, { cache: true });
}]);

app.factory("templateTypesPromise", ["$http", "appUrls", function ($http, appUrls) {
  return $http.get(appUrls.templateTypes, { cache: true });
}]);

app.factory("config", ["initialConfig", "$log", "templateTypesPromise", function (initialConfig, $log, templateTypesPromise) {
  if (initialConfig.pages.length <= 1) {
    $log.info("When there is no 404 page you might have problems with page routing!");
  }

  // console.log("GET CONFIG")
  // templateTypesPromise.then((resp) => {
  //   var pageTemplates = resp.data;
  //   var pages = initialConfig.pages
  //   pages.forEach((page) => {
  //     var pageTemplate = pageTemplates[page.template];
  //     pageTemplate.holders.forEach((holder) => {
  //       if(!page.holders[holder]){
  //         page.holders[holder] = {widgets:[]}
  //       }
  //     })
  //   })
  // })
  // console.log("UPDATED CONFIG", initialConfig)

  var c = angular.copy(initialConfig);

  //c.dps="https://dj-app.herokuapp.com";
  return c;
}]);

app.factory("appHotkeysInfo", ["config", function (config) {
  return {
    title: "Application Hotkeys",
    icon: config.icon,
    sections: [{
      fields: [{ key: "Alt + H", value: "Show this help" }, { key: "Esc", value: "Close" }, { key: "Alt + D", value: "Switch Mode" }, { key: "Alt + P", value: "Activate Page Manager" }, { key: "Alt + T", value: "Activate Translation Manager" }, { key: "Alt + R", value: "Activate Resource Manager" }, { key: "Alt + S", value: "Save Settings" }, { key: "Alt + C", value: "View Page Config" }]
    }]
  };
}]);

app.service("app", ["$http", "$state", "$stateParams", "$log", "config", "$rootScope", "$modal", "$translate", "appUrls", "appName", "fullReload", "eventWires", "APIUser", "hotkeys", "splash", "appHotkeysInfo", "globalConfig", "dialog", "portal", "templateTypesPromise", "initialConfig", "clipboard", "jsonEditor", function ($http, $state, $stateParams, $log, config, $rootScope, $modal, $translate, appUrls, appName, fullReload, eventWires, APIUser,
// APIProvider,
hotkeys, splash, appHotkeysInfo, globalConfig, dialog, portal, templateTypesPromise, initialConfig, clipboard, jsonEditor) {

  var pageConf = undefined;

  angular.extend(this, {
    sendingToServer: false,
    wasModified: false,
    wasSavedEver: false,
    currentPageIndex: 0,

    isHomePageOpened: function isHomePageOpened() {
      return $stateParams.href === "";
    },

    is404PageOpened: function is404PageOpened() {
      return this.pageConfig().href === "404";
    },

    pageIndexByHref: function pageIndexByHref(href) {

      var user = new APIUser();
      user.invokeAll("BEFORE_CHANGE_PAGE_SLOT");

      var result = config.pages.findIndex(function (p) {
        return p.href === href;
      });
      if (result !== -1) {
        return result;
      }
      result = config.pages.findIndex(function (p) {
        return p.href === "404";
      });
      if (result !== -1) {
        return result;
      }

      $log.warn("app.pageIndexByHref can't find page!");
    },
    pageConfig: function pageConfig() {
      return pageConf;
    },

    markModified: function markModified() {
      this.wasModified = true;
    },

    deletePage: function deletePage(page) {

      var curPageHref = $stateParams.href;
      var index = config.pages.indexOf(page);
      var deletedPageHref = config.pages[index].href;
      if (angular.isDefined(config.pages) && angular.isDefined(config.pages[index])) {
        config.pages.splice(index, 1);
        this.markModified(true);

        if (curPageHref === deletedPageHref) {
          $state.go("page", { href: "" });
        }
      }
    },

    submitToServer: function submitToServer(callback) {
      var _this = this;

      this.sendingToServer = true;
      return $http.put(appUrls.appConfig, config).then(function () {
        _this.wasSavedEver = true;
        _this.sendingToServer = false;
        _this.wasModified = false;

        if (config.name !== appName) {
          fullReload(appUrls.app(config.name, $stateParams.href));
        }
      }, function (data) {
        _this.sendingToServer = false;
        if (callback) {
          callback(data);
        }
      });
    },

    addNewPage: function addNewPage(page) {
      page.holders = page.holders || {};
      config.pages.push(page);
    },

    clonePage: function clonePage() {
      var _this = this;

      // console.log("Clone Page", config)
      dialog({
        title: "Clone Page",
        fields: {
          shortName: {
            title: "Short Title",
            type: "text"
          },
          href: {
            title: "Reference",
            type: "text"
          },
          cloned: {
            title: "Cloned page",
            type: "select",
            options: config.pages.map(function (item) {
              return { title: item.shortTitle, value: item };
            })
          }

        }
      }).then(function (form) {
        var clone = JSON.parse(form.fields.cloned.value);
        clone.shortTitle = form.fields.shortName.value;
        clone.href = form.fields.href.value;
        config.pages.push(clone);
        $state.go("page", { href: clone.href }, { reload: true });
        _this.markModified(true);
      });
    },

    copyPage: function copyPage() {

      dialog({
        title: "Copy Page",
        fields: {
          page: {
            title: "Page",
            type: "select",
            options: config.pages.map(function (item) {
              return { title: item.shortTitle, value: item };
            })
          }

        }
      }).then(function (form) {
        var copy = form.fields.page.value;
        clipboard.copyText(copy);
      });
    },

    pastePage: function pastePage() {
      var self = this;
      jsonEditor("", "Paste and modify page configuration").then(function (json) {
        var p = JSON.parse(json);
        config.pages.push(p);
        $state.go("page", { href: p.href }, { reload: true });
        self.markModified(true);
      });
    },

    openShareSettings: function openShareSettings() {
      var _this = this;

      $modal.open({
        templateUrl: appUrls.shareSettingsHTML,
        controller: "ShareSettingsModalController",
        windowClass: "share-settings-modal",
        backdrop: "static"
      }).result.then(function (collaborations) {
        config.collaborations = collaborations;
        _this.markModified(true);
      });
    },

    openAppSettingsDialog: function openAppSettingsDialog() {
      var _this = this;

      $modal.open({
        templateUrl: appUrls.appSettingsHTML,
        controller: "AppSettingsModalController",
        windowClass: "app-settings-modal",
        backdrop: "static"
      }).result.then(function (newSettings) {
        // console.log(newSettings);
        angular.extend(config, newSettings);
        _this.markModified(true);
      });
    },

    openResourceManager: function openResourceManager() {
      if (!globalConfig.designMode) {
        return;
      }$modal.open({
        templateUrl: appUrls.resourceManagerHTML,
        controller: "ResourceManagerController",
        backdrop: "static"
      });
    },

    openTranslationManager: function openTranslationManager() {
      if (!globalConfig.designMode) {
        return;
      }$modal.open({
        templateUrl: appUrls.translationManagerHTML,
        controller: "TranslationManagerController",
        backdrop: "static"
      });
    },

    openPageManager: function openPageManager() {
      if (!globalConfig.designMode) {
        return;
      }$modal.open({
        templateUrl: appUrls.pageManagerHTML,
        controller: "PageManagerController",
        backdrop: "static"
      });
    },

    openPortalConfigDialog: function openPortalConfigDialog() {
      $http.get(portal.api.getConfig).then(function (resp) {
        // console.log("Portal Config",resp.data)
        var fields = [];
        for (var key in resp.data) {
          fields.push({ title: key, value: resp.data[key] });
        }
        dialog({
          title: "" + $translate.instant("PORTAL_CONFIGURATION"),
          fields: fields
        }).then(function (form) {
          var conf = {};
          form.fields.forEach(function (item) {
            conf[item.title] = item.value;
          });
          $http.post(portal.api.setConfig, { config: conf }).then(function () {
            splash({
              title: "" + $translate.instant("PORTAL_CONFIGURATION") + ": " + ("" + $translate.instant("SAVED"))
            }, 1000);
          });
        });
      });
    },

    openSetAdminDialog: function openSetAdminDialog() {
      // console.log("openSetAdminDialog")
      $http.get(appUrls.usersList).then(function (resp) {
        dialog({
          title: "Set admin grant for user",
          fields: {
            user: {
              title: "User's email",
              type: "typeahead",
              list: resp.data.map(function (user) {
                return user.email;
              })
            }
          }
        }).then(function (form) {
          // console.log("User ", form.fields.user.value)
          $http.post(appUrls.setAdmin, {
            email: form.fields.user.value,
            value: true
          }).then(function (resp) {
            splash({
              title: "Grant Admin Role for " + resp.data[0].name + " (" + resp.data[0].email + ")"
            }, 1000);
          });
        });
      });
    },

    viewPageConfig: function viewPageConfig() {
      if (!globalConfig.designMode) {
        return;
      }$modal.open({
        templateUrl: appUrls.viewPageConfigHTML,
        controller: "ViewPageConfigController",
        backdrop: "static"
      });
    },

    showHotkeys: function showHotkeys() {
      splash(appHotkeysInfo);
    },

    onStateChangeStart: function onStateChangeStart(evt, toState, toParams) {
      if (toState.name === "page") {
        var pageIndex = this.pageIndexByHref(toParams.href);
        pageConf = config.pages[pageIndex];
        this.currentPageIndex = pageIndex;
      } else {
        $log.warn("No config available - non-page routing...");
        pageConf = undefined;
      }
    },

    wireSignalWithSlot: function wireSignalWithSlot(emitterScope, signalName, providerScope, slotName) {
      if (!emitterScope || !providerScope) {
        return;
      }
      var wire = eventWires.get(emitterScope) || [];
      wire.push({ signalName: signalName, providerScope: providerScope, slotName: slotName });
      eventWires.set(emitterScope, wire);
    },

    pageSubscriptions: function pageSubscriptions() {
      var pageConf = this.pageConfig() || {};
      pageConf.subscriptions = pageConf.subscriptions || [];

      pageConf.subscriptions.addListeners = function (listeners) {
        for (var j in listeners) {
          var exists = false;
          var listener = listeners[j];
          for (var i in pageConf.subscriptions) {
            if (pageConf.subscriptions[i].emitter === listener.emitter && pageConf.subscriptions[i].receiver === listener.receiver && pageConf.subscriptions[i].signal === listener.signal && pageConf.subscriptions[i].slot === listener.slot) {
              exists = true;
            }
          }
          if (!exists) {
            pageConf.subscriptions.push(listener);
          }
        }
      };

      pageConf.subscriptions.addListener = function (listener) {
        pageConf.subscriptions.addListeners([listener]);
      };

      pageConf.subscriptions.removeListeners = function (listener) {
        for (var i in pageConf.subscriptions) {
          if ((pageConf.subscriptions[i].emitter === listener.emitter || angular.isUndefined(listener.emitter)) && (pageConf.subscriptions[i].receiver === listener.receiver || angular.isUndefined(listener.receiver)) && (pageConf.subscriptions[i].signal === listener.signal || angular.isUndefined(listener.signal)) && (pageConf.subscriptions[i].slot === listener.slot || angular.isUndefined(listener.slot))) {
            pageConf.subscriptions.splice(i, 1);
            return;
          }
        }
      };

      return pageConf.subscriptions;
    },

    updatePageSubscriptions: function updatePageSubscriptions() {
      var _this = this;

      $rootScope.$evalAsync(function () {
        var subscriptions = _this.pageSubscriptions();
        eventWires.clear();

        if (!subscriptions) {
          return;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = subscriptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            _this.wireSignalWithSlot(APIUser.getScopeByInstanceName(s.emitter), s.signal, APIUser.getScopeByInstanceName(s.receiver), s.slot);
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
      });
    }
  });

  pageConf = config.pages[this.pageIndexByHref($stateParams.href || "")];

  $rootScope.$on("$stateChangeStart", this.onStateChangeStart.bind(this));
}]);

app.service("logIn", ["$cookies", "$location", "fullReload", "appUrls", function ($cookies, $location, fullReload, appUrls) {
  return function () {
    $cookies.put("redirectToUrl", $location.url());
    fullReload(appUrls.googleAuth);
  };
}]);

app.service("widgetLoader", ["$q", "$ocLazyLoad", "widgetTypesPromise", "appUrls", function ($q, $ocLazyLoad, widgetTypesPromise, appUrls) {
  this.load = function (widgets) {

    widgets = angular.isArray(widgets) ? widgets : [widgets];
    return widgetTypesPromise.then(function (widgetTypesHTTP) {
      var widgetControllers = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = widgets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var widget = _step.value;

          var widgetType = widgetTypesHTTP.data[widget];
          if (angular.isUndefined(widgetType)) {
            return $q.reject("Widget \"" + widget + "\" doesn't exist!");
          }
          if (!widgetType.nojs) {
            widgetControllers.push({
              name: "app.widgets." + widget,
              files: [appUrls.widgetJSModule(widget)]
            });
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

      return $ocLazyLoad.load(widgetControllers);
    });
  };
}]);

app.service("widgetManager", ["$modal", "$timeout", "APIUser", "APIProvider", "appUrls", "app", "randomWidgetName", function ($modal, $timeout, APIUser, APIProvider, appUrls, app, randomWidgetName) {
  angular.extend(this, {
    deleteIthWidgetFromHolder: function deleteIthWidgetFromHolder(holder, index) {
      var removedWidget = holder.widgets.splice(index, 1)[0];
      var user = new APIUser();
      user.tryInvoke(removedWidget.instanceName, APIProvider.REMOVAL_SLOT);
      app.markModified(true);
    },

    openWidgetConfigurationDialog: function openWidgetConfigurationDialog(widget) {
      var invocation = new APIUser().tryInvoke(widget.instanceName, APIProvider.OPEN_CUSTOM_SETTINGS_SLOT);
      if (!invocation.success) {
        this.openDefaultWidgetConfigurationDialog(widget);
      } else {
        // console.log("Returns from config dialog", invocation)
        if (invocation.result) {
          invocation.result.then(function () {
            var user = new APIUser();
            user.invokeAll(APIProvider.RECONFIG_SLOT);
            app.markModified(true);
            user.invokeAll(APIProvider.PAGE_COMPLETE_SLOT);
          });
        }
      }
    },

    openDefaultWidgetConfigurationDialog: function openDefaultWidgetConfigurationDialog(widget) {
      $modal.open({
        templateUrl: appUrls.widgetModalConfigHTML,
        controller: "WidgetModalSettingsController",
        windowClass: "app-settings-modal",
        backdrop: "static",
        resolve: {
          widgetScope: function widgetScope() {
            return new APIUser().getScopeByInstanceName(widget.instanceName);
          },
          widgetConfig: function widgetConfig() {
            return widget;
          },
          widgetType: ["widgetTypesPromise", function widgetType(widgetTypesPromise) {
            return widgetTypesPromise.then(function (widgetTypesHTTP) {
              return widgetTypesHTTP.data[widget.type];
            });
          }]
        }
      }).result.then(function (newWidgetConfig) {
        angular.copy(newWidgetConfig, widget);
        var user = new APIUser();
        user.invokeAll(APIProvider.RECONFIG_SLOT);
        app.markModified(true);
        user.invokeAll(APIProvider.PAGE_COMPLETE_SLOT);
      });
    },

    addNewWidgetToHolder: function addNewWidgetToHolder(holder) {
      $modal.open({
        templateUrl: appUrls.widgetModalAddNewHTML,
        controller: "WidgetModalAddNewController",
        backdrop: "static",
        resolve: {
          widgetTypes: ["widgetTypesPromise", function widgetTypes(widgetTypesPromise) {
            return widgetTypesPromise;
          }],
          holder: (function (_holder) {
            var _holderWrapper = function holder() {
              return _holder.apply(this, arguments);
            };

            _holderWrapper.toString = function () {
              return _holder.toString();
            };

            return _holderWrapper;
          })(function () {
            return holder;
          })
        }
      }).result.then(function (widgetType) {

        var realWidget = {
          type: widgetType.type,
          openConfigOnLoad: true,
          instanceName: randomWidgetName()
        };

        holder.widgets = holder.widgets || [];
        holder.widgets.push(realWidget);
      });
    },

    cloneWidget: function cloneWidget(holder, widget) {
      var newWidget = angular.copy(widget);
      newWidget.instanceName = randomWidgetName();
      console.log("Cloned", widget);
      console.log("Holder", holder);
      var pos = holder.widgets.map(function (item) {
        return item.instanceName;
      }).indexOf(widget.instanceName);
      holder.widgets.splice(pos, 0, newWidget);
      // holder.widgets.push(newWidget);
      app.markModified(true);
    }
  });
}]);

app.controller("MetaInfoController", ["$scope", "$rootScope", "appName", "app", "config", "author", function ($scope, $rootScope, appName, app, config, author) {
  angular.extend($scope, {
    title: appName,
    author: author.name,
    config: config
  });

  $rootScope.$on("$stateChangeSuccess", function () {
    var pageName = app.pageConfig().shortTitle;
    $scope.title = "" + pageName + " - " + config.title;
  });
}]);

app.controller("MainController", ["$scope", "$location", "$cookies", "$window", "$translate", "alert", "app", "config", "user", "appUrls", "globalConfig", "fullReload", "hotkeys", "splash", "appHotkeysInfo", "APIProvider", "APIUser", function ($scope, $location, $cookies, $window, $translate, alert, app, config, user, appUrls, globalConfig, fullReload, hotkeys, splash, appHotkeysInfo, APIProvider, APIUser) {

  if (user.isOwner || user.isCollaborator) {
    // console.log("Add hotkeys")

    hotkeys.add({
      combo: "alt+h",
      description: "Show hotkeys",
      callback: function callback(event) {
        event.preventDefault();
        app.showHotkeys();
      }
    });

    hotkeys.add({
      combo: "alt+p",
      description: "Invoke Page Manager",
      callback: function callback(event) {
        event.preventDefault();
        app.openPageManager();
      }
    });

    hotkeys.add({
      combo: "alt+r",
      description: "Invoke Resources Manager",
      callback: function callback(event) {
        event.preventDefault();
        app.openResourceManager();
      }
    });

    hotkeys.add({
      combo: "alt+t",
      description: "Invoke Translations Manager",
      callback: function callback(event) {
        event.preventDefault();
        app.openTranslationManager();
      }
    });

    hotkeys.add({
      combo: "alt+d",
      description: "Switch mode",
      callback: function callback(event) {
        event.preventDefault();
        globalConfig.designMode = !globalConfig.designMode;
      }
    });

    hotkeys.add({
      combo: "alt+c",
      description: "View Page Config",
      callback: function callback(event) {
        event.preventDefault();
        app.viewPageConfig();
      }
    });

    hotkeys.add({
      combo: "alt+s",
      description: "Save settings",
      callback: function callback(event) {
        event.preventDefault();
        app.submitToServer();
      }
    });
    // console.log(hotkeys);
    splash(appHotkeysInfo, 5000);
    // hotkeys.toggleHelp();
  }

  angular.extend($scope, {
    globalConfig: globalConfig,
    app: app,
    config: config,
    user: user,

    skin: {
      url: appUrls.skinUrl(config.skinName || "default")
    },

    logIn: function logIn() {
      // console.log("LOGIN")
      $cookies.put("redirectToUrl", $location.url());
      fullReload(appUrls.googleAuth);
    },

    logOut: function logOut() {
      $cookies.put("redirectToUrl", $location.url());
      fullReload(appUrls.logout);
    },

    alertAppConfigSubmissionFailed: function alertAppConfigSubmissionFailed(data) {
      $translate("ERROR_SUBMITTING_APP_CONF", data).then(function (translation) {
        return alert.error(translation);
      });
    }
  });

  $scope.$watchCollection("config.pages", function (newPages, oldPages) {
    if (oldPages !== newPages) {
      app.markModified();
    }
  });

  $scope.$watch("globalConfig.designMode", function () {
    var cnf = $scope.globalConfig;
    cnf.debugMode = cnf.debugMode && !cnf.designMode;
    var user = new APIUser();
    if (globalConfig.designMode) {
      user.invokeAll(APIProvider.BEFORE_DESIGN_MODE_SLOT);
    } else {
      user.invokeAll(APIProvider.BEFORE_PRESENTATION_MODE_SLOT);
    }
  });

  $window.onbeforeunload = function (evt) {
    var message = $translate.instant("LEAVE_WEBSITE_WITHOUT_SAVING");
    if (app.wasModified) {
      if (typeof evt === "undefined") {
        evt = $window.event;
      }
      if (evt) {
        evt.returnValue = message;
      }
      return message;
    }
  };
}]);

app.controller("PageController", ["$scope", "pageConfig", "templateTypesPromise", function ($scope, pageConfig, templateTypesPromise) {
  // console.log("Init page controller")
  // templateTypesPromise.then((resp) => {
  //   var pageTemplate = resp.data[pageConfig.template];
  //   console.log(pageConfig.template,pageTemplate)
  //   pageTemplate.holders.forEach((holder) => {
  //     if(!pageConfig.holders[holder]){
  //       console.log(holder)
  //       pageConfig.holders[holder] = {widgets:[]}
  //       console.log("append",pageConfig)
  //     }
  //   })
  angular.extend($scope, {
    config: pageConfig
  });
  // })
}]);

app.directive("widgetHolder", ["appUrls", "widgetManager", "app", "selectHolder", function (appUrls, widgetManager, app, selectHolder) {
  return {
    restrict: "E",
    templateUrl: appUrls.widgetHolderHTML,
    transclude: true,
    scope: true,
    link: function link(scope, element, attrs) {
      scope.$watchCollection("scope.config.holders", function () {
        if (scope.config.holders) {
          scope.holder = scope.config.holders[attrs.name] || {};
          scope.holder.width = angular.element(element[0]).width();
        }
      });

      angular.extend(scope, {
        deleteIthWidgetFromHolder: widgetManager.deleteIthWidgetFromHolder.bind(widgetManager),
        addNewWidgetToHolder: widgetManager.addNewWidgetToHolder.bind(widgetManager),
        cloneWidget: widgetManager.cloneWidget.bind(widgetManager),
        // collapsed:false,
        treeOptions: {
          dropped: function (event) {
            event.source.nodeScope.$$childHead.drag = false;
            selectHolder(null);
            app.markModified();
          },
          dragStart: function (event) {
            event.source.nodeScope.$$childHead.drag = true;
          },
          accept: function accept(sourceNodeScope, destNodesScope, destIndex) {
            selectHolder(destNodesScope.$treeScope.$parent.$parent);
            // console.log(scope, destNodesScope.$treeScope.$parent.$parent);
            return true;
          }
        }

      });
    }
  };
}]);

app.directive("widget", ["$rootScope", "$translate", "$window", "appUrls", "globalConfig", "widgetLoader", "config", "widgetManager", "user", "app", "randomWidgetName", "instanceNameToScope", "widgetSlots", "widgetTypesPromise", "autoWiredSlotsAndEvents", "eventWires", function ($rootScope, $translate, $window, appUrls, globalConfig, widgetLoader, config, widgetManager, user, app, randomWidgetName, instanceNameToScope, widgetSlots, widgetTypesPromise, autoWiredSlotsAndEvents, eventWires) {
  function updateEventsOnNameChange(widget) {
    $rootScope.$watch(function () {
      return widget.instanceName;
    }, function (newName, oldName) {
      if (newName !== oldName && newName !== undefined) {
        var subscriptions = app.pageConfig().subscriptions;
        for (var i = 0; i < (subscriptions ? subscriptions.length : 0); i++) {
          var subscription = subscriptions[i];
          if (subscription.emitter === oldName) {
            subscription.emitter = newName;
          }

          if (subscription.receiver === oldName) {
            subscription.receiver = newName;
          }
        }
      }
    });
  }

  return {
    restrict: "E",
    templateUrl: "/partials/widget.html",
    transclude: true,
    scope: {
      type: "@",
      widget: "=config",
      onDelete: "&",
      onClone: "&",
      container: "=?"
    },
    controller: function controller() {}, // needed for require: '^widget' to work in widget-translate directive
    link: function link(scope, element, attrs) {
      // console.log("Link", element)
      if (!scope.type) {
        throw "widget directive needs type parameter";
      }

      scope.container = {
        getScope: function getScope() {
          return scope;
        },

        getElement: function getElement() {
          return element;
        }
      };

      scope.skin = attrs.skin;
      // console.log(scope.type+" "+attrs.instancename+" "+attrs.skin);

      if (!scope.widget && attrs.instancename) {
        config.appWidgets = config.appWidgets || [];
        var conf = config.appWidgets.find(function (wgt) {
          return wgt.instanceName === attrs.instancename;
        });
        if (!conf) {
          conf = {
            instanceName: attrs.instancename,
            type: scope.type,
            container: scope.container
          };
          config.appWidgets.push(conf);
        }
        scope.widget = conf;
        scope.element = element;
        scope.disallowEditInstanceName = true;
      }

      scope.widget = scope.widget || {};
      scope.widget.type = scope.widget.type || scope.type;
      scope.widget.instanceName = attrs.instanceName || scope.widget.instanceName || randomWidgetName();

      widgetTypesPromise.then(function (w) {
        if (w.data[scope.widget.type].noicon !== true) {
          scope.widget.icon = appUrls.widgetIcon(scope.widget.type);
        }
      });

      updateEventsOnNameChange(scope.widget);

      widgetLoader.load(scope.type).then(function () {
        scope.widgetCodeLoaded = true;

        if (scope.widget.openConfigOnLoad) {
          delete scope.widget.openConfigOnLoad;

          scope.$applyAsync(function () {
            widgetManager.openWidgetConfigurationDialog(scope.widget);
          });
        }
      });

      function registerScope(scope) {
        instanceNameToScope.set(scope.widget.instanceName, scope);
        scope.$watch("widget.instanceName", function (newName, oldName) {
          if (newName !== oldName) {
            instanceNameToScope.set(newName, scope);
            instanceNameToScope["delete"](oldName);
          }
        });

        widgetSlots.set(scope, []);

        app.updatePageSubscriptions();

        scope.$on("$destroy", function () {
          // clean widgetSlots and eventWires
          widgetSlots["delete"](scope);
          eventWires["delete"](scope);

          // clean autoWiredSlotsAndEvents
          for (var i = autoWiredSlotsAndEvents.length - 1; i >= 0; --i) {
            if (autoWiredSlotsAndEvents[i].providerScope === scope) {
              autoWiredSlotsAndEvents.splice(i, 1);
            }
          }

          // clean instanceNameToScope
          instanceNameToScope["delete"](scope.widget.instanceName);
        });
      }

      registerScope(scope);
      widgetTypesPromise.then(function (widgetTypes) {
        angular.extend(scope, {
          globalConfig: globalConfig,
          user: user,
          widgetTemplateUrl: widgetTypes.data[scope.type].html ? widgetTypes.data[scope.type].html : appUrls.widgetHTML(scope.type),
          widgetCodeLoaded: false,
          widgetPanel: {
            allowDeleting: !!attrs.onDelete,
            allowCloning: !!attrs.onClone,
            allowOpenHelp: true,
            allowConfiguring: angular.isUndefined(attrs.nonConfigurable),
            editingInstanceName: false,
            openWidgetConfigurationDialog: widgetManager.openWidgetConfigurationDialog.bind(widgetManager),
            startEditingInstanceName: function startEditingInstanceName() {
              if (scope.disallowEditInstanceName) {
                return;
              }scope.widgetPanel.editingInstanceName = true;
              scope.widgetPanel.newInstanceName = scope.widget.instanceName;
            },
            finishEditingInstanceName: function finishEditingInstanceName() {
              scope.widgetPanel.editingInstanceName = false;
              if (scope.widget.instanceName !== scope.widgetPanel.newInstanceName) {
                scope.widget.instanceName = scope.widgetPanel.newInstanceName;
                app.markModified();
              }
            },
            cancelEditingInstanceName: function cancelEditingInstanceName() {
              scope.widgetPanel.editingInstanceName = false;
            },
            deleteWidget: function deleteWidget() {
              scope.onDelete();
            },

            cloneWidget: function cloneWidget() {
              scope.onClone();
            },

            openHelp: function openHelp() {
              var url = appUrls.widgetHelp(scope.type, $translate.use());
              $window.open(url, "_blank");
            }
          }
        });
      });
    }
  };
}]);

angular.bootstrap(document, ["app"], {
  strictDi: false
});
//# sourceMappingURL=app.js.map