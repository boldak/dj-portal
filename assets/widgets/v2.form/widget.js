import angular from 'angular';
// import 'dictionary';
// import 'ngReact';
// import 'custom-react-directives';
// import 'ng-prettyjson';
import 'ng-ace';


let m = angular.module('app.widgets.v2.form', [
    'app.dps',
    "ng.ace"
])


m.controller('FormController', function(
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
    pageWidgets,
    metadataDialog
) {

    const eventEmitter = new EventEmitter($scope);
    

    
    new APIProvider($scope)
        .config( () => {
           console.log("Form widget config") 
        })
        
        .openCustomSettings(() =>  
            metadataDialog({
                title: "Metadata Inspector",
                note: "Work with dj-form metadata",
                object: {
                    title: "metadata object",
                    id: "1",
                    note: "test metadata object"
                }
            })

            // dialog(
            // {
            //     title: "Form settings",
            //     fields: {
            //         d_listeners: {
            //             title: "Listeners",
            //             type: "text",
            //             value: "",
            //             required: false
            //         },
            //         config:{
            //           title: "Config",
            //           type: "text",
            //           value: JSON.stringify($scope.widget),
            //           required: false  
            //         }
            //     }
            // })
            .then((metadata) => {
                console.log("after dialog Form settings", metadata)
            })
        )

        .removal(() => {
            console.log('Form widget is destroyed');
        });
})
