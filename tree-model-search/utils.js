var queList = require('../que')


function findChildNodeLabel(key, root) {
   var parentNode= root.first(function (node) {
        return node.model.label === key;
    });

    if(!parentNode) {
        return 'not found'
    }
    if(parentNode.children && parentNode.children[0] && parentNode.children[0].model.label) {
        return parentNode.children[0].model.label
    }
    else {
        return 'not found' 
    }    
}


exports.getQueInfo = function getQueInfo(key , root) {

    var nodeLabel = findChildNodeLabel(key, root).replace('\r','');
    
    if( queList[nodeLabel] ) {
        console.log(queList[nodeLabel])
        return queList[nodeLabel]
    } else {
        console.log('not found')
        return {text: 'not found'}
    }

}

