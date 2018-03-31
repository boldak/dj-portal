import angular from 'angular';
import "./utility/index.js";



let m = angular.module('app.widgets.v2.form', [
  'app', 'app.dps', "oc.lazyLoad", "ngAnimate", "formUtility"
])



m.controller("ToastController", ($scope, APIProvider) => {
  (new APIProvider($scope, true))
    .provide("toast-message", ( e, data ) => {
      $scope.toastData = data;
      $scope.toastData.top = "50px";
    })
})

m.config(($mdToastProvider) => {
  
  $mdToastProvider.addPreset('testPreset', {
    options: function() {
      return {
        template:
          `
          <md-toast style="position:fixed; top:{{toastData.top}};">
            <div class="md-toast-content form-toast" style="color:{{toastData.color}};">
              <md-progress-circular 
                ng-if="toastData.progress"
                class="md-accent"
                style="margin-right:1em;" 
                md-diameter="20px"
              >
              </md-progress-circular>
              <img ng-if="toastData.image"
                src="{{toastData.image}}" class="md-avatar"/>
              <md-icon ng-if="toastData.icon"
                       md-font-icon="{{toastData.icon}}"
                       style="  font-family: FontAwesome; 
                                font-size: 32px;
                                margin-right: 0.25em;
                                color:{{toastData.color}};"
              > 
              </md-icon>  
              {{toastData.message}}
            </div>
          </md-toast>
          `,
        position: "top right",
        // parent: document.getElementById("skin-top"),
        hideDelay: false,
        controller: 'ToastController'

      };
    }
  });
});



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
  formIO,
  formUserUtils,
  formAnswerUtils,
  objectsIsEqual,
  truncString,
  testMessage,
  queryString,
  confirm,
  defaultNotificationTemplate,
  pageURI,
  $translate,
  $mdColors,
  $mdToast,
  formToast,
  $timeout
  
) {


// $mdColors.getThemeColor('primary-600');


// $ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 


// console.log(pageURI)
// console.log("query", queryString(pageURI))
// console.log("access for user", user)

angular.extend($scope, {

  primaryColor: "#f3f3f3",//$mdColors.getThemeColor('primary'),

  accentColor: $mdColors.getThemeColor('accent-500'),

  warnColor: $mdColors.getThemeColor('warn-500'),

  disableColor: "#333",

  showToast: (e) => {
    return $mdToast.show($mdToast.testPreset());
  },

  hideToast: () => { $mdToast.hide() },
  
  APIUser: APIUser,

  timeout: $timeout,

  dialog: dialog,

  pageLocation: $window.location.href,

  queryParams: queryString($window.location.href),
  
  pageWidgets: pageWidgets,

  user: angular.extend({},user),

  $filter: $filter,

  pageConfig: app.pageConfig(),
  
  formatDate: (date) => i18n.formatDate(new Date(date)),

  timeAgo: (date) => i18n.timeAgo(new Date(date)),
  
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

  formToast: formToast($scope),

  transport: formIO($scope,$dps),

  answerUtils: formAnswerUtils($scope),

  defaultNotificationTemplate: defaultNotificationTemplate,

  accessTypes:[
    { type: "any",      title: "For any respondents"      },
    { type: "users",    title: "For logged users"         },
    { type: "invited",  title: "For invited respondents"  }
  ],

  translate : (message) => {
    return $translate('WIDGET.V2.FORM.'+message)
  }

})

console.log("QUERY STRING", pageURI, queryString(pageURI));

$scope.user.apikey = queryString(pageURI).apikey 
// console.log("USER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", $scope.user)


$scope.widgetPanel.allowConfiguring = undefined;
$scope.widgetPanel.allowCloning = undefined;

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

    dialog({
        title:"Import form (OSA format)",
        fields:{
          file:{
            title:"File", 
            type:'file', 
            editable:true, 
            required:true
          },
          encoding:{
            title:"script",
            type:"text",
            editable:true, 
            required:true
          }
        }
    })
    .then(form => {
      // console.log(form.fields.file.value,
      //     form.fields.encoding.value)
      $scope.transport.loadLocalFile(
          form.fields.file.value,
          form.fields.encoding.value
      )
      .then(text => {
        // console.log("READ TEXT: ", text)
      })
      // runDPSwithFile(form.fields.file.value, {
      //   script: form.fields.script.value,
      //   state: {
      //     format: "osa"
      //   }
      // })
    })
  }

  $scope.exportResponses = () => {
    $scope.transport.exportResponses($scope.widget.form.id)
    .then(res => {
      app.save(() => {
        $scope.exportResponseUrl = res.data.url;
        $window.location.href = $dps.getUrl()+$scope.exportResponseUrl  
      })
    })
  }

  $scope.userNotification = () => {
    
    // $scope.transport
      // .updateForm($scope.widget.form)
      // .then(() => {$scope.processing = false;})


    $scope.widget.form.config.access.lastNotificatedAt = new Date();
    saveForm();
    
    if($scope.widget.form.config.access.type != 'invited') return
    dialog({
      title:"Notify Respondents",
      fields:{
       
        subject:{
          title:"Subject",
          type:"text",
          value:$scope.widget.form.config.access.notificationSubject || "DJ-FORM",
          editable:true,
          required:true
        },
        template: {
          title:"Template",
          type:"textarea",
          value:$scope.widget.form.config.access.notificationTemplate || $scope.defaultNotificationTemplate,
          rows:5,
          editable:true,
          required:true
        }
        
      }
    })
    .then(form => {
      
      $scope.widget.form.config.access.notificationTemplate = form.fields.template.value;
      $scope.widget.form.config.access.notificationSubject = form.fields.subject.value;
      $scope.widget.form.config.access.notiificator = "wdc.kpi.team@gmail.com";
      $scope.widget.form.config.access.lastNotificatedAt = new Date();
      $scope.widget.form.config.access.users = 
        $scope.widget.form.config.access.users.map( item => 
          angular.extend(item,{notifiedAt:new Date()})
        )
      
      $scope.transport.sendMails()
        .then(res => {
          console.log(res)
        }) 


    })
  }

  $scope.changeAccess = () => {
    // console.log("change access", $scope.widget.form.config.access.type)
    $scope.widget.form.config.access.enabled = !$scope.widget.form.config.access.enabled;
    
    saveForm();


    if($scope.widget.form.config.access.type == 'invited') $scope.userNotification();
  
  }

  // $scope.$watch(widget.config.access.enabled, userNotification)
  
  let cloneForm = $scope.cloneForm = () => {
    $scope.transport
      .cloneForm($scope.widget.form)
      .then((res) => {
        $scope.widget.form = res.data[0];
        (new APIUser()).invokeAll("formMessage", {action:"configure", data:$scope});
        loadForm()
      })
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

    let loadResponseStat = (formId) => {
      $scope.transport.loadResponseStat(formId)
      .then(res => {
        $scope.responsesStat = res.data;
        // (new APIUser()).invokeAll("formMessage", {action:"responseStat", data:res.data});
        if($scope.responsesStat){
          let dyna = $scope.responsesStat.filter(item => item)
          dyna.push({date: new Date(), v:1})
          $scope.responseDynamic = $scope.answerUtils.getResponseDynamic(dyna);
        }

        // console.log("responseSTAT",$scope.answerUtils.getResponseDynamic(dyna));
      })
    }

    let loadAllResponses = (formId) => {
      $scope.transport.loadAllResponses(formId)
      .then(res => {
        if(res.type != "error"){
          (new APIUser()).invokeAll("formMessage", {action:"responseStat", data:res.data});
        }
      })
    }


    let accessIsAlowed =  () => {
        // console.log("CHECK ACCESS FOR", angular.extend({},$scope.user), $scope.widget.form.config.access)
        
        if($scope.widget.form.config.access.type != 'any'){
          if(!$scope.user.id && $scope.user.apikey){
            let index = $scope.widget.form.config.access.users.map(item => item.apikey).indexOf($scope.user.apikey)
            if(index >= 0){
              angular.extend($scope.user,$scope.widget.form.config.access.users[index]) 
            }  
          }
        }  

       if( $scope.widget.form.config.access.enabled && $scope.widget.form.config.access.type == "users"){
          if(!$scope.user.id){
            $scope.formToast.show({
              state: "disabled",
              message: "Only users can access to form.",
              color: $scope.warnColor,
              icon: "fa-times-circle",
              notInterrupted: true,
              delay:5000
            })
            return false;
          }
        }


        if( $scope.widget.form.config.access.enabled && $scope.widget.form.config.access.type == "invited"){
          if(!$scope.widget.form.config.access.users){
            $scope.formToast.show({
              state: "disabled",
              message: "Only invited respondents can access to form.",
              color: $scope.warnColor,
              icon: "fa-times-circle",
              notInterrupted: true,
              delay:5000
            })
            return false;
          }
          let u = $scope.widget.form.config.access.users.filter(item => {
            if(item.id && $scope.user.id ) return item.id == $scope.user.id;
            if(item.apikey && $scope.user.apikey ) return item.apikey == $scope.user.apikey;
            return false
          })
          if(u.length == 0){
            $scope.formToast.show({
              state: "disabled",
              message: "Only invited respondents can access to form.",
              color: $scope.warnColor,
              icon: "fa-times-circle",
              notInterrupted: true,
              delay:5000
            })
            return false;
          }
        }

        if( !$scope.widget.form.config.access.enabled && !$scope.user.isOwner && !$scope.user.isCollaborator ){
            
            $scope.formToast.show({
              state: "disabled",
              message: "The form is closed.",
              color: $scope.warnColor,
              icon: "fa-times-circle",
              notInterrupted: true,
              delay:5000
            })
            return false;
        }

        $scope.formToast.show({
              state: "success",
              message: `Respondent ${($scope.user.name) ? $scope.user.name : $scope.user.email } is logged`,
              color: $scope.primaryColor,
              icon: ($scope.user.photo) ? undefined : "fa-user-circle",
              image: ($scope.user.photo) ? $scope.user.photo : undefined,
              notInterrupted: true,
              delay:5000
            })
        return true;
    }

    let loadForm = $scope.reload = () => {

      $scope.blockMessages = true;

      $scope.formToast.show({
              state: "process",
              message: `Load form...`,
              color: $scope.primaryColor,
              progress:true,
              delay:3000
            })



      $scope.transport
      .loadForm($scope.widget.form.id)    
      .then(res => {

        loadAllResponses($scope.widget.form.id)  
        
        let availableAccess = accessIsAlowed();
        
        if( availableAccess == true ){
          (new APIUser()).invokeAll("formMessage", {action:"show"});
        }  

        $scope.formLoaded = true;
        $scope.widget.form = res.data[0];
        
        $scope.widget.form.config.access.users = $scope.widget.form.config.access.users || [];
        $scope.widget.form.config.questions = $scope.widget.form.config.questions || {};  
        
        (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
        
        $scope.metadataTools.prepaire();

        $scope.widgetPanel.allowConfiguring = undefined;
        $scope.widgetPanel.allowCloning = undefined;


        if ($scope.widget.form.config.access.type == "any") {
          $scope.answer = $scope.answerUtils.create()
          $scope.processing = false;
          $scope.blockMessages = false;
          
          $scope.formToast.show({
              state: "none",
              message: `Prepare form...`,
              color: $scope.primaryColor,
              progress:true,
              delay:1000
            })

        } else {
            if (      $scope.widget.form.config.access.type == "users" 
                  ||  $scope.widget.form.config.access.type == "invited") {
              $scope.transport
                .loadAnswer($scope.user,$scope.widget.form.id)
                .then( res => {
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

                  if( availableAccess == true ){
                    $scope.formToast.show({
                      state: "none",
                      message: `Prepare form...`,
                      color: $scope.primaryColor,
                      progress:true,
                      delay:1000
                    })
                  }  
              })
            }
        }        
      })
    }



  let updateWidget = () => {
    if($scope.isDisabled()) return;
    if($scope.globalConfig.designMode){
      if($scope.widget.form){
        $scope.metadataTools.prepaire()
        loadResponseStat($scope.widget.form.id)
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
    $scope.markModified()
  
  }

  let updateConfig = () => {
    if($scope.widget.form){
      $scope.metadataTools.update();
    }
  }


  $http
      .get(appUrls.usersList)
      .then(result => { $scope.userUtils = formUserUtils($scope,result.data) })
    
  $scope.$watch("metadata", $scope.markModified, true);

  $scope.saveAnswers = () => {
    console.log("SAVE ANSWERS", $scope.formToast)

    if(["none", "disabled"].indexOf($scope.formToast.state) >= 0) return;
    
    $scope.formToast.show({
              state: "process",
              message: `Save responses...`,
              color: $scope.primaryColor,
              progress:true,
              delay:3000
            })


    if(!$scope.widget.form.config.access.enabled){
      
      $info(testMessage($scope), "The form is started in test mode")
      // .then(()=> {
      //   $scope.formToast.state("none");    
      // })

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
              // console.log("invokeAll update")
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
        saveFormPromise = $q(( resolve, reject) => { 
          $scope.transport
            .loadForm($scope.widget.form.id)  
            .then(res => {

              $scope.widget.form = res.data[0];
              (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              $scope.metadataTools.prepaire();
              (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              resolve(true)
            })
          resolve(true)
        })
      }
      
      if($scope.modified.answer){
        saveAnswerPromise = $q(( resolve, reject) => {
          $scope.modified.answer = false;
          $scope.transport
            .loadForm($scope.widget.form.id)  
            .then(res => {
              $scope.widget.form = res.data[0];
              (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              $scope.metadataTools.prepaire();
              (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              $scope.transport
              .updateAnswer($scope.answer)
              .then((res) => {
                $scope.answer = $scope.answerUtils.normalize((angular.isArray(res.data))? res.data[0] : res.data);
                (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
                resolve(true)
              })
            })    
        })
      } else {
        saveAnswerPromise = $q(( resolve, reject ) => { 
          $scope.transport
            .loadForm($scope.widget.form.id)  
            .then(res => {
              $scope.widget.form = res.data[0];
              (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              $scope.metadataTools.prepaire();
              (new APIUser()).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              resolve(true)
            })  
        })
      }

      $q.all([saveFormPromise, saveAnswerPromise])
        .then(() => {
          loadAllResponses($scope.widget.form.id)
          $scope.$evalAsync(() => {
            $scope.formToast.show({
              state: "completed",
              message: `Changes saved successfully!`,
              color: $scope.primaryColor,
              icon: "fa-check",
              delay:3000
            })
            $scope.blockMessages = false;  
            app.unmarkModified();
          },100)
        })    
    }
  }


  let validateFormConfig = (data) => {
    // console.log("VALIDATE")
    $scope.formToast.show({
              state: "list",
              message: `You added an alternative to the "${truncString(data.options.title)}" question. Click to save changes.`,
              color: $scope.warnColor,
              icon: "fa-pencil",
              delay:3000
            })
    $scope.modified.form = true;        
  }          

  // // $scope.fanButton.state("process")

  let saveForm =  () => {
      $scope.processing = true;
      updateConfig();
      $scope.widget.form.config.questions = {};

      pageWidgets()
        .filter((item) => item.type === "v2.form.question")
        .forEach((item) => {
          $scope.widget.form.config.questions[item.config.id] = item.config;
        })

      $scope.transport
      .updateForm($scope.widget.form)
      .then(() => {$scope.processing = false;})
  }

  new APIProvider($scope)
    .config(() => {
      updateWidget()  
    })

    .save(saveForm)

    // .translate(updateWidget)

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
        // console.log("Block MESSAGE FROM QUESTION")
        return;
      } 

      // console.log("HANDLE MESSAGE FROM QUESTION", context)
      
        if(context.action == 'init'){
            initQuestion(context.data)
            return
        }

        if(context.action == 'remove'){
            // console.log('remove',$scope.widget.form.config.questions[context.data.widget.ID])
            $scope.widget.form.config.questions[context.data.widget.ID] = undefined;
            return
        }

        if(context.action == "change-answer") {
          if(context.data && context.data.question && $scope.widget.form){
            $scope.answer = $scope.answer || $scope.answerUtils.create()   
            $scope.answer.data[context.data.question] = context.data;
            $scope.answerUtils.validateAnswers();
          }  
          return 
        }

        if(context.action == "add-alternative") {
          if(context.data){
            validateFormConfig(context.data)  
          }
          return
        }


        if(context.action == "update-config") {
          if(context.data && context.data.id && $scope.widget.form){
            
            if($scope.widget.form.config.questions){
              
              let newValue = angular.extend({},context.data);
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

    .beforePresentationMode(() => {
      // console.log("beforePresentationMode")
      saveForm();

    })  

    .provide('formMessage', (e, context) => {
        if((context.action == "remove") && ($scope.widget.instanceName != context.data.widget.instanceName)){
            updateWidget()
        }
    })  

    .provide("formSubmit", () => {
      // console.log("formSubmit")
      $scope.saveAnswers()
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




