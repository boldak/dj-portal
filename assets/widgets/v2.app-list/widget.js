import angular from 'angular';
import 'angular-foundation';


const appListWidget = angular.module('app.widgets.v2.app-list', ['mm.foundation']);



appListWidget.controller('AppListController', function ($scope, $portal, $translate,
                                                        APIProvider,EventEmitter,
                                                        i18n,config,appUrls,$modal,
                                                        dialog, prompt, alert, user,
                                                        appSkins, pageSubscriptions,
                                                        $window
                                                        ) {
  

  var emitter = new EventEmitter($scope);

  angular.extend($scope, {
    apps: undefined,
    oldApps: undefined,
    update(){
      $portal.get(appUrls.appList)
        .then(apps => {
          $scope.apps = apps;
          $scope.oldApps = apps;
          apps.forEach((c) =>{
            if(c.i18n){
              config.i18n = (config.i18n)? config.i18n : {}; 
              for(let locale in c.i18n){
                config.i18n[locale] = (config.i18n[locale]) ? config.i18n[locale] : {};
                angular.extend(config.i18n[locale],c.i18n[locale])  
              }
            }  
          })
          i18n.refresh();
        });
       // emitter.emit("setApplication",undefined);  
    },
    isOwner(app) {
      if (!user.id) {
        return false;
      }
      if (!app.owner) {
        return true;
      }
      return app.owner.id === user.id;
    },
    isCollaborator(app) {
      if (!user.id) {
        return false;
      }
      if (!app.collaborations) {
        return false;
      }
      return angular.isUndefined(app.collaborations.find(c => c.user.id === user.id));
    },

    gotoApp(app){
       $window.location.href = "/app/"+app.name;
    },

    openImportAppDialog(){
      dialog({
        title:`${$translate.instant('WIDGET.V2.APP-LIST.IMPORT_APP')}:`,
        fields:{
          name:{
            title:`${$translate.instant('WIDGET.V2.APP-LIST.NAME')}:`, 
            type:'text', 
            value:'', 
            editable:true, 
            required:true
          },
          file:{
            title:`${$translate.instant('WIDGET.V2.APP-LIST.CONF')}:`, 
            type:'file', 
            editable:true, 
            required:true
          }
        }
      }).then((form) => {
        const fd = new FormData();
        // Take the first selected file
        fd.append('file', form.fields.file.value, form.fields.name.value);
        $portal.post(appUrls.api.import, fd, {
          withCredentials: true,
          headers: {'Content-Type': undefined},
          transformRequest: angular.identity
        }).then(data => {
          $scope.update();
        }).catch(e => {
          alert.error(e)
          // if (status === 415) {
          //   alert.error($translate.instant('WIDGET.V2.APP-LIST.CANNOT_PARSE_DATA_AS_VALID_JSON', {data}));
          // } else {
          //   alert.error($translate.instant('WIDGET.V2.APP-LIST.ERROR_IMPORTING_APP', {status}));
          // }
        });

      })      
    },
    
    openCreateAppDialog() {
      dialog({
        title:`${$translate.instant('WIDGET.V2.APP-LIST.ADD_NEW_APP')}:`,
          fields:{
            name:{
              title:`${$translate.instant('WIDGET.V2.APP-LIST.NAME')}:`, 
              type:'text', 
              value:'', 
              editable:true, 
              required:true
            },
            skin:{
              title: `${$translate.instant('WIDGET.V2.APP-LIST.CHOOSE_SKIN')}:`, 
              type: 'select', 
              value: '',
              options: appSkins.map((item) => {return {title:item.title, value: item.name}}), 
              editable: true, 
              required: true
            }
          } 
      }).then((form) => {
          $portal.get(appUrls.api.createApp(form.fields.name.value, form.fields.skin.value))
          .then(data => {
            $scope.update();
          })
          .catch((e) => {
            alert.error(e)//$translate.instant('WIDGET.V2.APP-LIST.ERROR_CREATING_APP', {data, error}));
          });

      })
    }
  });  
   
  
  $scope.tags = [];

  $scope.select = (app) => {
    if ($scope.selection){
      $scope.selection.selected = false;
    }
    app.selected = true;
    $scope.selection = app;
    
    emitter.emit("setApplication",app);
  }

  $scope.hasTags = (app) => {
      let f = true;
      app.keywords = (app.keywords)? app.keywords : [];
      let keywords = app.keywords.map((k)=>{
        return $translate.instant(k)
      })
      if($scope.tags){
        $scope.tags.forEach(t => f &= keywords.indexOf(t) >=0 );
      }
      return f;
    };

  new APIProvider($scope)
    .config(() => {
        
      if($scope.widget.appWidget && $scope.widget.appWidget.length &&
        $scope.widget.appWidget.trim().length > 0){
          
        pageSubscriptions().removeListeners({
            receiver: $scope.widget.instanceName,
            signal: "setApplication"
        });

        $scope.appListeners = ($scope.widget.appWidget) ? $scope.widget.appWidget.split(",") : [];
          
        pageSubscriptions().addListeners(
          $scope.appListeners.map((item) =>{
            return {
                emitter: item.trim(),
                receiver:  $scope.widget.instanceName,
                signal: "setApplication",
                slot: "setApplication"
            }
          })
        );

      }else{

        pageSubscriptions().removeListeners({
            receiver: $scope.widget.instanceName,
            signal: "setApplication"
        });

      }

        $scope.update();

    })

    .translate(() => {
      emitter.emit("setApplication",$scope.selection);
    })
    
    .provide("refresh", () => {
      $scope.update();
    })

    .provide("appTags", (e,tags) => {
      $scope.tags = tags;
      emitter.emit("setApplication",$scope.selection);  
    })

    .provide("setApplication", (evt, app) => {
      if(app) $scope.gotoApp(app);
    });
    
})