import angular from 'angular';
import ListEditorTools from './list-editor.js'
import ColorUtility from './color.js'

angular
.module("v2.question.utility",[])
.factory("listEditor",[() => scope => new ListEditorTools(scope)])
.factory("colorUtility",[() => scope => new ColorUtility(scope)])