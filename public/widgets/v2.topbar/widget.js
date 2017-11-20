"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var m = angular.module("app.widgets.v2.topbar", []);

m.service("randomItemID", function () {
  return function () {
    return Math.random().toString(36).substring(2);
  };
});

m.controller("TopBarDialogController", ["$scope", "$modalInstance", "dialog", "content", "parentScope", "confirm", "randomItemID", function ($scope, $modalInstance, dialog, content, parentScope, confirm, randomItemID) {

  angular.extend($scope, {

    content: angular.copy(parentScope.widget.content.reverse()),
    decoration: angular.copy(parentScope.widget.decoration),

    close: function close() {
      parentScope.widget.content = angular.copy($scope.content).reverse();
      parentScope.widget.decoration = angular.copy($scope.decoration);
      $modalInstance.close();
    },

    cancel: function cancel() {
      $modalInstance.dismiss();
    },

    addSection: function addSection() {
      dialog({
        title: "New Section",
        fields: { title: { title: "Section Title", value: "", editable: true, required: true } }
      }).then(function (form) {
        $scope.content.push({
          key: randomItemID(),
          title: form.fields.title.value,
          content: []
        });
      });
    },

    deleteSection: function deleteSection(section) {
      var s = $scope.content.filter(function (item) {
        return item.key == section.key;
      })[0];
      if (s) {
        confirm("Delete section " + s.title + "(" + s.key + ")").then(function () {
          $scope.content = $scope.content.filter(function (item) {
            return item.key != s.key;
          });
        });
      }
    },

    editSection: function editSection(section) {
      var s = $scope.content.filter(function (item) {
        return item.key == section.key;
      })[0];
      if (s) {
        dialog({
          title: "Edit Section",
          fields: {
            title: {
              title: "Section Title", value: s.title, editable: true, required: true
            }
          }
        }).then(function (form) {
          s.title = form.fields.title.value;
        });
      }
    },

    addItem: function addItem(section) {
      if (section) {
        (function () {
          var s = $scope.content.filter(function (item) {
            return item.key == section.key;
          })[0];
          if (s) {
            dialog({
              title: "New Item",
              fields: {
                title: { title: "Item Title", value: "", editable: true, required: true },
                href: { title: "Item Reference", value: "", editable: true, required: true }
              }
            }).then(function (form) {
              s.content.push({
                key: randomItemID(),
                title: form.fields.title.value,
                href: form.fields.href.value
              });
            });
          }
        })();
      } else {
        dialog({
          title: "New Item",
          fields: {
            title: { title: "Item Title", value: "", editable: true, required: true },
            href: { title: "Item Reference", value: "", editable: true, required: true }
          }
        }).then(function (form) {
          $scope.content.push({
            key: randomItemID(),
            title: form.fields.title.value,
            href: form.fields.href.value
          });
        });
      }
    },

    deleteItem: function deleteItem(item, section) {
      if (section) {
        (function () {
          var s = $scope.content.filter(function (item) {
            return item.key == section.key;
          })[0];
          if (s) {
            (function () {
              var it = s.content.filter(function (p) {
                return p.key == item.key;
              })[0];
              if (it) {
                confirm("Delete item " + it.title + "(" + it.key + ")").then(function () {
                  s.content = s.content.filter(function (p) {
                    return p.key != it.key;
                  });
                });
              }
            })();
          }
        })();
      } else {
        (function () {
          var it = $scope.content.filter(function (p) {
            return p.key == item.key;
          })[0];
          if (it) {
            confirm("Delete item " + it.title + "(" + it.key + ")").then(function () {
              $scope.content = $scope.content.filter(function (p) {
                return p.key != it.key;
              });
            });
          }
        })();
      }
    },

    upItem: function upItem(item, section) {
      var list = section ? section.content : $scope.content;
      var it = list.map(function (item, index) {
        return { index: index, item: item };
      }).filter(function (p) {
        return p.item.key == item.key;
      })[0];
      var index = it ? it.index : -1;
      if (index > 0) {
        var buf = list[index - 1];
        list[index - 1] = list[index];
        list[index] = buf;
      }
    },

    editItem: function editItem(item) {
      dialog({
        title: "Edit Item",
        fields: {
          title: { title: "Item Title", value: item.title, editable: true, required: true },
          href: { title: "Item Reference", value: item.href, editable: true, required: true }
        }
      }).then(function (form) {

        item.title = form.fields.title.value;
        item.href = form.fields.href.value;
      });
    }
  });
}]);

