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

	add(object) {
	    
	    object.push({id:this.scope.randomID(), $djItemType:"embeded"});
	    this.scope.markModified();
	
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
			    if(dest != destNodesScope){
			        dest = destNodesScope;
			    }
			    return startDest == dest;
			  }
		}
	}		  
}

module.exports = ListEditorTools;
