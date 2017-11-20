"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-file-saver");

var dps = angular.module("app.dps", ["app.config", "ngFileSaver"]);

dps.run(["config", "$location", function (config, $location) {
	config.dps = config.dps || $location.protocol() + "://" + $location.host() + ":" + $location.port();

	console.log("Data Processing Server URL", config.dps);
}]);

dps.service("$dps", ["$http", "config", "$location", "FileSaver", "Blob", function ($http, config, $location, FileSaver, Blob) {
	var dpsURL = config.dps || $location.protocol() + "://" + $location.host() + ":" + $location.port();
	angular.extend(this, {
		get: function get(url, config) {
			// $http.jsonp(dpsURL+url+"?callback=JSON_CALLBACK",config)
			// .then(function(data,status){
			// 	console.log(dpsURL+url+"?callback=JSON_CALLBACK");
			// 	console.log(data)
			// 	console.log(status)
			// })
			// return $http.jsonp(dpsURL+url+"?callback=JSON_CALLBACK",config)
			return $http.get(dpsURL + url, config);
		},

		post: function post(url, config) {
			return $http.post(dpsURL + url, config);
		},

		downloadJSON: function downloadJSON(data, file) {
			var savedObject = new Blob([JSON.stringify(data)], { type: "application/json;charset=utf-8" }); // { type: 'text/plain;charset=utf-8' });
			FileSaver.saveAs(savedObject, file);
		},
		saveAttachement: function saveAttachement(data, mime, file) {
			var savedObject = new Blob([data], { type: mime }); // { type: 'text/plain;charset=utf-8' });
			FileSaver.saveAs(savedObject, file);
		},

		getUrl: function getUrl() {
			return dpsURL;
		}
	});
}]);
//# sourceMappingURL=dps.js.map