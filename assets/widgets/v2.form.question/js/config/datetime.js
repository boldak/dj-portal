import angular from 'angular';
import Question from "./question.js"

let DateTime = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "datetime", title: "Date & Time" },
      widget: {
        css: "fa fa-calendar",
        view: this.prefix + "datetime.view.html",
        options: this.prefix + "datetime.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        format:"date",//"date",
      }
    }


    this.configure(previus)
  }

  configure(previus) {
    super.configure()
  }

  applyAnswer() {
    if(this.scope.answer && this.scope.answer.value[0]){
        this.scope.answer.value[0] = new Date(this.scope.answer.value[0])  
    }
    
  }

  prepare() {
    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      format:this.state.options.format,
      type: "datetime",
      value: []
    }

  }

  setValue(value) {
    this.scope.answer.value[0] = value;
    this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }

  getValue() {
    return (new Date(this.scope.answer.value[0]))//.toLocaleDateString()//.toLocaleString()
  }

  validateAnswer() {
   this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0])) 
  }

  updateConfig() {}
}

module.exports = DateTime;
