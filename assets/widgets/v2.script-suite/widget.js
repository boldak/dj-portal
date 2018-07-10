import angular from 'angular';
import 'ng-ace';
import "pretty-data";

import dpsSnippets from 'js/dps-snippets';

let m = angular.module('app.widgets.v2.script-suite', [
    'app.dps',
    "ng.ace",
    'ngMaterial'
])


m.config(function($mdIconProvider) {
        $mdIconProvider
          .defaultIconSet('img/icons/sets/core-icons.svg', 24);
      })

m.filter('keyboardShortcut', function($window) {
        return function(str) {
          if (!str) return;
          var keys = str.split('-');
          var isOSX = /Mac OS X/.test($window.navigator.userAgent);

          var separator = (!isOSX || keys.length > 2) ? '+' : '';

          var abbreviations = {
            M: isOSX ? '⌘' : 'Ctrl',
            A: isOSX ? 'Option' : 'Alt',
            S: 'Shift'
          };

          return keys.map(function(key, index) {
            var last = index === keys.length - 1;
            return last ? key : abbreviations[key];
          }).join(separator);
        };
    })

m.controller('ScriptSuiteController', function(
    $scope, 
    APIProvider, 
    dialog, 
    app,
    i18n,
    $dps,
    EventEmitter,
    $error, 
    log,
    pageSubscriptions,
    $q,
    config,
    $mdDialog
) {


     $scope.settings = {
        options:{
            mode: 'text',
            theme: 'tomorrow'
        },
        type: 'text',
        data: 'No data'
    }

    let supportedMode = {
        text:           "text", 
        string:         "text", 
        xml:            "xml", 
        csv:            "csv", 
        javascript:     "javascript", 
        json:           "json",
        object:         "json",
        "function":     "json", 
        dps:            "dps",
        dataset:        "json",
    }

    let extention = {
        help:           "json",
        html:           "html", 
        json:           "json", 
        table:          "json",
        error:          "json",
        bar:            "json",
        hbar:           "json",
        line:           "json",
        area:           "json",
        scatter:        "json",
        radar:          "json",
        deps:           "json",
        pie:            "json"    
    }

    let prettify = function(context){
        if(['html','xml'].indexOf(context.key) >=0 ){
            return pd.xml(context.data)
        }
        if(angular.isString(context.data)){
            return context.data
        }
        return pd.json(context.data)
    }

    const eventEmitter = new EventEmitter($scope);
    
    $scope.notSaved = false;

    var __script;

    
    
    $scope.options = {
        mode:'dps', 
        theme:'tomorrow',
        onLoad      : editor => { $scope.editor = editor },
        onChange: (e) => {
            if(angular.isDefined($scope.currentScriptIndex)){
                if(angular.isDefined($scope.tabs[$scope.currentScriptIndex])){
                    $scope.tabs[$scope.currentScriptIndex].script = e[1].getSession().getValue();                
                }
            }    
       }
    }

    $scope.getEditorScript = function(){
        return __script;
    }

    $scope.keys = Object.keys;
    
    $scope.classed = function(index){
        if(!$scope.selected) return "row";
        return ($scope.keys($scope.widget.script)[index] == $scope.selected) ? "row selected": "row"
    }
    
    
    $scope = angular.extend($scope, {

        dpsSnippets: dpsSnippets,

        tabs:[],

        scripts: _.toPairs($scope.widget.script)
                    .map(item => {
                        let res =  {
                            name:item[0], 
                            script:item[1],
                            state: "",
                            result: {
                                options:{
                                    mode: 'text',
                                    theme: 'tomorrow'
                                },
                                type: 'text',
                                data: 'No data'
                            }
                        }
                        
                        return res;
                    }),

        
        currentScriptIndex: undefined,

        insertSnippet: code => {
            if (code) $scope.editor.session.replace($scope.editor.selection.getRange(), code)
        },

        getScriptByName: (name) =>   {
            let res = _.find($scope.scripts, item => item.name == name)
            console.log("getScriptByName",res)
            if(angular.isDefined(res)) return res;
            $scope.scripts.push({
                            name: name,
                            script: ('// Write ' + name + ' script here'),
                            state: "",
                            result: {
                                options:{
                                    mode: 'text',
                                    theme: 'tomorrow'
                                },
                                type: 'text',
                                data: 'No data'
                            }
            })
            return $scope.scripts[$scope.scripts.length-1]
        },
        
        getScriptIndexByName: (name) => {
            let res = _.findIndex($scope.scripts, item => item.name == name)
            if( res > -1 ) return res;
            $scope.scripts.push({
                            name: name,
                            script: ('// Write ' + name + ' script here'),
                            state: "",
                            result: {
                                options:{
                                    mode: 'text',
                                    theme: 'tomorrow'
                                },
                                type: 'text',
                                data: 'No data'
                            }
            })
            return $scope.scripts.length-1;
        },

        openScript: (name) => {
            let tabIndex = _.findIndex($scope.tabs, item => item.name == name)
            if ( tabIndex > -1 ) {
                $scope.currentScriptIndex = tabIndex;
                return
            }    
            let s = $scope.getScriptByName(name)
            $scope.tabs.push(s)
            $scope.currentScriptIndex = $scope.tabs.length-1;
            
        },

        saveScript: (name) => {

        },

        closeScript: (name) => {
            _.remove($scope.tabs, item => item.name == name)
            // $scope.getScriptByName(name).state.open = false;
        },

        selectTab: (name) => {
           console.log("Tab", name, $scope.currentScriptIndex)
        },

        appendFile: () => {
            let currentScript = $scope.tabs[$scope.currentScriptIndex];
            
            dialog({
            title: `Append Data File`,
            fields: {
                file: {
                    title: 'Data file:',
                    type: 'file',
                    value: currentScript.dataFile,
                    editable: true,
                    required: true
                }
            }

        }).then((form) => {

            // var p = progress("Upload dataset ");
            // const fd = new FormData();
            let currentScript = $scope.tabs[$scope.currentScriptIndex];
            currentScript.dataFile = form.fields.file.value;
        })

            // // Take the first selected file
            // fd.append('file', form.fields.file.value);
        },

        handleScriptResponse: response => {
            // currentScript.result = {
            //     data: response.data.data,
            //     key: response.data.type
            // };
            let currentScript = $scope.tabs[$scope.currentScriptIndex];
            let mode = supportedMode[response.data.type] || extention[response.data.type];
           
            if(mode){
                currentScript.result = {
                    options:{
                        mode: mode,
                        theme: "tomorrow"
                    },
                    type: response.data.type,
                    data: prettify(response.data)
                }
            }    
            
            currentScript.state = (response.data.type == "error") ? "rejected" : "resolved"
        },

        runScript: () => {

            let currentScript = $scope.tabs[$scope.currentScriptIndex];
            currentScript.state = "process";
            
            console.log("RUN", currentScript)

            let p;
            if (currentScript.dataFile){
                p =  $dps.postWithFile(
                        "/api/script", 
                        currentScript.dataFile,
                        {
                          "script": currentScript.script,
                          "locale": i18n.locale()  
                        } 
                    )
            } else {
                p = $dps.post(
                        "/api/script", 
                        {
                          "script": currentScript.script,
                          "locale": i18n.locale()  
                        } 
                    )

            }
            
            p.then($scope.handleScriptResponse)
        }
    })




    $scope.saveScript = () => {
        $scope.collapsed = true;
        $scope.widget.script[$scope.selected] = $scope.getEditorScript(); 
        $scope.notSaved = false;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
        app.markModified();
    }

    $scope.doDeleteScript = () => {
        $scope.collapsed = true;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
        let index = $scope.keys($scope.widget.script).indexOf($scope.selected);
        $scope.select();
        let newSuite = {};
        let keys = $scope.keys($scope.widget.script);
        for(let i=0; i < keys.length; i++){
            if(keys[i] != keys[index]){
                newSuite[keys[i]] = $scope.widget.script[keys[i]]
            }
        }
       
        $scope.$evalAsync(function(){
            $scope.widget.script = newSuite; 
            index = (index > ($scope.keys($scope.widget.script).length-1))?$scope.keys($scope.widget.script).length-1 : index;
            $scope.select($scope.keys($scope.widget.script)[index])
        })

        app.markModified()
    }
    
    $scope.deleteScript = () => {
        $scope.collapsed = true;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
        dialog({
            title:'Delete script "'+$scope.selected+'"?',
            form:{}
        })
        .then($scope.doDeleteScript)
    }
    $scope.doAddScript = (name, script) => {
        $scope.collapsed = true;
        $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
        $scope.widget.script[name] = (script) ? script : ('// Write '+name+' script here')
        $scope.select(name);
        app.markModified();
    }

    $scope.addScript = () => {
        dialog({
            title:'Add script',
            fields:{
                name:{
                    title: 'Script name',
                    type:'text',
                    validate: function (form){return !$scope.widget.script[form.fields.name.value]}
                }
            }
        })
        .then((form) =>{
            $scope.doAddScript(form.fields.name.value)
        })
    }

    $scope.renameScript = () => {
        let temp = {
            script: $scope.widget.script[$scope.selected],
            name: $scope.selected
        }

        $scope.doDeleteScript();

        dialog({
            title:'Rename script',
            fields:{
                name:{
                    title: 'Script name',
                    type:'text',
                    value:temp.name,
                    validate: function (form){return !$scope.widget.script[form.fields.name.value]}
                }
            }
        })
        .then((form) =>{
            $scope.doAddScript(form.fields.name.value, temp.script)
        })
        .catch(() =>{
            $scope.doAddScript(temp.name, temp.script)
        })
    }

    $scope.select = (name) => {
        $scope.collapsed = true;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
            
        if($scope.selected) {
            $scope.saveScript()
        } else {
            $scope.collapsed = true;
        }    

        if(!name){
            $scope.selected = undefined;
            $scope.notSaved = false;
            return
        }

        $scope.script =  angular.copy($scope.widget.script[name]);
        $scope.selected = name;
        $scope.notSaved = false;
    }

    $scope.cancelProcess = () => {
        if($scope.canceler) $scope.canceler.resolve();
        $scope.canceled = true;
    }

    // $scope.runScript = function() {
    //     $scope.canceled = false;
    //     if($scope.canceler) $scope.canceler.resolve();
    //     $scope.canceler = $q.defer();
        
    //     $scope.response = undefined;
    //     eventEmitter.emit('setData', undefined);
    //     $scope.saveScript(); 
        
    //     $scope.processed = true;
       
        
    //     $dps.post("/api/script", {
    //             "script": $scope.widget.script[$scope.selected],
    //             "locale": i18n.locale()
    //         },
    //         {timeout:$scope.canceler.promise})
    //         .then(function(response) {
    //             $scope.processed = false;
    //             response.data.key = response.data.type;
    //             if (response.data.key == 'error') {
    //                 $error(response.data.data)
    //                 $scope.response = {
    //                     key: "error",
    //                     data: response.data.data
    //                 }
    //                 $scope.rejected = true;
    //                 eventEmitter.emit('setData', $scope.response);
    //             } else {
    //                 $scope.successed = true;
    //                 if (response.data.key == "url") {
    //                     $scope.response = {
    //                         data: {
    //                             success: $dps.getUrl() + response.data.data.url
    //                         },
    //                         key: "json"
    //                     }
    //                     window.open($dps.getUrl() + response.data.data.url, '_blank')
    //                 } else {
    //                     if(response.data.key == "log"){
    //                         log({ title: "", messages: response.data.data});
    //                         $scope.response = response.data 
    //                     }else{
    //                         $scope.response = response.data    
    //                     }
    //                 }
    //                 eventEmitter.emit('setData', $scope.response);
    //             }
    //         })
    // }

    console.log($scope.dpsSnippets)
    
    new APIProvider($scope)
        .config(() => {
            // console.log("CONfIG",config)
            $scope.dataProcessingServer = config.dps;
            $scope.widget.script = $scope.widget.script || {}

            $scope.scripts = _.toPairs($scope.widget.script).map(item => {return {name:item[0], script:item[1]}});



            $scope.collapsed = ($scope.keys($scope.widget.script).length > 0)
            
            if($scope.keys($scope.widget.script).length > 0 && $scope.globalConfig.designMode){
                $scope.select($scope.keys($scope.widget.script)[0])
            }

            $scope.d_listeners = ($scope.widget.d_listeners) ? $scope.widget.d_listeners.split(",") : [];
            pageSubscriptions().removeListeners({
                emitter: $scope.widget.instanceName,
                signal: "setData"
            })

            $scope.response = {
                message: "Write script and execute it"
            };

            pageSubscriptions().addListeners(
                $scope.d_listeners.map((item) => {
                    return {
                        emitter: $scope.widget.instanceName,
                        receiver: item.trim(),
                        signal: "setData",
                        slot: "setData"
                    }
                })
            );

            eventEmitter.emit('setData', undefined);
        })
        
        .openCustomSettings(function() {
            return dialog({
                    title: "DJ dps Suite settings",
                    fields: {
                        d_listeners: {
                            title: "Listeners",
                            type: "text",
                            value: $scope.widget.d_listeners,
                            required: false
                        }
                    }
                })
                .then(function(form) {
                    $scope.widget.d_listeners = form.fields.d_listeners.value;
                    })
        })

        .removal(() => {
            console.log('Script widget is destroyed');
        });
})
