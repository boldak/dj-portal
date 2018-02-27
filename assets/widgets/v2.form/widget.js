import angular from 'angular';
import "./utility/index.js";



let m = angular.module('app.widgets.v2.form', [
  'app.dps', "oc.lazyLoad", "ngAnimate", "formUtility"
])


m.controller('FormController', function(
  $scope,
  APIProvider,
  APIUser,
  app,
  i18n,
  $dps,
  pageSubscriptions,
  $q,
  pageWidgets,
  config,
  instanceNameToScope,
  randomID,
  $ocLazyLoad,
  $window,
  $http,
  appUrls,
  user,
  dialog,
  parentHolder,
  $info,
  $filter,
  formMetadata,
  formFanButton,
  formIO,
  formUserUtils,
  formAnswerUtils,
  objectsIsEqual,
  truncString,
  testMessage
) {






$ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 

angular.extend($scope, {
  
  pageWidgets: pageWidgets,

  user: user,

  $filter: $filter,

  pageConfig: app.pageConfig(),
  
  formatDate: (date) => i18n.formatDate(date),
  
  modified: {
      form:false,
      answer:false
  },
  
  textFields: {
    key:undefined,
    value:undefined,
    userEmail:undefined
  },

  processing: false,
  blockMessages: false,

  isDisabled: () => {
    let forms = pageWidgets().filter((item) => item.type === "v2.form");
    return (forms.length > 1) && (!$scope.widget.form);
  },

  markModified: () => {
    updateConfig();
    app.markModified();
  }, 

  metadataTools: formMetadata($scope),

  fanButton: formFanButton($scope),

  transport: formIO($scope,$dps),

  answerUtils: formAnswerUtils($scope)

})


let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);


  $scope.openImportDialog = () => {
// --------------           NO DELETE this code !!! -----------------------------

    // let w ={
    //   "type": "v2.form.question",
    //   "instanceName": "ugikzklbrq__________",
    //   "initPhase": false,
    //   "icon": "/widgets/v2.form.question/icon.png",
    //   "disabled": false,
    //   "ID": "h9rnwb1eb6d___",
    //   "formWidget": "5uwtc89q6gm",
    //   "config": {
    //     "type": {
    //       "value": "check",
    //       "title": "Many of many"
    //     },
    //     "widget": {
    //       "css": "fa fa-check-square",
    //       "view": "./widgets/v2.form.question/partitions/check.view.html",
    //       "options": "./widgets/v2.form.question/partitions/check.options.html"
    //     },
    //     "options": {
    //       "required": false,
    //       "addEnabled": true,
    //       "showUserInfo": true,
    //       "title": "Many of many",
    //       "note": "Many of many",
    //       "nominals": {
    //         "sqla9ua6kzh": {
    //           "title": "New item"
    //         },
    //         "cqxqyr2k4bu": {
    //           "title": "New item"
    //         }
    //       }
    //     },
    //     "callback": {},
    //     "id": "h9rnwb1eb6d___"
    //   }
    // }
    //  parentHolder($scope.widget).widgets.push(w)

    // dialog({
    //     title:"Import form (OSA format)",
    //     fields:{
    //       file:{
    //         title:"File", 
    //         type:'file', 
    //         editable:true, 
    //         required:true
    //       },
    //       script:{
    //         title:"script",
    //         type:"textarea",
    //         editable:true, 
    //         required:true
    //       }
    //     }
    // })
    // .then(form => {
    //   loadLocalFile(form.fields.file.value)
    //   .then(text => {
    //     console.log("READ TEXT: ", text)
    //   })
    //   // runDPSwithFile(form.fields.file.value, {
    //   //   script: form.fields.script.value,
    //   //   state: {
    //   //     format: "osa"
    //   //   }
    //   // })
    // })
  }

  



  let createNewForm = () => {

      $scope.processing = true;

      let f = {
        metadata: {
          app_name: {value: config.name, required:true, editable:false},
          app_title: {value: config.title, required:true, editable:false},
          app_url: {value: $window.location.href, required:true, editable:false},
          app_icon: {value: config.icon, required:true, editable:false},
          page_title:{value: app.pageConfig().shortTitle, required:true, editable:false},
          title: {value: "Form title...", required:true, editable:true},
          note: {value: "Form note...", required:true, editable:true}
        },
        config:{
          access:{
            type:"any", // ["any","users", "invited"]
            enabled:false,
            users:[]
          },
          questions:[]
        }
      }  
      
      
      $scope.transport
      .createForm(f)
      .then((res) => {
        $scope.widget.form = res.data[0];
        (new APIUser()).invokeAll("formMessage", {action:"configure", data:$scope});
        loadForm()
      })
    }

    let loadForm = $scope.reload = () => {

      $scope.blockMessages = true;
      $scope.transport
      .loadForm($scope.widget.form.id)    
      .then(res => {
        
        $scope.formLoaded = true;
        $scope.widget.form = res.data[0];
        $scope.widget.form.config.access.users = $scope.widget.form.config.access.users || []; 
        
        (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
        
        $scope.metadataTools.prepaire();

        $scope.widgetPanel.allowConfiguring = undefined;
        $scope.widgetPanel.allowCloning = undefined;

// TODO diff modes

        $scope.transport
        .loadAnswer(user,$scope.widget.form.id)
        .then( res => {
          console.log("LOADED ANSWER", res)  
          if(res.data){
            $scope.answer = ( res.data.length == 0)
              ? $scope.answerUtils.create()
              : $scope.answerUtils.normalize(res.data[0]);
            (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
            
          } else {
               $scope.answer = $scope.answerUtils.create();
          }
          
          $scope.processing = false;
          $scope.blockMessages = false;
          $scope.fanButton.state("none")
        })
      })
    }



  let updateWidget = () => {
    if($scope.isDisabled()) return;
    if($scope.globalConfig.designMode){
      if($scope.widget.form){
        $scope.metadataTools.prepaire()
        return  
      }  
    } else {
        loadForm()
        return  
    }
  }    
      
  
  let initQuestion = s => {
    if(!s.widget.ID){
      s.widget.ID = randomID();
      s.widget.formWidget = $scope.widget.instanceName;  
    }
  }


  $scope.$watch("metadataTools.metadata", () => {
    $scope.metadataTools.update()
  }, true)


  $scope.setAccessType = (value) => {
    
    $scope.widget.form.config.access.type = value;
    
    if( value == "invited"){
      $scope.widget.form.config.access.invitationTemplate =
      $scope.widget.form.config.access.invitationTemplate ||  "Dear ${user.name} !\nWe invite you for expert assessments  \"${metadata.title}\"\nSee ${ref(metadata.app_url)}";
      $scope.widget.form.config.access.notificationTemplate =
      $scope.widget.form.config.access.notificationTemplate || "notification Template";
    }
    
    $scope.markModified()
  
  }

  let updateConfig = () => {
    if($scope.widget.form){
      $scope.metadataTools.update();
    // TODO  
    }
  }


  $http
      .get(appUrls.usersList)
      .then(result => { $scope.userUtils = formUserUtils($scope,result.data) })
    
  $scope.$watch("metadata", $scope.markModified, true);

  $scope.saveAnswers = () => {

    $scope.fanButton.state("process")
    
    if(!$scope.widget.form.config.access.enabled){
      
      $info(testMessage($scope), "TEST MODE")
      .then(()=> {
        $scope.fanButton.state("none");    
      })

    } else {


      $scope.blockMessages = true;
    
      let saveFormPromise, saveAnswerPromise;

      if($scope.modified.form){
        saveFormPromise = $q(( resolve, reject ) => {
    
          $scope.modified.form = false;
          $scope.transport
          .extendForm($scope.widget.form)
          .then(() => {
            $scope.transport
            .loadForm($scope.widget.form.id)  
            .then(res => {
              console.log("invokeAll update")
              $scope.formLoaded = true;
              $scope.widget.form = res.data[0];
              
              (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              
              $scope.metadataTools.prepaire();

              (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              
              resolve(true)
            
            })
          })
        })        
      } else {
        saveFormPromise = $q(( resolve, reject) => { resolve(true)})
      }
      
      if($scope.modified.answer){
        saveAnswerPromise = $q(( resolve, reject) => {
          $scope.modified.answer = false;
          $scope.transport
          .updateAnswer($scope.answer)
          .then((res) => {
            $scope.answer = $scope.answerUtils.normalize((angular.isArray(res.data))? res.data[0] : res.data);
            (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
            resolve(true)
          })  
        })
      } else {
        saveAnswerPromise = $q(( resolve, reject ) => { resolve(true)})
      }

      $q.all([saveFormPromise, saveAnswerPromise])
        .then(() => {
          $scope.$evalAsync(() => {
            $scope.fanButton.state("completed")
            $scope.blockMessages = false;  
          },100)
        })    
    }
  }


  let validateFormConfig = (data) => {
    console.log("VALIDATE")
    $scope.fanButton.state("list");
    $scope.fanButton._state.tooltip = 
        `You add new alternative into "${truncString(data.options.title)}" question. Click for save your changes.`
    $scope.modified.form = true;        
  }          

  $scope.fanButton.state("process")



  new APIProvider($scope)
    .config(() => {
      updateWidget()  
    })

    .save(() => {
      $scope.processing = true;
      updateConfig();
      $scope.widget.form.config.questions = {};

      pageWidgets()
        .filter((item) => item.type === "v2.form.question")
        .forEach((item) => {
          $scope.widget.form.config.questions[item.config.id] = item.config;
        })

      // TODO behevior for open access in presentation mode when user add alternatives

      // TODO get all question config and add into $scope.form.config.questions array
      // This is for design mode
      $scope.transport
      .updateForm($scope.widget.form)
      .then(() => {$scope.processing = false;})
    })

    .translate(updateWidget)

    .create((event, widget) => {
        
        if( widget.instanceName == $scope.widget.instanceName){
          let forms = pageWidgets().filter((item) => item.type === "v2.form");
          if(forms.length == 1) {
            if(!widget.form) createNewForm();
          }  
        } 
        
        if(!$scope.isDisabled() && $scope.widget.form && (widget.type == "v2.form.question")){
            initQuestion(scopeFor(widget.instanceName))
        }
    })

    .appReconfig ((c) => {
          // todo
          $scope.widget.form.metadata.app_name.value = config.name;
          $scope.widget.form.metadata.app_title.value = config.title;
          $scope.widget.form.metadata.app_url.value = $window.location.href,
          $scope.widget.form.metadata.app_icon.value = config.icon;
          $scope.widget.form.metadata.page_title.value = app.pageConfig().shortTitle;
          $scope.metadataTools.prepaire();

    })

    .provide('questionMessage', (e, context) => {
      
      if ($scope.blockMessages) {
        console.log("Block MESSAGE FROM QUESTION")
        return;
      }  
      console.log("HANDLE MESSAGE FROM QUESTION", context)
      
        if(context.action == 'init'){
            initQuestion(context.data)
            return
        }

        if(context.action == 'remove'){
            $scope.widget.form.config.questions[context.data.widget.ID]
            return
        }

        if(context.action == "change-answer") {
          if(context.data && context.data.question && $scope.widget.form){
            $scope.answer = $scope.answer || $scope.answerUtils.create()   
            $scope.answer.data[context.data.question] = context.data;
            $scope.answerUtils.validateAnswers();
          }   
        }

        if(context.action == "update-config") {
          if(context.data && context.data.id && $scope.widget.form){
            
            if($scope.widget.form.config.questions){
              
              let newValue = JSON.parse(JSON.stringify(angular.copy(context.data,{})));
              delete newValue.callback;
              
              let oldValue = $scope.widget.form.config.questions[context.data.id];
              
              if( !objectsIsEqual(newValue,oldValue) ){
                $scope.widget.form.config.questions[context.data.id] = newValue;
                validateFormConfig(newValue)  
              }
            } else {
              $scope.widget.form.config.questions = {};
              $scope.widget.form.config.questions[context.data.id] = context.data;
              validateFormConfig(context.data)  
            }
          }   
        }
    })  

    .provide('formMessage', (e, context) => {
        if((context.action == "remove") && ($scope.widget.instanceName != context.data.widget.instanceName)){
            updateWidget()
        }
    })  

    .removal(() => {
      (new APIUser()).invokeAll("formMessage", {action:"remove", data:$scope});
      
      $scope.processing = true;
      if($scope.widget.form){
        $scope.transport
        .deleteForm($scope.widget.form.id)
        .then(() => {$scope.processing = false})  
      }
    });
})




