import angular from 'angular';
import Question from "./question.js";

import "moment";

// console.log((new moment()).format("YYYY MM DD"))

let DateTime = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "datetime", title: "Date" },
      widget: {
        css: "fa-calendar",
        view: this.prefix + "datetime.view.html",
        options: this.prefix + "datetime.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        format:"day",//"month",
        constraints:{}
      }
    }


    this.configure(previus)
  }

  configure(previus) {
    super.configure();
    if(!previus) return;

    this.state.options.title = previus.state.options.title; 
    this.state.options.note = previus.state.options.note;
    this.state.options.required = previus.state.options.required;
    this.state.options.showResponsesStat = previus.state.options.showResponsesStat;
  }

  applyAnswer() {
    if(this.scope.answer && this.scope.answer.value[0]){
        this.setValue(new Date(this.scope.answer.value[0]));
        // this.scope.answer.value[0] = new Date(this.scope.answer.value[0])  
    }
    
  }

  prepare() {
    this.state.options.constraints = this.state.options.constraints || {};
    if(this.state.options.constraints.minDate) this.state.options.constraints.minDate = new Date(this.state.options.constraints.minDate);
    if(this.state.options.constraints.maxDate) this.state.options.constraints.maxDate = new Date(this.state.options.constraints.maxDate);
     
    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      format:this.state.options.format,
      type: "datetime",
      value: []
    }

  }

  calcAnswerIndex() {
    
    if( angular.isUndefined(this.scope.answer.value[0])  
         || angular.isUndefined(this.points) 
         || angular.isUndefined(this.u) ) {
      this.answerIndex = undefined;
      return
    } 

    let roundedValue = moment(this.scope.answer.value[0]);
    roundedValue = moment(this.round(roundedValue, this.points[0], this.points[this.points.length-1], this.u[0], this.u[1]))
    let i = _.findIndex(this.points, item => roundedValue.isSame( item, this.u[0] ) );
    this.answerIndex = (i < 0) ? undefined : i;
    
  }

  setValue(value) {
    this.scope.answer.value[0] = value;
    this.calcAnswerIndex()
    this.validateAnswer()
    // this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }

  getValue() {
    return (new Date(this.scope.answer.value[0]))//.toLocaleDateString()//.toLocaleString()
  }

  validateAnswer() {
                  
    if(!this.state.options.required) {
      this.scope.answer.validationResult = { 
          valid: true,
          message: "",
          needSaveAnswer: true,
          needSaveForm: true 
        }
    } else {
      this.scope.answer.validationResult = {
        valid: angular.isDefined(this.scope.answer.value[0]),
        message: ( angular.isDefined(this.scope.answer.value[0]) ) 
                    ? ""
                    : this.scope.message("RANGE_VALIDATION", {
                        question : this.scope.truncate(this.scope.config.state.options.title, 40)
                      }),
        needSaveAnswer: true,
        needSaveForm: true 
      }  
    }
  
    this.scope.answer.valid =  this.scope.answer.validationResult.valid
  }

  updateConfig() {}

  round( date, start, end, level, value) {

      date = new Date(date)      
      
      let defFormat = "YYYY-MM-DD HH:mm";
    
      let lo = moment(start).startOf(level).format(defFormat)
      let hi = moment(lo).add(value,level).format(defFormat)
      let d = moment(date)

      let s = moment(start).startOf(level).format(defFormat)
      let e = moment(end).startOf(level).add(value,level).format(defFormat)


      if(d.isAfter(e) || d.isBefore(s)) return date;

      while(!(d.isSameOrAfter(lo) && d.isSameOrBefore(hi))){
        lo = hi;
        hi = moment(lo).add(value, level).format( defFormat );
      }

      let dLo = d.diff(lo)
      let dHi = -d.diff(hi)
      return (dLo < dHi) ? lo: hi
  }

  getResponseStat(responses) {
    // return
    if(!responses) return;

    let defFormat = "YYYY-MM-DD HH:mm";
    let inputFormat = "DD/MM/YY HH:mm";


    let RStat = responses.filter(r => {
          if ( r.question_id == this.scope.config.state.id) {
              return true
            } else {
              return false
            }
        })

    RStat =    RStat.map(item => moment(item.value,inputFormat))
        .sort((a,b) => a.diff(b))
        .map(item => item.format(defFormat))

    

    
    let p = [
      ['m',1],
      ['m',5],
      ['m',10],
      ['m',15],
      ['m',20],
      ['m',30],
      ['h',1],
      ['h',2],
      ['h',4],
      ['h',12],
      ['d',1],
      ['d',3],
      ['d',7],
      ['M',1],
      ['M',3],
      ['M',6],
      ['y',1],
      ['y',2],
      ['y',5],
      ['y',10]
    ]
    
    
    // let round = ( date, start, level, value) => {

    //   let lo = moment(start).startOf(level).format(defFormat)
    //   let hi = moment(lo).add(value,level).format(defFormat)
    //   while(!(moment(date).isSameOrAfter(lo) && moment(date).isSameOrBefore(hi))){
    //     lo = hi;
    //     hi = moment(lo).add(value,level).format(defFormat);
    //   }

    //   let dLo = moment(date).diff(lo)
    //   let dHi = -moment(date).diff(hi)
    //   return (dLo < dHi) ? lo: hi
    // }

    let getPoints = (start, stop, level, value) => {
      let res =[];
      let lo = moment(start).startOf(level).format(defFormat)
      let hi = moment(lo).add(value,level).format(defFormat)
      res.push(lo)
      while(!(moment(stop).isSameOrAfter(lo) && moment(stop).isSameOrBefore(hi))){
        lo = hi;
        hi = moment(lo).add(value,level).format(defFormat);
        res.push(lo)
      }
      res.push(hi)
      return res;      
    }

    

    let titleFormat = {
      'm' :['HH:mm',''],
      'h' :['HH:','00'],
      'd' :['DD.MM',''],
      'M' :['MM.YY',''],
      'y' :['YYYY','']
    } 
    
    let u;
    
    for(u of p){
      if( (moment(RStat[RStat.length-1]).diff(RStat[0],u[0]) / u[1]) <= 10) break;
    }
    
    this.u = u;

    if(moment(RStat[RStat.length-1]).diff(RStat[0],u[0])<1) return;

    RStat = RStat.map(
      item => this.round(item,RStat[0],RStat[RStat.length-1],u[0],u[1])
    );




    let points = getPoints(RStat[0], RStat[RStat.length-1], u[0], u[1]);

    let stats = points.map(item => RStat.filter(t => moment(t).isSame(item,u[0])).length)
    let sum = stats.reduce((item,sum) => {return sum+item})
    
    if(sum==0){
          stats = stats.map(item => 0)
        }else{
          stats = stats.map(item => item/sum )
        }

    RStat = points.map((item,index) => {
      return {
        title: moment(item).format(titleFormat[u[0]][0])+titleFormat[u[0]][1],
        value: stats[index]
      }
    })

    this.points = points;
    this.scope.rstat = RStat;
  }

  isResponse(index) {
    return (angular.isDefined(this.answerIndex)) ? (index == this.answerIndex) : false;
    // if( angular.isUndefined(this.scope.answer.value[0])) return false;
    // if(this.points){
    //   let res = moment(this.scope.answer.value[0]);

    //   res = this.round(res, this.points[0], this.u[0], this.u[1])
    //   res = moment(res)
    //   res = res.isSame(this.points[index],this.u[0]);
    //   return res
    // } else {
    //   return false
    // }
  }



}

