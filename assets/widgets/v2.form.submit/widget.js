import angular from 'angular';

let m = angular.module('app.widgets.v2.form.submit', [])

m.controller('FormSubmitController', ($scope, APIUser, APIProvider) => {

  $scope.submit = () => {
    // console.log("SUBMIT")
    (new APIUser()).invokeAll("formSubmit", {});
  }

  $scope.hidden = true;

  

  (new APIProvider($scope))
     .provide('formMessage', (e, context) => {
        if(context.action == "show"){
          $scope.hidden = false;
          return
        }
      })      

})  

