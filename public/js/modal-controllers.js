"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-foundation");

require("angular-oclazyload");

require("sceditor");

require("template-cached-pages");

require("file-upload");

var modals = angular.module("app.modals", ["ngFileUpload"]);

modals.controller("WidgetModalSettingsController", ["$scope", "$modalInstance", "$timeout", "widgetScope", "widgetConfig", "widgetType", "app", function ($scope, $modalInstance, $timeout, widgetScope, widgetConfig, widgetType, app) {
  var data = angular.copy(widgetConfig);

  // split widgetConfig into basicProperties (not available in json-editor)
  // and data - everything else, modifiable in json-editor
  delete data.instanceName;
  delete data.type;
  delete data.icon;

  angular.extend($scope, {
    widgetScope: widgetScope,
    widgetType: widgetType,
    widgetConfig: data,

    basicProperties: {
      type: widgetConfig.type,
      instanceName: widgetConfig.instanceName,
      icon: widgetConfig.icon
    },

    ok: function ok() {
      // Use $timeout as a fix for android
      // On mobile devices (at least android) `data` is updated AFTER `ng-click` event happens if
      // submit button is pressed while input fields are still focused.
      // this is probably related to touch vs mouse behaviour and underlying json-editor implementation.
      $timeout(function () {
        $modalInstance.close(angular.extend(data, $scope.basicProperties));
        app.markModified(true);
      }, 100);
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    },

    updateData: function updateData(value) {
      data = value;
    }
  });
}]);

modals.controller("WidgetModalAddNewController", ["$scope", "$modalInstance", "$log", "$timeout", "$translate", "holder", "appUrls", "widgetTypes", "user", function ($scope, $modalInstance, $log, $timeout, $translate, holder, appUrls, widgetTypes, user) {
  // create array instead of map (easy filtering)
  var widgetTypesArr = [];

  for (var type in widgetTypes.data) {
    (function (type) {
      var currentWidget = {
        type: type
      };

      var translationId = "WIDGET." + type.toUpperCase() + ".DESCRIPTION";
      $translate(translationId).then(function (translation) {
        if (translation === translationId) {
          currentWidget.description = $translate.instant("WIDGET_HAS_NO_DESCRIPTION");
        } else {
          currentWidget.description = translation;
        }
      });

      //add keywords

      currentWidget.keywords = widgetTypes.data[type].keywords ? widgetTypes.data[type].keywords : [];

      // add path to icon of a widget
      if (widgetTypes.data[type].noicon) {
        currentWidget.icon = appUrls.defaultWidgetIcon;
      } else {
        currentWidget.icon = appUrls.widgetIcon(currentWidget.type);
      }
      // console.log("Grant for ", widgetTypes.data[type])
      currentWidget.grant = widgetTypes.data[type].grant ? widgetTypes.data[type].grant : ["owner", "collaborator", "administrator"];
      widgetTypesArr.push(currentWidget);
    })(type);
  }

  $scope.tags = [];
  widgetTypesArr.forEach(function (w) {
    w.keywords.forEach(function (t) {
      if ($scope.tags.indexOf(t) < 0) $scope.tags.push(t);
    });
  });

  $scope.selectedTags = [];

  var userRoles = [];
  if (user.isAdmin) userRoles.push("administrator");
  if (user.isOwner) userRoles.push("owner");
  if (user.isCollaborator) userRoles.push("collaborator");

  var hasGrant = function hasGrant(roles, grants) {
    var r = false;
    roles.forEach(function (role) {
      r |= grants.indexOf(role) >= 0;
    });
    return r;
  };

  widgetTypesArr = widgetTypesArr.filter(function (w) {
    return hasGrant(userRoles, w.grant);
  });

  angular.extend($scope, {
    widgetTypes: widgetTypesArr,
    chooseWidget: function chooseWidget(widget) {
      $scope.chosenWidget = widget;
      // no error as a widget was chosen
      $scope.widgetErr = {};
    },

    selectTag: function selectTag(t) {
      var index = $scope.tags.indexOf(t);
      $scope.tags.splice(index, 1);
      $scope.selectedTags.push(t);
      $scope.selectedObject = "";
      $scope.$viewValue = "";
    },

    unselectTag: function unselectTag(t) {
      var index = $scope.selectedTags.indexOf(t);
      $scope.selectedTags.splice(index, 1);
      $scope.tags.push(t);
    },

    hasTags: function hasTags(w) {
      var f = true;
      $scope.selectedTags.forEach(function (t) {
        return f &= w.keywords.indexOf(t) >= 0;
      });
      return f;
    },

    add: function add(widget) {
      // checks whether chosen template belongs to the current filter criteria
      $scope.chosenWidget = widget;

      $modalInstance.close($scope.chosenWidget);
    },

    isSelected: function isSelected(widget) {
      $scope.chosenWidget === widget;
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    }
  });
}]);

