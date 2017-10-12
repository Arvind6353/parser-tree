const que = require('./que')

// callback called on each node traversal
exports.iterator = function iterator(node) {
  var depth = "",
    i;
  for (i = 1; i <= node.depth; i++) depth += ">";
  console.log([depth, node.data.label].join(" "));
}


// assuming keys are unique . need to find the child of the key - the next que to be asked
exports.getNextQueOrder = function getNextQueOrder(key, flowTree) {
  return flowTree.find(function (node) {
    return key === node.data.label
  }).children[0].data.label
}


exports.getQueInfo = function (key, flowTree) {
  const child = flowTree.find(function (node) {
    return key === node.data.label
  }).children
  if (child && child[0] && child[0].data) {
    const qid = child[0].data.label
    console.log(que[qid])
    return que[qid]
  } else {
    return 'not found'
  }
}