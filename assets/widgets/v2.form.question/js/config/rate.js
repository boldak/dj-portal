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
}

module.exports = Rate;
