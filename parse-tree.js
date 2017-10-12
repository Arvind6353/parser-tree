(function() {
const fs = require('fs')
const iterator = require('./utils').iterator
const getQueInfo = require('./utils').getQueInfo
const constructTree = require('./construct-tree').constructTree
const getNextQueOrder = require('./utils').getNextQueOrder

var flowTree;

// read the flow input 
// fs.readFile('./flow.txt', 'utf8', function (err, data) {
//     if (err) throw (err)
//     var flowData = data.toString().split("\n");
//     for (i in flowData) {
//         var dataInEachLine = flowData[i].split('->');
//         flowTree = constructTree(dataInEachLine, i, flowTree);
//     }
// })


var data = fs.readFileSync('./flow.txt', 'utf8')
var flowData = data.toString().split("\n");
for (i in flowData) {
    var dataInEachLine = flowData[i].split('->');
    flowTree = constructTree(dataInEachLine, i, flowTree);
}

// examples
//flowTree.traverseDown(iterator)
getQueInfo('A4.2', flowTree)

module.exports = flowTree
})()  