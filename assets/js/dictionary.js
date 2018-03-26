import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'i18n';
import 'dps';

const dictionaryModule = angular.module('app.dictionary', ['pascalprecht.translate','app.i18n','app.dps']);
dictionaryModule.dictionary = {};



dictionaryModule.run(function (i18n, $dps) {
  
  // $http.get("./api/dictionary")
  $dps.get("/api/dictionary")
            .then(function (data) {
               console.log("Dictionary service", data)
                var d = {};
                for(let i in data){
                  d[data[i].key] = data[i].value;
                }
                dictionaryModule.dictionary = d;
                var tua = {};
                var ten = {};
                for(let i in data){
                  if (data[i].type == "i18n" &&  data[i].value) {
                    tua[data[i].key] = data[i].value.ua;
                    ten[data[i].key] = data[i].value.en;
                  }
                }
               i18n.add("uk",tua,true);
               i18n.add("en",ten,true);
            })
            .catch( e => {console.log("No server side dictionary : ", JSON.stringify(e, null,"\t"))})
});



dictionaryModule.service("$lookup",[ "i18n", "$dps",
  function( i18n, $dps){
    var LocalDictionary = function(dictionary){
      this._table = {}
      if (dictionary) this._init(dictionary)
    }

    LocalDictionary.prototype = {
        
        lookup: function(key){
          return this._table[key] || key
        },
        
        _init: function(dict){
          for(let i in dict){
            this._table[dict[i].key] = dict[i].value;
          }
          return this;
        }  
    }

    var lookup = function(key){
      return dictionaryModule.dictionary[key] || key
    };

     lookup.dictionary = function(dict){
        return new LocalDictionary()._init(dict)      
     }

    lookup.reload = function(){
      // $http.get("./api/dictionary")
      
      $dps.get("/api/dictionary")
              .then(function (data) {
                  var d = {};
                  for(let i in data){
                    d[data[i].key] = data[i].value;
                  }
                  dictionaryModule.dictionary = d;
                  var tua = {};
                  var ten = {};
                  for(let i in data){
                    if (data[i].type == "i18n" &&  data[i].value) {
                      tua[data[i].key] = data[i].value.ua;
                      ten[data[i].key] = data[i].value.en;
                    }
                  }
                 i18n.add("uk",tua,true);
                 i18n.add("en",ten,true);
            })
            .catch( e => {console.log("No server side dictionary : ", JSON.stringify(e, null,"\t"))})  
    }

  return lookup;
}]);



