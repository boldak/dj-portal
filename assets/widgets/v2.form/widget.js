import angular from 'angular';

let m = angular.module('app.widgets.v2.form', [
  'app.dps', "oc.lazyLoad", "ngAnimate"
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
  parentHolder
) {





let emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

$ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 


$scope.pageConfig = app.pageConfig();

$scope.formatDate = (date) => i18n.formatDate(date);

$scope.modified = {
  form:false,
  answer:false
} 

$scope.textFields = {
  key:undefined,
  value:undefined,
  userEmail:undefined
}

let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);

// operation process indicator

$scope.processing = false;

  let dps = {

    createForm: `
            // createForm 
            client();
            set("owner")
            <?javascript
                $scope.form = {
                    metadata: $scope.form.metadata,
                    config: $scope.form.config,
                    owner:$scope.owner.client.user,
                    history:[
                        {
                            state:"created",
                            message:"Create form via "+$scope.owner.client.app,
                            user: $scope.owner.client.user,
                            date: new Date()
                        }
                    ]
                }
            ?>
            dml.insert(into:"form", values:{{form}})
        `,

    updateForm: `
        // updateForm
            client();
            set("owner")

            <?javascript

                $scope.updatedForm = (item) => item.id == $scope.form.id;
                $scope.update = (item) => {
                    
                    // $scope.form.history.push({
                    //     date: new Date(),
                    //     message:"Update form",
                    //     state:"updated",
                    //     user: $scope.owner.client.user
                    // });
                    
                    return $scope.form;
                };

            ?>

            dml.update(for:"form", as:{{update}}, where:{{updatedForm}})
        `,

    getForm: `
            // getForm
            <?javascript
                $scope.filter = (item) => item.id == $scope.form;
            ?>

            dml.select(from:"form", where:{{filter}}, populate:"project")
        `,

    deleteForm:`
            // deleteForm
            <?javascript
                $scope.filter = (item) => item.id == $scope.form;
            ?>

            dml.delete(from:"form", where:{{filter}})
    `,

    updateAnswer:`
            // updateAnswer
            dml.insertOrUpdate(into:"answer", value:{{answer}})
    `


  }

  let runDPS = (params) => {

    let script = params.script;
    let storage = params.state;

    let state = {
      storage: storage,
      locale: i18n.locale()
    }

    return $dps.post("/api/script", {
        "script": script,
        "state": state
      })
      .then(function(response) {
        return {
          type: response.data.type,
          data: response.data.data
        }
      })
  }

  let runDPSwithFile = (file, params) => {

    let script = params.script;
    let storage = params.state;

    let state = {
      storage: storage,
      locale: i18n.locale()
    }

    return $dps.postWithFile("/api/script", file, {
        "script": script,
        "state": state
      })
      .then(function(response) {
        return {
          type: response.data.type,
          data: response.data.data
        }
      })
  }

  let loadLocalFile = (file) => {
    console.log("READ ", file)
    return $q((resolve,reject) => {
      let fr = new FileReader();
      fr.onload = (e) => {
        resolve(e.target.result)
      }
      fr.readAsText(file);  
    })
  }

  $scope.openImportDialog = () => {
// --------------           NO DELETE this code !!! -----------------------------

    let w ={
      "type": "v2.form.question",
      "instanceName": "ugikzklbrq__________",
      "initPhase": false,
      "icon": "/widgets/v2.form.question/icon.png",
      "disabled": false,
      "ID": "h9rnwb1eb6d___",
      "formWidget": "5uwtc89q6gm",
      "config": {
        "type": {
          "value": "check",
          "title": "Many of many"
        },
        "widget": {
          "css": "fa fa-check-square",
          "view": "./widgets/v2.form.question/partitions/check.view.html",
          "options": "./widgets/v2.form.question/partitions/check.options.html"
        },
        "options": {
          "required": false,
          "addEnabled": true,
          "showUserInfo": true,
          "title": "Many of many",
          "note": "Many of many",
          "nominals": {
            "sqla9ua6kzh": {
              "title": "New item"
            },
            "cqxqyr2k4bu": {
              "title": "New item"
            }
          }
        },
        "callback": {},
        "id": "h9rnwb1eb6d___"
      }
    }
     parentHolder($scope.widget).widgets.push(w)

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
      
      

      runDPS({
        script: dps.createForm,
        state: {
          form: f
        }
      })
      .then((res) => {
        $scope.widget.form = res.data[0];
        (new APIUser()).invokeAll("formMessage", {action:"configure", data:$scope});
        loadForm()
      })
    }

    let loadForm = () => {
      runDPS({
        script: dps.getForm,
        state: {
          form: $scope.widget.form.id
        }  
      })
      .then(res => {
        $scope.processing = false;
        $scope.formLoaded = true;
        $scope.widget.form = res.data[0];
        $scope.widget.form.config.access.users = $scope.widget.form.config.access.users || []; 
        
        (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
        
        $scope.metadataTools.prepaire();

        $scope.widgetPanel.allowConfiguring = undefined;
        $scope.widgetPanel.allowCloning = undefined;

          // todo for all modes
          $scope.answer = {
            form: $scope.widget.form.id,
            user: user,
            data: {}
          }

          _.toPairs($scope.widget.form.config.questions)
            .forEach(item => {
              $scope.answer.data[item[0]] = {valid: false}
            })


        })
    }


  $scope.isDisabled = () => {
    let forms = pageWidgets().filter((item) => item.type === "v2.form");
    return (forms.length > 1) && (!$scope.widget.form);
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

 
  $scope.metadataTools = {
    
    metadata:[],

    prepaire: () => {
      $scope.metadataTools.metadata = _.toPairs($scope.widget.form.metadata)
                          .map(item => {
                            return {
                              key:item[0],
                              value:item[1].value,
                              required:item[1].required,
                              editable: item[1].editable
                            }
                          })
    },

    valid: () => {
      if(!$scope.textFields.key) return false;
      return $scope.metadataTools.metadata.map(item => item.key).indexOf($scope.textFields.key) < 0
    },

    add: (key, value) => {
      $scope.metadataTools.metadata.push({
          key: key,
          value: value,
          required: false,
          editable: true
      })
      $scope.textFields.key = undefined;
      $scope.textFields.value = undefined;
    },

    delete: (key) => {
      let index = $scope.metadataTools.metadata.map(item => item.key).indexOf(key);
      $scope.metadataTools.metadata.splice(index,1)
    },

    update: () => {
      if($scope.widget.form){
        $scope.widget.form.metadata = {}
        $scope.metadataTools.metadata.forEach((item) => {
          $scope.widget.form.metadata[item.key] = item
        })  
      }
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

  $scope.markModified = () => {
    updateConfig();
    app.markModified();
  } 

    $http
      .get(appUrls.usersList)
      .then(result => { $scope.userList = result.data})
    
    $scope.getUsers = (filterValue) => {
     
      return $q((resolve,reject) => {
          let result = $scope.userList
            .filter(user =>
              $scope.widget.form.config.access.users.map(item => item.email).indexOf(user.email)<0
            )
            .filter(user =>
              user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
              user.email.toLowerCase().includes(filterValue.toLowerCase())
            )
            .slice(0, 8)
          resolve(result)  
      })    
    };


  $scope.invitedUserAdd = null;

  $scope.alreadyInvited = (value) => {

    if(!value){
      $scope.userIsInvited = false;
      return 
    } 
    
    if (angular.isString(value)){
      $scope.userIsInvited = $scope.widget.form.config.access.users.map(item => item.email).indexOf(value) >= 0;      
      return 
    }
    
    if(angular.isDefined(value.email)){
      $scope.userIsInvited = $scope.widget.form.config.access.users.map(item => item.email).indexOf(value.email) >= 0;      
      return 
    }

    $scope.userIsInvited = false;
  } 

  $scope.validInvitedUser = (value) => {
    
    $scope.alreadyInvited(value);

    if(!value){
      $scope.invitedUserIsValid = false;
      return 
    } 
    
    if (angular.isString(value)){
      value = value.trim();
      let t = emailRegex.test(value);
      if(t){
        $scope.invitedUserAdd = value
      }
      $scope.invitedUserIsValid = t;
      return 
    }
    
    if(angular.isDefined(value.email)){
      $scope.invitedUserAdd = value;
      $scope.invitedUserIsValid = true;
      return 
    }

    $scope.invitedUserIsValid = false; 
  }

  $scope.addInvitedUser = () => {
    $scope.widget.form.config.access.users = $scope.widget.form.config.access.users || [];
    if(angular.isString($scope.invitedUserAdd)){
      $scope.widget.form.config.access.users.push({email:$scope.invitedUserAdd}) 
    } else {
      $scope.widget.form.config.access.users.push($scope.invitedUserAdd)
    }
    $scope.invitedUserAdd = undefined;
    $scope.invitedUser = undefined;
    $scope.invitedUserIsValid = false; 
  }

  $scope.deleteInvitedUser = email => {
    let index = $scope.widget.form.config.access.users.map(item => item.email).indexOf(email)
    if( index >= 0 ){
      $scope.widget.form.config.access.users.splice(index,1)
    }
  }

  $scope.$watch("metadata", $scope.markModified, true);

  $scope.saveAnswers = () => {
    if($scope.modified.form){
      $scope.fanButton.state("process")
      console.log("SAVE FORM", $scope.widget.form)
      $scope.modified.form = false;
      runDPS({
              script: dps.updateForm,
              state: {
                form: $scope.widget.form
              }
      })
      .then(() => {
         runDPS({
          script: dps.getForm,
          state: {
            form: $scope.widget.form.id
          }  
        })
        .then(res => {
          $scope.fanButton.state("none");
          $scope.processing = false;
          $scope.formLoaded = true;
          $scope.widget.form = res.data[0];
          // $scope.widget.form.config.access.users = $scope.widget.form.config.access.users || []; 
          
          (new APIUser()).invokeAll("formMessage", {action:"update", data:$scope.widget.form});
          
          $scope.metadataTools.prepaire();

          // $scope.widgetPanel.allowConfiguring = undefined;
          // $scope.widgetPanel.allowCloning = undefined;

          //   // todo for all modes
          //   $scope.answer = {
          //     form: $scope.widget.form.id,
          //     user: user,
          //     data: {}
          //   }

          //   _.toPairs($scope.widget.form.config.questions)
          //     .forEach(item => {
          //       $scope.answer.data[item[0]] = {valid: false}
          //     })


          })
      })
    }
    
    if($scope.modified.answer){
      $scope.fanButton.state("process")
      console.log("SAVE answer", $scope.answer)
      $scope.modified.answer = false;
      runDPS({
              script: dps.updateAnswer,
              state: {
                answer: $scope.answer
              }
      })
      .then((res) => {
        let newAnswer = (angular.isArray(res.data))? res.data[0] : res.data;
        $scope.answer = newAnswer;
        $scope.fanButton.state("none")
      })
    }    
  }

  
  $scope.fanButton = {
    availableStates: {
      process:{
        identity:"process",
        color:"#5f8ab9",
        class:"fa fa-spinner fa-pulse",
        tooltip:`
          <div style="background:#5f8ab9; color:#ffffff; padding:0.5em;margin:-0.6em; font-size:large;">
            Answer's save processed...
          </div>
        `
    },
      disabled:{
        identity:"disabled",
        color:"#e7e7e7",
        class:"fa fa-times"
      },
      alert:{
        identity:"alert",
        color:"#f44336",
        class:"fa fa-exclamation"
      },
      warning:{
        identity:"warning",
        color:"#ff9800",
        class:"fa fa-exclamation",
        tooltip:""
      },

      list:{
        identity:"list",
        color:"#ff9800",
        class:"fa fa-pencil",
        tooltip:""
      },
      success:{
        identity:"success",
        color:"#ff9800",
        class:"fa fa-check",
        tooltip:`
          <div style="
                background: #f9f9f7;
                color: #ff9800;
                padding: 1em;
                margin: -1em;
                font-size: larger;
                border-radius: 0.5em;
                box-shadow: 0 0.1em 0.5em 0 #607D8B;"
          >
            Forms is completed. Click for save. 
          </div>`
      }  
    },

    _state: undefined,
    
    state: (value, params) => {
      if(value){
          if($scope.fanButton.availableStates[value]){
            $scope.fanButton._state = $scope.fanButton._state || {}
            angular.copy($scope.fanButton.availableStates[value], $scope.fanButton._state)
            // angular.extend($scope.fanButton._state, params)  
          } else {
            $scope.fanButton._state = undefined
          }
      } else {
        return $scope.fanButton._state;
      }
    }  
  }  

  let validateAnswers = () => {
    let a = _.toPairs($scope.answer.data)
    let nvc = a.filter((item) => !item[1].valid).length;
    let vc = a.length-nvc;
    if(nvc == 0) {
      $scope.fanButton.state("success")
    } else {
      if((a.length-nvc)>0){
        $scope.fanButton.state("warning");
        $scope.fanButton._state.tooltip =
        `
        <div style="
                background: #f9f9f7;
                color: #ff9800;
                padding: 1em;
                margin: -1em;
                font-size: larger;
                border-radius: 0.5em;
                box-shadow: 0 0.1em 0.5em 0 #607D8B;"
          >
          You can save answers.<br/>  
          But 
          ${nvc} 
          from 
          ${a.length} 
          is not completed.<br/> 
          Click for save if need.
        <div>`
        // $scope.fanButton._state.tooltip = `You can save answers.  
        // But ${nvc} from ${a.length} is not completed. 
        // Click for save if need.`
      } else {
        $scope.fanButton.state("none");
      }
    }
    $scope.modified.answer = true;
  }

  let validateFormConfig = (data) => {
    $scope.fanButton.state("list");
    $scope.fanButton._state.tooltip = 
        `
          <div style="
                background: #f9f9f7;
                color: #ff9800;
                padding: 1em;
                margin: -1em;
                font-size: larger;
                border-radius: 0.5em;
                box-shadow: 0 0.1em 0.5em 0 #607D8B;"
          >  
            You add new alternative into "
            ${trunc(data.options.title)}
            " question.
            Click for save your changes.
          </div>
        `
    // $scope.fanButton._state.tooltip =`You add new alternative into "${trunc(data.options.title)}" question.
    //         Click for save your changes.`
    $scope.modified.form = true;        
  }          

  $scope.fanButton.state("none")

  let trunc = (value, length) => {
    length = length || 20;
    return ( value.toString().length <= length )
      ? value.toString()
      : ( (value.toString().length - length) > 10 )
        ? value.toString().substring(0,length)+'...'
        : value.toString()
  }





  new APIProvider($scope)
    .config(() => {
      console.log("config", $scope.widget)
        updateWidget()  
    })

    .save(() => {
      $scope.processing = true;
      updateConfig();
      $scope.widget.form.config.questions = {};

      pageWidgets()
        .filter((item) => item.type === "v2.form.question")
        .forEach((item) => {
          console.log("save ", item)
          $scope.widget.form.config.questions[item.config.id] = item.config;
        })

      // TODO behevior for open access in presentation mode when user add alternatives

      // TODO get all question config and add into $scope.form.config.questions array
      // This is for design mode

      runDPS({
              script: dps.updateForm,
              state: {
                form: $scope.widget.form
              }
      })
      .then(() => {
        $scope.processing = false;
      })
      
    })

    .translate(updateWidget)

    .create((event, widget) => {
        
        if( widget.instanceName == $scope.widget.instanceName){
          console.log("create", widget)
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
      console.log("APP reconfig")()
          // todo
          $scope.widget.form.metadata.app_name.value = config.name;
          $scope.widget.form.metadata.app_title.value = config.title;
          $scope.widget.form.metadata.app_url.value = $window.location.href,
          $scope.widget.form.metadata.app_icon.value = config.icon;
          $scope.widget.form.metadata.page_title.value = app.pageConfig().shortTitle;
          prepaireMetadata($scope.widget.form.metadata);

    })

    .provide('questionMessage', (e, context) => {
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
          $scope.fanButton.state("none")
          if(context.data && context.data.question && $scope.widget.form){
            if(!$scope.answer){
              
              $scope.answer = $scope.answer || {
                              form: $scope.widget.form.id,
                              user: user,
                              data: {}
                            }

              _.toPairs($scope.widget.form.config.questions)
              .forEach(item => {
                $scope.answer.data[item[0]] = {valid: false}
              })
            }
            
           $scope.answer.data[context.data.question] = context.data;
           validateAnswers();
          }   
        }

        if(context.action == "update-config") {
          if(context.data && context.data.id && $scope.widget.form){
            $scope.fanButton.state("none");
            $scope.widget.form.config.questions = $scope.widget.form.config.questions || {};
            $scope.widget.form.config.questions[context.data.id] = context.data;
            validateFormConfig(context.data)
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
        runDPS({
            script: dps.deleteForm,
            state: {
              form: $scope.widget.form.id
            }
        })
        .then(() => {
          $scope.processing = false;
        })  
      }
   });
})




