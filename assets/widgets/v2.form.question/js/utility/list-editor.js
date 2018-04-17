import angular from 'angular';

let dest = null;
let startDest = null;

let ListEditorTools  = class {
	
	constructor(scope){
	
		this.scope = scope;
			
	}

	delete(object,index) {
	
	    object.splice(index,1);
	    this.scope.markModified();
	
	}


	createCollection(array) {
		array = array || [];
		let res = array.map(item => item);
		res.$$collectionId = this.scope.randomID();
		res.forEach(item => {
			item.$$collectionId = res.$$collectionId;
			item.$djItemType = "embedded"
		})
		return res;
	}

	add( collection, value ) {
	    if (angular.isObject(value)){
	    	if(!collection.$$collectionId) collection = this.createCollection(collection);
	    	value.$$collectionId = collection.$$collectionId;
	    	value.$djItemType = "embedded"
	    	collection.push(value)
	    }
	    return collection;
	}

	cselect(value) {
    	this.scope._click = value
	}

	treeOptions() {
		return {
			  dropped:(event) => {
			  //   console.log("DROP", event.source.index+" -> "+event.dest.index)
			  //   // event.source.nodeScope.$$childHead.drag = false;
			  //   // selectHolder(null);
			    this.scope.markModified()
			  },
			  dragStart:(event) => {
			        dest = event.dest.nodesScope;
			        startDest = event.dest.nodesScope;
			      // console.log("DRAGSTART", event)
			      // event.source.nodeScope.$$childHead.drag = true;
			  },
			  accept: (sourceNodeScope, destNodesScope, destIndex) => {
			  	// console.log("start",startDest,"source",sourceNodeScope, "dest",destNodesScope)
			    if(dest != destNodesScope){
			        dest = destNodesScope;
			    }
			    return sourceNodeScope.$modelValue.$$collectionId == dest.$modelValue.$$collectionId;
			  }
		}
	}		  
}

module.exports = ListEditorTools;
