import angular from 'angular';
import Question from "./question.js"

let Range = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "range", title: "Range" },
      widget: {
        css: "fa-arrows-h",
        view: this.prefix + "range.view.html",
        options: this.prefix + "range.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        range:{
          min:0,
          max:100
        },
        step: 1
      }
    }


    this.configure(previus)
  }

  configure(previus) {
    
    super.configure()
    
    if(!previus) return;

    this.state.options.title = previus.state.options.title; 
    this.state.options.note = previus.state.options.note;
    this.state.options.required = previus.state.options.required;
    this.state.options.showResponsesStat = previus.state.options.showResponsesStat;
  }

  applyAnswer() {}

  prepare() {
    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      type: "range",
      value: []
    }

  }

  setValue(value) {
    this.scope.answer.value[0] = value;
    this.validateAnswer()
    // this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
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

  getResponseStat(responses) {
    if(!responses) return;
    let RStat = [];
    let th = [];
    let step = (this.scope.config.state.options.range.max -
               this.scope.config.state.options.range.min)/5;
    
    for (  let v=this.scope.config.state.options.range.min; 
          v<=this.scope.config.state.options.range.max; 
          v+=step
        ) th.push(v)
    
    for( let index = 0; index<(th.length-1); index++){
      RStat.push(
        responses.filter(r => {
          if ( r.question_id == this.scope.config.state.id  
                && th[index] <=r.value
                && r.value <= th[index+1]) {
              return true
            } else {
              return false
            }
        }).length
      )
    }  

   
    let values = RStat.map(item => item)
    let sum = values.reduce((item,sum) => {return sum+item})
    if(sum==0){
          values = values.map(item => 0)
        }else{
          values = values.map(item => item/sum )
        }
    this.th = th;
    this.scope.rstat = RStat.map((item,index) => {
      return {
        // title: ((th[index+1]+th[index])/2).toFixed(2),
        title: (th[index]).toFixed(2),
        value: values[index]
      }  
    });
  }

  isResponse(index){
    if(this.th){
      return (this.th[index] <= this.scope.answer.value[0]) && (this.scope.answer.value[0] < this.th[index+1])  
    } else {
      return false  
    }
  }  
    

}

module.exports = Range;
