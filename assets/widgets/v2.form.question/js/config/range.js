import angular from 'angular';
import Question from "./question.js"

let Range = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "range", title: "Range" },
      widget: {
        css: "fa fa-arrows-h",
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
    this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }

  validateAnswer() {
   this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0])) 
  }

  updateConfig() {}
}

module.exports = Range;
