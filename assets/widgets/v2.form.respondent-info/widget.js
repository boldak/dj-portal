import angular from 'angular';

let m = angular.module('app.widgets.v2.form.respondent-info', [])

m.controller('FormRespondentInfoController', ($scope, APIUser, APIProvider) => {

  $scope.hidden = true;

  (new APIProvider($scope))
      
      .provide('formMessage', (e, context) => {
        if(context.action == "login"){
          $scope.respondent = context.data;
          $scope.hidden = false;
          return
        }
      })      

})  