modals.controller("AddNewPageModalController", ["$scope", "$state", "$modalInstance", "$translate", "alert", "app", "templateTypes", "appUrls", function ($scope, $state, $modalInstance, $translate, alert, app, templateTypes, appUrls) {
  // TODO: Rewrite this piece of SH*T!

  // array of all template types
  var templateTypesArr = [];

  // create templateTypesArr out of templateTypes map
  for (var type in templateTypes.data) {
    var currentTemplate = {
      type: type,
      description: templateTypes.data[type].description,
      holders: templateTypes.data[type].holders,
      icon: appUrls.templateIcon(type)
    };

    templateTypesArr.push(currentTemplate);
  }

  $scope.settings = {

    href: "",

    // check whether shortTitle is correct (isn't empty for now)
    checkShortTitle: function checkShortTitle() {
      $scope.titleErr = {};
      if (!$scope.settings.shortTitle) {
        $scope.titleErr.message = $translate.instant("FIELD_MUSTNT_BE_EMPTY");
        $scope.titleErr["class"] = "red";
        return false;
      }
      return true;
    },

    templateTypes: templateTypesArr,

    // add button action
    add: function add() {
      if (!$scope.settings.checkShortTitle()) {
        return;
      }

      //if chosen template isn't in the current filter then show an error
      if (!$scope.settings.chosenTemplate) {
        $scope.chosenTemplate = {};
        $scope.templateErr = {};
        $scope.templateErr.message = $translate.instant("CHOOSE_A_TEMPLATE");
        $scope.templateErr["class"] = "red";
        return;
      }

      var page = {
        shortTitle: $scope.settings.shortTitle,
        href: $scope.settings.href,
        template: $scope.settings.chosenTemplate.type,
        holders: {}
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $scope.settings.chosenTemplate.holders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var holderName = _step.value;

          page.holders[holderName] = {
            widgets: []
          };
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

      app.addNewPage(page);

      // redirect to the new page
      $state.go("page", { href: $scope.settings.href }, { reload: true });
      $modalInstance.close();
    },

    chooseTemplate: function chooseTemplate(template) {
      $scope.settings.chosenTemplate = template;
      // don't show any error message
      $scope.templateErr = {};
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    },

    isSelected: function isSelected(template) {
      return $scope.settings.chosenTemplate === template;
    }
  };
}]);

modals.controller("PageSettingsModalController", ["$scope", "$state", "$modalInstance", "$translate", "alert", "app", "page", function ($scope, $state, $modalInstance, $translate, alert, app, page) {
  $scope.settings = {
    href: page.href,
    shortTitle: page.shortTitle
  };

  angular.extend($scope, {
    // check whether shortTitle is correct (isn't empty for now)
    checkShortTitle: function checkShortTitle() {
      this.titleErr = {};
      if (!this.settings.shortTitle) {
        this.titleErr = true;
        this.titleErr.message = $translate.instant("FIELD_MUSTNT_BE_EMPTY");
        this.titleErr["class"] = "red";
        return false;
      }
      return true;
    },

    // add button action
    save: function save() {
      if (!this.checkShortTitle()) {
        return;
      }

      // if nothing changes - emulate pressing cancel button.
      for (var prop in this.settings) {
        if (this.settings[prop] !== page[prop]) {
          angular.extend(page, $scope.settings);
          $modalInstance.close();
          return;
        }
      }
      this.cancel();
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    }
  });
}]);

modals.controller("ShareSettingsModalController", ["$scope", "$modalInstance", "$http", "author", "appUrls", "config", function ($scope, $modalInstance, $http, author, appUrls, config) {
  angular.extend($scope, {
    author: author,
    collaborations: angular.copy(config.collaborations) || [], // TODO: change to collaborations

    getUsers: function getUsers(filterValue) {
      var _this = this;

      // todo: add support for filterValue
      return $http.get(appUrls.usersList).then(function (result) {
        return (
          /* Hack: filters do not work in angular-foundation's typeahead view for some reason */
          result.data.filter(function (user) {
            return !_this.userIsCollaborator(user);
          }).filter(function (user) {
            return user.name.toLowerCase().includes(filterValue.toLowerCase()) || user.email.toLowerCase().includes(filterValue.toLowerCase());
          }).slice(0, 8)
        );
      });
    },

    addCollaboration: function addCollaboration() {
      this.collaborations.push({
        user: {
          id: this.selectedUser.id,
          name: this.selectedUser.name,
          email: this.selectedUser.email,
          photo: this.selectedUser.photo
        },
        access: undefined // todo: add support for edit/view access rights
      });
    },

    deleteCollaboration: function deleteCollaboration(userId) {
      this.collaborations.splice(this.collaborations.findIndex(function (user) {
        return user.id === userId;
      }), 1);
    },

    userIsCollaborator: function userIsCollaborator(user) {
      var isOwner = user.id === (author || {}).id;
      return isOwner || this.collaborations.find(function (c) {
        return c.user.id === user.id;
      });
    },

    ok: function ok() {
      $modalInstance.close(this.collaborations);
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    }
  });
}]);

modals.controller("AppSettingsModalController", ["$scope", "$modalInstance", "appName", "appSkins", "config", function ($scope, $modalInstance, appName, appSkins, config) {
  angular.extend($scope, {
    settings: {
      isPublished: config.isPublished,
      name: config.name,
      skinName: config.skinName,
      keywords: config.keywords.join(", "),
      title: config.title,
      description: config.description,
      icon: config.icon,
      dps: config.dps
    },
    skins: appSkins,

    generateIcon: function generateIcon() {
      this.settings.icon = "/img/default/" + Math.round(20 * Math.random()) + ".png";
    },

    ok: function ok() {
      this.settings.keywords = this.settings.keywords.split(",");

      for (var i in this.settings.keywords) {
        this.settings.keywords[i] = this.settings.keywords[i].trim();
      }

      // this.settings.keywords.forEach((item) => {item = item.trim()})
      $modalInstance.close(this.settings);
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    }
  });
}]);

modals.controller("ViewPageConfigController", ["$scope", "$modalInstance", "app", "config", function ($scope, $modalInstance, app, config) {
  $scope.config = app.pageConfig();
  $scope.holders = [];
  for (var i in $scope.config.holders) {
    $scope.holders.push(i);
  }$scope.keys = function (obj) {
    return Object.keys(obj);
  };
  $scope.ok = function () {
    $modalInstance.close(this.settings);
  }, $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}]);

modals.controller("ResourceManagerController", ["$scope", "$http", "$upload", "appName", "dialog", "clipboard", "$modalInstance", "$translate", function ($scope, $http, $upload, appName, dialog, clipboard, $modalInstance, $translate) {

  $scope.appName = appName;
  $scope.upload_process = true;

  $scope.copyToClipboard = function (text) {
    clipboard.copyText(text);
  };

  $scope.load = function () {
    $http.get("./api/resource").success(function (data) {
      $scope.upload_process = false;
      $scope.resources = data;
    });
  };
  var formatDate = function formatDate(date) {
    var locale = $translate.use() || "en";
    date = new Date(date);
    date = date.toLocaleString(locale, { year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    return date;
  };

  $scope.formatDate = formatDate;

  $scope.upload = function (file) {
    $scope.upload_process = true;
    $upload.upload({
      url: "./api/resource/update",
      method: "POST",
      headers: {
        "my-header": "my-header-value"
      },
      fields: { app: appName },
      file: file }).then(function () {
      $scope.load();
    });
  };

  $scope.fileSelected = function (f, e) {
    var files = f;

    $scope.formUpload = false;
    if (files != null) {
      $scope.commits = undefined;
      for (var i = 0; i < files.length; i++) {
        $scope.errorMsg = null;
        (function (file) {
          $scope.upload(file);
        })(files[i]);
      }
    }
  };

  $scope.deleteResource = function (resource) {
    $scope.upload_process = true;
    $http.get("./api/resource/delete/" + resource.path).success(function () {
      $scope.upload_process = false;
      $scope.load();
    });
  };

  $scope.close = function () {
    $modalInstance.close();
  };

  $scope.renameResource = function (resource) {
    dialog({
      title: "Enter new resource name",
      fields: {
        oldName: { title: "Old name", value: resource.path },
        newName: { title: "New name", value: resource.path, editable: true, required: true }
      }
    }).then(function (form) {
      $scope.upload_process = true;
      $http.post("./api/resource/rename", { app: $scope.appName,
        oldPath: form.fields.oldName.value,
        newPath: form.fields.newName.value
      }).success(function () {
        $scope.load();
      });
    });
  };

  $scope.upload_process = true;
  $scope.load();
}]);

modals.controller("TranslationManagerController", ["$scope", "i18n", "$translate", "dialog", "app", "clipboard", "config", "$modalInstance", function ($scope, i18n, $translate, dialog, app, clipboard, config, $modalInstance) {

  $scope.prepareTranslations = function () {

    // get key collection
    var keys = [];
    for (var locale in config.i18n) {
      for (var key in config.i18n[locale]) {
        (function (key) {
          if (keys.filter(function (item) {
            return item == key;
          }).length == 0) {
            keys.push(key);
          }
        })(key);
      }
    }
    //organize table
    $scope.translations = [];
    for (var i in keys) {
      var tr = { key: keys[i] };
      for (var locale in config.i18n) {
        tr[locale] = config.i18n[locale][keys[i]];
      }
      $scope.translations.push(tr);
    }
  };

  $scope.prepareTranslations();

  $scope.close = function () {
    $modalInstance.close();
  };

  $scope.copyToClipboard = function (text) {
    clipboard.copyText(text);
  };

  $scope.deleteTranslation = function (t) {
    i18n.remove([t.key]);
    $scope.prepareTranslations();
    app.markModified(true);
  };

  $scope.createTranslation = function () {
    dialog({
      title: "Create translation",
      fields: {
        key: { title: "Key", editable: true, required: true },
        en: { title: "English", editable: true },
        ua: { title: "Ukrainian", editable: true },
        ru: { title: "Russian", editable: true }
      }
    }).then(function (form) {
      app.markModified(true);
      var t = {};
      t[form.fields.key.value] = form.fields.ua.value;
      i18n.add("uk", t);
      t[form.fields.key.value] = form.fields.en.value;
      i18n.add("en", t);
      t[form.fields.key.value] = form.fields.ru.value;
      i18n.add("ru", t);
      $scope.prepareTranslations();
    });
  };

  $scope.editTranslation = function (translation) {
    dialog({
      title: "Edit translation",
      fields: {
        key: { title: "Key", editable: true, required: true, value: translation.key },
        en: { title: "English", editable: true, value: translation.en },
        uk: { title: "Ukrainian", editable: true, value: translation.uk },
        ru: { title: "Russian", editable: true, value: translation.ru }
      }
    }).then(function (form) {
      app.markModified(true);
      if (translation.key != form.fields.key.value) {
        $scope.deleteTranslation(translation);
      }
      var t = {};
      t[form.fields.key.value] = form.fields.uk.value;
      i18n.add("uk", t);
      t[form.fields.key.value] = form.fields.en.value;
      i18n.add("en", t);
      t[form.fields.key.value] = form.fields.ru.value;
      i18n.add("ru", t);
      $scope.prepareTranslations();
    });
  };
}]);

modals.factory("addNewPageInModal", ["app", "$modal", function (app, $modal) {
  return function () {
    $modal.open({
      templateUrl: "/widgets/page-list/new-page-modal-config.html",
      controller: "AddNewPageModalController",
      backdrop: "static",
      resolve: {
        templateTypes: ["templateTypesPromise", function templateTypes(templateTypesPromise) {
          return templateTypesPromise;
        }]
      }
    }).result.then(function () {
      return app.markModified(true);
    });
  };
}]);

modals.factory("openPageConfig", ["app", "$modal", function (app, $modal) {
  return function (page) {
    var thisPage = app.pageConfig().href === page.href;
    $modal.open({
      templateUrl: "/widgets/page-list/page-modal-config.html",
      controller: "PageSettingsModalController",
      backdrop: "static",
      resolve: {
        page: function () {
          return page;
        }
      }
    }).result.then(function () {
      app.markModified(true);
      if (thisPage) {
        $state.go("page", { href: page.href }, { reload: true });
      }
    });
  };
}]);

modals.controller("PageManagerController", ["$scope", "$translate", "$modal", "$modalInstance", "$state", "clipboard", "app", "appName", "config", "globalConfig", "confirm", "addNewPageInModal", "openPageConfig", function ($scope, $translate, $modal, $modalInstance, $state, clipboard, app, appName, config, globalConfig, confirm, addNewPageInModal, openPageConfig) {
  // TODO: synchronize css styles on active link after clicking

  angular.extend($scope, {
    appName: appName,
    config: config,
    addNewPageInModal: addNewPageInModal,
    openPageConfig: openPageConfig,
    copyToClipboard: function copyToClipboard(ref) {
      clipboard.copyText("/app/" + appName + "/" + ref);
    },
    gotoPage: function gotoPage(page) {
      $state.go("page", { href: page.href }, { reload: true });
      $modalInstance.close();
    },
    close: function close() {
      $modalInstance.close();
    },
    clonePage: function clonePage() {
      app.clonePage();
    },
    copyPage: function copyPage() {
      app.copyPage();
    },
    pastePage: function pastePage() {
      app.pastePage();
    },
    deletePageWithConfirmation: function deletePageWithConfirmation(page) {
      $translate("WIDGET.PAGE-LIST.ARE_YOU_SURE_DELETE_PAGE").then(confirm).then(function () {
        return app.deletePage(page);
      });
    }
  });
}]);
/*ok*/
//# sourceMappingURL=modal-controllers.js.map