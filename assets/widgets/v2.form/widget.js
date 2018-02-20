import angular from 'angular';
// import 'dictionary';

let m = angular.module('app.widgets.v2.form', [
  'app.dps', "oc.lazyLoad"
])


m.controller('FormController', function(
  $scope,
  APIProvider,
  APIUser,
  dialog,
  app,
  i18n,
  $dps,
  EventEmitter,
  $error,
  log,
  pageSubscriptions,
  $q,
  pageWidgets,
  metadataDialog,
  config,
  instanceNameToScope,
  randomID,
  $ocLazyLoad,
  $window,
  $http,
  appUrls
) {


let emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

$ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 


$scope.pageConfig = app.pageConfig();

$scope.formatDate = (date) => i18n.formatDate(date);

 

$scope.textFields = {
  key:undefined,
  value:undefined,
  userEmail:undefined
}

  // const eventEmitter = new EventEmitter($scope);
  // const apiUser = new APIUser();
  // $scope.formatDate = i18n.formatDate;
  let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);

// operation process indicator

$scope.processing = false;

  let dps = {

    getProjectList: `
            // getProjectList
            <?javascript
                $scope.s = (item) => {
                    return {
                        id: item.id,
                        owner: item.owner,
                        metadata: item.metadata
                    }
                }
            ?>
            dml.select(from:"project", as:{{s}})
        `,

    createProject: `
            // createProject
            client();
            set("owner")
            <?javascript
                $scope.project = {
                    metadata:$scope.project,
                    owner:$scope.owner.client.user,
                    history:[
                        {
                            state:"created",
                            message:"Create project via "+$scope.owner.client.app,
                            user: $scope.owner.client.user,
                            date: new Date()
                        }
                    ]
                }
            ?>
            dml.insert(into:"project", values:{{project}})
        `,

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




  $scope.metadata = [];

  let prepaireMetadata = (metadata) => {
    $scope.metadata = _.toPairs(metadata)
                        .map(item => {
                          return {
                            key:item[0],
                            value:item[1].value,
                            required:item[1].required,
                            editable: item[1].editable
                          }
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
      
      

      runDPS({
        script: dps.createForm,
        state: {
          form: f
        }
      })
      .then((res) => {
        $scope.widget.form = res.data[0].id;
        app.storage.form = res.data[0];
        $scope.form = res.data[0];
        prepaireMetadata($scope.form.metadata);  
        app.markModified();
        let usr = new APIUser; 
        usr.invokeAll("formMessage", {action:"configure", data:$scope});
        updateWidget();
        $scope.processing = false;
      })
    }

    let loadForm = () => {
      runDPS({
        script: dps.getForm,
        state: {
          form: $scope.widget.form
        }  
      })
      .then(res => {
        $scope.processing = false;
        $scope.form = res.data[0];
        app.storage.form = res.data[0];
        $scope.form.config.access.users = $scope.form.config.access.users || []; 

          let usr = new APIUser(); 
          usr.invokeAll("formMessage", {action:"update", data:$scope.form});
          
          prepaireMetadata($scope.form.metadata);

          $scope.widgetPanel.allowConfiguring = undefined;
          $scope.widgetPanel.allowCloning = undefined;
        })
      }


  $scope.isDisabled = () => {
    let forms = pageWidgets().filter((item) => item.type === "v2.form");
    return (forms.length > 1) && (!$scope.widget.form);
  }

  let updateWidget = () => {
    if($scope.isDisabled()) return;
    if(!$scope.form && app.storage.form){
      $scope.form = app.storage.form;
      prepaireMetadata($scope.form.metadata);
      return
    } 
    if(!$scope.form && !app.storage.form  && $scope.widget.form){  
      loadForm()
      return
    }  
  }

  let initQuestion = s => {
    $scope.widget.questions = ($scope.widget.questions) 
        ? $scope.widget.questions 
        : {};
    s.widget.ID = randomID();
    s.widget.formWidget = $scope.widget.instanceName; 
    
    pageSubscriptions().addListener(
        {
            emitter: $scope.widget.instanceName,
            receiver: s.widget.instanceName,
            signal: "formMessage",
            slot: "formMessage"
        }
    );
    pageSubscriptions().addListener(
        {
            emitter: s.widget.instanceName,
            receiver: $scope.widget.instanceName,
            signal: "questionMessage",
            slot: "questionMessage"
        }
    );
    $scope.widget.questions[s.widget.ID] = {id: s.widget.ID, form: $scope.form, config:{}}
  }

  $scope.validMetadata = () => {
    if(!$scope.textFields.key) return false;
    return $scope.metadata.map(item => item.key).indexOf($scope.textFields.key) < 0
  }

  $scope.addMetadata = (key, value) => {
    $scope.metadata.push({
        key: key,
        value: value,
        required: false,
        editable: true
    })
    $scope.textFields.key = undefined;
    $scope.textFields.value = undefined;
  }

  $scope.deleteMetadata = (key) => {
    let index = $scope.metadata.map(item => item.key).indexOf(key);
    $scope.metadata.splice(index,1)
  }


  $scope.setAccessType = (value) => {
    
    $scope.form.config.access.type = value;
    
    if( value == "invited"){
      $scope.form.config.access.invitationTemplate =
      $scope.form.config.access.invitationTemplate ||  "Dear ${user.name} !\nWe invite you for expert assessments  \"${metadata.title}\"\nSee ${ref(metadata.app_url)}";
      $scope.form.config.access.notificationTemplate =
      $scope.form.config.access.notificationTemplate || "notification Template";
    }
    
    $scope.markModified()
  
  }

  let updateConfig = () => {
    if($scope.form){
      $scope.widget.form = $scope.form.id;
      $scope.form.metadata = {}
      $scope.metadata.forEach((item) => {
        $scope.form.metadata[item.key] = item
      })
    // TODO  
    }
  }

  $scope.markModified = () => {
    updateConfig();
    app.storage.form = $scope.form;
    app.markModified();
  } 


  $scope.getUsers = (filterValue) => {
    return $http.get(appUrls.usersList).then(result =>
        result.data
          .filter(user =>
            $scope.form.config.access.users.map(item => item.email).indexOf(user.email)<0
          )
          .filter(user =>
            user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            user.email.toLowerCase().includes(filterValue.toLowerCase())
          )
          .slice(0, 8)
    );
  }

  $scope.invitedUserAdd = null;

  $scope.alreadyInvited = (value) => {

    if(!value){
      $scope.userIsInvited = false;
      return 
    } 
    
    if (angular.isString(value)){
      $scope.userIsInvited = $scope.form.config.access.users.map(item => item.email).indexOf(value) >= 0;      
      return 
    }
    
    if(angular.isDefined(value.email)){
      $scope.userIsInvited = $scope.form.config.access.users.map(item => item.email).indexOf(value.email) >= 0;      
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
    $scope.form.config.access.users = $scope.form.config.access.users || [];
    if(angular.isString($scope.invitedUserAdd)){
      $scope.form.config.access.users.push({email:$scope.invitedUserAdd}) 
    } else {
      $scope.form.config.access.users.push($scope.invitedUserAdd)
    }
    $scope.invitedUserAdd = undefined;
    $scope.invitedUser = undefined;
    $scope.invitedUserIsValid = false; 
  }

  $scope.$watch("metadata", $scope.markModified, true);
    

  new APIProvider($scope)
    .config(() => {
      console.log("config", $scope.widget)
        updateWidget()  
    })

    .save(() => {
      $scope.processing = true;
      updateConfig();
      // TODO behevior for open access in presentation mode when user add alternatives

      // TODO get all question config and add into $scope.form.config.questions array
      // This is for design mode

      runDPS({
              script: dps.updateForm,
              state: {
                form: $scope.form
              }
      })
      .then(() => {
        $scope.processing = false;
      })
      
    })

    .translate(updateWidget)

    .create((event,widget) => {
        
        if( widget.instanceName == $scope.widget.instanceName){
          console.log("create", widget)
          let forms = pageWidgets().filter((item) => item.type === "v2.form");
          if(forms.length == 1) {
            if(!widget.form) createNewForm();
          }  
        } 
        
        if(!$scope.disabled && $scope.form && (widget.type == "v2.form.question")){
            initQuestion(scopeFor(widget.instanceName))
        }
    })

    .appReconfig ((c) => {
      console.log("APP reconfig")

          $scope.form.metadata.app_name.value = config.name;
          $scope.form.metadata.app_title.value = config.title;
          $scope.form.metadata.app_url.value = $window.location.href,
          $scope.form.metadata.app_icon.value = config.icon;
          $scope.form.metadata.page_title.value = app.pageConfig().shortTitle;
          prepaireMetadata($scope.form.metadata);

    })

    .provide('questionMessage', (e, context) => {
        if(context.action == 'init'){
            initQuestion(context.data)
            return
        }

        if(context.action == 'remove'){
            $scope.widget.questions[context.data.widget.ID] = undefined
            return
        }

    })  

    .provide('formMessage', (e, context) => {
        if((context.action == "remove") && ($scope.widget.instanceName != context.data.widget.instanceName)){
            updateWidget()
        }
    })  

    .removal(() => {
      let user = new APIUser();
      user.invokeAll("formMessage", {action:"remove", data:$scope});
      
      $scope.processing = true;
      if($scope.form){
        runDPS({
            script: dps.deleteForm,
            state: {
              form: $scope.form.id
            }
        })
        .then(() => {
          $scope.processing = false;
          app.storage.form = undefined;        
        })  
      }
      
   });
})