m.controller("TopBarController", ["$scope", "$modal", "app", "logIn", "appName", "config", "author", "user", "APIProvider", "$translate", "$lookup", "EventEmitter", "i18n", "randomItemID", "$scroll", "$location", "$window", function ($scope, $modal, app, logIn, appName, config, author, user, APIProvider, $translate, $lookup, EventEmitter, i18n, randomItemID, $scroll, $location, $window) {

  var eventEmitter = new EventEmitter($scope);
  angular.extend($scope, {
    logIn: logIn,
    app: app,
    appName: appName,
    config: config,

    navigate: function (href) {
      var href = href.split("#");
      var path = href[0].length > 0 ? href[0] : $location.path();
      var id = href[1];

      if (path == $location.path() && id) {
        $scroll(id);
        return;
      }

      if (path.length > 0 && path != $location.path()) {
        $window.location.href = path;
      }
    },

    languages: [{ key: "en", title: "Eng." }, { key: "uk", title: "Укр." }
    // {key: "ru", title: "Рус."}
    ],
    selectLanguage: function selectLanguage(langKey) {
      $scope.currentLang = $scope.languages.filter(function (item) {
        return item.key == langKey;
      })[0];
      $translate.use(langKey);
      $translate.refresh().then(function () {
        i18n.refresh();
      });
      eventEmitter.emit("selectLanguage", langKey);
    } });

  $scope.currentLang = $scope.languages.filter(function (item) {
    return item.key == i18n.locale();
  })[0];

  new APIProvider($scope).config(function () {

    $scope.widget.decoration = $scope.widget.decoration ? $scope.widget.decoration : {
      languageSelector: {
        enable: true,
        showFlag: false,
        showTitle: true
      },
      loginButton: true,
      gotoApps: true
    };
    $scope.widget.content = $scope.widget.content ? $scope.widget.content : [];
    console.log("Select lang", $scope.currentLang.key);
    $scope.selectLanguage($scope.currentLang.key);
  }).openCustomSettings(function () {
    $modal.open({
      templateUrl: "/widgets/v2.topbar/topbar-dialog.html",
      controller: "TopBarDialogController",
      resolve: {
        content: function () {
          return $scope.widget.content;
        },
        parentScope: function () {
          return $scope;
        }
      },
      backdrop: "static"
    });
  });
}]);
// eventEmitter.emit("selectLanguage",$scope.currentLang.key);

//   [ {
//        key:randomItemID(),
//       title: "Getting Started",
//       href: "#Getting",
//       content: [{
//          key: randomItemID(),
//           title: "Page 1",
//           href: "#p1" 
//         },{
//            key: randomItemID(),
//           title: "Page 2",
//           href: "#p2" 
//         }
//       ]
//     },
//     {
//        key:randomItemID(),
//       title: "Pages",
//       content: [{
//          key: randomItemID(),
//           title: "Page 1",
//           href: "#p1" 
//         },{
//            key: randomItemID(),
//           title: "Page 2",
//           href: "#p2" 
//         }
//       ]
//     },{
//        key: randomItemID(),
//       title: "About",
//       href: "#Getting"
//     }         
// ];
// $scope.widget.content = $scope.widget.content.reverse();

// .translate((langKey) => {
//   $scope.currentLang = $scope.languages.filter((item) => item.key == langKey)[0]
// })
// .provide('selectLanguage', (langKey) => {
//   console.log("selectLang",langKey)
//   $scope.currentLang = $scope.languages.filter((item) => item.key == langKey)[0]
// })
//# sourceMappingURL=../v2.topbar/widget.js.map