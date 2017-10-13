(function () {
    const fs = require('fs')
    const TreeModel = require('tree-model');
    const getQueInfo = require('./utils').getQueInfo

    var tree = new TreeModel();

    var root = tree.parse({
        label: 'Q1'
    })

    var data = fs.readFileSync('./flow.txt', 'utf8')
    var flowData = data.toString().split("\n");
    for (i in flowData) {
        var dataInEachLine = flowData[i].split('->');
        constructTree(dataInEachLine);
    }

    function constructTree(arr) {

        for (var i = 1; i < arr.length; i++) {

            var abc;
            root.walk(function (node) {
                // Halt the traversal by returning false
                if (node.model.label === arr[i - 1]) {
                    abc = node;
                    return false;
                }
            });

            if (!abc) {
                root.addChild(
                    tree.parse({
                        label: arr[i]
                    })
                )
            } else {
                abc.addChild(
                    tree.parse({
                        label: arr[i]
                    })
                )
            }
        }
    }

    getQueInfo('A4.1', root)
    exports.tree = tree
    exports.root = root
})()