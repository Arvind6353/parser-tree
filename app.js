const fs = require('fs')
const Arboreal = require('./tree')
const queList = require('./que')
var flowTree;

fs.readFile('./flow.txt', 'utf8', function (err, data) {
    if (err) throw (err)
    var flowData = data.toString().split("\n");
    for (i in flowData) {
        var dataInEachLine = flowData[i].split('->');
        constructTree(dataInEachLine, i);
    }
})

function constructTree(arr, indx) {
    var i = 1;
    if (indx == 0) {
        flowTree = new Arboreal(null, {
            label: arr[0]
        });
    }
    while (i < arr.length) {
        if (!flowTree.children[indx] && i == 1) {
            flowTree.appendChild({
                label: arr[i]
            })

        } else {
             findLastAndAppend(flowTree, i, indx, arr[i])
        }

        i++;
    }

}

function iterator(node) {
    var depth = "",
        i;
    for (i = 1; i <= node.depth; i++) depth += ">";
    console.log([depth, node.data.label].join(" "));
}


setTimeout(() => {
 flowTree.traverseDown(iterator)
//    console.log(getNextQueOrder('A1.3'))
}, 3000)


// assuming keys are unique . need to find the child of the key - the next que to be asked
function getNextQueOrder(key) {
    return flowTree.find(function (node) {
        return key === node.data.label
    }).children[0].data.label
}

function findLastAndAppend(flowTree, dep, indx, label) {

    var tree = Object.assign({}, flowTree);

    for (i = 0; i <= dep - 1 && tree != null; i++) {

        if (tree.children.length == 0) {

            tree.appendChild({
                label: label
            })

        } else {
            tree = tree.children[i == 0 ? indx : 0];
        }
    }
    return tree;

}