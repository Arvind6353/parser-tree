const Arboreal = require('./tree')

// construct tree 
exports.constructTree = function constructTree(arr, indx, flowTree) {
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
            addChildNodes(flowTree, i, indx, arr[i])
        }
        i++;
    }
    return flowTree
}

// add children by traversing to the last and appending the child
function addChildNodes(flowTree, dep, indx, label) {

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
}