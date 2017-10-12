const fs = require('fs')
const iterator = require('./utils').iterator
const getQueInfo = require('./utils').getQueInfo
const constructTree = require('./construct-tree').constructTree
const getNextQueOrder = require('./utils').getNextQueOrder

var flowTree;

// read the flow input 
fs.readFile('./flow.txt', 'utf8', function (err, data) {
    if (err) throw (err)
    var flowData = data.toString().split("\n");
    for (i in flowData) {
        var dataInEachLine = flowData[i].split('->');
        flowTree = constructTree(dataInEachLine, i, flowTree);
    }
})


// examples

setTimeout(() => {
    //flowTree.traverseDown(iterator)
    getQueInfo(getNextQueOrder('A2.1', flowTree))

   }, 3000)

   