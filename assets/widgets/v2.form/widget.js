import angular from 'angular';
import "./utility/index.js";



let m = angular.module('app.widgets.v2.form', [
  'app', 'app.dps', "oc.lazyLoad", "ngAnimate", "formUtility", 'app.i18n'
])



m.controller('FormController', function(
  $scope,
  APIProvider,
  APIUser,
  EventEmitter,
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
  $timeout,
  $sce,
  $mdDialog,
  mdConfirm,
  mdAlert,
  mdSplash,
  mdDialog,
  logIn,
  widgetManager
  
) {



angular.extend($scope, {

  appUrls: appUrls,

  http: $http,
  
  __script:'',

  getEditorTemplate : () => $scope.__script,

  templateEditorOptions: {
    mode:'html', 
    theme:'tomorrow',
    onChange: e => { $scope.__script = e[1].getSession().getValue() }
  },


  primaryColor: $mdColors.getThemeColor('primary'),

  accentColor: $mdColors.getThemeColor('accent-500'),

  warnColor: $mdColors.getThemeColor('warn-500'),

  disableColor: "#333",

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

  i18n: i18n,
  
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


$scope.userUtils  = formUserUtils($scope);


$scope.updateMessagePreview = () => {
    
    if(     !$scope.widget
        ||  !$scope.widget.form
        ||  !$scope.widget.form.config 
        ||  !$scope.widget.form.config.access
        ||  !$scope.widget.form.config.access.users
    ) return;    
    
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
      
    let u;
    
    if( $scope.widget.form.config.access.users.length > 0 ){

      let l = $scope.widget.form.config.access.users.filter((item => item.selected))

      if(l.length > 0){

        u =l[0];

      } else {

        u = $scope.widget.form.config.access.users[0];

      }
    } else {

      u = {
        name: "User Name Example",
        email: 'user@example.com' ,
        apikey:'apikey'
      }

    }

    try {
      $scope.messagePreview = $sce.trustAsHtml(_.template($scope.getEditorTemplate())($scope.transport.prepareContext(u)))
    } catch (e) {
      $scope.messagePreview = $sce.trustAsHtml('<span style="color:{{warnColor}}">Preview is not available</span>');
    }
    
    
    
    _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
    
  }

if($scope.globalConfig.designMode){
  
  $scope.$watch('__script', $scope.updateMessagePreview)

}

console.log("QUERY STRING", pageURI, queryString(pageURI));

$scope.user.apikey = queryString(pageURI).apikey 


$scope.widgetPanel.allowConfiguring = undefined;
$scope.widgetPanel.allowCloning = undefined;

let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);


let updateID = object => {
  return _.fromPairs(_.toPairs(object).map(item => {
            item[1].oldId = item[0];
            return [randomID(),item[1]]
          }))
} 

  $scope.openImportDialog = () => {
    // mdDialog({
    dialog({  
        title:"Import form",
        fields:{
          file:{
            title:"File", 
            type:'file', 
            editable:true, 
            required:true
          }
        }
    })
    .then(form => {
      // console.log("IMPORT ", form.fields.file)
      $scope.transport.loadLocalFile(
          form.fields.file.value,
          "utf-u"
      )
      .then(text => {
        let importedForm = JSON.parse(text);
        // console.log("FORM", importedForm)
        importedForm.config.questions = updateID(
          _.fromPairs(
            _.toPairs(importedForm.config.questions)
              .map( q => {
                if(q[1].options.entities){
                  q[1].options.entities = updateID(q[1].options.entities)
                }
                if(q[1].options.properties){
                  q[1].options.properties = updateID(q[1].options.properties)
                }
                if(q[1].options.nominals){
                  q[1].options.nominals = updateID(q[1].options.nominals)
                }

                if(q[1].options.disables){
                  q[1].options.disables = _.fromPairs(
                    _.toPairs(q[1].options.disables)
                        .map( ds => {
                          ds[0] = _.findKey(q[1].options.entities,{ oldId:ds[0] })
                          ds[1] = _.fromPairs(
                             _.toPairs(ds[1])
                             .map( d => {
                                d[0] = _.findKey(q[1].options.properties, { oldId:d[0] })
                                return [d[0],d[1]]
                             })   
                          )
                          return [ds[0],ds[1]]
                        })
                  )
                }

                return [q[0], q[1]]
              })
          )
        )    


        let updatedForm = angular.extend({}, $scope.widget.form)
        updatedForm.config.questions = updatedForm.config.questions || {};
        updatedForm.config.questions = angular.extend(updatedForm.config.questions, importedForm.config.questions)


        $scope.widget.form = updatedForm;

        _.toPairs(importedForm.config.questions)
                        .forEach( w => {
                           widgetManager
                            .addWidget(widgetManager.getParentHolder($scope.widget.instanceName),"v2.form.question")
                            .then( widgetScope => {
                              // console.log(widgetScope)
                              widgetScope.widget.ID = w[0]

                              $timeout( () => {
                                 // widgetScope.widget.updateDirect({data:$scope.widget.form})
                                 (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
                              }, 100)
                            }) 
                        })

       
        
        // let promises = _.toPairs(importedForm.config.questions)
        //                 .map( w => {
        //                    return widgetManager
        //                     .addWidget(widgetManager.getParentHolder($scope.widget.instanceName),"v2.form.question")
        //                     .then( widgetScope => {
        //                       widgetScope.widget.ID = w[0]
        //                       return widgetScope;
        //                     }) 
        //                 })
        
        
        // // saveForm();

        // $q.all(promises)
        //   .then( (res) => {
        //     console.log("All Promises Resolved")
        //     $timeout( () => {
        //       // $scope.widget.form = updatedForm;
        //       (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
        //       // $scope.metadataTools.prepaire();
        //       // (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
        //     }, 100)

        //   })

      })
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

  $scope.exportForm = () => {
    $scope.transport
      .loadForm($scope.widget.form.id)    
      .then(res => {
            let a = document.createElement('a');
            a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(res.data[0],null,'\t')));
            a.setAttribute('download', 'form_'+$scope.widget.form.id+"_"+moment().format('YYYY_MM_DD_HH_mm')+'_config.json');
            a.click()
      })      
  }

  $scope.userNotification = () => {
    

    $scope.widget.form.config.access.notificationTemplate = $scope.getEditorTemplate();
    
    $scope.widget.form.config.access.lastNotificatedAt = new Date();
    $scope.widget.form.config.access.users = 
        $scope.widget.form.config.access.users.map( item => 
          angular.extend(item,{notifiedAt:new Date()})
        )
      
    $scope.transport.sendMails().then(res => {})
    
    saveForm();
  }

  $scope.changeAccess = () => { 
    $scope.widget.form.config.access.lastNotificatedAt = new Date();
    saveForm() 
  }

  
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
          locale: i18n.locale(),
          access:{
            type:"any", // ["any","users", "invited"]
            enabled:false,
            users:[],
            notificationTemplate: defaultNotificationTemplate,
            notificationSubject: "JD-FORMS"
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
        if($scope.responsesStat){
          let dyna = $scope.responsesStat.filter(item => item)
          dyna.push({date: new Date(), v:1})
          $scope.responseDynamic = $scope.answerUtils.getResponseDynamic(dyna);
        }
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

        let _invited;

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
            
            mdConfirm({
              title: $translate.instant('WIDGET.V2.FORM.ACCESS_FOR_LOGGED_USERS'),
              icon: 'fa-exclamation-circle',
              class: 'md-accent',
              textContent: $translate.instant('WIDGET.V2.FORM.IF_YOU_NEED'),
              ok: $translate.instant('WIDGET.V2.FORM.LOGIN_WITH_GOOGLE'),
              cancel: $translate.instant('WIDGET.V2.FORM.CANCEL')
            }).then(function() {
                  app.unmarkModified();
                  logIn();
                }, function() {}
              );

            return false;
          }
        }


        if( $scope.widget.form.config.access.enabled && $scope.widget.form.config.access.type == "invited"){
          if(!$scope.widget.form.config.access.users){

            mdAlert({
              title: $translate.instant('WIDGET.V2.FORM.ACCESS_IS_DENIED'),
              icon: 'fa-times-circle',
              class: 'md-warn',
              textContent: $translate.instant('WIDGET.V2.FORM.ONLY_INVITED'),
              ok: $translate.instant('WIDGET.V2.FORM.CLOSE')
            })

            return false;
          }

          let u = $scope.widget.form.config.access.users.filter(item => {
            if(item.id && $scope.user.id ) return item.id == $scope.user.id;
            if(item.apikey && $scope.user.apikey ) return item.apikey == $scope.user.apikey;
            return false
          })

          if( u.length == 0 ) {
            
            mdAlert({
              title: $translate.instant('WIDGET.V2.FORM.ACCESS_IS_DENIED'),
              icon: 'fa-times-circle',
              class: 'md-warn',
              textContent: $translate.instant('WIDGET.V2.FORM.ONLY_INVITED'),
              ok: $translate.instant('WIDGET.V2.FORM.CLOSE')
            })
            return false;
          } else {
             _invited = angular.extend({}, u[0])
          }
        }

        if( !$scope.widget.form.config.access.enabled && !$scope.user.isOwner && !$scope.user.isCollaborator ){
            
            mdAlert({
              title: $translate.instant('WIDGET.V2.FORM.ACCESS_IS_DENIED'),
              icon: 'fa-times-circle',
              class: 'md-warn',
              textContent: $translate.instant('WIDGET.V2.FORM.FORM_IS_CLOSED'),
              ok: $translate.instant('WIDGET.V2.FORM.CLOSE')
            })

            return false;
        }

        (new APIUser($scope)).invokeAll("formMessage", {action:"login", data: (_invited || $scope.user)});
        return true;
    }

    let loadForm = $scope.reload = () => {

      $scope.blockMessages = true;

      $scope.transport
      .loadForm($scope.widget.form.id)    
      .then(res => {


        loadAllResponses($scope.widget.form.id)  
        
        let availableAccess = accessIsAlowed();

        $scope.widget.form.config.access.notificationTemplate = $scope.widget.form.config.access.notificationTemplate || $scope.defaultNotificationTemplate;
        $scope.widget.form.config.access.notificationSubject = $scope.widget.form.config.access.notificationSubject || "DJ-FORM";




        if( availableAccess == true ){
          (new APIUser($scope)).invokeAll("formMessage", {action:"show"});
        }  

        $scope.formLoaded = true;
        $scope.widget.form = res.data[0];
        
        $scope.widget.form.config.access.users = $scope.widget.form.config.access.users || [];
        $scope.widget.form.config.questions = $scope.widget.form.config.questions || {};  
        
        $scope.widget.form.config.locale = $scope.widget.form.config.locale || i18n.locale();
        
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", $scope.widget.form.config.locale, i18n.locale())
        // if($scope.widget.form.config.locale != i18n.locale()){
          // console.log(angular.extend({},i18n))
          i18n.setLocale($scope.widget.form.config.locale)
        // }

        $scope.$evalAsync(() => {
          (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});  
        })
        
        
        $scope.metadataTools.prepaire();

        $scope.widgetPanel.allowConfiguring = undefined;
        $scope.widgetPanel.allowCloning = undefined;


        if ($scope.widget.form.config.access.type == "any") {
          
          $scope.answer = $scope.answerUtils.create()
          $scope.processing = false;
          $scope.blockMessages = false;
          
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
                    
                    (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
                    
                  } else {
                       
                       $scope.answer = $scope.answerUtils.create();
                  
                  }

                  $scope.processing = false;
                  $scope.blockMessages = false;
                    
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
        loadAllResponses($scope.widget.form.id)
        $scope.$evalAsync(() => {
          (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});  
        })
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
      (new APIUser($scope)).invokeAll("formMessage", {action:"update-config"})

      $scope.widget.form.config.questions = {};

      pageWidgets()
        .filter(item => item.type === "v2.form.question")
        .filter(item => item.config)
        .forEach(item => {
          $scope.widget.form.config.questions[item.config.id] = item.config;
        })
    }
  }


 
    
  $scope.$watch("metadata", $scope.markModified, true);

  let getResponseValidatiion = () => {
     
     let responseValidationList = 
        _.toPairs($scope.answer.data)
         .filter(item => item[1].validationResult)
         .map(item => {
          return item[1]
         })

     console.log("RESPONSE", $scope.answer.data)
    
     if(responseValidationList.length > 0){
        
        let formValid = {valid:true , messages:[]};
        
        responseValidationList.forEach(( item ) => {
            console.log("VALIDATE", item)
            formValid.valid = formValid.valid && item.valid && item.validationResult.valid,
            formValid.messages.push((item.validationResult.message) ? `<li>${item.validationResult.message}</li>` : '')
        })

        return formValid;
     }    
     
     return {
          valid: true,
          messages: []
     }     
  
  }

  $scope.saveAnswers = () => {
    let formValidation = getResponseValidatiion();
    if(formValidation.valid){
      $scope.doSaveAnswers()
      return
    }

    mdConfirm({
              title: $translate.instant('WIDGET.V2.FORM.RESPONSE_NOT_COMPLETED'),
              icon: 'fa-exclamation-circle',
              class: 'md-accent',
              htmlContent: `<ol>${formValidation.messages.join("\n")}</ol><p>
                  ${$translate.instant('WIDGET.V2.FORM.CAN_SAVE')}</p>`,
              ok: $translate.instant('WIDGET.V2.FORM.SAVE_RESPONSES'),
              cancel: $translate.instant('WIDGET.V2.FORM.CONTINUE')
            }).then(function() {
                  $scope.doSaveAnswers()
                }, function() {}
              );
  }

  $scope.doSaveAnswers = () => {
    
    if(!$scope.widget.form.config.access.enabled){
      
      mdAlert({
              title: 'The form is started in test mode',
              icon: 'fa-exclamation-circle',
              class: 'md-primary',
              htmlContent: `<pre> ${testMessage($scope)} </pre>`,
              ok: 'Continue'
            })
  
    } else {


      $scope.blockMessages = true;
    
      let saveFormPromise, saveAnswerPromise;

      if($scope.modified.form){
        saveFormPromise = $q(( resolve, reject ) => {
          updateConfig();
          $scope.modified.form = false;
          $scope.transport
          .extendForm($scope.widget.form)
          .then(() => {
            $scope.transport
            .loadForm($scope.widget.form.id)  
            .then(res => {
              $scope.formLoaded = true;
              $scope.widget.form = res.data[0];
              
              (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              
              $scope.metadataTools.prepaire();

              (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              
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
              (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              $scope.metadataTools.prepaire();
              (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
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
              (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              $scope.metadataTools.prepaire();
              (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              $scope.transport
              .updateAnswer($scope.answer)
              .then((res) => {
                $scope.answer = $scope.answerUtils.normalize((angular.isArray(res.data))? res.data[0] : res.data);
                (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
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
              (new APIUser($scope)).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
              $scope.metadataTools.prepaire();
              (new APIUser($scope)).invokeAll("formMessage", {action:"set-answer", data:$scope.answer});
              resolve(true)
            })  
        })
      }

      $q.all([saveFormPromise, saveAnswerPromise])
        .then(() => {
          loadAllResponses($scope.widget.form.id)
          $scope.$evalAsync(() => {
            $scope.blockMessages = false;  
            app.unmarkModified();
          },100)
        })    
    }
  }


  let validateFormConfig = (data) => {
    $scope.modified.form = true;        
  }          

 
  let saveForm =  () => {
      $scope.processing = true;
      updateConfig();
      $scope.widget.form.config.access.notificationTemplate = $scope.getEditorTemplate();
      // $scope.widget.form.config.questions = {};

      // pageWidgets()
      //   .filter((item) => item.type === "v2.form.question")
      //   .forEach((item) => {
      //     $scope.widget.form.config.questions[item.config.id] = item.config;
      //   })

      $scope.transport
        .updateForm($scope.widget.form)
        .then(() => {$scope.processing = false;})
  }

  new APIProvider($scope)

    .config( updateWidget )
    .save( saveForm )

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
          $scope.widget.form.metadata.app_name.value = config.name;
          $scope.widget.form.metadata.app_title.value = config.title;
          $scope.widget.form.metadata.app_url.value = $window.location.href,
          $scope.widget.form.metadata.app_icon.value = config.icon;
          $scope.widget.form.metadata.page_title.value = app.pageConfig().shortTitle;
          $scope.metadataTools.prepaire();

    })

    .provide('questionMessage', (e, context) => {
      
      if ($scope.blockMessages) return;
      
      
        if(context.action == 'init'){
            initQuestion(context.data)
            return
        }

        if(context.action == 'remove'){
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

    // .beforePresentationMode( saveForm )  

    .provide('formMessage', (e, context) => {
        if((context.action == "remove") && ($scope.widget.instanceName != context.data.widget.instanceName)){
            updateWidget()
        }
    })  

    .provide( "formSubmit", $scope.saveAnswers )
    

    .removal(() => {
      (new APIUser($scope)).invokeAll("formMessage", {action:"remove", data:$scope});
      
      $scope.processing = true;
      if($scope.widget.form){
        $scope.transport
        .deleteForm($scope.widget.form.id)
        .then(() => {$scope.processing = false})  
      }
    });
})