module.exports = DateTime;




// var app = angular.module('plunker', ['ngMaterial']);

// app.controller('MainCtrl', function($scope) {

//   var monthFormat = buildLocaleProvider("MMMM YYYY");
//   var ymdFormat = buildLocaleProvider("YYYY-MM-DD");


//   function buildLocaleProvider(formatString) {
//     return {
//       formatDate: function(date) {
//         if (date) return moment(date).format(formatString);
//         else return null;
//       },
//       parseDate: function(dateString) {
//         if (dateString) {
//           var m = moment(dateString, formatString, true);
//           return m.isValid() ? m.toDate() : new Date(NaN);
//         } else return null;
//       }
//     };
//   }


//   $scope.dateFields = {
//     type: 'date',
//     required: false,
//     binding: 'applicant.expectedGraduation',
//     startView: 'month',
//     label: 'Credit Card Expiry - Year/Month picker',
//     locale: monthFormat
//   };

// });

// md-input-container flex="100" layout="column">
//           <div style="font-size: 10px; color: blue;" label ng-bind="::dateFields[2].label"></div>
//           <md-datepicker ng-model="dateFields.selectedDate"
//                      ng-required="dateFields.required"
//                      md-date-locale="dateFields.locale"
//                      md-mode="month"
//                      md-open-on-focus="true">
//         </md-datepicker>
//     </md-input-container>