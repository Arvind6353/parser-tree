
var Tree = function(value) {
  var newTree = {};
  newTree.value = value;
  newTree.children = [];
  _.extend(newTree, treeMethods);
  return newTree;
};

var treeMethods = {};

treeMethods.addChild = function(value) {
  this.children.push(Tree(value));
};

treeMethods.contains = function(target, root) {
  root = root || this;
  if (root.value === target) return true; // base-case
  
  for (var i = 0; i < root.children.length; i++) {
    if (this.contains(target, root.children[i])) return true;
  }
  
  return false;
};