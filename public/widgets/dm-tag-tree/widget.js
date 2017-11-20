"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("dictionary");

angular.module("app.widgets.dm-tag-tree", ["app.dictionary", "app.dps"]).controller("DataManagerTagTreeController", ["$scope", "$http", "$dps", "EventEmitter", "APIProvider", "pageSubscriptions", "$lookup", "$translate", "user", "app", function ($scope, $http, $dps, EventEmitter, APIProvider, pageSubscriptions, $lookup, $translate, user, app) {

  var eventEmitter = new EventEmitter($scope);
  $scope.lookup = $lookup;
  $scope.breadcrums = [];
  $scope.tagList = [];

  $scope.collapsed = true;

  $scope.changeState = function () {
    $scope.collapsed = !$scope.collapsed;
  };

  var addListener = function addListener(listener) {
    var subscriptions = pageSubscriptions();
    for (var i in subscriptions) {
      if (subscriptions[i].emitter === listener.emitter && subscriptions[i].receiver === listener.receiver && subscriptions[i].signal === listener.signal && subscriptions[i].slot === listener.slot) {
        return;
      }
    }
    subscriptions.push(listener);
  };

  var removeListener = function removeListener(listener) {
    var subscriptions = pageSubscriptions();
    for (var i in subscriptions) {
      if (subscriptions[i].emitter === listener.emitter && subscriptions[i].receiver === listener.receiver && subscriptions[i].signal === listener.signal && subscriptions[i].slot === listener.slot) {
        subscriptions.splice(i, 1);
        return;
      }
    }
  };

  var prepareList = function prepareList(tag) {
    $scope.tagList = [];
    for (var item in tag) {
      if (item.indexOf("_") !== 0 && item.indexOf("$") !== 0) {
        $scope.tagList.push(tag[item]);
      }
    }
  };

  $scope.down = function (tag) {
    $scope.breadcrums.push(tag);
    prepareList(tag);
    $scope.tag = tag;
    eventEmitter.emit("setLookupKey", tag._tag, $scope.category);
    // let tmp = {};
    // tmp["dataset.topics"] = [{startsWith:tag._path}];
    // let query = [tmp];
    //
    var query = "$[?(@.dataset.topics.contains(function(d){return d.startWith('{{}}')}))]".split("{{}}").join(tag._path);

    eventEmitter.emit("searchQuery", query);
  };

  $scope.up = function (index) {
    $scope.down($scope.breadcrums.splice(index)[0]);
  };

  new APIProvider($scope).config(function () {
    console.log("widget " + $scope.widget.instanceName + " is (re)configuring...");
    $scope.title = $scope.widget.title;
    $scope.category = $scope.widget.category;
    $scope.query = $scope.widget.query;

    $scope.lookupListeners = $scope.widget.lookupListeners ? $scope.widget.lookupListeners.split(",") : [];

    pageSubscriptions().removeListeners({
      emitter: $scope.widget.instanceName,
      signal: "setLookupKey"
    });

    pageSubscriptions().addListeners($scope.lookupListeners.map(function (item) {
      return {
        emitter: $scope.widget.instanceName,
        receiver: item.trim(),
        signal: "setLookupKey",
        slot: "setLookupKey"
      };
    }));

    // for(var i in $scope.lookupListeners){
    //   $scope.lookupListeners[i] = $scope.lookupListeners[i].trim();
    //   // console.log($scope.widget.instanceName,$scope.lookupListeners[i]);
    //  addListener({
    //         emitter: $scope.widget.instanceName,
    //         receiver: $scope.lookupListeners[i],
    //         signal: "setLookupKey",
    //         slot: "setLookupKey"
    //       });
    // }

    $scope.searchListeners = $scope.widget.searchListeners ? $scope.widget.searchListeners.split(",") : [];

    pageSubscriptions().removeListeners({
      emitter: $scope.widget.instanceName,
      signal: "searchQuery"
    });

    pageSubscriptions().addListeners($scope.searchListeners.map(function (item) {
      return {
        emitter: $scope.widget.instanceName,
        receiver: item.trim(),
        signal: "searchQuery",
        slot: "searchQuery"
      };
    }));

    // for(var i in $scope.searchListeners){
    //   $scope.searchListeners[i] = $scope.searchListeners[i].trim();
    //   // console.log($scope.widget.instanceName,$scope.searchListeners[i]);
    //  addListener({
    //         emitter: $scope.widget.instanceName,
    //         receiver: $scope.searchListeners[i],
    //         signal: "searchQuery",
    //         slot: "searchQuery"
    //       });
    // } 

    $scope.icon_class = $scope.widget.icon_class;
    $scope.property = $scope.widget.property || $scope.property;
    var status = user.isOwner || user.isCollaborator ? "private" : "public";
    // $http.post("./api/metadata/tag/tree",{"status":status})
    $dps.post("/api/metadata/tag/tree", { status: status }).success(function (resp) {
      $scope.breadcrums = [];
      $scope.tagList = [];
      resp._tag = $scope.title;
      $scope.result = resp;
      $scope.breadcrums.push($scope.result);
      prepareList($scope.result);
      $scope.tag = $scope.result;
      // $scope.down($scope.result);
    });
  }).provide("refresh", function (evt) {
    var status = user.isOwner || user.isCollaborator ? "private" : "public";
    // $http.post("./api/metadata/tag/tree",{"status":status})
    $dps.post("/api/metadata/tag/tree", { status: status }).success(function (resp) {
      $scope.breadcrums = [];
      $scope.tagList = [];
      resp._tag = $scope.title;
      $scope.result = resp;
      $scope.breadcrums.push($scope.result);
      prepareList($scope.result);
      $scope.tag = $scope.result;
    });
  }).removal(function () {
    console.log("TagsTotal widget is destroyed");
  });
}]);
//# sourceMappingURL=../dm-tag-tree/widget.js.map