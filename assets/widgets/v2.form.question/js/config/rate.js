import angular from 'angular';
import Question from "./question.js"

let Rate = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "rate", title: "Rate" },
      widget: {
        css: "fa fa-star",
        view: this.prefix + "rate.view.html",
        options: this.prefix + "rate.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        max: 7
      }
    }


    this.configure(previus)
  }

  configure(previus) {
    super.configure()
  }

  applyAnswer() {}

  prepare() {
    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      type: "rate",
      value: []
    }

  }

  setValue(value) {
    this.scope.answer.value[0] = value;
    this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }

  validateAnswer() {
   this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0])) 
  }

  updateConfig() {}

  getResponseStat(responses) {
    let RStat = [];
    for(let index = 1; index <= this.scope.config.state.options.max; index++){
      RStat.push(responses.filter(r => {
          if ( r.question_id == this.scope.config.state.id  && r.value == index) {
              return true
            } else {
              return false
            }
        }).length);
    }

    let values = RStat.map(item => item)
    let sum = values.reduce((item,sum) => {return sum+item})
    if(sum==0){
          values = values.map(item => 0)
        }else{
          values = values.map(item => item/sum )
        }
    
    this.scope.rstat = RStat.map((item,index) => {
      return {
        title: index+1,
        value: values[index]
      }  
    });
  }

  isResponse(value) {
    return this.scope.answer.value[0] == value
  }

}

module.exports = Rate;
